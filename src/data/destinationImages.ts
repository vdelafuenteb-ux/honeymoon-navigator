import greeceImg from '@/assets/destinations/greece.jpg';
import dubaiImg from '@/assets/destinations/dubai.jpg';
import maldivesImg from '@/assets/destinations/maldives.jpg';
import chinaImg from '@/assets/destinations/china.jpg';
import koreaImg from '@/assets/destinations/korea.jpg';
import japanImg from '@/assets/destinations/japan.jpg';

export const destinationHeroImages: Record<string, string> = {
  'Grecia': greeceImg,
  'Dubái': dubaiImg,
  'Maldivas': maldivesImg,
  'China': chinaImg,
  'Corea del Sur': koreaImg,
  'Japón': japanImg,
};

export const destinationTaglines: Record<string, string> = {
  'Grecia': 'Donde el mar Egeo susurra historias de amor eterno',
  'Dubái': 'Un oasis de lujo en medio del desierto dorado',
  'Maldivas': 'Nuestro paraíso privado sobre aguas cristalinas',
  'China': 'Milenios de magia esperando ser descubiertos juntos',
  'Corea del Sur': 'Modernidad y tradición en perfecta armonía',
  'Japón': 'Donde los cerezos en flor celebrarán nuestro amor 🌸',
};

export interface GuidePlace {
  name: string;
  emoji: string;
  description: string;
  tip?: string;
  mapsQuery: string;
  category: 'attraction' | 'food' | 'photo' | 'tip';
}

export interface DestinationGuide {
  tagline: string;
  transportTip: string;
  mustTry: string;
  places: GuidePlace[];
}

