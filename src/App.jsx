import { useState, useRef } from "react";

// ─── BRAND COLORS ────────────────────────────────────────────────────────────
const C = {
  gold:'#E5B800', deepGold:'#C9980A', black:'#1A1A1A',
  offWhite:'#F7F7F9', gray:'#6B7280', charcoal:'#1E2A3A',
  beige:'#D4C49A', darkGray:'#4A4A4A', white:'#FFFFFF',
  red:'#DC2626', green:'#16A34A', lightGold:'#FFF8DC',
  blue:'#0284c7', lightBlue:'#f0f9ff', purple:'#7c3aed',
};

// ─── REAL PRICE ANCHORS (2025) ────────────────────────────────────────────────
const PA = {
  gas: 4.65, mpg: 28,
  hotel:   { low:[75,110],   normal:[130,185], high:[220,380] },
  food:    { low:[35,55],    normal:[60,90],   high:[110,180] },
  car:     { low:[45,70],    normal:[70,100],  high:[105,190] },
  flight_dom: { low:[150,280], normal:[280,450], high:[450,900] },
  flight_int: { low:[400,750], normal:[750,1300],high:[1300,4000] },
  attraction: { low:[10,20],  normal:[20,45],  high:[45,120] },
};

// ─── FAMOUS TRIPS ─────────────────────────────────────────────────────────────
const FAMOUS_TRIPS = [
  {
    id:'rt66', emoji:'🛣️', cat:'USA Road',
    name:'Route 66', tag:'The Great American Highway',
    desc:'Chicago to Santa Monica — the iconic cross-country drive through the heart of America',
    days:14, type:'roadtrip', domestic:true, depCity:'Chicago, IL',
    dests:[
      {name:'St. Louis, Missouri',       places:'Gateway Arch, City Museum, Anheuser-Busch Brewery'},
      {name:'Oklahoma City, Oklahoma',   places:'Bricktown, National Memorial, Stockyards City'},
      {name:'Amarillo, Texas',           places:'Cadillac Ranch, Palo Duro Canyon, Big Texan Steak Ranch'},
      {name:'Albuquerque, New Mexico',   places:'Old Town, Balloon Fiesta grounds, Breaking Bad locations'},
      {name:'Flagstaff, Arizona',        places:'Grand Canyon South Rim day trip, Walnut Canyon, Lowell Observatory'},
      {name:'Los Angeles, California',   places:'Santa Monica Pier end of Route 66, Venice Beach, Hollywood Sign'},
    ],
    highlights:['Cadillac Ranch TX','Grand Canyon day trip','Petrified Forest AZ','Santa Monica Pier finish line'],
    stat:'2,278 miles · 14 days · No flights needed',
  },
  {
    id:'pch', emoji:'🌊', cat:'USA Road',
    name:'Pacific Coast Hwy', tag:"California's Most Scenic Drive",
    desc:'San Francisco to Los Angeles hugging the rugged California coastline on Highway 1',
    days:7, type:'roadtrip', domestic:true, depCity:'San Francisco, CA',
    dests:[
      {name:'Santa Cruz, California',      places:'Boardwalk amusement park, Natural Bridges, surfing lessons'},
      {name:'Monterey, California',        places:'Aquarium, 17-Mile Drive, Cannery Row, whale watching'},
      {name:'Big Sur, California',         places:'Bixby Bridge, Pfeiffer Beach purple sand, McWay Falls'},
      {name:'San Luis Obispo, California', places:'Hearst Castle, Madonna Inn, Bubblegum Alley'},
      {name:'Los Angeles, California',     places:'Santa Monica Pier, Venice Beach, Malibu, Getty Villa'},
    ],
    highlights:['Bixby Bridge viewpoint','Hearst Castle tour','Big Sur sunset','Malibu beaches'],
    stat:'600 miles · 7 days · One of the world\'s top scenic drives',
  },
  {
    id:'fl_keys', emoji:'🌴', cat:'USA Road',
    name:'Florida Keys', tag:'Paradise at the End of the Road',
    desc:'Miami to Key West through 42 bridges connecting a string of tropical islands',
    days:5, type:'beach', domestic:true, depCity:'Miami, FL',
    dests:[
      {name:'Key Largo, Florida',  places:'John Pennekamp Coral Reef snorkeling, diving, glass-bottom boat'},
      {name:'Islamorada, Florida', places:'Sport fishing capital, Theater of the Sea, Anne\'s Beach'},
      {name:'Marathon, Florida',   places:'Turtle Hospital tour, Seven Mile Bridge walk, Pigeon Key'},
      {name:'Key West, Florida',   places:'Duval Street, Mallory Square sunset celebration, Hemingway House'},
    ],
    highlights:['Seven Mile Bridge','John Pennekamp snorkeling','Mallory Square sunset','Southernmost Point USA'],
    stat:'160 miles · 5 days · Max speed 45 mph — slow down and enjoy',
  },
  {
    id:'sw_loop', emoji:'🏜️', cat:'National Parks',
    name:'Southwest Loop', tag:"America's Greatest National Parks",
    desc:'Grand Canyon, Zion, Bryce Canyon, Arches — the ultimate American national parks road trip',
    days:10, type:'adventure', domestic:true, depCity:'Las Vegas, NV',
    dests:[
      {name:'Grand Canyon, Arizona',        places:'South Rim, Bright Angel Trail, Desert View Watchtower'},
      {name:'Zion National Park, Utah',     places:'Angels Landing hike, The Narrows wade, Emerald Pools'},
      {name:'Bryce Canyon, Utah',           places:'Inspiration Point, Navajo Loop hoodoos, Sunset Point'},
      {name:'Arches National Park, Utah',   places:'Delicate Arch at sunrise, Landscape Arch, Windows section'},
      {name:'Monument Valley, Arizona',     places:'The Mittens, John Ford\'s Point, Wildcat Trail'},
    ],
    highlights:['Grand Canyon South Rim at dawn','Angels Landing hike','Bryce hoodoos','Delicate Arch sunrise'],
    stat:'1,200 miles loop from Las Vegas · 10 days · National Park Pass saves money',
  },
  {
    id:'music', emoji:'🎸', cat:'USA Road',
    name:'Music City Trail', tag:'From Country to Jazz',
    desc:'Nashville to New Orleans following America\'s greatest music heritage through the Deep South',
    days:7, type:'roadtrip', domestic:true, depCity:'Nashville, TN',
    dests:[
      {name:'Nashville, Tennessee',        places:'Broadway honky-tonks, Grand Ole Opry, Country Music Hall of Fame'},
      {name:'Memphis, Tennessee',          places:'Graceland, Beale Street blues, Sun Studio, world-class BBQ'},
      {name:'Clarksdale, Mississippi',     places:'Delta Blues Museum, Robert Johnson crossroads, Ground Zero Club'},
      {name:'New Orleans, Louisiana',      places:'French Quarter, Bourbon Street jazz, beignets at Café Du Monde'},
    ],
    highlights:['Grand Ole Opry Nashville','Graceland Memphis','Beale Street blues clubs','Bourbon Street jazz'],
    stat:'600 miles · 7 days · Best food and music in America',
  },
  {
    id:'pr', emoji:'🇵🇷', cat:'Caribbean',
    name:'Puerto Rico Tour', tag:'La Isla del Encanto',
    desc:'The complete Puerto Rico experience: rainforest, colonial history, beaches and bioluminescent bays',
    days:7, type:'beach', domestic:true, depCity:'San Juan, PR',
    dests:[
      {name:'San Juan, Puerto Rico',         places:'Old San Juan, Castillo El Morro, La Perla, Condado Beach'},
      {name:'El Yunque, Puerto Rico',        places:'El Yunque Rainforest trails, natural pools, La Mina Falls'},
      {name:'Ponce, Puerto Rico',            places:'Plaza Las Delicias, Parque de Bombas, Hacienda Buena Vista'},
      {name:'Rincón, Puerto Rico',           places:'Surfing, whale watching Dec-Mar, Steps Beach, lighthouse sunset'},
      {name:'Fajardo, Puerto Rico',          places:'Laguna Grande bioluminescent bay kayak night tour, Las Cabezas reserve'},
    ],
    highlights:['Old San Juan colonial walls','El Yunque rainforest hike','Rincón sunset from lighthouse','Bioluminescent bay night tour'],
    stat:'250 miles around island · 7 days · No passport for US citizens',
  },
  {
    id:'italy', emoji:'🍕', cat:'Europe',
    name:'Italy Classic', tag:'Rome, Florence & Venice',
    desc:'The essential Italian journey — ancient history, Renaissance art, canals and world-class food',
    days:10, type:'museums', domestic:false, airport:'New York John F. Kennedy (JFK)',
    dests:[
      {name:'Rome, Italy',    places:'Colosseum, Vatican Museums & Sistine Chapel, Trevi Fountain, Trastevere dinner'},
      {name:'Florence, Italy',places:'Uffizi Gallery, Michelangelo\'s David, Ponte Vecchio, Tuscany day trip'},
      {name:'Venice, Italy',  places:'St. Mark\'s Basilica, Grand Canal gondola, Rialto Market, Murano Island glass'},
    ],
    highlights:['Vatican Sistine Chapel','Colosseum at dawn','Uffizi Gallery Renaissance art','Venice gondola'],
    stat:'10 days · Travel by Trenitalia high-speed train between cities',
  },
  {
    id:'paris', emoji:'🗼', cat:'Europe',
    name:'Paris Weekend', tag:'The City of Light',
    desc:'An unforgettable long weekend in Paris — the Eiffel Tower, Louvre, Montmartre and croissants',
    days:4, type:'museums', domestic:false, airport:'New York John F. Kennedy (JFK)',
    dests:[
      {name:'Paris, France', places:'Eiffel Tower, Louvre Museum, Musée d\'Orsay, Montmartre & Sacré-Cœur, Versailles day trip'},
    ],
    highlights:['Eiffel Tower lit at night','Louvre Museum Venus de Milo','Montmartre artists quarter','Palace of Versailles gardens'],
    stat:'4 days · Paris Metro covers everything — no car needed',
  },
  {
    id:'iceland', emoji:'🌋', cat:'Adventure',
    name:'Iceland Ring Road', tag:'Fire, Ice & Northern Lights',
    desc:'Circle the entire island of Iceland on the legendary Route 1 — waterfalls, glaciers, geysers and auroras',
    days:10, type:'adventure', domestic:false, airport:'New York John F. Kennedy (JFK)',
    dests:[
      {name:'Reykjavik, Iceland',           places:'Blue Lagoon, Golden Circle (Geysir+Gullfoss+Þingvellir), Hallgrímskirkja'},
      {name:'South Coast, Iceland',         places:'Seljalandsfoss waterfall you walk behind, Skógafoss, black sand beaches, Jökulsárlón glacier lagoon'},
      {name:'East Iceland',                 places:'East Fjords scenic drive, Seyðisfjörður village, Egilsstaðir'},
      {name:'Akureyri, Iceland',            places:'Whale watching, Lake Mývatn geothermal area, Dettifoss Europe\'s most powerful waterfall'},
      {name:'Snæfellsnes Peninsula, Iceland',places:'Snæfellsjökull glacier volcano, Kirkjufell mountain (Game of Thrones), Arnarstapi'},
    ],
    highlights:['Blue Lagoon geothermal spa','Northern Lights (Sep–Mar)','Jökulsárlón glacier lagoon','Kirkjufell mountain'],
    stat:'828 miles ring road · 10 days · Rent a 4WD SUV',
  },
  {
    id:'peru', emoji:'🏔️', cat:'Latin America',
    name:'Peru & Machu Picchu', tag:'Lost City of the Incas',
    desc:'From Lima\'s food scene to Cusco\'s Inca temples to the wonder of Machu Picchu',
    days:10, type:'adventure', domestic:false, airport:'Miami International (MIA)',
    dests:[
      {name:'Lima, Peru',           places:'Miraflores, Larco Museum, world-class ceviche, paragliding over Pacific'},
      {name:'Cusco, Peru',          places:'Plaza de Armas, Sacsayhuamán Inca fortress, San Blas artisan quarter, Sacred Valley'},
      {name:'Machu Picchu, Peru',   places:'Machu Picchu citadel at sunrise, Sun Gate hike, Inca Bridge, Huayna Picchu mountain'},
      {name:'Aguas Calientes, Peru',places:'Base camp for Machu Picchu, hot springs, local market, Machu Picchu Pueblo'},
    ],
    highlights:['Machu Picchu at sunrise (7am)','Sacred Valley Inca sites','Cusco colonial + Inca architecture','Lima food scene'],
    stat:'10 days · Lima→Cusco by plane (1hr) · Cusco→Machu Picchu by train',
  },
  {
    id:'amalfi', emoji:'🛥️', cat:'Europe',
    name:'Amalfi Coast', tag:"Italy's Most Dramatic Coastline",
    desc:'Cliffside villages, turquoise water, lemon trees and the freshest seafood of your life',
    days:7, type:'beach', domestic:false, airport:'New York John F. Kennedy (JFK)',
    dests:[
      {name:'Naples, Italy',  places:'Authentic pizza Napoletana, National Archaeological Museum, Pompeii & Herculaneum ruins'},
      {name:'Sorrento, Italy',places:'Piazza Tasso, Limoncello distillery, ferry hub for Capri and Amalfi towns'},
      {name:'Positano, Italy',places:'Iconic cliffside village, Spiaggia Grande beach, boutique shopping on steep stairs'},
      {name:'Amalfi, Italy',  places:'Cathedral of St. Andrew, Valle delle Ferriere hike, traditional paper mills'},
      {name:'Ravello, Italy', places:'Villa Cimbrone infinity garden, Villa Rufolo concerts, best panoramic views'},
    ],
    highlights:['Pompeii ancient ruins','Positano cliffside view','Capri day trip by ferry','Pizza in Naples — birth of pizza'],
    stat:'7 days · Use ferries not the road — more scenic and less stressful',
  },
  {
    id:'caribbean', emoji:'🏝️', cat:'Caribbean',
    name:'Caribbean Island Hop', tag:'Island to Island Paradise',
    desc:'The best of the Caribbean — stunning beaches, Creole food, rum and reggae across 4 islands',
    days:10, type:'beach', domestic:false, airport:'Miami International (MIA)',
    dests:[
      {name:'Barbados',  places:'Crane Beach top-rated, Barbados rum trail & Mount Gay distillery, Bridgetown colonial town'},
      {name:'St. Lucia', places:'Piton mountains hike, Soufrière drive-in volcano, Diamond Botanical Gardens, Anse Chastanet'},
      {name:'Antigua',   places:'English Harbour & Nelson\'s Dockyard, 365 beaches (one for every day), sailing'},
      {name:'St. Martin',places:'French & Dutch sides, Orient Beach, Maho Beach plane spotting, Grand Case restaurants'},
    ],
    highlights:['Pitons hike St. Lucia','Barbados rum trail','Antigua 365 beaches','Maho Beach plane watching'],
    stat:'10 days · Inter-island flights 30–90 min each',
  },
  {
    id:'ne_fall', emoji:'🍂', cat:'USA Road',
    name:'New England Fall', tag:"America's Best Foliage",
    desc:'Vermont, New Hampshire and Maine ablaze with the most spectacular autumn colors in the world',
    days:7, type:'roadtrip', domestic:true, depCity:'Boston, MA',
    dests:[
      {name:'White Mountains, New Hampshire',places:'Kancamagus Highway peak foliage drive, Mt. Washington Cog Railway, Conway'},
      {name:'Stowe, Vermont',               places:'Stowe Village main street, Ben & Jerry\'s factory tour, covered bridge photo stops'},
      {name:'Burlington, Vermont',          places:'Church Street, Lake Champlain waterfront, ECHO Museum, craft beer scene'},
      {name:'Woodstock, Vermont',           places:'Most beautiful New England village, Quechee Gorge, Billings Farm & Museum'},
      {name:'Bar Harbor, Maine',            places:'Acadia National Park, Cadillac Mountain sunrise (first in USA), Jordan Pond House'},
    ],
    highlights:['Kancamagus Highway foliage drive','Ben & Jerry\'s factory','Acadia Cadillac Mountain sunrise','Woodstock Vermont village'],
    stat:'800 miles loop from Boston · Peak foliage: early–mid October — BOOK EARLY',
  },
  {
    id:'camino', emoji:'⛪', cat:'Adventure',
    name:'Camino de Santiago', tag:'The Way of St. James',
    desc:'Walk (or experience) the world\'s most famous pilgrimage across the north of Spain',
    days:14, type:'adventure', domestic:false, airport:'New York John F. Kennedy (JFK)',
    dests:[
      {name:'Pamplona, Spain',             places:'Running of the Bulls route, medieval walls, pintxos bars on Calle Estafeta'},
      {name:'Logroño, Spain',              places:'La Rioja wine capital, Calle Laurel tapas street, San Millán monasteries'},
      {name:'Burgos, Spain',               places:'UNESCO Gothic Cathedral, famous morcilla blood sausage, halfway point'},
      {name:'León, Spain',                 places:'Cathedral with Europe\'s largest stained glass, Barrio Húmedo bar scene'},
      {name:'Santiago de Compostela, Spain',places:'Cathedral, Pilgrim\'s Mass with Botafumeiro incense burner, Compostela certificate'},
    ],
    highlights:['Pilgrim\'s Mass in Santiago Cathedral','Burgos Gothic Cathedral','Rioja wine vineyards','Medieval towns and albergues'],
    stat:'14 days · Key highlights by train + bus (full walk takes 30+ days)',
  },
  {
    id:'tuscany', emoji:'🍷', cat:'Europe',
    name:'Tuscany Wine Tour', tag:'Wine, Art & Rolling Hills',
    desc:'Florence as base to explore Chianti vineyards, Siena\'s medieval square and the timeless Val d\'Orcia',
    days:7, type:'relaxation', domestic:false, airport:'New York John F. Kennedy (JFK)',
    dests:[
      {name:'Florence, Italy',    places:'Uffizi Gallery, Ponte Vecchio, Piazzale Michelangelo sunset, Mercato Centrale'},
      {name:'Siena, Italy',       places:'Piazza del Campo (medieval shell square), Gothic Cathedral, Palio race history'},
      {name:'Chianti, Italy',     places:'Antinori wine estate, Castello di Brolio, Greve in Chianti village, vineyard stays'},
      {name:'San Gimignano, Italy',places:'14 medieval towers, white truffle gelato, walls walk, Vernaccia wine tasting'},
      {name:'Pienza, Italy',      places:'Pecorino cheese tastings, Renaissance ideal city, Val d\'Orcia UNESCO landscape'},
    ],
    highlights:['Chianti vineyard wine tasting','Siena Piazza del Campo','San Gimignano medieval towers','Val d\'Orcia at golden hour'],
    stat:'7 days · Rent a car in Florence · Avoid city center ZTL zones',
  },
  {
    id:'brp', emoji:'🌿', cat:'USA Road',
    name:'Blue Ridge Parkway', tag:"America's Favorite Drive",
    desc:'469 miles of the most beautiful mountain scenery in the eastern United States — Virginia to North Carolina',
    days:5, type:'roadtrip', domestic:true, depCity:'Roanoke, VA',
    dests:[
      {name:'Shenandoah Valley, Virginia',      places:'Skyline Drive, Luray Caverns, Old Rag Mountain hike'},
      {name:'Boone, North Carolina',            places:'Moses Cone Memorial Park, Price Lake, Linn Cove Viaduct'},
      {name:'Asheville, North Carolina',        places:'Biltmore Estate (America\'s largest home), River Arts District, craft breweries'},
      {name:'Great Smoky Mountains, Tennessee', places:'Clingmans Dome highest point, Cades Cove wildlife loop, Laurel Falls, black bears'},
    ],
    highlights:['Mabry Mill historic grist mill','Biltmore Estate 8,000 acres','Clingmans Dome highest Appalachian peak','Cades Cove black bear sightings'],
    stat:'469 miles Parkway · 5 days · Free to drive · No trucks allowed',
  },
];

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const TR = {
  en:{
    tagline:"We Plan Your Trip, You Just Enjoy",
    langBtn:"ES", langLabel:"Language",
    inspiration:"✨ Trip Inspiration", inspirationSub:"Pick a famous route to get started — or scroll down to plan your own",
    clearTrip:"✕ Clear Selection", selectedTrip:"Selected Trip",
    formTitle:"Plan Your Trip", customTitle:"Planning:",
    destSection:"Destinations & Places to Visit",
    destPlaceholder:"e.g., Paris, France",
    placesPlaceholder:"Places to visit (e.g., Eiffel Tower, Louvre...)",
    placesLabel:"Places I Want to Visit (optional)",
    addDest:"+ Add Destination", remove:"✕",
    startDate:"Departure Date", returnDate:"Return Date",
    travelers:"Travelers", nationality:"Nationality / Passport",
    nationalityPlaceholder:"e.g., United States, Puerto Rico...",
    airport:"Departure Airport", airportSearch:"Search airport...",
    airportSelected:"Selected",
    tripType:"Trip Style", budgetType:"Budget Level",
    totalBudget:"Total Budget (USD)", budgetPlaceholder:"e.g., 3000",
    generate:"✈  Generate My Complete Travel Plan",
    fillAll:"Please complete all required fields.",
    demoModeLabel:"Try Demo Mode (no API key needed)",
    demoModeHint:"Generates a realistic plan instantly using local price calculations — no internet/API call required. Great for testing. Turn off for real AI-powered results.",
    tabs:["💰 Budget","📅 Itinerary","🗺 Routes","💡 Tips","🛒 Book Now"],
    item:"Item", cpp:"Per Person", totalCost:"Group Total", comments:"Details",
    time:"Time", activity:"Activity", mapLink:"Map", actCost:"Cost",
    viable:"✓ VIABLE", notViable:"✗ TIGHT",
    budgetOK:"✅  YOUR BUDGET COVERS THIS TRIP",
    budgetNO:"❌  BUDGET NEEDS ADJUSTMENT",
    budgetOKDetail:"Your $BUDGET budget covers the ~$COST estimated cost. You have ~$LEFT as a buffer.",
    budgetNODetail:"Your $BUDGET budget is ~$MISSING short of the estimated $COST. See suggestions below.",
    budgetNOSuggest:"💡 Options: reduce trip days · choose lower budget tier · cut one destination · increase budget",
    allocated:"Allocated", estimated:"Estimated",
    totalRow:"SUBTOTAL", grandTotal:"GRAND TOTAL",
    perPerson:"Per Person", perGroup:"Full Group",
    selectDay:"Select a day:", dayLabel:"Day",
    viewRoute:"Open Route in Google Maps →",
    openMaps:"📍 Map", tips:"Travel Tips", docs:"Documents Needed",
    currency:"Currency", tz:"Timezone", bestTime:"Best Time",
    emergency:"Emergency #s", visaInfo:"Visa / Entry",
    localApps:"Local Apps", weather:"Weather",
    downloadBudget:"⬇ Budget PDF",
    downloadCalendar:"⬇ Itinerary PDF",
    back:"← New Trip", days:"days", nights:"nights", balance:"Buffer",
    perDestDays:"days per stop",
    tripMode:"Trip Type",
    international:"✈ International",
    domesticTrip:"🚗 Domestic",
    tripModeHint:"Domestic trips calculate gas costs instead of flights.",
    needsCarRental:"Car rental needed?",
    yesCarRental:"Yes — rent a car", noCarRental:"No — I have my own",
    stayQuestion:"Accommodation Type",
    stayHotel:"🏨 Hotel / Airbnb overnight",
    stayHome:"🏠 Return home each day",
    stayHotelHint:"Hotel costs will be factored into your budget.",
    stayHomeHint:"No hotel costs — best for destinations within 2 hrs.",
    departureCity:"Departure City",
    departureCityPlaceholder:"e.g., San Juan, PR",
    travelingWithKids:"Traveling with children?",
    noKids:"No — Adults Only", yesKids:"Yes — With Kids",
    addChild:"+ Add Child", removeChild:"✕",
    childNum:"Child", kidsHint:"Enter each child's age for age-appropriate recommendations.",
    yearsOld:"yrs",
    ageInfant:"Infant (0–1)", ageToddler:"Toddler (2–4)",
    ageChild:"Child (5–11)", ageTeen:"Teen (12–17)",
    familyFriendly:"Family Tips", clothing:"What to Pack",
    kidsPassengerNoteShort:"Age 2+ needs own seat → count as traveler. Under 2 → lap infant, don't count.",
    bookNowTitle:"Book Your Trip",
    bookNowSubtitle:"Links pre-filled with your trip details.",
    bookFlights:"Flights", bookHotel:"Hotels",
    bookCar:"Car Rental", bookAttractions:"Attractions",
    bookFood:"Restaurants", openLink:"Book →",
    priceNote:"Prices are AI estimates grounded in 2025 rates. Verify before booking.",
    loadingSubtitle:"Generating your personalized plan with real 2025 prices…",
    loadingTime:"Takes 60–120 seconds. Please wait.",
    loading:["🔍 Researching current flight prices...","🏨 Finding real hotel rates...","🗺 Building your day-by-day itinerary...","📋 Scheduling activities with realistic timing...","💡 Researching entry requirements & local tips...","💰 Calculating precise costs...","🌍 Finalizing your complete plan..."],
    errorGen:"Generation failed. Check your API key and try again.",
    tripTypes:{ roadtrip:"Road Trip", beach:"Beach & Sun", museums:"Culture & Museums", relaxation:"Relax & Unwind", adventure:"Adventure", sports:"Sports", train:"Train Journey", backpacker:"Backpacker", other:"Other" },
    budgetTypes:{ low:"Budget (Economical)", normal:"Mid-Range", high:"Luxury" },
    catLabels:{ 'USA Road':'🛣️ USA Road Trips','National Parks':'🏕️ National Parks','Caribbean':'🌴 Caribbean','Europe':'🌍 Europe','Latin America':'🦜 Latin America','Adventure':'🧗 Adventure' },
  },
  es:{
    tagline:"Hacemos Tu Viaje, Tú Solo Disfruta",
    langBtn:"EN", langLabel:"Idioma",
    inspiration:"✨ Inspiración de Viajes", inspirationSub:"Escoge una ruta famosa para empezar — o desplázate para planificar el tuyo",
    clearTrip:"✕ Limpiar Selección", selectedTrip:"Viaje Seleccionado",
    formTitle:"Planifica Tu Viaje", customTitle:"Planificando:",
    destSection:"Destinos y Lugares a Visitar",
    destPlaceholder:"ej: París, Francia",
    placesPlaceholder:"Lugares a visitar (ej: Torre Eiffel, Louvre...)",
    placesLabel:"Lugares que Quiero Visitar (opcional)",
    addDest:"+ Agregar Destino", remove:"✕",
    startDate:"Fecha de Salida", returnDate:"Fecha de Regreso",
    travelers:"Viajeros", nationality:"Nacionalidad / Pasaporte",
    nationalityPlaceholder:"ej: Puerto Rico, Estados Unidos...",
    airport:"Aeropuerto de Salida", airportSearch:"Buscar aeropuerto...",
    airportSelected:"Seleccionado",
    tripType:"Estilo de Viaje", budgetType:"Nivel de Presupuesto",
    totalBudget:"Presupuesto Total (USD)", budgetPlaceholder:"ej: 3000",
    generate:"✈  Generar Mi Plan de Viaje Completo",
    fillAll:"Por favor completa todos los campos requeridos.",
    demoModeLabel:"Probar Modo Demo (sin necesitar API key)",
    demoModeHint:"Genera un plan realista al instante usando cálculos de precios locales — no requiere internet ni llamada a la API. Ideal para probar. Apágalo para resultados reales con IA.",
    tabs:["💰 Presupuesto","📅 Itinerario","🗺 Rutas","💡 Tips","🛒 Reservar"],
    item:"Item", cpp:"Por Persona", totalCost:"Total Grupo", comments:"Detalles",
    time:"Hora", activity:"Actividad", mapLink:"Mapa", actCost:"Costo",
    viable:"✓ VIABLE", notViable:"✗ AJUSTADO",
    budgetOK:"✅  TU PRESUPUESTO CUBRE ESTE VIAJE",
    budgetNO:"❌  PRESUPUESTO NECESITA AJUSTE",
    budgetOKDetail:"Tu presupuesto de $BUDGET cubre el costo estimado de ~$COST. Tienes ~$LEFT de margen.",
    budgetNODetail:"Tu presupuesto de $BUDGET tiene un déficit de ~$MISSING versus el estimado de $COST.",
    budgetNOSuggest:"💡 Opciones: reduce los días · elige nivel económico · elimina un destino · aumenta el presupuesto",
    allocated:"Asignado", estimated:"Estimado",
    totalRow:"SUBTOTAL", grandTotal:"TOTAL GENERAL",
    perPerson:"Por Persona", perGroup:"Grupo Completo",
    selectDay:"Selecciona un día:", dayLabel:"Día",
    viewRoute:"Ver Ruta en Google Maps →",
    openMaps:"📍 Mapa", tips:"Tips de Viaje", docs:"Documentos",
    currency:"Moneda", tz:"Zona Horaria", bestTime:"Mejor Época",
    emergency:"Emergencias", visaInfo:"Visa / Entrada",
    localApps:"Apps Locales", weather:"Clima",
    downloadBudget:"⬇ PDF Presupuesto",
    downloadCalendar:"⬇ PDF Itinerario",
    back:"← Nuevo Viaje", days:"días", nights:"noches", balance:"Margen",
    perDestDays:"días por destino",
    tripMode:"Tipo de Viaje",
    international:"✈ Internacional",
    domesticTrip:"🚗 Doméstico",
    tripModeHint:"Los viajes domésticos calculan gasolina en vez de vuelos.",
    needsCarRental:"¿Necesitas alquilar un carro?",
    yesCarRental:"Sí — alquilar carro", noCarRental:"No — tengo mi propio",
    stayQuestion:"Tipo de Alojamiento",
    stayHotel:"🏨 Hotel / Airbnb (me quedo)",
    stayHome:"🏠 Regreso a casa cada día",
    stayHotelHint:"Los costos de hotel se incluirán en el presupuesto.",
    stayHomeHint:"Sin costos de hotel. Ideal para destinos a menos de 2 hrs.",
    departureCity:"Ciudad de Salida",
    departureCityPlaceholder:"ej: San Juan, PR",
    travelingWithKids:"¿Viaja con niños?",
    noKids:"No — Solo Adultos", yesKids:"Sí — Con Niños",
    addChild:"+ Agregar Niño", removeChild:"✕",
    childNum:"Niño", kidsHint:"Ingresa la edad de cada niño para actividades apropiadas.",
    yearsOld:"años",
    ageInfant:"Bebé (0–1)", ageToddler:"Niño pequeño (2–4)",
    ageChild:"Niño (5–11)", ageTeen:"Adolescente (12–17)",
    familyFriendly:"Tips Familia", clothing:"Qué Llevar",
    kidsPassengerNoteShort:"2+ años = asiento propio → cuéntalos. Menor de 2 = regazo → no cuentes.",
    bookNowTitle:"Reserva Tu Viaje",
    bookNowSubtitle:"Links con los detalles de tu viaje pre-llenados.",
    bookFlights:"Vuelos", bookHotel:"Hoteles",
    bookCar:"Carro", bookAttractions:"Atracciones",
    bookFood:"Restaurantes", openLink:"Reservar →",
    priceNote:"Precios son estimados de IA basados en tarifas reales 2025. Verifica antes de reservar.",
    loadingSubtitle:"Generando tu plan personalizado con precios reales 2025…",
    loadingTime:"Toma 60–120 segundos. Por favor espera.",
    loading:["🔍 Investigando precios actuales de vuelos...","🏨 Buscando tarifas reales de hoteles...","🗺 Construyendo tu itinerario día por día...","📋 Programando actividades con tiempos realistas...","💡 Investigando requisitos de entrada y tips locales...","💰 Calculando costos precisos...","🌍 Finalizando tu plan completo..."],
    errorGen:"Error al generar. Verifica tu API key e intenta de nuevo.",
    tripTypes:{ roadtrip:"Road Trip", beach:"Playa", museums:"Cultura y Museos", relaxation:"Relax", adventure:"Aventura", sports:"Deportivo", train:"Viaje en Tren", backpacker:"Mochilero", other:"Otro" },
    budgetTypes:{ low:"Económico", normal:"Intermedio", high:"Lujo" },
    catLabels:{ 'USA Road':'🛣️ USA Road Trips','National Parks':'🏕️ Parques Nacionales','Caribbean':'🌴 Caribe','Europe':'🌍 Europa','Latin America':'🦜 Latinoamérica','Adventure':'🧗 Aventura' },
  }
};

