import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
          country: { type: "string", description: "País del destino — debe coincidir con los países del itinerario del usuario o crear uno nuevo" },
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
    const { messages, tripContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build dynamic system prompt from trip context
    const ctx = tripContext || {};
    const names = ctx.coupleNames?.filter(Boolean)?.join(' & ') || 'los viajeros';
    const dateRange = ctx.startDate && ctx.endDate ? `del ${ctx.startDate} al ${ctx.endDate}` : 'fechas por definir';
    const countries = ctx.countries?.length > 0 ? ctx.countries.join(', ') : 'aún sin destinos definidos';
    const eventCount = ctx.eventCount || 0;

    const SYSTEM_PROMPT = `Eres un asistente de viajes de élite para la luna de miel de ${names}.
Fechas del viaje: ${dateRange}.
Destinos actuales: ${countries}.
Eventos actuales en el itinerario: ${eventCount}.

Tu trabajo:
- Interpretar las ideas del usuario y estructurarlas como eventos del itinerario.
- Ser proactivo: si ves espacios vacíos, sugiere opciones románticas (restaurantes, experiencias, tours).
- Si el usuario menciona un vuelo, hotel o actividad, SIEMPRE usa la herramienta create_event para agregarlo al itinerario.
- Cuando el usuario pregunta "qué hacemos" en una fecha, usa show_timeline para mostrar visualmente los eventos de ese día.
- Cuando sugieras experiencias, usa suggest_experiences para mostrar tarjetas interactivas.

REGLAS CRÍTICAS PARA create_event:
- El campo "country" DEBE ser el nombre del país (ej: "Grecia", "Japón", "Dubái"), NO una ciudad.
- Puedes crear países nuevos libremente, no necesitan existir previamente.
- IMPORTANTE: Cuando el usuario te mande un itinerario completo o lista larga, debes crear CADA evento individualmente con create_event. Llama la herramienta UNA VEZ POR CADA evento. No resumas ni omitas nada.
- Asegúrate de que datetime_start tenga formato ISO 8601 con hora incluida (ej: "2026-03-05T10:00").
- Si el usuario dice "3 de marzo" y el año del viaje es 2026, usa "2026-03-03".

- Responde siempre en español, con un tono cálido, profesional y entusiasta.
- Usa emojis con moderación para dar calidez (✨💕🌟🍽️✈️🏨).
- Mantén respuestas concisas pero completas.
- IMPORTANTE: Cuando crees eventos o muestres timelines, ADEMÁS del tool call, da una respuesta textual breve y cálida confirmando la acción.
- Cuando muestres sugerencias, haz 2-4 opciones con descripciones románticas y emojis.
- NO inventes datos que el usuario no te haya dado. Si no sabes las fechas exactas, pregunta.
- Si el itinerario está vacío, anima al usuario a empezar contándote sobre su viaje.`;

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
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA agotados." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Error del servicio de IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