export const destinationGuides: Record<string, DestinationGuide> = {
  'Grecia': {
    tagline: 'Donde el mar Egeo susurra historias de amor eterno',
    transportTip: 'Desde Atenas a Santorini: ferry Blue Star (5h) o vuelo doméstico (45 min). El ferry es más romántico.',
    mustTry: 'Prueben un atardecer en Oia con una copa de vino Assyrtiko local 🍷',
    places: [
      { name: 'Acrópolis de Atenas', emoji: '🏛️', description: 'El Partenón iluminado al atardecer es mágico para fotos', tip: 'Ir temprano (8am) para evitar multitudes', mapsQuery: 'Acropolis Athens Greece', category: 'attraction' },
      { name: 'Oia, Santorini', emoji: '🌅', description: 'Las icónicas cúpulas azules y el mejor atardecer del mundo', tip: 'Reserva lugar en el castillo de Oia 1 hora antes del sunset', mapsQuery: 'Oia Castle Santorini', category: 'photo' },
      { name: 'Strofi Restaurant', emoji: '🍽️', description: 'Cocina griega con terraza mirando la Acrópolis iluminada', tip: 'Pedir mesa en la terraza y el cordero al horno', mapsQuery: 'Strofi Restaurant Athens', category: 'food' },
      { name: 'Amoudi Bay', emoji: '📸', description: 'Bahía secreta bajo Oia, perfecta para fotos con barcos y acantilados', tip: 'Bajar los 300 escalones al atardecer', mapsQuery: 'Amoudi Bay Oia Santorini', category: 'photo' },
      { name: 'Barrio de Plaka', emoji: '🛍️', description: 'Callejuelas con buganvilias, tiendas y tabernas tradicionales', tip: 'Perderse sin Google Maps es parte de la magia', mapsQuery: 'Plaka neighborhood Athens', category: 'attraction' },
      { name: 'Selene Restaurant', emoji: '🍷', description: 'Alta cocina griega en Santorini con vinos volcánicos', tip: 'Probar el menú degustación de 7 tiempos', mapsQuery: 'Selene Restaurant Santorini', category: 'food' },
    ],
  },
  'Dubái': {
    tagline: 'Un oasis de lujo en medio del desierto dorado',
    transportTip: 'El Metro de Dubái conecta todo. Para el desierto, reserven transfer privado del hotel.',
    mustTry: 'Un brunch del viernes en el Burj Al Arab — la experiencia más lujosa del mundo 🥂',
    places: [
      { name: 'Burj Khalifa', emoji: '🏙️', description: 'Subir al piso 148 "At The Top SKY" al atardecer es imperdible', tip: 'Reservar online con mínimo 3 días de anticipación', mapsQuery: 'Burj Khalifa Dubai', category: 'attraction' },
      { name: 'At.mosphere Restaurant', emoji: '🍽️', description: 'Cenar en el piso 122 del Burj Khalifa — la cena más alta del mundo', tip: 'Pedir mesa junto a la ventana y el menú degustación', mapsQuery: 'At.mosphere Restaurant Burj Khalifa', category: 'food' },
      { name: 'Dubai Miracle Garden', emoji: '🌸', description: '150 millones de flores formando esculturas gigantes', tip: 'Ir entre 4-6pm cuando baja el calor y las luces se encienden', mapsQuery: 'Dubai Miracle Garden', category: 'photo' },
      { name: 'Palm Jumeirah', emoji: '🌴', description: 'La isla artificial con playas privadas y resorts de ensueño', tip: 'Tomar el monorriel para vistas aéreas increíbles', mapsQuery: 'Palm Jumeirah Dubai', category: 'attraction' },
      { name: 'Al Fahidi Historical District', emoji: '📸', description: 'El Dubái antiguo con casas de viento y galerías de arte', tip: 'El mejor spot de fotos es la esquina de los murales', mapsQuery: 'Al Fahidi Historical District Dubai', category: 'photo' },
      { name: 'Pierchic Restaurant', emoji: '🦞', description: 'Mariscos premium sobre un muelle con vista al mar Arábigo', tip: 'Reservar para el sunset — las vistas son espectaculares', mapsQuery: 'Pierchic Restaurant Dubai', category: 'food' },
    ],
  },
  'Maldivas': {
    tagline: 'Nuestro paraíso privado sobre aguas cristalinas',
    transportTip: 'Desde Malé al resort: hidroavión (30-45 min) o lancha rápida. El hidroavión tiene las mejores vistas.',
    mustTry: 'Una cena privada en la playa bajo las estrellas, con los pies en la arena 🌊',
    places: [
      { name: 'Snorkel en arrecife de casa', emoji: '🐠', description: 'Nadar con tortugas y mantarrayas desde tu villa', tip: 'Pedir al resort el mapa de los mejores puntos de snorkel', mapsQuery: 'Soneva Fushi Maldives', category: 'attraction' },
      { name: 'Playa bioluminiscente', emoji: '✨', description: 'El plancton brilla de noche creando un mar de estrellas', tip: 'Se ve mejor en noches de luna nueva — verificar calendario', mapsQuery: 'Bioluminescent Beach Maldives', category: 'photo' },
      { name: 'Ithaa Undersea Restaurant', emoji: '🍽️', description: 'El primer restaurante submarino del mundo — cenar rodeados de peces', tip: 'Solo 14 asientos, reservar con semanas de anticipación', mapsQuery: 'Ithaa Undersea Restaurant Maldives', category: 'food' },
      { name: 'Puesta de sol en hamaca', emoji: '🌅', description: 'Las hamacas sobre el agua son icónicas para fotos de pareja', tip: 'La golden hour es a las 5:30pm — tener la cámara lista', mapsQuery: 'Maldives overwater hammock', category: 'photo' },
      { name: 'Spa sobre el agua', emoji: '💆', description: 'Masaje de pareja con piso de vidrio viendo el océano', tip: 'Reservar el primer turno de la mañana — más privado', mapsQuery: 'Soneva Fushi Spa Maldives', category: 'attraction' },
      { name: 'Fresh in the Garden', emoji: '🥗', description: 'Cocina orgánica del huerto del resort entre vegetación tropical', tip: 'Los jugos naturales y el menú de mariscos son increíbles', mapsQuery: 'Fresh in the Garden Soneva Fushi', category: 'food' },
    ],
  },
  'China': {
    tagline: 'Milenios de magia esperando ser descubiertos juntos',
    transportTip: 'El tren bala (高铁) conecta las ciudades principales. Descarguen DiDi (el Uber local) y WeChat Pay.',
    mustTry: 'Dim Sum auténtico en un salón de té tradicional en Shanghái 🥟',
    places: [
      { name: 'The Bund (外滩)', emoji: '🌃', description: 'El paseo ribereño con el skyline más impresionante de Asia', tip: 'Ir a las 7pm cuando se encienden todas las luces del Pudong', mapsQuery: 'The Bund Shanghai', category: 'photo' },
      { name: 'Yu Garden (豫园)', emoji: '🏯', description: 'Jardín clásico de 400 años con puentes zigzag y pagodas', tip: 'Ir entre semana temprano para disfrutarlo sin multitudes', mapsQuery: 'Yu Garden Shanghai', category: 'attraction' },
      { name: 'Mr & Mrs Bund', emoji: '🍽️', description: 'Alta cocina francesa con vista al río Huangpu del chef Paul Pairet', tip: 'Pedir la mesa de la terraza y el menú degustación', mapsQuery: 'Mr and Mrs Bund Shanghai', category: 'food' },
      { name: 'Gran Muralla en Mutianyu', emoji: '🏔️', description: 'Sección menos turística y más romántica de la Gran Muralla', tip: 'Tomar el teleférico de ida y el tobogán de vuelta', mapsQuery: 'Mutianyu Great Wall Beijing', category: 'attraction' },
      { name: 'Tianzifang (田子坊)', emoji: '📸', description: 'Callejones con galerías, cafés y arte callejero increíble', tip: 'Los murales del callejón 3 son los más instagrameables', mapsQuery: 'Tianzifang Shanghai', category: 'photo' },
      { name: 'Din Tai Fung', emoji: '🥟', description: 'Los mejores xiaolongbao (dumplings de sopa) del mundo', tip: 'Ir antes de las 11:30am para evitar la fila de 1 hora', mapsQuery: 'Din Tai Fung Shanghai', category: 'food' },
    ],
  },
  'Corea del Sur': {
    tagline: 'Modernidad y tradición en perfecta armonía',
    transportTip: 'T-Money card para metro y bus. El metro de Seúl es ultra eficiente y con WiFi gratis.',
    mustTry: 'Korean BBQ en Mapo-gu — el barrio de carne a la parrilla más famoso de Seúl 🥩',
    places: [
      { name: 'Gyeongbokgung Palace', emoji: '🏯', description: 'Vestir hanbok tradicional y entrar gratis al palacio real', tip: 'Alquiler de hanbok desde $15 USD en las tiendas aledañas', mapsQuery: 'Gyeongbokgung Palace Seoul', category: 'attraction' },
      { name: 'N Seoul Tower', emoji: '🗼', description: 'Candados del amor con vista panorámica de toda la ciudad', tip: 'Subir al atardecer y quedarse para las luces nocturnas', mapsQuery: 'N Seoul Tower Namsan', category: 'photo' },
      { name: 'Jungsik Restaurant', emoji: '🍽️', description: 'Alta cocina coreana moderna — 2 estrellas Michelin', tip: 'El menú degustación coreano es una experiencia artística', mapsQuery: 'Jungsik Restaurant Seoul', category: 'food' },
      { name: 'Bukchon Hanok Village', emoji: '📸', description: '600 casas tradicionales hanok con vistas a la ciudad moderna', tip: 'Ir antes de las 9am para fotos sin gente', mapsQuery: 'Bukchon Hanok Village Seoul', category: 'photo' },
      { name: 'Starfield Library', emoji: '📚', description: 'Biblioteca gigante y fotogénica dentro del COEX Mall', tip: 'El ángulo desde el segundo piso es el mejor para fotos', mapsQuery: 'Starfield Library COEX Seoul', category: 'attraction' },
      { name: 'Maple Tree House', emoji: '🥩', description: 'El mejor Korean BBQ de Seúl según los locales', tip: 'Pedir el chadolbegi (brisket) y el samgyeopsal (panceta)', mapsQuery: 'Maple Tree House Itaewon Seoul', category: 'food' },
    ],
  },
  'Japón': {
    tagline: 'Donde los cerezos en flor celebrarán nuestro amor 🌸',
    transportTip: 'Japan Rail Pass (14 días) es esencial. El Shinkansen Tokio→Kioto toma 2h15m. Suica card para metro local.',
    mustTry: 'Omakase en un restaurante de sushi de 8 asientos — el chef prepara cada pieza frente a ustedes 🍣',
    places: [
      { name: 'Templo Senso-ji', emoji: '⛩️', description: 'El templo más antiguo de Tokio con la icónica linterna roja', tip: 'Ir a las 6am cuando está vacío — las fotos son mágicas', mapsQuery: 'Senso-ji Temple Tokyo', category: 'attraction' },
      { name: 'Fushimi Inari Taisha', emoji: '⛩️', description: '10.000 torii rojos formando túneles infinitos en Kioto', tip: 'Subir hasta la cima (2h) — desde el cruce 4 está casi vacío', mapsQuery: 'Fushimi Inari Taisha Kyoto', category: 'photo' },
      { name: 'Sushi Saito', emoji: '🍣', description: '3 estrellas Michelin — solo 8 asientos, experiencia omakase suprema', tip: 'Reservar con 3 meses vía el concierge del hotel', mapsQuery: 'Sushi Saito Tokyo', category: 'food' },
      { name: 'Bosque de Bambú', emoji: '🎋', description: 'Arashiyama — el sendero entre bambúes gigantes es surrealista', tip: 'Ir al amanecer (6am) para tenerlo prácticamente solos', mapsQuery: 'Arashiyama Bamboo Grove Kyoto', category: 'photo' },
      { name: 'Kinkaku-ji (Pabellón Dorado)', emoji: '✨', description: 'Templo cubierto de oro reflejado en un lago de ensueño', tip: 'Después de lluvia el reflejo es perfecto — llevar paraguas', mapsQuery: 'Kinkaku-ji Golden Pavilion Kyoto', category: 'attraction' },
      { name: 'Ichiran Ramen', emoji: '🍜', description: 'Los booths individuales más famosos del mundo — ramen personalizado', tip: 'Pedir fideos al dente, caldo concentrado y huevo extra', mapsQuery: 'Ichiran Ramen Shibuya Tokyo', category: 'food' },
      { name: 'Shibuya Crossing', emoji: '📸', description: 'El cruce peatonal más famoso del mundo — caos organizado', tip: 'Mejor vista desde Starbucks del 2do piso o Shibuya Sky', mapsQuery: 'Shibuya Crossing Tokyo', category: 'photo' },
      { name: 'Onsen en Kioto', emoji: '♨️', description: 'Baño termal tradicional japonés — relajación total', tip: 'El ryokan Suiran tiene onsen privado al aire libre', mapsQuery: 'Suiran Luxury Collection Kyoto', category: 'attraction' },
    ],
  },
};