const AIRPORTS = [
  {code:"SJU",name:"San Juan Luis Muñoz Marín (SJU)"},{code:"JFK",name:"New York John F. Kennedy (JFK)"},
  {code:"LAX",name:"Los Angeles International (LAX)"},{code:"MIA",name:"Miami International (MIA)"},
  {code:"ORD",name:"Chicago O'Hare (ORD)"},{code:"ATL",name:"Atlanta Hartsfield-Jackson (ATL)"},
  {code:"DFW",name:"Dallas/Fort Worth (DFW)"},{code:"SFO",name:"San Francisco International (SFO)"},
  {code:"BOS",name:"Boston Logan (BOS)"},{code:"SEA",name:"Seattle-Tacoma (SEA)"},
  {code:"LAS",name:"Las Vegas Harry Reid (LAS)"},{code:"MCO",name:"Orlando International (MCO)"},
  {code:"DEN",name:"Denver International (DEN)"},{code:"EWR",name:"Newark Liberty (EWR)"},
  {code:"PHX",name:"Phoenix Sky Harbor (PHX)"},{code:"YYZ",name:"Toronto Pearson (YYZ)"},
  {code:"MEX",name:"Mexico City Benito Juárez (MEX)"},{code:"CUN",name:"Cancún International (CUN)"},
  {code:"BOG",name:"Bogotá El Dorado (BOG)"},{code:"LIM",name:"Lima Jorge Chávez (LIM)"},
  {code:"GRU",name:"São Paulo Guarulhos (GRU)"},{code:"EZE",name:"Buenos Aires Ezeiza (EZE)"},
  {code:"SCL",name:"Santiago de Chile (SCL)"},{code:"PTY",name:"Panama City Tocumen (PTY)"},
  {code:"SDQ",name:"Santo Domingo Las Américas (SDQ)"},{code:"LHR",name:"London Heathrow (LHR)"},
  {code:"CDG",name:"Paris Charles de Gaulle (CDG)"},{code:"FRA",name:"Frankfurt International (FRA)"},
  {code:"AMS",name:"Amsterdam Schiphol (AMS)"},{code:"MAD",name:"Madrid Barajas (MAD)"},
  {code:"BCN",name:"Barcelona El Prat (BCN)"},{code:"FCO",name:"Rome Fiumicino (FCO)"},
  {code:"LIS",name:"Lisbon Humberto Delgado (LIS)"},{code:"ATH",name:"Athens Venizelos (ATH)"},
  {code:"IST",name:"Istanbul Airport (IST)"},{code:"DXB",name:"Dubai International (DXB)"},
  {code:"HND",name:"Tokyo Haneda (HND)"},{code:"SIN",name:"Singapore Changi (SIN)"},
  {code:"ICN",name:"Seoul Incheon (ICN)"},{code:"SYD",name:"Sydney Kingsford Smith (SYD)"},
  {code:"KEF",name:"Reykjavik Keflavik (KEF)"},{code:"NRT",name:"Tokyo Narita (NRT)"},
];

// ─── LOGO ─────────────────────────────────────────────────────────────────────
const Logo = ({size=44}) => (
  <svg width={size} height={Math.round(size*0.65)} viewBox="0 0 200 130" fill="none">
    <polygon points="100,4 91,52 100,48 109,52" fill={C.gold}/>
    <path d="M78 44 A24 24 0 0 1 122 44" stroke={C.gold} strokeWidth="8" fill="none" strokeLinecap="round"/>
    <path d="M78 63 A24 24 0 0 0 122 63" stroke={C.gold} strokeWidth="8" fill="none" strokeLinecap="round"/>
    <circle cx="100" cy="54" r="9" fill={C.gold}/>
    <line x1="100" y1="54" x2="6"   y2="54" stroke={C.gold} strokeWidth="5" strokeLinecap="round"/>
    <line x1="100" y1="54" x2="194" y2="54" stroke={C.gold} strokeWidth="5" strokeLinecap="round"/>
  </svg>
);

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const inp = {width:'100%',padding:'11px 14px',borderRadius:8,border:`1.5px solid ${C.beige}`,background:C.white,fontSize:14,color:C.black,fontFamily:'inherit',boxSizing:'border-box',outline:'none'};
const lbl = {display:'block',marginBottom:6,fontWeight:700,fontSize:11,color:C.charcoal,textTransform:'uppercase',letterSpacing:0.8};
const card = {background:C.white,borderRadius:16,boxShadow:'0 2px 16px rgba(0,0,0,0.07)',border:`1px solid ${C.beige}`};
const btnG = {background:C.gold,color:C.black,border:'none',borderRadius:8,padding:'9px 18px',cursor:'pointer',fontWeight:800,fontSize:13,fontFamily:'inherit'};
const btnD = {background:C.charcoal,color:C.gold,border:'none',borderRadius:8,padding:'9px 18px',cursor:'pointer',fontWeight:800,fontSize:13,fontFamily:'inherit'};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const getCode = n => { const m=(n||'').match(/\(([A-Z]{3})\)/); return m?m[1]:''; };
const ageLabel = (a,t) => { const n=Number(a); if(n<2)return t.ageInfant; if(n<5)return t.ageToddler; if(n<12)return t.ageChild; return t.ageTeen; };
const fmt = n => Number(n||0).toLocaleString();

