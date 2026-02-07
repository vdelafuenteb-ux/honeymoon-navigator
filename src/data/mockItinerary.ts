import { TripCountry, TripStats } from '@/types/trip';

export const tripStats: TripStats = {
  totalDays: 45,
  daysRemaining: 24, // mock
  budgetEstimated: 35000,
  budgetSpent: 18500,
  percentConfirmed: 62,
  countriesCount: 6,
  eventsCount: 87,
};

export const tripItinerary: TripCountry[] = [
  {
    country: 'Grecia',
    flag: '🇬🇷',
    dateRange: '3 - 10 Mar',
    days: [
      {
        date: '2026-03-03',
        events: [
          { id: 'g1', type: 'flight', status: 'confirmed', title: 'Vuelo Santiago → Atenas', location: 'Aeropuerto SCL → ATH', datetime_start: '2026-03-03T08:00', datetime_end: '2026-03-03T22:00', notes: 'Escala en Madrid. LATAM + Aegean', source: 'manual', cost_estimated: 1800, currency: 'USD' },
          { id: 'g2', type: 'hotel', status: 'confirmed', title: 'Hotel Grande Bretagne', location: 'Atenas, Plaza Syntagma', datetime_start: '2026-03-03T23:00', datetime_end: '2026-03-06T12:00', notes: 'Suite con vista a la Acrópolis', source: 'manual', cost_estimated: 1200, currency: 'USD' },
        ],
      },
      {
        date: '2026-03-04',
        events: [
          { id: 'g3', type: 'activity', status: 'draft', title: 'Tour Acrópolis y Partenón', location: 'Atenas', datetime_start: '2026-03-04T09:00', datetime_end: '2026-03-04T13:00', notes: 'Guía privado reservado', source: 'user_chat', cost_estimated: 150, currency: 'EUR' },
          { id: 'g4', type: 'food', status: 'draft', title: 'Almuerzo en Strofi', location: 'Rovertou Galli 25, Atenas', datetime_start: '2026-03-04T14:00', datetime_end: '2026-03-04T15:30', notes: 'Terraza con vista a la Acrópolis', source: 'user_chat', cost_estimated: 80, currency: 'EUR' },
          { id: 'g5', type: 'activity', status: 'draft', title: 'Paseo por Plaka', location: 'Barrio Plaka, Atenas', datetime_start: '2026-03-04T16:30', datetime_end: '2026-03-04T19:00', notes: 'Shopping y exploración', source: 'user_chat' },
        ],
      },
      {
        date: '2026-03-07',
        events: [
          { id: 'g6', type: 'transport', status: 'confirmed', title: 'Ferry a Santorini', location: 'Puerto de Pireo → Santorini', datetime_start: '2026-03-07T07:30', datetime_end: '2026-03-07T12:30', notes: 'Blue Star Ferries - Business Class', source: 'manual', cost_estimated: 120, currency: 'EUR' },
          { id: 'g7', type: 'hotel', status: 'draft', title: 'Katikies Hotel Santorini', location: 'Oia, Santorini', datetime_start: '2026-03-07T14:00', datetime_end: '2026-03-10T12:00', notes: 'Cave suite con piscina infinita', source: 'user_chat', cost_estimated: 2400, currency: 'EUR' },
        ],
      },
    ],
  },
  {
    country: 'Dubái',
    flag: '🇦🇪',
    dateRange: '11 - 16 Mar',
    days: [
      {
        date: '2026-03-11',
        events: [
          { id: 'd1', type: 'flight', status: 'confirmed', title: 'Vuelo Atenas → Dubái', location: 'ATH → DXB', datetime_start: '2026-03-11T06:00', datetime_end: '2026-03-11T12:30', notes: 'Emirates directo', source: 'manual', cost_estimated: 600, currency: 'USD' },
          { id: 'd2', type: 'hotel', status: 'draft', title: 'Atlantis The Royal', location: 'Palm Jumeirah, Dubái', datetime_start: '2026-03-11T15:00', datetime_end: '2026-03-16T12:00', notes: 'Royal suite con vista al mar', source: 'user_chat', cost_estimated: 3500, currency: 'USD' },
        ],
      },
      {
        date: '2026-03-13',
        events: [
          { id: 'd3', type: 'food', status: 'draft', title: 'Cena en At.mosphere', location: 'Burj Khalifa, Piso 122', datetime_start: '2026-03-13T20:00', datetime_end: '2026-03-13T23:00', notes: 'Reserva para 2 - Menú degustación', source: 'user_chat', cost_estimated: 500, currency: 'USD' },
          { id: 'd4', type: 'activity', status: 'draft', title: 'Desert Safari al atardecer', location: 'Desierto de Dubái', datetime_start: '2026-03-13T15:00', datetime_end: '2026-03-13T19:30', notes: 'Safari privado con cena beduina', source: 'user_chat', cost_estimated: 300, currency: 'USD' },
        ],
      },
    ],
  },
  {
    country: 'Maldivas',
    flag: '🇲🇻',
    dateRange: '17 - 23 Mar',
    days: [
      {
        date: '2026-03-17',
        events: [
          { id: 'm1', type: 'flight', status: 'draft', title: 'Vuelo Dubái → Malé', location: 'DXB → MLE', datetime_start: '2026-03-17T09:00', datetime_end: '2026-03-17T14:30', notes: 'Emirates', source: 'user_chat', cost_estimated: 450, currency: 'USD' },
          { id: 'm2', type: 'transport', status: 'draft', title: 'Hidroavión a resort', location: 'Malé → Soneva Fushi', datetime_start: '2026-03-17T16:00', datetime_end: '2026-03-17T16:45', notes: 'Transfer incluido con hotel', source: 'user_chat' },
          { id: 'm3', type: 'hotel', status: 'draft', title: 'Soneva Fushi', location: 'Baa Atoll, Maldivas', datetime_start: '2026-03-17T17:00', datetime_end: '2026-03-23T12:00', notes: 'Water villa con piscina privada', source: 'user_chat', cost_estimated: 5600, currency: 'USD' },
        ],
      },
    ],
  },
  {
    country: 'China',
    flag: '🇨🇳',
    dateRange: '24 - 31 Mar',
    days: [
      {
        date: '2026-03-24',
        events: [
          { id: 'c1', type: 'flight', status: 'draft', title: 'Vuelo Malé → Shanghái', location: 'MLE → PVG', datetime_start: '2026-03-24T06:00', datetime_end: '2026-03-24T18:00', notes: 'Escala en Singapur', source: 'user_chat', cost_estimated: 800, currency: 'USD' },
          { id: 'c2', type: 'hotel', status: 'draft', title: 'The Peninsula Shanghai', location: 'The Bund, Shanghái', datetime_start: '2026-03-24T20:00', datetime_end: '2026-03-27T12:00', notes: 'Deluxe River Suite', source: 'user_chat', cost_estimated: 1500, currency: 'USD' },
        ],
      },
    ],
  },
  {
    country: 'Corea del Sur',
    flag: '🇰🇷',
    dateRange: '1 - 7 Abr',
    days: [
      {
        date: '2026-04-01',
        events: [
          { id: 'k1', type: 'flight', status: 'draft', title: 'Vuelo Pekín → Seúl', location: 'PEK → ICN', datetime_start: '2026-04-01T10:00', datetime_end: '2026-04-01T13:30', notes: 'Korean Air', source: 'user_chat', cost_estimated: 350, currency: 'USD' },
          { id: 'k2', type: 'hotel', status: 'draft', title: 'Josun Palace Seoul', location: 'Gangnam, Seúl', datetime_start: '2026-04-01T15:00', datetime_end: '2026-04-04T12:00', notes: 'Grand Deluxe', source: 'user_chat', cost_estimated: 900, currency: 'USD' },
        ],
      },
    ],
  },
  {
    country: 'Japón',
    flag: '🇯🇵',
    dateRange: '8 - 16 Abr',
    days: [
      {
        date: '2026-04-08',
        events: [
          { id: 'j1', type: 'flight', status: 'draft', title: 'Vuelo Seúl → Tokio', location: 'ICN → NRT', datetime_start: '2026-04-08T09:00', datetime_end: '2026-04-08T11:30', notes: 'ANA', source: 'user_chat', cost_estimated: 280, currency: 'USD' },
          { id: 'j2', type: 'hotel', status: 'confirmed', title: 'Aman Tokyo', location: 'Otemachi, Tokio', datetime_start: '2026-04-08T15:00', datetime_end: '2026-04-12T12:00', notes: 'Premier Room con vista al jardín imperial', source: 'manual', cost_estimated: 3200, currency: 'USD' },
        ],
      },
      {
        date: '2026-04-09',
        events: [
          { id: 'j3', type: 'activity', status: 'draft', title: 'Templo Senso-ji y Asakusa', location: 'Asakusa, Tokio', datetime_start: '2026-04-09T09:00', datetime_end: '2026-04-09T12:00', notes: 'Temporada de cerezos en flor 🌸', source: 'user_chat' },
          { id: 'j4', type: 'food', status: 'draft', title: 'Sushi Saito', location: 'Minato, Tokio', datetime_start: '2026-04-09T19:00', datetime_end: '2026-04-09T21:00', notes: '3 estrellas Michelin - Reserva con 3 meses de anticipación', source: 'user_chat', cost_estimated: 400, currency: 'USD' },
        ],
      },
      {
        date: '2026-04-12',
        events: [
          { id: 'j5', type: 'transport', status: 'draft', title: 'Shinkansen Tokio → Kioto', location: 'Estación de Tokio → Kioto', datetime_start: '2026-04-12T08:00', datetime_end: '2026-04-12T10:15', notes: 'Nozomi - Green Car (Primera clase)', source: 'user_chat', cost_estimated: 130, currency: 'USD' },
          { id: 'j6', type: 'hotel', status: 'draft', title: 'Suiran Luxury Collection', location: 'Arashiyama, Kioto', datetime_start: '2026-04-12T14:00', datetime_end: '2026-04-16T12:00', notes: 'Habitación tradicional ryokan con onsen privado', source: 'user_chat', cost_estimated: 1800, currency: 'USD' },
        ],
      },
      {
        date: '2026-04-16',
        events: [
          { id: 'j7', type: 'flight', status: 'draft', title: 'Vuelo Osaka → Santiago', location: 'KIX → SCL', datetime_start: '2026-04-16T14:00', datetime_end: '2026-04-17T08:00', notes: 'Regreso a casa ✈️ Escala en Dallas', source: 'user_chat', cost_estimated: 1900, currency: 'USD' },
        ],
      },
    ],
  },
];
