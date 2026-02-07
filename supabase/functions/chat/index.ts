import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Eres un asistente de viajes de élite para una luna de miel de 45 días (3 marzo - 16 abril, 2026).
Países: Grecia, Dubai, Maldivas, China, Corea del Sur, Japón.
Usuario: Vicente, Gerente General que valora el orden y la eficiencia.

Tu trabajo:
- Interpretar las ideas del usuario y estructurarlas como eventos del itinerario.
- Ser proactivo: si ves espacios vacíos, sugiere opciones románticas (restaurantes, experiencias, tours).
- Si el usuario menciona un vuelo, hotel o actividad, SIEMPRE usa la herramienta create_event para agregarlo al itinerario.
- Cuando el usuario pregunta "qué hacemos" en una fecha, usa show_timeline para mostrar visualmente los eventos de ese día.
- Cuando sugieras experiencias, usa suggest_experiences para mostrar tarjetas interactivas.
- Responde siempre en español, con un tono cálido, profesional y entusiasta.
- Usa emojis con moderación para dar calidez (✨💕🌟🍽️✈️🏨).
- Mantén respuestas concisas pero completas.
- IMPORTANTE: Cuando crees eventos o muestres timelines, ADEMÁS del tool call, da una respuesta textual breve y cálida confirmando la acción.
- Cuando muestres sugerencias, haz 2-4 opciones con descripciones románticas y emojis.
- Los países válidos son exactamente: Grecia, Dubái, Maldivas, China, Corea del Sur, Japón`;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "create_event",
      description: "Crea un nuevo evento en el itinerario de viaje. Usa esto cuando el usuario quiera agregar vuelos, hoteles, restaurantes, actividades o transporte.",
      parameters: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["flight", "hotel", "activity", "food", "transport"], description: "Tipo de evento" },
          title: { type: "string", description: "Título descriptivo del evento" },
          location: { type: "string", description: "Ubicación del evento" },
          country: { type: "string", enum: ["Grecia", "Dubái", "Maldivas", "China", "Corea del Sur", "Japón"], description: "País del destino" },
          datetime_start: { type: "string", description: "Fecha y hora de inicio ISO 8601 (ej: 2026-03-05T19:00)" },
          datetime_end: { type: "string", description: "Fecha y hora de fin ISO 8601 (opcional)" },
          notes: { type: "string", description: "Notas o detalles adicionales" },
          cost_estimated: { type: "number", description: "Costo estimado (opcional)" },
          currency: { type: "string", description: "Moneda (USD, EUR, etc.)" },
        },
        required: ["type", "title", "location", "country", "datetime_start"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "show_timeline",
      description: "Muestra visualmente los eventos de un día o rango de fechas en formato timeline bonito. Usa esto cuando pregunten qué hay planeado.",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "Fecha a mostrar (YYYY-MM-DD)" },
          country: { type: "string", description: "País para filtrar (opcional)" },
        },
        required: ["date"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "suggest_experiences",
      description: "Sugiere experiencias románticas con tarjetas visuales interactivas. Usa esto para proponer restaurantes, actividades, tours.",
      parameters: {
        type: "object",
        properties: {
          suggestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                type: { type: "string", enum: ["food", "activity", "hotel", "transport"] },
                location: { type: "string" },
                description: { type: "string" },
                cost_estimated: { type: "number" },
                currency: { type: "string" },
                emoji: { type: "string" },
                country: { type: "string" },
                datetime_start: { type: "string" },
              },
              required: ["title", "type", "location", "description", "emoji", "country", "datetime_start"],
              additionalProperties: false,
            },
          },
        },
        required: ["suggestions"],
        additionalProperties: false,
      },
    },
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        tools: TOOLS,
        stream: true,
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
        return new Response(JSON.stringify({ error: "Créditos de IA agotados. Agrega créditos en Settings → Workspace → Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Error del servicio de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