function buildBookingLinks(destName, destCode, originCode, sd, rd, n) {
  const city=(destName.split(',')[0]||destName).trim();
  const d=encodeURIComponent(city), dF=encodeURIComponent(destName), oc=originCode||'SJU', dc=destCode||'';
  return {
    flights:[
      {label:'Google Flights',icon:'✈️',color:'#1a73e8',url:`https://www.google.com/travel/flights?q=flights+from+${oc}+to+${d}&curr=USD`},
      {label:'Kayak',icon:'🔎',color:'#ff690f',url:`https://www.kayak.com/flights/${oc}-${dc||'anywhere'}/${sd}/${rd}/${n}adults`},
      {label:'Skyscanner',icon:'🌐',color:'#0770e3',url:`https://www.skyscanner.com/transport/flights/${oc.toLowerCase()}/${dc.toLowerCase()||'anywhere'}/`},
      {label:'Expedia',icon:'💼',color:'#00355F',url:`https://www.expedia.com/Flights-Search?trip=roundtrip&leg1=from%3A${oc}%2Cto%3A${dc||d}%2Cdeparture%3A${sd}%2FANYTIME&passengers=adults:${n}&mode=search`},
    ],
    hotels:[
      {label:'Booking.com',icon:'🏨',color:'#003580',url:`https://www.booking.com/search.html?ss=${dF}&checkin=${sd}&checkout=${rd}&group_adults=${n}&no_rooms=1`},
      {label:'Airbnb',icon:'🏠',color:'#ff5a5f',url:`https://www.airbnb.com/s/${dF}/homes?checkin=${sd}&checkout=${rd}&adults=${n}`},
      {label:'Hotels.com',icon:'⭐',color:'#d32f2f',url:`https://www.hotels.com/search.do?q-destination=${dF}&q-check-in=${sd}&q-check-out=${rd}&q-rooms=1&q-room-0-adults=${n}`},
      {label:'TripAdvisor',icon:'🦉',color:'#34e0a1',url:`https://www.tripadvisor.com/Search?q=${dF}+hotels`},
    ],
    cars:[
      {label:'Miles Car Rental',icon:'🚗',color:'#1E2A3A',url:'https://www.miles.com'},
      {label:'Hertz',icon:'🚙',color:'#C8A400',url:`https://www.hertz.com/rentacar/reservation/?from=${d}&pickup=${sd}&return=${rd}`},
      {label:'Enterprise',icon:'🏢',color:'#006747',url:`https://www.enterprise.com/en/car-rental/deeplinking/car-rental-landing.html?from=${sd}&to=${rd}`},
      {label:'Kayak Cars',icon:'🔑',color:'#ff690f',url:`https://www.kayak.com/cars/${dF}/${sd}/${rd}`},
    ],
    attractions:[
      {label:'Viator',icon:'🎯',color:'#145c46',url:`https://www.viator.com/search/${dF}?startDate=${sd}&endDate=${rd}&people=${n}`},
      {label:'GetYourGuide',icon:'🎟️',color:'#FF5722',url:`https://www.getyourguide.com/s/?q=${dF}&date_from=${sd}&date_to=${rd}&num_people=${n}`},
      {label:'Klook',icon:'🌟',color:'#ff6b00',url:`https://www.klook.com/search/?query=${dF}`},
      {label:'TripAdvisor',icon:'🗺️',color:'#34e0a1',url:`https://www.tripadvisor.com/Search?q=${dF}+things+to+do`},
    ],
    restaurants:[
      {label:'Yelp',icon:'🍽️',color:'#d32323',url:`https://www.yelp.com/search?find_desc=restaurants&find_loc=${dF}`},
      {label:'OpenTable',icon:'🍷',color:'#da3743',url:`https://www.opentable.com/s/?term=${dF}&covers=${n}`},
      {label:'TripAdvisor',icon:'🥗',color:'#34e0a1',url:`https://www.tripadvisor.com/Restaurants-${d}`},
    ],
  };
}

