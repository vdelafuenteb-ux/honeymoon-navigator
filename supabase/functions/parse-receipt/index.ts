import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EXTRACTION_PROMPT = `Eres un experto en extraer datos de comprobantes de viaje (reservas de hotel, boletos de avión, confirmaciones de tours, reservas de restaurantes).

Analiza la imagen o documento proporcionado y extrae la siguiente información:

Responde SIEMPRE usando la herramienta extract_receipt_data, incluso si no puedes leer todos los campos.
Si no puedes determinar un campo, usa null.
Para fechas usa formato ISO 8601 (YYYY-MM-DDTHH:mm:ss).
Para precios usa solo el número sin símbolo de moneda.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageUrl, fileType } = await req.json();
    
    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "imageUrl is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build the user message with the image
    const userContent: any[] = [
      { type: "text", text: "Extrae los datos de este comprobante de viaje. Analiza cuidadosamente todos los detalles visibles." },
    ];

    if (fileType === "application/pdf") {
      // For PDFs, send as a document URL
      userContent.push({
        type: "image_url",
        image_url: { url: imageUrl },
      });
    } else {
      userContent.push({
        type: "image_url",
        image_url: { url: imageUrl },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: EXTRACTION_PROMPT },
          { role: "user", content: userContent },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_receipt_data",
              description: "Extract structured data from a travel receipt/booking confirmation",
              parameters: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "Title or name of the booking (e.g. 'Vuelo LATAM LA601', 'Hotel Ritz Carlton')",
                  },
                  type: {
                    type: "string",
                    enum: ["flight", "hotel", "activity", "food", "transport"],
                    description: "Type of travel event",
                  },
                  location: {
                    type: "string",
                    description: "Location or venue name",
                  },
                  datetime_start: {
                    type: "string",
                    description: "Start date/time in ISO 8601 format (YYYY-MM-DDTHH:mm:ss)",
                  },
                  datetime_end: {
                    type: "string",
                    description: "End date/time in ISO 8601 format, if applicable",
                  },
                  cost: {
                    type: "number",
                    description: "Total cost/price as a number",
                  },
                  currency: {
                    type: "string",
                    description: "Currency code (USD, EUR, CLP, etc.)",
                  },
                  confirmation_code: {
                    type: "string",
                    description: "Booking/confirmation reference code if visible",
                  },
                  notes: {
                    type: "string",
                    description: "Any additional relevant details extracted",
                  },
                },
                required: ["title", "type"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_receipt_data" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Demasiadas solicitudes, intenta en unos segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA agotados." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Error al procesar el documento" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data));

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "extract_receipt_data") {
      return new Response(JSON.stringify({ error: "No se pudieron extraer datos del documento" }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const extractedData = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ success: true, data: extractedData }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("parse-receipt error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