function parseJSON(text) {
  let t=(text||'').trim().replace(/^```json\s*/i,'').replace(/^```\s*/i,'').replace(/\s*```\s*$/,'').trim();
  const s=t.indexOf('{'); if(s===-1) throw new Error('No JSON');
  const e=t.lastIndexOf('}');
  if(e>s){try{return JSON.parse(t.slice(s,e+1));}catch(_){}}
  let p=t.slice(s),opens=0,aOpens=0,inStr=false,esc=false;
  for(let i=0;i<p.length;i++){const c=p[i];if(esc){esc=false;continue;}if(c==='\\'&&inStr){esc=true;continue;}if(c==='"'){inStr=!inStr;continue;}if(inStr)continue;if(c==='{')opens++;else if(c==='}')opens--;else if(c==='[')aOpens++;else if(c===']')aOpens--;}
  p=p.replace(/,\s*\{[^}]*$/,'').replace(/,\s*\[[^\]]*$/,'');
  let cl=''; for(let i=0;i<aOpens;i++)cl+=']'; for(let i=0;i<opens;i++)cl+='}';
  try{return JSON.parse(p+cl);}catch(e){throw new Error('JSON parse failed');}
}

/* ── Gemini access: 1) server proxy /api/gemini (key hidden, nothing for the user to set up)
      2) fallback: key the user pastes in the app (saved only in this browser) ── */
let USER_KEY = '';
try { USER_KEY = localStorage.getItem('r2t_gemini_key') || ''; } catch(_) {}
export function setUserKey(k){ USER_KEY=(k||'').trim(); try{ if(USER_KEY) localStorage.setItem('r2t_gemini_key',USER_KEY); else localStorage.removeItem('r2t_gemini_key'); }catch(_){} }
let SEARCH_BLOCKED = false;
const COOL = {}; // model -> timestamp until which it is skipped
let PROXY_OK = null; let PROXY_INFO = '';
const SHOW_KEY_UI = (()=>{try{return new URLSearchParams(window.location.search).has('key');}catch(_){return false;}})(); // null = unknown, true/false after first try
const MODELS = ['gemini-3.5-flash','gemini-3.5-flash-lite','gemini-flash-latest'];
const sleep = ms => new Promise(r=>setTimeout(r,ms));

async function geminiRequest(model, body) {
  if(PROXY_OK!==false){
    try{
      const r = await fetch('/api/gemini',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model,body})});
      if(r.status===404||r.status===405||r.status===501||(r.ok===false&&(r.headers.get('content-type')||'').includes('text/html'))){ PROXY_OK=false; PROXY_INFO='proxy '+r.status; }
      else { PROXY_OK=true; return r; }
    }catch(_){ PROXY_OK=false; }
  }
  if(!USER_KEY){ const e=new Error('NO_KEY'); e.code='NO_KEY'; throw e; }
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':USER_KEY},body:JSON.stringify(body)});
}

async function runPool(tasks,limit=4){
  let i=0; const worker=async()=>{ while(i<tasks.length){ const t=tasks[i++]; await t(); } };
  await Promise.all(Array.from({length:Math.min(limit,tasks.length)},worker));
}

async function callAI(prompt, maxTokens=6000, useSearch=false) {
  const body = {
    contents:[{parts:[{text:prompt}]}],
    generationConfig:{ maxOutputTokens:maxTokens, temperature:0.2, thinkingConfig:{thinkingLevel:'low'} }, // low thinking: otherwise reasoning tokens eat the JSON budget
  };
  const setSearch=(on)=>{ delete body.tools; delete body.generationConfig.responseMimeType;
    if(on) body.tools=[{google_search:{}}];                 // cannot combine with JSON mime type
    else body.generationConfig.responseMimeType='application/json'; };
  let searchOn = useSearch && !SEARCH_BLOCKED;
  setSearch(searchOn);
  let lastErr;
  // Rotate across models: when one is overloaded (503/429/502) skip it for a while and try the next at once
  for(let round=0; round<5; round++){
    const now=Date.now();
    const order=[...MODELS].sort((x,y)=>((COOL[x]||0)>now)-((COOL[y]||0)>now));
    for(const model of order){
      try{
        const res = await geminiRequest(model, body);
        if(res.status===429&&searchOn){ SEARCH_BLOCKED=true; searchOn=false; setSearch(false); lastErr=new Error('Search quota'); continue; } // free key: no live search -> price anchors
        if([429,500,502,503,504].includes(res.status)){ COOL[model]=Date.now()+(res.status===429?25000:15000); lastErr=new Error(`Gemini ${res.status}`); continue; }
        if(res.status===404){ COOL[model]=Date.now()+600000; lastErr=new Error(`Model ${model} not available`); continue; }
        if(!res.ok){
          const e=await res.text().catch(()=>'');
          if(res.status===400&&/thinking/i.test(e)&&body.generationConfig.thinkingConfig){ delete body.generationConfig.thinkingConfig; lastErr=new Error('thinking unsupported'); continue; }
          if(res.status===400&&/API key|API_KEY/i.test(e)) { const x=new Error('BAD_KEY'); x.code='BAD_KEY'; throw x; }
          if(res.status===401||res.status===403){ const x=new Error('BAD_KEY'); x.code='BAD_KEY'; throw x; }
          throw new Error(`Gemini ${res.status}: ${e.slice(0,160)}`);
        }
        const data=await res.json();
        const text=(data?.candidates?.[0]?.content?.parts||[]).map(p=>p.text||'').join('\n');
        if(!text.trim()){ lastErr=new Error('Empty response'); continue; }
        try{ return parseJSON(text); }catch(pe){ lastErr=pe; continue; }
      }catch(e){ if(e.code==='NO_KEY'||e.code==='BAD_KEY') throw e; lastErr=e; }
    }
    await sleep(5000*(round+1));
  }
  throw lastErr||new Error('AI unavailable');
}

/* Recompute every total in code — never trust the model's arithmetic */
function fixBudget(r, numT, allocated){
  const list=(r&&r.budget)||[];
  list.forEach(d=>{
    const rows=(d.rows||[]).map(x=>{
      const total=Math.max(0,Math.round(Number(x.total)||(Number(x.pp)||0)*numT));
      return {...x,total,pp:Math.round(total/numT)};
    });
    d.rows=rows;
    d.estimated=rows.reduce((a,x)=>a+x.total,0);
    d.estimatedPP=Math.round(d.estimated/numT);
    d.allocated=allocated;
    d.viable=d.estimated<=allocated;
  });
  return r;
}

// ─── DEMO MODE GENERATORS (no API needed — uses real PA price anchors) ───────
function demoBudgetForDest(dest, opts) {
  const {bt,drivingTheRoute,includeHotel,includeCar,includeFlights,numT,lang} = opts;
  const isES = lang==='es';
  const h=PA.hotel[bt], f=PA.food[bt], c=PA.car[bt];
  const fl = drivingTheRoute ? PA.flight_dom[bt] : PA.flight_int[bt];
  const hotelAvg = includeHotel ? Math.round((h[0]+h[1])/2) : 0;
  const hotelTotal = hotelAvg * dest.days;
  const foodPP = Math.round((f[0]+f[1])/2);
  const foodTotal = foodPP * dest.days * numT;
  const carAvg = includeCar ? Math.round((c[0]+c[1])/2) : 0;
  const carTotal = carAvg * dest.days;
  const flightPP = includeFlights ? Math.round((fl[0]+fl[1])/2) : 0;
  const flightTotal = flightPP * numT;
  const milesEst = drivingTheRoute ? 250 : 0;
  const gasTotal = drivingTheRoute ? Math.round((milesEst/PA.mpg)*PA.gas) : 0;
  const attrPP = Math.round(((PA.attraction[bt][0]+PA.attraction[bt][1])/2) * 3);
  const attrTotal = attrPP * numT;
  const extrasPP = 45;
  const extrasTotal = extrasPP * numT;
  const total = hotelTotal+foodTotal+carTotal+flightTotal+gasTotal+attrTotal+extrasTotal;
  const estimatedPP = Math.round(total/numT);
  const rows=[];
  if(includeFlights) rows.push({icon:'✈️',cat:isES?'Vuelos':'Flights',pp:flightPP,total:flightTotal,detail:isES?'Estimado demo: tarifa promedio ida y vuelta':'Demo estimate: average round-trip fare',links:'Google Flights, Kayak'});
  rows.push({icon:'🏨',cat:includeHotel?'Hotel':(isES?'Alojamiento':'Accommodation'),pp:includeHotel?Math.round(hotelTotal/numT):0,total:hotelTotal,detail:includeHotel?(isES?`Estimado demo: $${hotelAvg}/noche × ${dest.days} noches`:`Demo estimate: $${hotelAvg}/night × ${dest.days} nights`):(isES?'Viaje de un día — $0':'Day trip — $0'),links:includeHotel?'Booking.com, Airbnb':'N/A'});
  if(includeCar) rows.push({icon:'🚗',cat:isES?'Carro':'Car Rental',pp:Math.round(carTotal/numT),total:carTotal,detail:isES?`Estimado demo: $${carAvg}/día × ${dest.days} días`:`Demo estimate: $${carAvg}/day × ${dest.days} days`,links:'Miles Car Rental, Hertz'});
  rows.push({icon:'⛽',cat:drivingTheRoute?(isES?'Gasolina':'Gas & Tolls'):(isES?'Transporte Local':'Local Transport'),pp:Math.round(gasTotal/numT)||0,total:gasTotal,detail:drivingTheRoute?(isES?`Estimado demo: ~${milesEst} mi ÷ ${PA.mpg}mpg × $${PA.gas}/gal`:`Demo estimate: ~${milesEst} mi ÷ ${PA.mpg}mpg × $${PA.gas}/gal`):(isES?'Uber/transporte local':'Uber/local transit'),links:''});
  rows.push({icon:'🍽️',cat:isES?'Comida':'Food & Dining',pp:foodPP*dest.days,total:foodTotal,detail:isES?`$${foodPP}/persona/día × ${dest.days} días × ${numT} personas`:`$${foodPP}/person/day × ${dest.days} days × ${numT} people`,links:''});
  rows.push({icon:'🎯',cat:isES?'Atracciones':'Attractions',pp:attrPP,total:attrTotal,detail:isES?'3 atracciones estimadas (demo)':'3 estimated attractions (demo)',links:'Viator, GetYourGuide'});
  rows.push({icon:'💼',cat:'Extras',pp:extrasPP,total:extrasTotal,detail:isES?'Seguro, propinas, varios (demo)':'Insurance, tips, misc (demo)',links:''});
  return {
    name:dest.name, days:dest.days, dates:dest.dateRange,
    allocated:dest.allocated||0, estimatedPP, estimated:total,
    viable: total <= (dest.allocated||Infinity),
    note: isES?'Estimado de demostración — no usa IA real, verifica precios reales antes de reservar':'Demo estimate — not generated by real AI, verify real prices before booking',
    flightDetail: includeFlights?(isES?'Demo: tarifa aérea promedio':'Demo: average airfare'):'N/A',
    rows
  };
}

function demoTipsForDest(name, opts) {
  const isES = opts.lang==='es';
  const border = opts.crossingBorder;
  return {
    dest:name,
    tips: isES?[
      'Reserva alojamiento con anticipación en temporada alta.',
      'Lleva efectivo para pequeños comercios y propinas.',
      'Descarga mapas offline antes de llegar.',
      'Verifica el clima local antes de empacar.',
      'Investiga el idioma local básico si aplica.',
      'Guarda copias digitales de tus documentos importantes.'
    ]:[
      'Book accommodation in advance during peak season.',
      'Carry some cash for small vendors and tips.',
      'Download offline maps before you arrive.',
      'Check local weather before packing.',
      'Learn a few basic local phrases if applicable.',
      'Keep digital copies of your important documents.'
    ],
    familyTips: opts.hasKidsFlag?(isES?['Lleva snacks y entretenimiento para los traslados.','Verifica políticas de edad en atracciones.']:['Bring snacks and entertainment for transit.','Check age policies at attractions.']):[],
    docs: [
      ...(isES?['Identificación / pasaporte vigente','Confirmación de hotel','Seguro de viaje (recomendado)']:['Valid ID / passport','Hotel confirmation','Travel insurance (recommended)']),
      ...(border?(isES?['Pasaporte físico requerido incluso cruzando por tierra']:['Physical passport required even crossing by land']):[])
    ],
    visaInfo: border?(isES?'Estimado demo — cruzarás una frontera terrestre, lleva pasaporte físico y verifica requisitos de entrada reales.':'Demo estimate — crossing a land border, bring a physical passport and verify real entry requirements.'):(isES?'Estimado demo — verifica los requisitos reales de entrada antes de viajar.':'Demo estimate — verify real entry requirements before traveling.'),
    currency: isES?'Verifica la moneda local antes de viajar':'Check local currency before traveling',
    timezone: isES?'Verifica la zona horaria del destino':'Check destination timezone',
    bestSeason: isES?'Varía según destino — consulta temporada ideal':'Varies by destination — check ideal season',
    weather: isES?'Consulta el pronóstico antes de empacar':'Check the forecast before packing',
    clothing: isES?'Ropa cómoda y adecuada al clima del destino':'Comfortable clothing suited to destination climate',
    gettingAround: isES?'Demo — usa Google Maps para transporte local y camina cuando sea posible':'Demo — use Google Maps for local transport and walk when possible',
    safety: isES?'Demo — mantente alerta en zonas turísticas concurridas, evita mostrar objetos de valor':'Demo — stay alert in busy tourist areas, avoid displaying valuables',
    moneyTips: isES?'Demo — lleva tarjeta y algo de efectivo; verifica si se acepta propina':'Demo — bring card and some cash; check if tipping is customary',
    connectivity: isES?'Demo — considera un eSIM internacional o WiFi del hotel':'Demo — consider an international eSIM or hotel WiFi',
    localApps: 'Google Maps, Google Translate, Uber/Lyft',
    emergency: isES?'911 (EE.UU./PR) o número de emergencia local':'911 (US/PR) or local emergency number',
    highlights: [],
  };
}

function demoItineraryForGroup(g, opts) {
  const isES = opts.lang==='es';
  const places = g.reqPlaces.length ? g.reqPlaces : [isES?'Punto de interés local':'Local point of interest'];
  let idx=0;
  const next = () => { const p=places[idx % places.length]; idx++; return p; };
  const mapQ = (name) => `https://maps.google.com/?q=${encodeURIComponent(name+', '+g.dest)}`;
  return g.days.map(d=>{
    let acts=[];
    if(d.dayType==='ARRIVAL'){
      const p1=next();
      acts=[
        {time:'2:00 PM',name:isES?'Llegada y check-in':'Arrival & check-in',detail:isES?'Acomódate y descansa del viaje':'Settle in and rest from travel',duration:isES?'30 min':'30 min',map:mapQ(g.dest),cost:'—',type:'transport'},
        {time:'5:00 PM',name:p1,detail:isES?'Actividad de bienvenida (demo)':'Welcome activity (demo)',duration:'~2 hrs',map:mapQ(p1),cost:'~$15',type:'attraction'},
        {time:'7:30 PM',name:isES?'Cena local':'Local dinner',detail:isES?'Prueba un plato típico de la zona':'Try a local specialty dish',duration:'~1.5 hrs',map:mapQ(isES?'restaurantes':'restaurants'),cost:'~$25',type:'meal'},
      ];
    } else if(d.dayType==='RETURN'){
      const p1=next();
      acts=[
        {time:'8:00 AM',name:isES?'Desayuno':'Breakfast',detail:isES?'Último desayuno antes de partir':'Last breakfast before departure',duration:'45 min',map:mapQ(isES?'desayuno':'breakfast'),cost:'~$12',type:'meal'},
        {time:'10:00 AM',name:p1,detail:isES?'Última visita (demo)':'Final visit (demo)',duration:'~1.5 hrs',map:mapQ(p1),cost:'~$15',type:'attraction'},
        {time:'1:00 PM',name:isES?'Salida':'Departure',detail:isES?'Regreso a casa':'Heading back home',duration:'—',map:mapQ(g.dest),cost:'—',type:'transport'},
      ];
    } else if(d.dayType==='TRANSIT'){
      const p1=next();
      acts=[
        {time:'8:00 AM',name:isES?'Desayuno':'Breakfast',detail:'',duration:'45 min',map:mapQ(isES?'desayuno':'breakfast'),cost:'~$12',type:'meal'},
        {time:'10:00 AM',name:p1,detail:isES?'Actividad matutina (demo)':'Morning activity (demo)',duration:'~1.5 hrs',map:mapQ(p1),cost:'~$15',type:'attraction'},
        {time:'1:00 PM',name:isES?`Viaje a ${g.nextDest||''}`:`Travel to ${g.nextDest||''}`,detail:'',duration:'varies',map:mapQ(g.nextDest||g.dest),cost:'—',type:'transport'},
      ];
    } else {
      const p1=next(), p2=next();
      acts=[
        {time:'8:00 AM',name:isES?'Desayuno':'Breakfast',detail:'',duration:'45 min',map:mapQ(isES?'desayuno':'breakfast'),cost:'~$12',type:'meal'},
        {time:'10:00 AM',name:p1,detail:isES?'Actividad matutina (demo)':'Morning activity (demo)',duration:'~2 hrs',map:mapQ(p1),cost:'~$20',type:'attraction'},
        {time:'1:00 PM',name:isES?'Almuerzo':'Lunch',detail:'',duration:'1 hr',map:mapQ(isES?'almuerzo':'lunch'),cost:'~$18',type:'meal'},
        {time:'3:00 PM',name:p2,detail:isES?'Actividad de tarde (demo)':'Afternoon activity (demo)',duration:'~2 hrs',map:mapQ(p2),cost:'~$20',type:'attraction'},
        {time:'6:00 PM',name:isES?'Paseo vespertino':'Evening stroll',detail:'',duration:'45 min',map:mapQ(g.dest),cost:'—',type:'attraction'},
        {time:'7:30 PM',name:isES?'Cena':'Dinner',detail:'',duration:'~1.5 hrs',map:mapQ(isES?'cena':'dinner'),cost:'~$28',type:'meal'},
      ];
    }
    return {num:d.num, date:d.date, dest:g.dest, dayType:d.dayType, acts};
  });
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Ready2Travel() {
  const [lang,setLang]=useState('en');
  const [page,setPage]=useState('form');
  const [tab,setTab]=useState(0);
  const [selDay,setSelDay]=useState(0);
  const [results,setResults]=useState(null);
  const [error,setError]=useState('');
  const [loadMsg,setLoadMsg]=useState('');
  const [savedForm,setSavedForm]=useState(null);
  const [pdfModal,setPdfModal]=useState(null);
  const [selectedTrip,setSelectedTrip]=useState(null);
  const [showInspiration,setShowInspiration]=useState(false);
  const [demoMode,setDemoMode]=useState(false);
  const [keyInput,setKeyInput]=useState(USER_KEY);
  const [keyOpen,setKeyOpen]=useState(false);
  const [keyMsg,setKeyMsg]=useState('');
  const [filterCat,setFilterCat]=useState('all');
  const formRef=useRef(null);

  const [dests,setDests]=useState([{name:'',places:''}]);
  const [startDate,setStartDate]=useState('');
  const [returnDate,setReturnDate]=useState('');
  const [airportQ,setAirportQ]=useState('');
  const [airport,setAirport]=useState('');
  const [showAP,setShowAP]=useState(false);
  const [travelers,setTravelers]=useState('2');
  const [nationality,setNationality]=useState('Puerto Rico');
  const [hasKids,setHasKids]=useState(null);
  const [children,setChildren]=useState([{age:''}]);
  const [isDomestic,setIsDomestic]=useState(false);
  const [needsCar,setNeedsCar]=useState(null);
  const [gettingThereMode,setGettingThereMode]=useState(null); // 'fly' | 'drive' | null — how to reach the start of a domestic trip
  const [stayType,setStayType]=useState(null);
  const [depCity,setDepCity]=useState('');
  const [tripType,setTripType]=useState('beach');
  const [budgetType,setBudgetType]=useState('normal');
  const [budget,setBudget]=useState('');

  const t=TR[lang];
  const filteredAP=AIRPORTS.filter(a=>!airportQ.trim()?true:a.name.toLowerCase().includes(airportQ.toLowerCase())||a.code.toLowerCase().includes(airportQ.toLowerCase())).slice(0,8);
  const cats=['all',...[...new Set(FAMOUS_TRIPS.map(t=>t.cat))]];
  const visibleTrips=filterCat==='all'?FAMOUS_TRIPS:FAMOUS_TRIPS.filter(tr=>tr.cat===filterCat);

  const pickFamousTrip = (trip) => {
    setSelectedTrip(trip);
    setDests(trip.dests.map(d=>({name:d.name,places:d.places})));
    setTripType(trip.type);
    setIsDomestic(trip.domestic);
    setStayType(trip.dests.length>1?'hotel':null); // multi-stop road trips always need hotels along the way
    setNeedsCar(null);
    if(trip.domestic){
      setGettingThereMode('drive'); // famous domestic road trips default to driving — user can switch to fly
      setDepCity(trip.depCity||''); setAirport(''); setAirportQ('');
    } else if(trip.airport){
      setGettingThereMode('fly'); // international trips default to flying — user can switch to cross-border drive
      setAirport(trip.airport); setAirportQ(trip.airport);
      setDepCity(trip.depCity||'');
    }
    setTimeout(()=>formRef.current?.scrollIntoView({behavior:'smooth',block:'start'}),100);
  };
  const clearTrip = () => { setSelectedTrip(null); setDests([{name:'',places:''}]); setGettingThereMode(null); setStayType(null); setNeedsCar(null); };

  const addDest=()=>setDests([...dests,{name:'',places:''}]);
  const removeDest=i=>setDests(dests.filter((_,idx)=>idx!==i));
  const updDest=(i,f,v)=>{const d=[...dests];d[i][f]=v;setDests(d);};

  const runGenerate = async (formData, outputLang) => {
    setError(''); setPage('loading');
    const {dests:fd,startDate:sd,returnDate:rd,airport:ap,travelers:tr,nationality:nat,
           hasKids:hk,children:ch,isDomestic:dom,needsCar:rentCar,stayType:stayT,
           gettingThereMode:gtm,depCity:depC,tripType:tt,budgetType:bt,budget:bg,selectedTrip:selTrip,demoMode}=formData;
    const valid=fd.filter(d=>d.name.trim());
    const isMultiStopTrip=valid.length>1;
    const numT=parseInt(tr)||2, tLang=outputLang==='Spanish'?'es':'en';
    const style=TR[tLang].tripTypes[tt], tier=TR[tLang].budgetTypes[bt];
    const sanAp=(ap||'').replace(/["`]/g,' ').trim();
    const originCode=getCode(ap||'')||'SJU';
    const sanNat=(nat||'United States').replace(/["`]/g,' ').trim();
    const sanDep=(depC||'').replace(/["`]/g,' ').trim();
    // ═══ UNIVERSAL TRANSPORT LOGIC — decoupled from country scope ═══
    // dom = same country as nationality (affects passport/visa/currency context only)
    // gtm = 'fly' | 'drive' — how the traveler physically gets to the trip (works the same regardless of country)
    // rentCar = whether they want a rental car AT the destination (only asked/relevant when flying)
    const includeFlights = gtm==='fly';
    const includeCar = gtm==='fly' && rentCar===true; // renting only makes sense if you flew in
    const drivingTheRoute = gtm==='drive' || (gtm==='fly' && rentCar===true); // true if movement between stops is by car
    const includeHotel = isMultiStopTrip || (stayT==='hotel');
    const originLabel = gtm==='drive' ? (sanDep||sanNat) : sanAp;
    const crossingBorder = !dom && gtm==='drive'; // different country, arriving by land — profile #3
    const borderCtx = crossingBorder ? `CROSS-BORDER BY CAR: traveler is driving across an international land border from ${sanDep||sanNat} into ${dom?'':'a different country'}. Always mention border crossing requirements (passport/ID required even by land, customs declarations, vehicle insurance validity in destination country, currency exchange) in tips.` : '';
    const kidsAges=hk===true?(ch||[]).map(c=>c.age).filter(a=>a&&!isNaN(a)&&Number(a)>=0&&Number(a)<=17).map(Number):[];
    const hasKidsFlag=kidsAges.length>0;
    const stayCtx=isMultiStopTrip?'Hotel overnight included.':(stayT==='home'?'DAY TRIP — returns home each night, $0 hotel.':'Hotel overnight included.');
    const kidsCtx=hasKidsFlag?`WITH CHILDREN ages ${kidsAges.join(', ')} — family-friendly only, no adult venues.`:'Adults only.';
    const famCtx=selTrip?`FAMOUS TRIP: "${selTrip.name}" — ${selTrip.tag}. Must-include highlights: ${(selTrip.highlights||[]).join(', ')}. Route notes: ${selTrip.stat}.`:'';
    const yr=new Date().getFullYear();
    const h=PA.hotel[bt], f=PA.food[bt], c=PA.car[bt];
    const fl=dom?PA.flight_dom[bt]:PA.flight_int[bt];
    const priceCtx=`REAL ${yr} PRICE ANCHORS:
- Gas: $${PA.gas}/gal, avg ${PA.mpg} MPG (fuel cost = miles÷${PA.mpg}×$${PA.gas})
- ${tier} Hotel: $${h[0]}–$${h[1]}/night
- ${tier} Food: $${f[0]}–$${f[1]}/person/day
- Car rental: $${c[0]}–$${c[1]}/day
${includeFlights?`- Flights to destination: $${fl[0]}–$${fl[1]}/person round-trip`:''}
- Attractions: $${PA.attraction[bt][0]}–$${PA.attraction[bt][1]}/person average`;

    const start=new Date(sd+'T12:00:00'), ret=new Date(rd+'T12:00:00');
    const totalDays=Math.max(1,Math.round((ret-start)/(86400000)));
    const daysPerDest=Math.max(1,Math.floor(totalDays/valid.length));
    const rem=totalDays-daysPerDest*valid.length;
    let cur=new Date(sd+'T12:00:00');
    const destInfo=valid.map((d,i)=>{
      const days=daysPerDest+(i===valid.length-1?rem:0);
      const from=cur.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
      cur.setDate(cur.getDate()+days);
      const to=cur.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
      return {name:(d.name||'').replace(/["`]/g,' ').trim(),places:(d.places||'').replace(/["`]/g,' ').trim(),days,dateRange:`${from} to ${to}`};
    });
    const perDestBudget=Math.round(Number(bg)/destInfo.length);

    // Day-by-day grouping (pure computation, needed by both demo and real generation)
    let gDay=0; let dDate=new Date(sd+'T12:00:00');
    const groups=[];
    for(let di=0;di<destInfo.length;di++){
      const dest=destInfo[di];
      const days=[];
      for(let d=0;d<dest.days;d++){
        gDay++;
        const isVeryFirstDay=di===0&&d===0, isLast=d===dest.days-1, isLastDest=di===destInfo.length-1;
        const dateStr=dDate.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
        let dayType='FULL';
        if(isVeryFirstDay)dayType='ARRIVAL';
        else if(isLast&&isLastDest)dayType='RETURN';
        else if(isLast&&!isLastDest)dayType='TRANSIT';
        days.push({num:gDay,date:dateStr,dayType});
        dDate.setDate(dDate.getDate()+1);
      }
      groups.push({
        dest:dest.name, nextDest:di<destInfo.length-1?destInfo[di+1].name:null,
        isLastDest:di===destInfo.length-1,
        reqPlaces:dest.places?dest.places.split(',').map(p=>p.trim()).filter(Boolean):[],
        days
      });
    }

    try {
      let budgetArr=[], tipsArr=[], itinArr=[];

      if(demoMode){
        // ── DEMO MODE — local calculation, no API calls, works offline / in chat preview ──
        for(let di=0; di<destInfo.length; di++){
          const dest=destInfo[di];
          setLoadMsg(`💰 ${TR[tLang].loading[5]} — ${dest.name} (Demo)`);
          await new Promise(r=>setTimeout(r,350));
          budgetArr.push({budget:[demoBudgetForDest({...dest,allocated:perDestBudget},{bt,drivingTheRoute,includeHotel,includeCar,includeFlights:includeFlights&&di===0,numT,lang:tLang})]});
        }
        for(const destName of [...new Set(destInfo.map(d=>d.name))]){
          setLoadMsg(`💡 ${TR[tLang].loading[4]} — ${destName} (Demo)`);
          await new Promise(r=>setTimeout(r,300));
          tipsArr.push({tips:[demoTipsForDest(destName,{lang:tLang,hasKidsFlag,crossingBorder})]});
        }
        for(const g of groups){
          setLoadMsg(`🗺️ ${TR[tLang].loading[3]} — ${g.dest} (Demo)`);
          await new Promise(r=>setTimeout(r,350));
          itinArr.push(demoItineraryForGroup(g,{lang:tLang}));
        }
      } else {
      // ── BUDGET (with Google Search grounding for real prices) ──
      const budgetTasks=destInfo.map((dest,di)=>async()=>{
        const isFirstDest=di===0;
        const legOrigin=di===0?originLabel:destInfo[di-1].name; // each leg starts from the PREVIOUS stop, not always from home
        try{
          const gasLine=drivingTheRoute?`Driving distance ${legOrigin}→${dest.name} (this leg only): estimate miles, calculate gas: (miles÷${PA.mpg})×$${PA.gas}/gal = $X total fuel for group, ÷${numT} per person.`:'';
          const openJaw = isMultiStopTrip && includeFlights;
          const flightNote=isFirstDest?(includeFlights?(openJaw?`ONE-TIME FLIGHT: traveler flies from ${originCode} into ${legOrigin} at the START of the trip only — this flight cost belongs ONLY to this first destination's budget. Trip is open-jaw (returns from a different city).`:`Flight cost belongs ONLY to this first destination — traveler does not re-fly between every city.`):''):(includeFlights?`NO FLIGHT COST HERE — the one-time flight was already counted in destination #1's budget. Do NOT add a flight row here.`:'');
          const prompt=`You are a professional travel budget planner. Use REAL current ${yr} prices. Search for actual current hotel rates, attraction admission fees, and flight costs for ${dest.name}.

ALL TEXT IN ${outputLang}. OUTPUT ONLY RAW JSON.

${priceCtx}
${famCtx}
${gasLine}
${flightNote}
${borderCtx}
${stayCtx}
${kidsCtx}

TRIP LEG: ${legOrigin} → ${dest.name} | ${dest.days} days (${dest.dateRange}) | ${numT} travelers | ${style} | ${tier} | Budget: $${perDestBudget}

MANDATORY CALCULATION RULES:
1. Total = sum of all row totals. estimatedPP = total ÷ ${numT}. Show your math in detail fields.
2. Hotel: ${includeHotel?`${dest.days} nights × real current rate ($${h[0]}–$${h[1]}/night) × 1 room`:'$0 — day trip, returns home'}
3. Food: ${dest.days} days × $X/day × ${numT} people (use real local costs)
4. Attractions: list 3–5 real attractions with actual admission prices (search real prices)
5. ${drivingTheRoute?`Gas: calculate driving miles ONLY for this leg (${legOrigin} to ${dest.name}), use $${PA.gas}/gal`:(includeFlights?'Flights: use current airline prices, include real airline names':'Local transport: estimate realistic public transit/rideshare costs')}
6. STAY WITHIN BUDGET: the total MUST be ≤ $${perDestBudget}. If your first estimate is higher, pick cheaper real options (lower-priced hotel area, free/cheaper attractions, cheaper meals) until it fits. Only exceed it if impossible even at the minimum, and then say exactly what is short. Never invent prices — use searched current prices.
7. note = one-sentence honest assessment including what's tight if over budget

Return EXACTLY this JSON structure:
{"budget":[{
  "name":"${dest.name}","days":${dest.days},"dates":"${dest.dateRange}",
  "allocated":${perDestBudget},"estimatedPP":0,"estimated":0,"viable":true,
  "note":"honest budget assessment",
  "flightDetail":"${isFirstDest&&includeFlights?(openJaw?'One-time flight into '+legOrigin+' — open-jaw, returns from final destination. Real airline, ~$X/person.':'Round-trip flight. Real airline, ~$X/person.'):'N/A — already counted or not applicable'}",
  "rows":[
    ${isFirstDest&&includeFlights?`{"icon":"✈️","cat":"${outputLang==='Spanish'?'Vuelos':'Flights'}","pp":0,"total":0,"detail":"[Real airline] One-time flight ${openJaw?'into '+legOrigin+' (open-jaw, returns from final destination city)':'round-trip'} from ${originCode}. ~$X/person. Total for ${numT}: $X","links":"Google Flights, Kayak"},`:''}
    {"icon":"🏨","cat":"${includeHotel?(outputLang==='Spanish'?'Hotel':'Hotel'):(outputLang==='Spanish'?'Alojamiento':'Accommodation')}","pp":${includeHotel?0:0},"total":${includeHotel?0:0},"detail":"${includeHotel?`[Hotel name area] ~$${h[0]}-${h[1]}/night × ${dest.days} nights = ~$X`:'Day trip — $0 hotel cost'}","links":"${includeHotel?'Booking.com, Airbnb':'N/A'}"},
    ${includeCar?`{"icon":"🚗","cat":"${outputLang==='Spanish'?'Carro':'Car Rental'}","pp":0,"total":0,"detail":"~$${c[0]}-${c[1]}/day × ${dest.days} days (this leg) = ~$X total","links":"Miles Car Rental, Hertz, Enterprise"},`:''}
    {"icon":"⛽","cat":"${drivingTheRoute?(outputLang==='Spanish'?'Gasolina':'Gas & Tolls'):(outputLang==='Spanish'?'Transporte Local':'Local Transport')}","pp":0,"total":0,"detail":"${drivingTheRoute?`~X miles driving (${legOrigin}→${dest.name}) ÷ ${PA.mpg}mpg × $${PA.gas}/gal = ~$X fuel. Tolls: ~$X`:'Uber/Lyft/Metro/train ~$X/day × '+dest.days+' days'}","links":""},
    {"icon":"🍽️","cat":"${outputLang==='Spanish'?'Comida':'Food & Dining'}","pp":0,"total":0,"detail":"$X/person/day × ${dest.days} days × ${numT} people = $X. Breakdown: breakfast $X, lunch $X, dinner $X","links":""},
    {"icon":"🎯","cat":"${outputLang==='Spanish'?'Atracciones':'Attractions'}","pp":0,"total":0,"detail":"List real attractions: [Name]: $X/adult${hasKidsFlag?', $X/child':''}. [Name2]: $X. [Name3]: Free. Total: ~$X/person","links":"Viator, GetYourGuide"},
    {"icon":"💼","cat":"${outputLang==='Spanish'?'Extras':'Extras'}","pp":0,"total":0,"detail":"Travel insurance ~$X, tips/gratuity ~$X, souvenirs ~$X, misc ~$X","links":""}
  ]
}]}`;
          const r=await callAI(prompt,7000,true); budgetArr[di]=fixBudget(r,numT,perDestBudget);
        }catch(e){if(e.code==='NO_KEY'||e.code==='BAD_KEY')throw e;console.warn('Budget error:',e.message);budgetArr[di]={budget:[]};}
      });

      // ── TIPS ──
      const tipTasks=[...new Set(destInfo.map(d=>d.name))].map((dest,ti)=>async()=>{
        try{
          const prompt=`You are a meticulous travel expert for ${dest} who answers EVERY question a first-time visitor would have. Use real, current, specific information — never generic placeholders. ALL IN ${outputLang}. OUTPUT ONLY RAW JSON.
Nationality: ${sanNat} | Travel: ${sd} to ${rd} | Style: ${style} | ${stayCtx} | ${kidsCtx} | Transport: ${drivingTheRoute?'driving/road trip':(includeFlights?'flying, using local transit':'')}
${famCtx}
${borderCtx}

{"tips":[{
  "dest":"${dest}",
  "tips":["specific practical tip with concrete details (names, prices, or numbers when relevant)","tip 2","tip 3","tip 4","tip 5","tip 6"],
  "familyTips":${hasKidsFlag?'["family-specific tip 1 for ages '+kidsAges.join(',')+'","tip 2","tip 3"]':'[]'},
  "docs":["specific document 1 with details (e.g. passport validity rule, specific form name)","doc 2","doc 3"],
  "visaInfo":"specific entry requirements for ${sanNat} citizens entering ${dest}'s country — visa-free / visa-on-arrival / e-visa / advance application, processing time, cost if any${crossingBorder?'. Since traveler is crossing by land, specifically confirm whether a land border crossing has different requirements than arriving by air.':''}",
  "currency":"currency name, symbol, approximate exchange rate to USD, and whether USD is also widely accepted",
  "timezone":"timezone name, UTC offset, and difference from ${sanNat} time",
  "bestSeason":"best time of year to visit and why (weather, crowds, prices)",
  "weather":"expected weather during ${sd}–${rd} with realistic temperature range in °F and °C, and rain/humidity expectations",
  "clothing":"specific packing list items for this trip style, season, and any cultural dress norms (e.g. modest dress for religious sites)",
  "gettingAround":"how to get around once there: best apps (name them), public transit options and approximate cost, walkability, whether ride-share/taxis are common and roughly how much they cost",
  "safety":"general safety level, any neighborhoods or situations to be cautious about, common tourist scams to watch for and how to avoid them",
  "moneyTips":"ATM availability and fees, which cards are widely accepted vs cash-only situations, typical tipping percentage and when it's expected vs not customary",
  "connectivity":"best option for mobile data (eSIM, local SIM, or international plan), typical cost, and WiFi availability in hotels/cafes",
  "localApps":"specific named apps useful here: maps, transport, translation, food delivery, ride-share",
  "emergency":"police, ambulance, fire emergency numbers, plus the nearest embassy/consulate info if relevant for ${sanNat} citizens",
  "highlights":["top highlight 1 with a specific reason it's unmissable (not generic)","highlight 2","highlight 3"]
}]}`;
          const r=await callAI(prompt,5500); tipsArr[ti]=r;
        }catch(e){if(e.code==='NO_KEY'||e.code==='BAD_KEY')throw e;tipsArr[ti]={tips:[]};}
      });

      // ── ITINERARY ──
      const itinTasks=groups.map((g,gi)=>async()=>{
        const dQ=encodeURIComponent(g.dest);
        const numFull=g.days.filter(d=>d.dayType==='FULL').length;
        const famHighlights=selTrip?(selTrip.highlights||[]).filter(h=>h.toLowerCase().includes(g.dest.split(',')[0].toLowerCase())):[];

        // Phase 1: unique place list
        try{
          const p1=`List ${numFull*6+10} unique real places in ${g.dest} for ${style} trip. ALL IN ${outputLang}. ONLY JSON.
${hasKidsFlag?`FAMILY-FRIENDLY — ages ${kidsAges.join(', ')}`:'Adults'}
${g.reqPlaces.length?'MUST INCLUDE: '+g.reqPlaces.join(', '):''}
${famHighlights.length?'FAMOUS TRIP HIGHLIGHTS: '+famHighlights.join(', '):''}
Include: landmarks, restaurants (with cuisine type & price range), cafes, parks, museums, local experiences.
{"places":[{"name":"Real Place Name","type":"landmark|restaurant|cafe|park|museum|experience|beach","cost":"$X admission or Free","duration":"full-day|4hrs|2hrs|1hr|30min","bestTime":"morning|afternoon|evening","rating":"4.5/5"}]}
All places must be REAL and exist. NO duplicates. ONLY JSON.`;
          const r1=await callAI(p1,4000);
          const places=(r1?.places||[]).filter(p=>p.name);

          // Phase 2: build schedule
          const placeList=places.length>0?`USE THESE ${places.length} REAL PLACES (each exactly once):\n`+places.map((p,i)=>`${i+1}. ${p.name} [${p.type}] ${p.cost||'varies'} ~${p.duration||'2hrs'} best:${p.bestTime||'anytime'} ★${p.rating||'4/5'}`).join('\n'):`Choose ${numFull*6+10} unique real places in ${g.dest}`;
          const dayLines=g.days.map(d=>{
            const transitByCar = drivingTheRoute; // between-stops movement: car if driving the whole way OR flew+rented a car
            if(d.dayType==='ARRIVAL'){
              if(gtm==='fly') return `Day ${d.num} (${d.date}): ARRIVAL — fly from ${sanAp} into ${originLabel}. Include: airport arrival${includeCar?', rental car pickup':''}, hotel check-in, 1 nearby welcome activity, dinner.`;
              return `Day ${d.num} (${d.date}): ARRIVAL — drive from ${originLabel}${crossingBorder?' (crossing an international border — mention border checkpoint, passport check, brief wait)':''}. Include: drive start, rest stop, hotel/accommodation check-in, 1 welcome activity nearby, dinner with local specialty.`;
            }
            if(d.dayType==='RETURN'){
              if(gtm==='fly') return `Day ${d.num} (${d.date}): RETURN — Include: hotel breakfast, 1 final activity, hotel checkout${includeCar?', drop off rental car':''}, fly back to ${sanAp} from ${g.dest}${isMultiStopTrip?' (open-jaw return — different city than arrival)':''}.`;
              return `Day ${d.num} (${d.date}): RETURN — Include: hotel breakfast, 1 final activity (not far from departure), ${includeHotel?'hotel checkout, ':''}drive back to ${originLabel}${crossingBorder?' (crossing the border again — mention checkpoint)':''}.`;
            }
            if(d.dayType==='TRANSIT') return `Day ${d.num} (${d.date}): TRANSIT — Breakfast, 1 morning activity in ${g.dest}, ${transitByCar?'drive':'fly'} to ${g.nextDest}, arrive and settle.`;
            return `Day ${d.num} (${d.date}): FULL DAY — 6 activities spread across the day: morning (breakfast spot, activity), midday (lunch + 1-2 spots), afternoon (activity), evening (dinner + optional evening activity). Include realistic travel time between spots and note transit time (walk/drive/transit minutes) whenever consecutive activities are more than a short walk apart.`;
          }).join('\n');

          const p2=`Expert travel planner who has actually visited ${g.dest}. Create a hyper-realistic, time-accurate itinerary that answers every practical question a visitor would have. ALL IN ${outputLang}. ONLY JSON.
DESTINATION: ${g.dest} | Style: ${style} | Budget tier: ${tier} | ${numT} travelers | ${kidsCtx}
${famCtx}
${g.reqPlaces.length?'MUST VISIT: '+g.reqPlaces.join(', '):''}
${borderCtx}

${placeList}

SCHEDULE:
${dayLines}

STRICT RULES — TIME ACCURACY IS CRITICAL:
- Theme parks / major attractions = FULL DAY (8hrs+). ONE max per day.
- Account for REAL opening hours — don't schedule a museum visit at 8pm if it closes at 6pm.
- Include REAL travel time between consecutive stops in the detail (e.g. "15 min walk" or "20 min drive/taxi ~$8"). If stops are 30+ min apart, this is mandatory, not optional.
- Meals at REAL named restaurants with cuisine type, 1-2 signature dishes to order, and price range.
- Every place UNIQUE across ALL days — zero repeats.
- Times must be realistic — never schedule more activities than the available hours allow.
- Every activity's "detail" field must include: what to do/see there, one specific insider tip (best time to avoid lines, what to order, where to stand for photos, etc.), and the realistic time needed.
- Use the "duration" field to state how long to actually spend there (e.g. "1.5 hrs", "45 min", "full day").

{"days":[{"num":1,"date":"full date","dest":"${g.dest}","dayType":"ARRIVAL|FULL|TRANSIT|RETURN","acts":[{
  "time":"9:00 AM",
  "name":"Real Place Name",
  "detail":"What to do/see, specific insider tip, how to get to the NEXT stop and how long that takes",
  "duration":"realistic time to spend here, e.g. 1.5 hrs",
  "map":"https://maps.google.com/?q=Place+Name,${dQ}",
  "cost":"~$X per person or Free",
  "type":"meal|attraction|transport|accommodation"
}]}]}
All ${g.days.length} days. ONLY JSON.`;
          const r2=await callAI(p2,Math.min(10000,1800*g.days.length+2500));
          itinArr[gi]=r2?.days||[];
        }catch(e){if(e.code==='NO_KEY'||e.code==='BAD_KEY')throw e;console.warn('Itinerary error:',e.message);itinArr[gi]=[];}
      });

      // Run everything in parallel (4 at a time) instead of one-by-one with fixed pauses
      const allTasks=[...budgetTasks,...tipTasks,...itinTasks];
      let doneN=0;
      const progress=()=>setLoadMsg(tLang==='es'?`🧠 Preparando tu viaje… ${doneN} de ${allTasks.length} partes listas`:`🧠 Building your trip… ${doneN} of ${allTasks.length} parts ready`);
      progress();
      await runPool(allTasks.map(t=>async()=>{await t();doneN++;progress();}),2);
      // Retry anything that came back empty (rate limits): up to 3 extra passes, spaced out
      for(let pass=0; pass<3; pass++){
        const redo=[];
        budgetTasks.forEach((t,i)=>{ if(!(budgetArr[i]?.budget?.length)) redo.push(t); });
        tipTasks.forEach((t,i)=>{ if(!(tipsArr[i]?.tips?.length)) redo.push(t); });
        itinTasks.forEach((t,i)=>{ if(!(itinArr[i]?.length)) redo.push(t); });
        if(!redo.length) break;
        setLoadMsg(tLang==='es'?`⏳ Reintentando ${redo.length} parte(s) (límite de la IA)…`:`⏳ Retrying ${redo.length} part(s) (AI rate limit)…`);
        await sleep(25000);
        await runPool(redo,2);
      }
      } // end else (real AI generation)

      const seen=new Set();
      const allDays=itinArr.flatMap(d=>d||[]).sort((a,b)=>(a.num||0)-(b.num||0));
      allDays.forEach(day=>(day.acts||[]).forEach(act=>{
        const k=(act.name||'').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,30);
        if(['checkin','checkout','departure','return','drive','flight'].some(w=>k.includes(w)))return;
        if(seen.has(k)&&k.length>5)act.name+=' ⚠'; else seen.add(k);
      }));

      const finalBudget=budgetArr.flatMap(r=>r?.budget||[]);
      const finalTips=tipsArr.flatMap(r=>r?.tips||[]);

      // If every single API call failed, don't show a confusing blank results page —
      // tell the user clearly so they can check their API key / connection.
      if(finalBudget.length===0 && allDays.length===0 && finalTips.length===0){
        throw new Error(tLang==='es'
          ? 'No se pudo generar ningún dato. Verifica tu API key de Gemini y tu conexión a internet, luego intenta de nuevo.'
          : 'Could not generate any data. Check your Gemini API key and internet connection, then try again.');
      }

      setResults({
        budget:finalBudget,
        itinerary:allDays,
        tips:finalTips,
        meta:{originCode,sd,rd,numT,destInfo,selectedTrip:selTrip}
      });
      setPage('results'); setTab(0); setSelDay(0);
    }catch(err){
      console.error(err);
      const es=outputLang==='Spanish';
      if(err.code==='NO_KEY'||err.code==='BAD_KEY'){
        if(SHOW_KEY_UI) setKeyOpen(true);
        setError(err.code==='NO_KEY'
          ?(es?`El servicio de IA aún no está activado en este sitio (${PROXY_INFO||'sin servidor'}). Si eres el dueño: revisa la variable GEMINI_API_KEY en Netlify y vuelve a desplegar.`:`The AI service is not activated on this site yet (${PROXY_INFO||'no server'}). Owner: check the GEMINI_API_KEY variable in Netlify and redeploy.`)
          :(es?'La clave de Gemini guardada en el servidor no es válida. Si eres el dueño: crea una nueva (AIza...) en aistudio.google.com/app/apikey y actualiza GEMINI_API_KEY.':'The Gemini key stored on the server is not valid. Owner: create a new one (AIza...) and update GEMINI_API_KEY.'));
      } else if(/429|503/.test(err.message)){
        setError(es?'La IA está saturada (límite gratuito). Espera 1 minuto e intenta de nuevo.':'The AI is busy (free-tier limit). Wait a minute and try again.');
      } else {
        setError(`${TR[es?'es':'en'].errorGen} ${err.message}`);
      }
      setPage('form');
    }
  };

  const generateTrip = async () => {
    const valid=dests.filter(d=>d.name.trim());
    const isMultiStop = valid.length>1;
    if(!valid.length||!startDate||!returnDate||!budget){setError(t.fillAll);return;}
    if(!gettingThereMode){setError(t.fillAll);return;}
    if(gettingThereMode==='fly'&&!airport){setError(t.fillAll);return;}
    if(gettingThereMode==='fly'&&needsCar===null){setError(t.fillAll);return;}
    if((gettingThereMode==='drive'||isDomestic)&&!depCity.trim()){setError(t.fillAll);return;}
    if(!isMultiStop&&stayType===null){setError(t.fillAll);return;}
    const fd={dests,startDate,returnDate,airport,travelers,nationality,hasKids,children,isDomestic,needsCar,stayType,gettingThereMode,depCity,tripType,budgetType,budget,selectedTrip,demoMode};
    setSavedForm(fd);
    await runGenerate(fd,lang==='es'?'Spanish':'English');
  };

  const gPP=results?(results.budget||[]).reduce((s,d)=>s+(d.estimatedPP||0),0):0;
  const gGrp=results?(results.budget||[]).reduce((s,d)=>s+(d.estimated||0),0):0;
  const numT=parseInt(travelers)||2;
  const meta=results?.meta||{};

  const buildPDF=(type)=>{
    const hdr=`<div style="display:flex;align-items:center;gap:12px;border-bottom:3px solid #E5B800;padding-bottom:14px;margin-bottom:18px"><svg width="44" height="28" viewBox="0 0 200 130" fill="none"><polygon points="100,4 91,52 100,48 109,52" fill="#E5B800"/><circle cx="100" cy="54" r="9" fill="#E5B800"/><line x1="100" y1="54" x2="6" y2="54" stroke="#E5B800" stroke-width="5"/><line x1="100" y1="54" x2="194" y2="54" stroke="#E5B800" stroke-width="5"/></svg><div><div style="font-size:20px;font-weight:900;color:#1A1A1A;letter-spacing:3px">READY2TRAVEL</div><div style="font-size:10px;color:#6B7280">${t.tagline}</div></div></div><div style="background:#F7F7F9;padding:10px;border-radius:6px;margin-bottom:16px;font-size:11px">${airport} · ${startDate}→${returnDate} · ${travelers} travelers · $${budget}</div>`;
    let body='';
    if(type==='budget')body=(results.budget||[]).map(d=>`<h2 style="color:#1E2A3A">📍 ${d.name} — ${d.days} days</h2><p style="font-size:11px;color:#6B7280">${d.dates}</p><div style="background:${d.viable?'#dcfce7':'#fee2e2'};padding:8px;border-radius:6px;margin:8px 0;font-size:11px;font-weight:700;color:${d.viable?'#16A34A':'#DC2626'}">${d.viable?t.viable:t.notViable} — ${d.note}</div><table style="width:100%;border-collapse:collapse;font-size:10px"><tr style="background:#1E2A3A;color:white"><th style="padding:6px;text-align:left">${t.item}</th><th style="padding:6px;text-align:right">${t.cpp}</th><th style="padding:6px;text-align:right">${t.totalCost}</th><th style="padding:6px">${t.comments}</th></tr>${(d.rows||[]).map((r,i)=>`<tr style="background:${i%2?'white':'#f9f9f9'}"><td style="padding:6px">${r.icon} ${r.cat}</td><td style="padding:6px;text-align:right;color:#C9980A">$${fmt(r.pp)}</td><td style="padding:6px;text-align:right;font-weight:700">$${fmt(r.total)}</td><td style="padding:6px;font-size:9px">${r.detail}</td></tr>`).join('')}<tr style="background:#E5B800"><td style="padding:8px;font-weight:900" colspan="2">TOTAL</td><td style="padding:8px;text-align:right;font-weight:900">$${fmt(d.estimated)}</td><td style="padding:8px;font-size:9px">Allocated: $${fmt(d.allocated)}</td></tr></table>`).join('<br/>');
    else body=(results.itinerary||[]).map(day=>`<div style="margin-bottom:12px"><div style="background:#1E2A3A;color:#E5B800;padding:8px;font-weight:700;font-size:11px">${t.dayLabel} ${day.num} — ${day.date} · ${day.dest}</div><table style="width:100%;border-collapse:collapse;font-size:9px">${(day.acts||[]).map((a,i)=>`<tr style="background:${i%2?'white':'#f9f9f9'}"><td style="padding:5px;font-weight:700;color:#C9980A;width:60px">${a.time}</td><td style="padding:5px;font-weight:600;width:130px">${a.name}</td><td style="padding:5px">${a.detail}</td><td style="padding:5px;color:#16A34A;width:60px">${a.cost||'—'}</td></tr>`).join('')}</table></div>`).join('');
    return `${hdr}${body}<div style="margin-top:24px;border-top:1px solid #D4C49A;padding-top:10px;text-align:center;font-size:9px;color:#6B7280">READY2TRAVEL © ${new Date().getFullYear()} — ${t.tagline}</div>`;
  };

  return (
    <div style={{minHeight:'100vh',background:C.offWhite,fontFamily:'"Segoe UI",system-ui,sans-serif'}}>
      <style>{`
        *{box-sizing:border-box}
        input:focus,select:focus,textarea:focus{border-color:${C.gold}!important;box-shadow:0 0 0 3px ${C.gold}33!important;outline:none}
        ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-thumb{background:${C.beige};border-radius:3px}
        .rh:hover{background:#fffdf0!important}.bk:hover{opacity:.85;transform:translateY(-1px)}
        .tc:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.15)!important}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
      `}</style>

      {/* ── HEADER ── */}
      <header style={{background:C.charcoal,padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 20px rgba(0,0,0,0.4)'}}>
        <div style={{display:'flex',alignItems:'center',gap:14,cursor:'pointer'}} onClick={()=>{setPage('form');setResults(null);}}>
          <Logo size={48}/>
          <div>
            <div style={{fontWeight:900,fontSize:20,color:C.white,letterSpacing:3}}>READY2TRAVEL</div>
            <div style={{fontSize:10,color:C.beige,letterSpacing:0.5,marginTop:2}}>{t.tagline}</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{color:C.beige,fontSize:12}}>{t.langLabel}:</span>
          <button onClick={async()=>{const nl=lang==='en'?'es':'en';setLang(nl);if(page==='results'&&savedForm)await runGenerate({...savedForm},nl==='es'?'Spanish':'English');}} style={btnG}>{t.langBtn}</button>
        </div>
      </header>

      {/* ── FORM PAGE ── */}
      {page==='form'&&(
        <div style={{animation:'fu 0.4s ease'}}>

          {/* Famous Trips Toggle Button */}
          <div style={{maxWidth:760,margin:'0 auto',padding:'24px 20px 0'}}>
            <button onClick={()=>setShowInspiration(v=>!v)} style={{width:'100%',background:showInspiration?C.charcoal:`linear-gradient(135deg, ${C.charcoal}, #2a3a52)`,color:C.gold,border:`1.5px solid ${C.gold}55`,borderRadius:14,padding:'16px 20px',cursor:'pointer',fontFamily:'inherit',fontWeight:800,fontSize:14,display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:'0 4px 16px rgba(0,0,0,0.12)'}}>
              <span style={{display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:20}}>✨</span>
                {t.inspiration}
                {selectedTrip&&<span style={{background:C.gold,color:C.black,fontSize:10,fontWeight:900,borderRadius:8,padding:'3px 9px'}}>{selectedTrip.emoji} {selectedTrip.name}</span>}
              </span>
              <span style={{fontSize:14,transition:'transform 0.2s',transform:showInspiration?'rotate(180deg)':'none'}}>▼</span>
            </button>
          </div>

          {/* Famous Trips Section — collapsible */}
          {showInspiration&&(
          <div style={{background:C.charcoal,paddingBottom:32,marginTop:14,animation:'fu 0.3s ease'}}>
            <div style={{maxWidth:1100,margin:'0 auto',padding:'28px 20px 0'}}>
              <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',flexWrap:'wrap',gap:8,marginBottom:6}}>
                <h2 style={{margin:0,color:C.gold,fontSize:22,fontWeight:900}}>{t.inspiration}</h2>
                <span style={{color:C.beige,fontSize:12}}>{t.inspirationSub}</span>
              </div>

              {/* Category Filter */}
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:16,marginTop:14}}>
                {cats.map(cat=>(
                  <button key={cat} onClick={()=>setFilterCat(cat)} style={{padding:'6px 14px',border:`1.5px solid ${filterCat===cat?C.gold:C.beige+'44'}`,borderRadius:20,cursor:'pointer',fontFamily:'inherit',fontWeight:700,fontSize:11,background:filterCat===cat?C.gold:'transparent',color:filterCat===cat?C.black:C.beige,transition:'all 0.2s'}}>
                    {cat==='all'?(lang==='en'?'🌍 All':' 🌍 Todos'):(t.catLabels?.[cat]||cat)}
                  </button>
                ))}
              </div>

              {/* Trip Cards Grid */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:12}}>
                {visibleTrips.map(trip=>(
                  <div key={trip.id} onClick={()=>{pickFamousTrip(trip);setShowInspiration(false);}} className="tc" style={{background:selectedTrip?.id===trip.id?`${C.gold}22`:'rgba(255,255,255,0.06)',border:`2px solid ${selectedTrip?.id===trip.id?C.gold:'rgba(255,255,255,0.1)'}`,borderRadius:14,padding:16,cursor:'pointer',transition:'all 0.25s',animation:'fu 0.4s ease'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                      <span style={{fontSize:28}}>{trip.emoji}</span>
                      {selectedTrip?.id===trip.id&&<span style={{background:C.gold,color:C.black,fontSize:10,fontWeight:900,borderRadius:10,padding:'2px 8px'}}>✓ SELECTED</span>}
                    </div>
                    <div style={{fontWeight:800,fontSize:14,color:C.white,marginBottom:3}}>{trip.name}</div>
                    <div style={{fontSize:11,color:C.gold,fontWeight:600,marginBottom:6}}>{trip.tag}</div>
                    <div style={{fontSize:11,color:C.beige,lineHeight:1.5,marginBottom:10}}>{trip.desc}</div>
                    <div style={{fontSize:10,color:'rgba(255,255,255,0.5)',borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:8,lineHeight:1.6}}>{trip.stat}</div>
                    <div style={{marginTop:10,display:'flex',flexWrap:'wrap',gap:4}}>
                      {(trip.highlights||[]).slice(0,2).map((h,i)=>(
                        <span key={i} style={{background:'rgba(229,184,0,0.15)',color:C.gold,fontSize:9,borderRadius:6,padding:'2px 7px',border:'1px solid rgba(229,184,0,0.3)'}}>{h}</span>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Form */}
          <div ref={formRef} style={{maxWidth:760,margin:'0 auto',padding:'32px 20px'}}>
            <div style={{...card,padding:36}}>

              {selectedTrip&&(
                <div style={{background:`${C.gold}15`,border:`2px solid ${C.gold}`,borderRadius:14,padding:16,marginBottom:24,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <span style={{fontSize:28}}>{selectedTrip.emoji}</span>
                    <div>
                      <div style={{fontWeight:900,fontSize:15,color:C.charcoal}}>{selectedTrip.name}</div>
                      <div style={{fontSize:12,color:C.darkGray}}>{selectedTrip.stat}</div>
                    </div>
                  </div>
                  <button onClick={clearTrip} style={{...btnD,fontSize:11,padding:'7px 14px'}}>{t.clearTrip}</button>
                </div>
              )}

              <h2 style={{margin:'0 0 24px',color:C.charcoal,fontSize:20,fontWeight:800}}>
                {selectedTrip?`${t.customTitle} ${selectedTrip.name}`:t.formTitle}
              </h2>
              {error&&<div style={{background:'#fee2e2',color:C.red,padding:'12px 16px',borderRadius:8,marginBottom:20,fontWeight:600,fontSize:13}}>⚠ {error}</div>}

              {/* Trip Scope — country, not transport */}
              <div style={{marginBottom:20}}>
                <label style={lbl}>🌍 {lang==='es'?'¿A dónde viajas?':'Where are you traveling?'}</label>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  {[{v:true,icon:'🏠',label:lang==='es'?'Dentro de mi país':'Within my own country'},{v:false,icon:'🌎',label:lang==='es'?'A otro país':'To a different country'}].map(o=>(
                    <button key={String(o.v)} onClick={()=>setIsDomestic(o.v)} style={{padding:'12px',border:`2px solid ${isDomestic===o.v?C.gold:C.beige}`,borderRadius:12,cursor:'pointer',fontFamily:'inherit',background:isDomestic===o.v?`${C.gold}22`:C.white,color:isDomestic===o.v?C.charcoal:C.gray,fontWeight:700,fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                      <span style={{fontSize:20}}>{o.icon}</span><span>{o.label}</span>
                    </button>
                  ))}
                </div>
                <div style={{marginTop:8,background:`${C.gold}15`,border:`1px solid ${C.gold}55`,borderRadius:8,padding:'8px 12px',fontSize:12,color:C.darkGray}}>ℹ️ {isDomestic?(lang==='es'?'Sin pasaporte ni visa — solo afecta moneda/idioma si aplica.':'No passport/visa needed — only affects currency/language if relevant.'):(lang==='es'?'Aplican requisitos de pasaporte/visa — pueden cruzar por avión o por tierra.':'Passport/visa requirements apply — you can fly or cross by land.')}</div>
              </div>

              {/* Destinations */}
              <div style={{marginBottom:20}}>
                <label style={lbl}>📍 {t.destSection}</label>
                {dests.map((d,i)=>(
                  <div key={i} style={{marginBottom:12,background:C.lightGold,borderRadius:12,padding:14,border:`1px solid ${C.beige}`}}>
                    <div style={{display:'flex',gap:8,marginBottom:8,alignItems:'center'}}>
                      <div style={{background:C.gold,color:C.black,borderRadius:'50%',width:24,height:24,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:11,flexShrink:0}}>{i+1}</div>
                      <input value={d.name} onChange={e=>updDest(i,'name',e.target.value)} placeholder={t.destPlaceholder} style={{...inp,flex:1}}/>
                      {dests.length>1&&<button onClick={()=>removeDest(i)} style={{background:'#fee2e2',color:C.red,border:'none',borderRadius:7,padding:'9px 11px',cursor:'pointer',fontWeight:800,flexShrink:0}}>{t.remove}</button>}
                    </div>
                    <input value={d.places} onChange={e=>updDest(i,'places',e.target.value)} placeholder={t.placesPlaceholder} style={{...inp,fontSize:12}}/>
                  </div>
                ))}
                <button onClick={addDest} style={{...btnD,fontSize:12,marginTop:4}}>{t.addDest}</button>
              </div>

              {/* Dates */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:10}}>
                <div><label style={lbl}>📅 {t.startDate}</label><input type="date" value={startDate} onChange={e=>{setStartDate(e.target.value);if(returnDate&&e.target.value>=returnDate)setReturnDate('');}} min={new Date().toISOString().split('T')[0]} style={inp}/></div>
                <div><label style={lbl}>🔙 {t.returnDate}</label><input type="date" value={returnDate} onChange={e=>setReturnDate(e.target.value)} min={startDate||new Date().toISOString().split('T')[0]} style={inp}/></div>
              </div>
              {startDate&&returnDate&&(()=>{const days=Math.round((new Date(returnDate+'T12:00:00')-new Date(startDate+'T12:00:00'))/86400000);const nd=dests.filter(d=>d.name.trim()).length;return days>0?<div style={{background:`${C.gold}22`,border:`1px solid ${C.gold}55`,borderRadius:8,padding:'8px 14px',marginBottom:16,fontSize:13,color:C.charcoal,fontWeight:600}}>🗓 {days} {t.days} / {days-1} {t.nights}{nd>1?` — ~${Math.floor(days/nd)} ${t.perDestDays}`:''}</div>:null;})()}

              {/* Travelers + Nationality */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:16}}>
                <div><label style={lbl}>👥 {t.travelers}</label><input type="number" value={travelers} onChange={e=>setTravelers(e.target.value)} min="1" max="99" style={inp}/></div>
                <div><label style={lbl}>🌐 {t.nationality}</label><input value={nationality} onChange={e=>setNationality(e.target.value)} placeholder={t.nationalityPlaceholder} style={inp}/></div>
              </div>

              {/* Kids */}
              {hasKids===true&&<div style={{background:`${C.gold}18`,border:`1px solid ${C.gold}66`,borderRadius:8,padding:'8px 14px',marginBottom:14,fontSize:12,color:C.charcoal}}>{t.kidsPassengerNoteShort}</div>}
              <div style={{marginBottom:20,background:C.offWhite,borderRadius:12,padding:16,border:`1.5px solid ${C.beige}`}}>
                <label style={{...lbl,marginBottom:12}}>👶 {t.travelingWithKids}</label>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  <button onClick={()=>{setHasKids(false);setChildren([{age:''}]);}} style={{padding:'14px',borderRadius:10,cursor:'pointer',fontFamily:'inherit',fontWeight:700,fontSize:13,border:`2px solid ${hasKids===false?C.charcoal:C.beige}`,background:hasKids===false?C.charcoal:C.white,color:hasKids===false?C.white:C.gray,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}><span>👤</span><span>{t.noKids}</span></button>
                  <button onClick={()=>setHasKids(true)} style={{padding:'14px',borderRadius:10,cursor:'pointer',fontFamily:'inherit',fontWeight:700,fontSize:13,border:`2px solid ${hasKids===true?C.gold:C.beige}`,background:hasKids===true?`${C.gold}22`:C.white,color:hasKids===true?C.charcoal:C.gray,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}><span>👨‍👩‍👧</span><span>{t.yesKids}</span></button>
                </div>
                {hasKids===true&&(
                  <div style={{marginTop:14,background:C.lightBlue,borderRadius:10,padding:14,border:'1.5px solid #bae6fd'}}>
                    <p style={{margin:'0 0 10px',fontSize:12,color:C.blue,fontWeight:600}}>ℹ️ {t.kidsHint}</p>
                    {children.map((ch,ci)=>(
                      <div key={ci} style={{display:'flex',gap:10,marginBottom:10,alignItems:'center',flexWrap:'wrap'}}>
                        <div style={{background:C.gold,color:C.black,borderRadius:'50%',width:26,height:26,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:11,flexShrink:0}}>{ci+1}</div>
                        <span style={{fontSize:13,fontWeight:700,color:C.charcoal}}>{t.childNum} {ci+1}</span>
                        <input type="number" min="0" max="17" value={ch.age} onChange={e=>{const c=[...children];c[ci]={age:e.target.value};setChildren(c);}} placeholder="0–17" style={{...inp,width:75,textAlign:'center',flex:'0 0 75px',padding:'9px'}}/>
                        <span style={{fontSize:12,color:C.blue,fontWeight:600}}>{t.yearsOld}</span>
                        {ch.age!==''&&!isNaN(ch.age)&&<span style={{fontSize:10,color:C.darkGray,fontStyle:'italic',background:`${C.gold}22`,borderRadius:6,padding:'2px 7px'}}>{ageLabel(ch.age,t)}</span>}
                        {children.length>1&&<button onClick={()=>setChildren(children.filter((_,idx)=>idx!==ci))} style={{background:'#fee2e2',color:C.red,border:'none',borderRadius:6,padding:'5px 9px',cursor:'pointer',fontWeight:800,flexShrink:0}}>{t.removeChild}</button>}
                      </div>
                    ))}
                    <button onClick={()=>setChildren([...children,{age:''}])} style={{background:C.blue,color:C.white,border:'none',borderRadius:8,padding:'7px 14px',cursor:'pointer',fontWeight:700,fontSize:12,fontFamily:'inherit',marginTop:4}}>{t.addChild}</button>
                  </div>
                )}
              </div>

              {/* Getting There — universal: works the same whether same-country or different-country */}
              <div style={{marginBottom:16}}>
                {(()=>{
                  const isMultiStop = dests.filter(d=>d.name.trim()).length > 1;
                  const startLabel = depCity || selectedTrip?.depCity || dests[0]?.name || (lang==='es'?'tu destino':'your destination');
                  const crossBorderNow = !isDomestic && gettingThereMode==='drive';
                  return (
                    <>
                      {/* Fly or Drive — applies to home-country AND different-country trips alike */}
                      <div style={{background:C.offWhite,borderRadius:12,padding:14,border:`1.5px solid ${C.beige}`,marginBottom:12}}>
                        <label style={{...lbl,marginBottom:10}}>🧭 {lang==='es'?`¿Cómo llegas a ${startLabel}?`:`How will you get to ${startLabel}?`}</label>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                          <button onClick={()=>setGettingThereMode('fly')} style={{padding:'12px 10px',border:`2px solid ${gettingThereMode==='fly'?C.gold:C.beige}`,borderRadius:12,cursor:'pointer',fontFamily:'inherit',background:gettingThereMode==='fly'?`${C.gold}22`:C.white,color:gettingThereMode==='fly'?C.charcoal:C.gray,fontWeight:700,fontSize:12,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}><span style={{fontSize:22}}>✈️</span><span>{lang==='es'?'Vuelo hasta ahí':'Fly there'}</span></button>
                          <button onClick={()=>setGettingThereMode('drive')} style={{padding:'12px 10px',border:`2px solid ${gettingThereMode==='drive'?C.charcoal:C.beige}`,borderRadius:12,cursor:'pointer',fontFamily:'inherit',background:gettingThereMode==='drive'?C.charcoal:C.white,color:gettingThereMode==='drive'?C.white:C.gray,fontWeight:700,fontSize:12,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}><span style={{fontSize:22}}>🚗</span><span>{lang==='es'?'Manejo hasta ahí':'Drive there'}</span></button>
                        </div>
                        {gettingThereMode===null&&<div style={{marginTop:6,fontSize:11,color:C.gray,textAlign:'center'}}>↑ {lang==='es'?'Selecciona una opción':'Select an option'}</div>}
                        {gettingThereMode==='drive'&&crossBorderNow&&<div style={{marginTop:8,background:'#fef3c7',border:'1px solid #f59e0b',borderRadius:8,padding:'7px 12px',fontSize:12,color:'#92400e'}}>🛂 {lang==='es'?'Cruzarás una frontera internacional por tierra — lleva pasaporte/identificación, espera revisión aduanera, y verifica tu seguro de auto sea válido en el otro país.':'You\'ll cross an international land border — bring your passport/ID, expect a customs check, and verify your car insurance is valid in the other country.'}</div>}
                        {gettingThereMode==='drive'&&!crossBorderNow&&<div style={{marginTop:8,background:`${C.charcoal}10`,borderRadius:8,padding:'7px 12px',fontSize:12,color:C.darkGray}}>ℹ️ {lang==='es'?'Usarás tu propio carro durante todo el viaje — sin vuelos ni alquiler.':'You\'ll use your own car for the entire trip — no flights, no rental.'}</div>}
                      </div>

                      {/* Departure airport — only if flying */}
                      {gettingThereMode==='fly'&&(
                        <div style={{marginBottom:12,position:'relative'}}>
                          <label style={lbl}>✈ {t.airport}</label>
                          <input value={airportQ} onChange={e=>{setAirportQ(e.target.value);setAirport('');setShowAP(true);}} onFocus={()=>setShowAP(true)} onBlur={()=>setTimeout(()=>setShowAP(false),200)} placeholder={t.airportSearch} style={inp}/>
                          {airport&&!showAP&&<div style={{marginTop:5,fontSize:12,color:C.green,fontWeight:700}}>✓ {t.airportSelected}: {airport}</div>}
                          {showAP&&filteredAP.length>0&&(
                            <div style={{position:'absolute',zIndex:99,width:'100%',top:'calc(100% + 2px)',background:C.white,border:`1px solid ${C.beige}`,borderRadius:8,boxShadow:'0 8px 28px rgba(0,0,0,0.12)',maxHeight:220,overflowY:'auto'}}>
                              {filteredAP.map(a=><div key={a.code} onMouseDown={()=>{setAirport(a.name);setAirportQ(a.name);setShowAP(false);}} style={{padding:'10px 14px',cursor:'pointer',fontSize:13,borderBottom:`1px solid ${C.offWhite}`}} className="rh"><strong style={{color:C.gold,marginRight:8}}>{a.code}</strong>{a.name.replace(` (${a.code})`,``)}</div>)}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Departure / starting city — needed for drive mode (and for domestic fly to know route start) */}
                      {(gettingThereMode==='drive'||isDomestic)&&(
                        <div style={{marginBottom:12}}>
                          <label style={lbl}>📍 {gettingThereMode==='fly'?(lang==='es'?'Ciudad a la que vuelas (inicio de la ruta)':'City you\'ll fly into (start of the route)'):t.departureCity}</label>
                          <input value={depCity} onChange={e=>setDepCity(e.target.value)} placeholder={t.departureCityPlaceholder} style={inp}/>
                        </div>
                      )}

                      {/* Rent a car at destination — only relevant when flying */}
                      {gettingThereMode==='fly'&&(
                        <div style={{marginBottom:12,background:C.offWhite,borderRadius:12,padding:14,border:`1.5px solid ${C.beige}`}}>
                          <label style={{...lbl,marginBottom:10}}>🔑 {lang==='es'?'¿Alquilarás un carro al llegar?':'Will you rent a car once there?'}</label>
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                            <button onClick={()=>setNeedsCar(true)} style={{padding:'11px',border:`2px solid ${needsCar===true?C.gold:C.beige}`,borderRadius:10,cursor:'pointer',fontFamily:'inherit',background:needsCar===true?`${C.gold}22`:C.white,color:needsCar===true?C.charcoal:C.gray,fontWeight:700,fontSize:12}}>🚗 {lang==='es'?'Sí, alquilaré carro':'Yes, I\'ll rent a car'}</button>
                            <button onClick={()=>setNeedsCar(false)} style={{padding:'11px',border:`2px solid ${needsCar===false?C.charcoal:C.beige}`,borderRadius:10,cursor:'pointer',fontFamily:'inherit',background:needsCar===false?C.charcoal:C.white,color:needsCar===false?C.white:C.gray,fontWeight:700,fontSize:12}}>🚇 {lang==='es'?'No, transporte público':'No, public transit'}</button>
                          </div>
                          {needsCar===null&&<div style={{marginTop:6,fontSize:11,color:C.gray,textAlign:'center'}}>↑ {lang==='es'?'Selecciona una opción':'Select an option'}</div>}
                        </div>
                      )}

                      {/* Stay type — only relevant for a SINGLE destination trip (any country) */}
                      {!isMultiStop&&(
                        <div style={{background:C.offWhite,borderRadius:12,padding:14,border:`1.5px solid ${C.beige}`}}>
                          <label style={{...lbl,marginBottom:10}}>🏨 {t.stayQuestion}</label>
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                            <button onClick={()=>setStayType('hotel')} style={{padding:'12px 10px',border:`2px solid ${stayType==='hotel'?C.gold:C.beige}`,borderRadius:12,cursor:'pointer',fontFamily:'inherit',background:stayType==='hotel'?`${C.gold}22`:C.white,color:stayType==='hotel'?C.charcoal:C.gray,fontWeight:700,fontSize:12,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}><span style={{fontSize:22}}>🏨</span><span style={{textAlign:'center'}}>{t.stayHotel}</span></button>
                            <button onClick={()=>setStayType('home')} style={{padding:'12px 10px',border:`2px solid ${stayType==='home'?C.charcoal:C.beige}`,borderRadius:12,cursor:'pointer',fontFamily:'inherit',background:stayType==='home'?C.charcoal:C.white,color:stayType==='home'?C.white:C.gray,fontWeight:700,fontSize:12,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}><span style={{fontSize:22}}>🏠</span><span style={{textAlign:'center'}}>{t.stayHome}</span></button>
                          </div>
                          {stayType==='hotel'&&<div style={{marginTop:8,background:`${C.gold}15`,borderRadius:8,padding:'7px 12px',fontSize:12,color:C.darkGray}}>ℹ️ {t.stayHotelHint}</div>}
                          {stayType==='home'&&<div style={{marginTop:8,background:`${C.charcoal}10`,borderRadius:8,padding:'7px 12px',fontSize:12,color:C.darkGray}}>ℹ️ {t.stayHomeHint}</div>}
                        </div>
                      )}
                      {isMultiStop&&(
                        <div style={{background:`${C.gold}10`,borderRadius:8,padding:'8px 12px',fontSize:12,color:C.darkGray}}>
                          🏨 {lang==='es'?'Ruta de varias paradas — se asume hotel en cada parada durante el viaje.':'Multi-stop route — hotels assumed at each stop along the way.'}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Style + Budget Tier */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
                <div><label style={lbl}>🗺 {t.tripType}</label><select value={tripType} onChange={e=>setTripType(e.target.value)} style={inp}>{Object.entries(t.tripTypes).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div>
                <div><label style={lbl}>💳 {t.budgetType}</label><select value={budgetType} onChange={e=>setBudgetType(e.target.value)} style={inp}>{Object.entries(t.budgetTypes).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div>
              </div>

              {/* Budget */}
              <div style={{marginBottom:28}}>
                <label style={lbl}>💰 {t.totalBudget}</label>
                <div style={{position:'relative'}}>
                  <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:C.deepGold,fontWeight:900,fontSize:16}}>$</span>
                  <input type="number" value={budget} onChange={e=>setBudget(e.target.value)} placeholder={t.budgetPlaceholder} min="0" style={{...inp,paddingLeft:28}}/>
                </div>
                {budget&&(()=>{const b=Number(budget),h=PA.hotel[budgetType],f=PA.food[budgetType];const days=startDate&&returnDate?Math.round((new Date(returnDate+'T12:00:00')-new Date(startDate+'T12:00:00'))/86400000):0;const n=parseInt(travelers)||2;const estHotel=days*((h[0]+h[1])/2);const estFood=days*((f[0]+f[1])/2)*n;const estTotal=estHotel+estFood;const pct=Math.round((b/estTotal)*100);return b&&days?<div style={{marginTop:8,fontSize:12,color:pct>=100?C.green:pct>=75?C.deepGold:C.red,fontWeight:600}}>💡 {pct>=100?'✓ Budget looks sufficient for hotel + food alone':pct>=75?'⚠ Budget is tight — may cover basics':'⚠ Budget may be insufficient — consider increasing'}</div>:null;})()}
              </div>
              {SHOW_KEY_UI&&              <div style={{marginBottom:14,border:`1.5px solid ${C.beige}`,borderRadius:10,padding:'10px 14px',background:C.offWhite}}>
                <button type="button" onClick={()=>setKeyOpen(o=>!o)} style={{background:'none',border:'none',cursor:'pointer',fontFamily:'inherit',fontWeight:800,fontSize:13,color:C.charcoal,padding:0}}>🔑 {lang==='es'?'Clave de IA (Gemini)':'AI key (Gemini)'} {keyOpen?'▲':'▼'}</button>
                {keyOpen&&(
                  <div style={{marginTop:10}}>
                    <p style={{fontSize:12,color:C.gray,margin:'0 0 8px',lineHeight:1.6}}>{lang==='es'?'Solo si el sitio no la trae configurada. Gratis en aistudio.google.com/app/apikey. Se guarda solo en este navegador.':'Only needed if the site has none configured. Free at aistudio.google.com/app/apikey. Saved only in this browser.'}</p>
                    <div style={{display:'flex',gap:8}}>
                      <input type="password" value={keyInput} onChange={e=>setKeyInput(e.target.value)} placeholder="AIza..." style={{...inp,flex:1}}/>
                      <button type="button" onClick={()=>{setUserKey(keyInput);setKeyMsg(lang==='es'?'✓ Guardada':'✓ Saved');setError('');}} style={{background:C.charcoal,color:C.gold,border:'none',borderRadius:10,padding:'0 16px',fontWeight:800,cursor:'pointer',fontFamily:'inherit'}}>{lang==='es'?'Guardar':'Save'}</button>
                    </div>
                    {keyMsg&&<div style={{fontSize:12,color:C.green,marginTop:6,fontWeight:700}}>{keyMsg}</div>}
                  </div>
                )}
              </div>}
              <label style={{display:'flex',alignItems:'flex-start',gap:10,background:C.lightBlue,border:'1.5px solid #bae6fd',borderRadius:10,padding:'12px 14px',marginBottom:14,cursor:'pointer'}}>
                <input type="checkbox" checked={demoMode} onChange={e=>setDemoMode(e.target.checked)} style={{marginTop:2,width:16,height:16,flexShrink:0,accentColor:C.blue}}/>
                <span style={{fontSize:12,color:C.darkGray,lineHeight:1.6}}>
                  <strong style={{color:C.blue}}>🧪 {t.demoModeLabel}</strong><br/>{t.demoModeHint}
                </span>
              </label>
              <button onClick={generateTrip} style={{width:'100%',background:C.gold,color:C.black,border:'none',borderRadius:14,padding:18,fontSize:17,fontWeight:900,cursor:'pointer',fontFamily:'inherit',boxShadow:`0 6px 24px ${C.gold}55`,letterSpacing:0.5}}>{t.generate}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOADING ── */}
      {page==='loading'&&(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'80vh',gap:24,padding:40}}>
          <Logo size={90}/>
          <div style={{width:56,height:56,border:`5px solid ${C.beige}`,borderTopColor:C.gold,borderRadius:'50%',animation:'spin 0.9s linear infinite'}}/>
          <div style={{textAlign:'center',maxWidth:440}}>
            <p style={{color:C.charcoal,fontSize:17,fontWeight:800,margin:'0 0 8px',minHeight:28}}>{loadMsg||t.loading[0]}</p>
            <p style={{color:C.gray,fontSize:12,margin:0}}>{t.loadingSubtitle}</p>
            <p style={{color:C.beige,fontSize:11,margin:'6px 0 0',animation:'pulse 2s infinite'}}>{t.loadingTime}</p>
          </div>
          {selectedTrip&&(
            <div style={{background:C.charcoal,border:`1px solid ${C.gold}44`,borderRadius:12,padding:'14px 20px',textAlign:'center'}}>
              <span style={{fontSize:24}}>{selectedTrip.emoji}</span>
              <div style={{color:C.gold,fontWeight:800,fontSize:14,marginTop:4}}>{selectedTrip.name}</div>
              <div style={{color:C.beige,fontSize:11,marginTop:2}}>{selectedTrip.tag}</div>
            </div>
          )}
        </div>
      )}

      {/* ── RESULTS ── */}
      {page==='results'&&results&&(
        <div style={{maxWidth:1100,margin:'0 auto',padding:'24px 20px',animation:'fu 0.4s ease'}}>

          {/* Famous trip banner */}
          {meta.selectedTrip&&(
            <div style={{background:C.charcoal,borderRadius:14,padding:'16px 20px',marginBottom:16,display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
              <span style={{fontSize:36}}>{meta.selectedTrip.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:900,fontSize:18,color:C.gold}}>{meta.selectedTrip.name}</div>
                <div style={{fontSize:12,color:C.beige,marginTop:2}}>{meta.selectedTrip.tag} · {meta.selectedTrip.stat}</div>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {(meta.selectedTrip.highlights||[]).map((h,i)=>(
                  <span key={i} style={{background:`${C.gold}22`,color:C.gold,fontSize:10,borderRadius:8,padding:'3px 9px',border:`1px solid ${C.gold}44`}}>★ {h}</span>
                ))}
              </div>
            </div>
          )}

          {/* Summary bar */}
          <div style={{background:C.charcoal,borderRadius:12,padding:'12px 20px',marginBottom:14,display:'flex',flexWrap:'wrap',gap:16,alignItems:'center'}}>
            <Logo size={32}/>
            {[{icon:'📅',val:startDate},{icon:'🔙',val:returnDate},{icon:'✈',val:(airport||depCity).split('(')[0].trim()},{icon:'👥',val:`${travelers} travelers`},{icon:'💰',val:`$${Number(budget).toLocaleString()}`}].map((item,i)=>(
              <div key={i} style={{textAlign:'center'}}><div style={{fontSize:14,color:C.beige}}>{item.icon}</div><div style={{fontSize:11,fontWeight:700,color:C.white,marginTop:2}}>{item.val}</div></div>
            ))}
          </div>

          {/* Budget Verdict */}
          {(()=>{const tb=Number(budget),tc=gGrp,ok=tb>=tc&&tc>0;if(!tc)return null;const diff=Math.abs(tb-tc);const detail=(ok?t.budgetOKDetail:t.budgetNODetail).replace('$BUDGET',`$${fmt(tb)}`).replace('$COST',`$${fmt(tc)}`).replace('$LEFT',`$${fmt(diff)}`).replace('$MISSING',`$${fmt(diff)}`);return(
            <div style={{borderRadius:14,marginBottom:14,overflow:'hidden',boxShadow:ok?'0 4px 20px rgba(22,163,74,0.2)':'0 4px 20px rgba(220,38,38,0.2)'}}>
              <div style={{background:ok?C.green:C.red,padding:'14px 20px',display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:32}}>{ok?'✅':'❌'}</span>
                <div><div style={{fontWeight:900,fontSize:15,color:C.white}}>{ok?t.budgetOK:t.budgetNO}</div><div style={{fontSize:12,color:'rgba(255,255,255,0.85)',marginTop:3}}>{detail}</div></div>
              </div>
              <div style={{background:ok?'#dcfce7':'#fee2e2',padding:'12px 20px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:10}}>
                {[{label:t.totalBudget,val:`$${fmt(tb)}`,color:C.charcoal},{label:t.estimated,val:`$${fmt(tc)}`,color:ok?C.green:C.red},{label:t.perPerson,val:`$${fmt(gPP)}`,color:C.charcoal},{label:t.balance,val:`${ok?'+':'-'}$${fmt(diff)}`,color:ok?C.green:C.red}].map((item,i)=>(
                  <div key={i} style={{textAlign:'center'}}><div style={{fontSize:10,color:C.gray,textTransform:'uppercase',marginBottom:2}}>{item.label}</div><div style={{fontWeight:900,fontSize:18,color:item.color}}>{item.val}</div></div>
                ))}
              </div>
              {!ok&&<div style={{background:'#fef2f2',padding:'10px 20px',fontSize:12,color:'#991b1b',fontWeight:600}}>{t.budgetNOSuggest}</div>}
            </div>
          );})()}

          {/* Action bar */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,flexWrap:'wrap',gap:10}}>
            <button onClick={()=>{setPage('form');setResults(null);}} style={btnD}>{t.back}</button>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>setPdfModal({title:t.downloadBudget,html:buildPDF('budget')})} style={btnG}>{t.downloadBudget}</button>
              <button onClick={()=>setPdfModal({title:t.downloadCalendar,html:buildPDF('cal')})} style={btnD}>{t.downloadCalendar}</button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:'flex',gap:3,marginBottom:18,background:C.charcoal,padding:5,borderRadius:12,overflowX:'auto'}}>
            {t.tabs.map((name,i)=>(<button key={i} onClick={()=>setTab(i)} style={{flex:'1 0 auto',padding:'10px 14px',border:'none',borderRadius:8,cursor:'pointer',fontWeight:700,fontSize:12,fontFamily:'inherit',background:tab===i?C.gold:'transparent',color:tab===i?C.black:C.beige,transition:'all 0.2s',whiteSpace:'nowrap'}}>{name}</button>))}
          </div>

          {/* ── TAB 0: BUDGET ── */}
          {tab===0&&(
            <div>
              <div style={{background:'#fffbeb',border:'1.5px solid #f59e0b',borderRadius:12,padding:'12px 16px',marginBottom:16,display:'flex',gap:10,alignItems:'flex-start'}}>
                <span style={{fontSize:18}}>💡</span>
                <div style={{fontSize:12,color:'#78350f',lineHeight:1.7}}><strong>{lang==='en'?'About these prices:':'Sobre estos precios:'}</strong> {t.priceNote}</div>
              </div>
              {(results.budget||[]).map((dest,di)=>(
                <div key={di} style={{...card,marginBottom:18,padding:0,overflow:'hidden'}}>
                  <div style={{padding:'14px 20px',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8,borderBottom:`1px solid ${C.beige}`}}>
                    <div><h3 style={{margin:'0 0 2px',color:C.charcoal,fontSize:17}}>📍 {dest.name}</h3><p style={{margin:0,color:C.gray,fontSize:12}}>{dest.dates} · {dest.days} {t.days}</p></div>
                    <div style={{display:'flex',gap:14}}>
                      <div style={{textAlign:'right'}}><div style={{fontSize:10,color:C.gray}}>{t.perPerson}</div><div style={{fontWeight:900,fontSize:17,color:C.deepGold}}>${fmt(dest.estimatedPP)}</div></div>
                      <div style={{textAlign:'right'}}><div style={{fontSize:10,color:C.gray}}>{t.perGroup}</div><div style={{fontWeight:900,fontSize:17,color:C.charcoal}}>${fmt(dest.estimated)}</div></div>
                    </div>
                  </div>
                  <div style={{margin:'10px 20px',padding:'9px 14px',borderRadius:8,fontWeight:700,fontSize:12,background:dest.viable?'#dcfce7':'#fee2e2',color:dest.viable?C.green:C.red,border:`1px solid ${dest.viable?'#bbf7d0':'#fecaca'}`}}>{dest.viable?t.viable:t.notViable} — {dest.note}</div>
                  {dest.flightDetail&&dest.flightDetail!=='N/A — domestic'&&dest.flightDetail!=='N/A domestic'&&(
                    <div style={{margin:'0 20px 10px',padding:'10px 14px',borderRadius:8,background:`${C.charcoal}08`,border:`1.5px solid ${C.charcoal}15`,display:'flex',gap:10}}><span>✈️</span><div style={{fontSize:12,color:C.darkGray,lineHeight:1.6}}><strong>Flights:</strong> {dest.flightDetail}</div></div>
                  )}
                  <div style={{overflowX:'auto'}}>
                    <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                      <thead><tr style={{background:C.charcoal,color:C.white}}><th style={{padding:'9px 16px',textAlign:'left',minWidth:130}}>{t.item}</th><th style={{padding:'9px 16px',textAlign:'right',minWidth:90}}>{t.cpp}</th><th style={{padding:'9px 16px',textAlign:'right',minWidth:100}}>{t.totalCost}</th><th style={{padding:'9px 16px',textAlign:'left',minWidth:250}}>{t.comments}</th></tr></thead>
                      <tbody>
                        {(dest.rows||[]).map((r,ri)=>(<tr key={ri} className="rh" style={{background:ri%2===0?C.offWhite:C.white}}><td style={{padding:'10px 16px',fontWeight:700}}>{r.icon} {r.cat}</td><td style={{padding:'10px 16px',textAlign:'right',fontWeight:700,color:C.deepGold,whiteSpace:'nowrap'}}>${fmt(r.pp)}</td><td style={{padding:'10px 16px',textAlign:'right',fontWeight:800,whiteSpace:'nowrap'}}>${fmt(r.total)}</td><td style={{padding:'10px 16px',color:C.darkGray,fontSize:12,lineHeight:1.6}}>{r.detail}</td></tr>))}
                        <tr style={{background:C.gold}}><td style={{padding:'10px 16px',fontWeight:900}}>{t.totalRow}</td><td style={{padding:'10px 16px',textAlign:'right',fontWeight:900}}>${fmt(dest.estimatedPP)}</td><td style={{padding:'10px 16px',textAlign:'right',fontWeight:900}}>${fmt(dest.estimated)}</td><td style={{padding:'10px 16px',fontSize:12,fontWeight:700}}>{t.allocated}: ${fmt(dest.allocated)}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              {(results.budget||[]).length>0&&(
                <div style={{background:C.charcoal,borderRadius:14,padding:22,marginTop:4}}>
                  <h3 style={{margin:'0 0 14px',color:C.gold,fontSize:15,fontWeight:900}}>✈ {t.grandTotal}</h3>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:12}}>
                    {[{label:t.perPerson,val:`$${fmt(gPP)}`,color:C.gold},{label:`${t.perGroup} (${numT})`,val:`$${fmt(gGrp)}`,color:C.white},{label:t.totalBudget,val:`$${fmt(Number(budget))}`,color:C.white},{label:t.balance,val:`${Number(budget)-gGrp>=0?'+':''}${fmt(Number(budget)-gGrp)} USD`,color:Number(budget)-gGrp>=0?'#4ade80':'#f87171'}].map((item,i)=>(
                      <div key={i} style={{background:'rgba(255,255,255,0.07)',borderRadius:10,padding:'12px 16px'}}><div style={{fontSize:10,color:C.beige,textTransform:'uppercase',marginBottom:4}}>{item.label}</div><div style={{fontWeight:900,fontSize:22,color:item.color}}>{item.val}</div></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 1: ITINERARY ── */}
          {tab===1&&(results.itinerary||[]).map((day,di)=>(
            <div key={di} style={{...card,marginBottom:14,padding:0,overflow:'hidden'}}>
              <div style={{background:C.charcoal,padding:'12px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:6}}>
                <span style={{color:C.gold,fontWeight:800,fontSize:14}}>{t.dayLabel} {day.num} — {day.date}</span>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  {day.dayType&&day.dayType!=='FULL'&&<span style={{background:`${C.gold}33`,color:C.gold,fontSize:9,fontWeight:800,borderRadius:6,padding:'2px 8px'}}>{day.dayType}</span>}
                  <span style={{color:C.beige,fontSize:12}}>📍 {day.dest}</span>
                </div>
              </div>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                  <thead><tr style={{background:C.darkGray,color:C.white}}><th style={{padding:'8px 14px',textAlign:'left',width:85}}>{t.time}</th><th style={{padding:'8px 14px',textAlign:'left',minWidth:160}}>{t.activity}</th><th style={{padding:'8px 14px',textAlign:'left',minWidth:250}}>{t.comments}</th><th style={{padding:'8px 14px',textAlign:'right',width:90}}>{t.actCost}</th><th style={{padding:'8px 14px',textAlign:'center',width:75}}>{t.mapLink}</th></tr></thead>
                  <tbody>{(day.acts||[]).map((a,ai)=>(<tr key={ai} className="rh" style={{background:ai%2===0?C.offWhite:C.white,borderLeft:a.type==='meal'?`3px solid ${C.gold}`:a.type==='attraction'?`3px solid ${C.blue}`:'none'}}><td style={{padding:'10px 14px',fontWeight:800,color:C.deepGold,whiteSpace:'nowrap'}}>{a.time}</td><td style={{padding:'10px 14px',fontWeight:600,color:C.charcoal,lineHeight:1.4}}>{a.name}{a.duration&&<div style={{fontSize:10,color:C.gray,fontWeight:500,marginTop:2}}>⏱ {a.duration}</div>}</td><td style={{padding:'10px 14px',color:C.darkGray,lineHeight:1.6,fontSize:12}}>{a.detail}</td><td style={{padding:'10px 14px',textAlign:'right',fontWeight:700,color:C.green,fontSize:12,whiteSpace:'nowrap'}}>{a.cost||'—'}</td><td style={{padding:'10px 14px',textAlign:'center'}}><a href={a.map} target="_blank" rel="noreferrer" style={{background:C.charcoal,color:C.gold,borderRadius:6,padding:'4px 8px',fontSize:11,fontWeight:800,textDecoration:'none'}}>{t.openMaps}</a></td></tr>))}</tbody>
                </table>
              </div>
            </div>
          ))}

          {/* ── TAB 2: MAPS ── */}
          {tab===2&&(
            <div style={{...card,padding:22}}>
              <p style={{margin:'0 0 14px',fontWeight:700,color:C.charcoal}}>{t.selectDay}</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:20}}>
                {(results.itinerary||[]).map((day,di)=>(<button key={di} onClick={()=>setSelDay(di)} style={{padding:'9px 13px',border:'none',borderRadius:10,cursor:'pointer',fontWeight:700,fontSize:11,fontFamily:'inherit',background:selDay===di?C.gold:C.offWhite,color:selDay===di?C.black:C.charcoal,boxShadow:selDay===di?`0 2px 10px ${C.gold}55`:'none',transition:'all 0.2s'}}>{t.dayLabel} {day.num}{day.dayType&&day.dayType!=='FULL'?` (${day.dayType.charAt(0)})`:''}<div style={{fontSize:9,fontWeight:400,marginTop:1,maxWidth:65,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:selDay===di?C.charcoal:C.gray}}>{(day.dest||'').split(',')[0]}</div></button>))}
              </div>
              {results.itinerary?.[selDay]&&(()=>{
                const day=results.itinerary[selDay], acts=day.acts||[];
                const getQ=a=>{try{const u=new URL(a.map);const q=u.searchParams.get('q');if(q)return encodeURIComponent(q);}catch(e){}return encodeURIComponent((a.name||'')+', '+day.dest);};
                const dayOrigin=(()=>{if(day.dayType==='ARRIVAL'||day.num===1)return encodeURIComponent(gettingThereMode==='drive'?(depCity||nationality):airport||day.dest); return encodeURIComponent('Hotel in '+day.dest);})();
                let routeUrl=acts.length===0?`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(day.dest)}`:acts.length===1?`https://www.google.com/maps/dir/?api=1&origin=${dayOrigin}&destination=${getQ(acts[0])}`:`https://www.google.com/maps/dir/?api=1&origin=${dayOrigin}&destination=${getQ(acts[acts.length-1])}&waypoints=${acts.map(getQ).slice(0,-1).join('|')}`;
                return(
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
                      <h3 style={{margin:0,color:C.charcoal,fontSize:16}}>{t.dayLabel} {day.num} — {day.dest}</h3>
                      {day.dayType&&<span style={{background:`${C.gold}33`,color:C.deepGold,fontSize:10,fontWeight:800,borderRadius:6,padding:'2px 8px'}}>{day.dayType}</span>}
                    </div>
                    <p style={{margin:'0 0 14px',color:C.gray,fontSize:12}}>{day.date} · Starting from: <strong>{day.dayType==='ARRIVAL'||day.num===1?(gettingThereMode==='drive'?depCity:airport.split('(')[0].trim()):'Hotel in '+day.dest}</strong></p>
                    <div style={{borderRadius:12,border:`1px solid ${C.beige}`,overflow:'hidden',marginBottom:12}}>
                      {acts.map((a,ai)=>(<div key={ai} style={{display:'flex',gap:10,alignItems:'center',padding:'11px 14px',borderBottom:ai<acts.length-1?`1px solid ${C.offWhite}`:'none',background:ai%2===0?C.white:C.offWhite}}><span style={{minWidth:68,fontWeight:800,color:C.gold,fontSize:12,flexShrink:0}}>{a.time}</span><span style={{flex:1,fontWeight:600,color:C.charcoal,fontSize:13}}>{a.name}</span>{a.cost&&<span style={{fontSize:11,color:C.green,fontWeight:700,flexShrink:0}}>{a.cost}</span>}<a href={a.map} target="_blank" rel="noreferrer" style={{background:C.gold,color:C.black,borderRadius:6,padding:'4px 9px',fontSize:10,fontWeight:800,textDecoration:'none',flexShrink:0}}>📍</a></div>))}
                    </div>
                    <a href={routeUrl} target="_blank" rel="noreferrer" style={{display:'block',background:C.charcoal,color:C.gold,borderRadius:12,padding:13,textAlign:'center',fontWeight:800,fontSize:13,textDecoration:'none'}}>{t.viewRoute}</a>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── TAB 3: TIPS ── */}
          {tab===3&&(results.tips||[]).map((dest,di)=>(
            <div key={di} style={{...card,marginBottom:18,padding:22}}>
              <h3 style={{margin:'0 0 16px',color:C.charcoal,fontSize:17}}>📍 {dest.dest}</h3>
              {(dest.highlights||[]).length>0&&(
                <div style={{marginBottom:16,background:`${C.gold}10`,border:`1.5px solid ${C.gold}44`,borderRadius:12,padding:14}}>
                  <div style={{fontWeight:800,fontSize:12,color:C.deepGold,marginBottom:8}}>⭐ {lang==='en'?'Must-See Highlights':'Lo Mejor de la Visita'}</div>
                  {dest.highlights.map((h,i)=><div key={i} style={{display:'flex',gap:8,marginBottom:6,fontSize:13,color:C.charcoal,lineHeight:1.5}}><span style={{color:C.gold,flexShrink:0,fontWeight:900}}>★</span>{h}</div>)}
                </div>
              )}
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(145px,1fr))',gap:10,marginBottom:14}}>
                {[{icon:'💱',label:t.currency,val:dest.currency},{icon:'🕐',label:t.tz,val:dest.timezone},{icon:'🌡',label:t.weather,val:dest.weather},{icon:'📅',label:t.bestTime,val:dest.bestSeason},{icon:'📱',label:t.localApps,val:dest.localApps},{icon:'🚨',label:t.emergency,val:dest.emergency}].map((info,i)=>(
                  <div key={i} style={{background:C.offWhite,borderRadius:10,padding:'10px 12px',border:`1px solid ${C.beige}`}}><div style={{fontSize:10,color:C.gray,marginBottom:3,fontWeight:600}}>{info.icon} {info.label}</div><div style={{fontWeight:700,color:C.charcoal,fontSize:11,lineHeight:1.5}}>{info.val||'—'}</div></div>
                ))}
              </div>
              {dest.clothing&&<div style={{background:`${C.blue}0f`,border:`1.5px solid ${C.blue}33`,borderRadius:10,padding:'12px 16px',marginBottom:14}}><div style={{fontWeight:800,fontSize:12,color:C.blue,marginBottom:6}}>🧳 {t.clothing}</div><div style={{fontSize:12,color:C.darkGray,lineHeight:1.7}}>{dest.clothing}</div></div>}
              {dest.visaInfo&&<div style={{background:`${C.gold}12`,border:`1px solid ${C.gold}44`,borderRadius:10,padding:'12px 16px',marginBottom:14}}><div style={{fontSize:11,fontWeight:800,color:C.charcoal,marginBottom:5}}>🛂 {t.visaInfo}</div><div style={{fontSize:12,color:C.darkGray,lineHeight:1.6}}>{dest.visaInfo}</div></div>}
              {(dest.gettingAround||dest.safety||dest.moneyTips||dest.connectivity)&&(
                <div style={{marginBottom:14}}>
                  <h4 style={{margin:'0 0 10px',color:C.charcoal,fontSize:13,fontWeight:800}}>🧭 {lang==='es'?'Logística Práctica':'Practical Logistics'}</h4>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    {dest.gettingAround&&<div style={{background:C.offWhite,borderRadius:10,padding:'10px 12px',border:`1px solid ${C.beige}`}}><div style={{fontSize:11,fontWeight:800,color:C.charcoal,marginBottom:4}}>🚇 {lang==='es'?'Cómo Moverte':'Getting Around'}</div><div style={{fontSize:12,color:C.darkGray,lineHeight:1.6}}>{dest.gettingAround}</div></div>}
                    {dest.safety&&<div style={{background:C.offWhite,borderRadius:10,padding:'10px 12px',border:`1px solid ${C.beige}`}}><div style={{fontSize:11,fontWeight:800,color:C.charcoal,marginBottom:4}}>🛡️ {lang==='es'?'Seguridad':'Safety'}</div><div style={{fontSize:12,color:C.darkGray,lineHeight:1.6}}>{dest.safety}</div></div>}
                    {dest.moneyTips&&<div style={{background:C.offWhite,borderRadius:10,padding:'10px 12px',border:`1px solid ${C.beige}`}}><div style={{fontSize:11,fontWeight:800,color:C.charcoal,marginBottom:4}}>💳 {lang==='es'?'Dinero y Propinas':'Money & Tipping'}</div><div style={{fontSize:12,color:C.darkGray,lineHeight:1.6}}>{dest.moneyTips}</div></div>}
                    {dest.connectivity&&<div style={{background:C.offWhite,borderRadius:10,padding:'10px 12px',border:`1px solid ${C.beige}`}}><div style={{fontSize:11,fontWeight:800,color:C.charcoal,marginBottom:4}}>📶 {lang==='es'?'Conectividad':'Connectivity'}</div><div style={{fontSize:12,color:C.darkGray,lineHeight:1.6}}>{dest.connectivity}</div></div>}
                  </div>
                </div>
              )}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
                <div><h4 style={{margin:'0 0 10px',color:C.charcoal,fontSize:13,fontWeight:800}}>💡 {t.tips}</h4>{(dest.tips||[]).map((tip,ti)=>(<div key={ti} style={{display:'flex',gap:7,marginBottom:8,fontSize:12,color:C.darkGray,lineHeight:1.6}}><span style={{color:C.gold,fontWeight:900,flexShrink:0}}>→</span>{tip}</div>))}{(dest.familyTips||[]).length>0&&<div style={{marginTop:12}}><h4 style={{margin:'0 0 8px',color:C.blue,fontSize:13,fontWeight:800}}>👨‍👩‍👧 {t.familyFriendly}</h4>{dest.familyTips.map((tip,ti)=>(<div key={ti} style={{display:'flex',gap:7,marginBottom:8,fontSize:12,color:C.darkGray,lineHeight:1.6}}><span style={{color:C.blue,fontWeight:900,flexShrink:0}}>→</span>{tip}</div>))}</div>}</div>
                <div><h4 style={{margin:'0 0 10px',color:C.charcoal,fontSize:13,fontWeight:800}}>📋 {t.docs}</h4>{(dest.docs||[]).map((doc,di2)=>(<div key={di2} style={{display:'flex',gap:7,marginBottom:8,fontSize:12,color:C.darkGray,lineHeight:1.6}}><span style={{color:C.green,fontWeight:900,flexShrink:0}}>✓</span>{doc}</div>))}</div>
              </div>
            </div>
          ))}

          {/* ── TAB 4: BOOK NOW ── */}
          {tab===4&&(
            <div>
              <div style={{...card,padding:20,marginBottom:18}}>
                <h2 style={{margin:'0 0 4px',color:C.charcoal,fontSize:18,fontWeight:900}}>🛒 {t.bookNowTitle}</h2>
                <p style={{margin:0,color:C.gray,fontSize:12}}>{t.bookNowSubtitle}</p>
              </div>
              <div style={{background:`${C.gold}12`,border:`1px solid ${C.gold}44`,borderRadius:10,padding:'9px 14px',marginBottom:16,fontSize:11,color:C.darkGray}}>⚠ {t.priceNote}</div>
              {(results.budget||[]).map((dest,di)=>{
                const dCity=(dest.name.split(',')[0]||dest.name).toLowerCase();
                const dAP=AIRPORTS.find(a=>a.name.toLowerCase().includes(dCity));
                const links=buildBookingLinks(dest.name,dAP?.code||'',meta.originCode||getCode(airport)||'SJU',startDate,returnDate,numT);
                const sections=[...(gettingThereMode==='fly'?[{key:'flights',icon:'✈️',title:t.bookFlights,data:links.flights,color:'#1a73e8'}]:[]),{key:'hotels',icon:'🏨',title:t.bookHotel,data:links.hotels,color:'#003580'},...(needsCar===true?[{key:'cars',icon:'🚗',title:t.bookCar,data:links.cars,color:'#006747'}]:[]),{key:'attractions',icon:'🎯',title:t.bookAttractions,data:links.attractions,color:'#145c46'},{key:'restaurants',icon:'🍽️',title:t.bookFood,data:links.restaurants,color:'#d32323'}];
                return(
                  <div key={di} style={{...card,marginBottom:16,padding:0,overflow:'hidden'}}>
                    <div style={{background:C.charcoal,padding:'12px 18px'}}><h3 style={{margin:0,color:C.gold,fontSize:16,fontWeight:800}}>📍 {dest.name}</h3><p style={{margin:'3px 0 0',color:C.beige,fontSize:11}}>{dest.dates} · {dest.days} {t.days}</p></div>
                    <div style={{padding:18}}>
                      {sections.map(sec=>(
                        <div key={sec.key} style={{marginBottom:18}}>
                          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}><span style={{fontSize:16}}>{sec.icon}</span><h4 style={{margin:0,color:C.charcoal,fontSize:13,fontWeight:800}}>{sec.title}</h4></div>
                          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(185px,1fr))',gap:9}}>
                            {sec.data.map((lk,li)=>(<a key={li} href={lk.url} target="_blank" rel="noreferrer" className="bk" style={{display:'flex',alignItems:'center',gap:9,padding:'10px 14px',borderRadius:10,textDecoration:'none',background:`${lk.color}10`,border:`1.5px solid ${lk.color}33`,transition:'all 0.2s'}}><span style={{fontSize:18,flexShrink:0}}>{lk.icon}</span><div style={{flex:1,minWidth:0}}><div style={{fontWeight:800,color:lk.color,fontSize:12,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{lk.label}</div><div style={{fontSize:9,color:C.gray,marginTop:1}}>{t.openLink}</div></div><span style={{fontSize:11,color:lk.color,fontWeight:800}}>↗</span></a>))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div style={{textAlign:'center',padding:'20px',color:C.gray,fontSize:11,borderTop:`1px solid ${C.beige}`,marginTop:20}}>
        READY2TRAVEL © {new Date().getFullYear()} · {t.tagline}
      </div>

      {/* PDF Modal */}
      {pdfModal&&(
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:500,display:'flex',flexDirection:'column',background:'#fff'}}>
          <div style={{background:C.charcoal,padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexShrink:0}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}><Logo size={34}/><span style={{color:C.gold,fontWeight:800,fontSize:13}}>{pdfModal.title}</span></div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>{const f=document.getElementById('r2t-pdf');if(f?.contentWindow){f.contentWindow.focus();f.contentWindow.print();}}} style={{...btnG,fontSize:12,padding:'9px 16px'}}>🖨️ {lang==='es'?'Imprimir / PDF':'Print / Save PDF'}</button>
              <button onClick={()=>setPdfModal(null)} style={{...btnD,fontSize:12,padding:'9px 16px'}}>✕</button>
            </div>
          </div>
          <iframe id="r2t-pdf" title="PDF" style={{flex:1,border:'none'}} srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;margin:28px;color:#1A1A1A;font-size:11px}table{border-collapse:collapse;width:100%}th,td{padding:5px 8px;border:1px solid #ddd}@media print{body{margin:12px}}</style></head><body>${pdfModal.html}</body></html>`}/>
        </div>
      )}
    </div>
  );
}
