// Movies Table
export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  duration: number; // in minutes
  genre: string[];
  language: string;
  releaseDate: string;
  synopsis: string;
  director: string;
  cast: string[];
  ageRating: "G" | "PG" | "PG-13" | "R" | "NC-17";
  status: "coming_soon" | "now_showing" | "ended";
}

export const movies: Movie[] = [
  {
    id: "m1",
    title: "Neon Horizon",
    posterUrl: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=600&fit=crop",
    rating: 8.7,
    duration: 148,
    genre: ["Sci-Fi", "Action"],
    language: "English",
    releaseDate: "2025-12-15",
    synopsis: "In a dystopian future where neon lights never dim, a rogue AI seeks to rewrite humanity's fate.",
    director: "Elena Voss",
    cast: ["Ryan Chen", "Maya Rodriguez", "Alex Okonkwo"],
    ageRating: "PG-13",
    status: "now_showing"
  },
  {
    id: "m2",
    title: "Shadow Protocol",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=600&fit=crop",
    rating: 9.1,
    duration: 156,
    genre: ["Thriller", "Action"],
    language: "English",
    releaseDate: "2025-12-20",
    synopsis: "An elite spy must infiltrate the world's most secure facility to prevent a global catastrophe.",
    director: "Marcus Wei",
    cast: ["Sarah Kim", "James Foster", "Priya Sharma"],
    ageRating: "R",
    status: "now_showing"
  },
  {
    id: "m3",
    title: "Eternal Echoes",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=600&fit=crop",
    rating: 8.4,
    duration: 132,
    genre: ["Romance", "Drama"],
    language: "Korean",
    releaseDate: "2025-12-18",
    synopsis: "Two souls separated by time find each other through mysterious letters that transcend decades.",
    director: "Park Ji-won",
    cast: ["Lee Min-ho", "Kim Soo-yeon", "Choi Woo-shik"],
    ageRating: "PG",
    status: "now_showing"
  },
  {
    id: "m4",
    title: "Crimson Thunder",
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop",
    rating: 7.9,
    duration: 141,
    genre: ["Action", "Adventure"],
    language: "Mandarin",
    releaseDate: "2025-12-22",
    synopsis: "A legendary martial artist emerges from retirement to protect her village from an ancient evil.",
    director: "Zhang Wei",
    cast: ["Liu Yifei", "Donnie Yen", "Michelle Yeoh"],
    ageRating: "PG-13",
    status: "now_showing"
  },
  {
    id: "m5",
    title: "Digital Dreams",
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=1200&h=600&fit=crop",
    rating: 8.2,
    duration: 118,
    genre: ["Sci-Fi", "Mystery"],
    language: "English",
    releaseDate: "2025-12-25",
    synopsis: "When virtual reality becomes indistinguishable from real life, one programmer discovers a terrifying truth.",
    director: "Anna Kowalski",
    cast: ["Tom Blake", "Zoe Martinez", "David Park"],
    ageRating: "PG-13",
    status: "now_showing"
  },
  {
    id: "m6",
    title: "The Last Guardian",
    posterUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
    rating: 8.9,
    duration: 165,
    genre: ["Fantasy", "Adventure"],
    language: "English",
    releaseDate: "2026-01-05",
    synopsis: "A young orphan discovers she's the last in a line of ancient guardians sworn to protect magical artifacts.",
    director: "Jennifer Moore",
    cast: ["Emma Stone", "Tom Holland", "Benedict Cumberbatch"],
    ageRating: "PG",
    status: "coming_soon"
  },
  {
    id: "m7",
    title: "Midnight Cafe",
    posterUrl: "https://images.unsplash.com/photo-1514897575457-c4db467cf78e?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=600&fit=crop",
    rating: 7.8,
    duration: 105,
    genre: ["Comedy", "Romance"],
    language: "Japanese",
    releaseDate: "2025-12-28",
    synopsis: "A quirky cafe owner helps heartbroken customers find love again through magical coffee blends.",
    director: "Takeshi Yamamoto",
    cast: ["Haruka Ayase", "Kenichi Matsuyama", "Satomi Ishihara"],
    ageRating: "PG",
    status: "now_showing"
  },
  {
    id: "m8",
    title: "Code Red",
    posterUrl: "https://images.unsplash.com/photo-1574267432644-f61f1bcad700?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=1200&h=600&fit=crop",
    rating: 8.5,
    duration: 142,
    genre: ["Action", "Thriller"],
    language: "English",
    releaseDate: "2025-12-30",
    synopsis: "A cybersecurity expert must stop a terrorist group from launching a digital attack on global infrastructure.",
    director: "Michael Bay",
    cast: ["Chris Hemsworth", "Scarlett Johansson", "Idris Elba"],
    ageRating: "R",
    status: "now_showing"
  },
  {
    id: "m9",
    title: "Whispers in the Dark",
    posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=600&fit=crop",
    rating: 7.2,
    duration: 98,
    genre: ["Horror", "Thriller"],
    language: "English",
    releaseDate: "2025-12-27",
    synopsis: "A family moves into their dream home, only to discover it harbors terrifying secrets from the past.",
    director: "James Wan",
    cast: ["Vera Farmiga", "Patrick Wilson", "Mckenna Grace"],
    ageRating: "R",
    status: "now_showing"
  },
  {
    id: "m10",
    title: "The Great Race",
    posterUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&h=600&fit=crop",
    rating: 8.0,
    duration: 125,
    genre: ["Action", "Sports"],
    language: "English",
    releaseDate: "2026-01-08",
    synopsis: "An underdog racing team fights their way to the top in the world's most dangerous motorsport championship.",
    director: "Ron Howard",
    cast: ["Daniel Ricciardo", "Christian Bale", "Matt Damon"],
    ageRating: "PG-13",
    status: "coming_soon"
  },
  {
    id: "m11",
    title: "Symphony of Hearts",
    posterUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=600&fit=crop",
    rating: 7.6,
    duration: 115,
    genre: ["Romance", "Drama"],
    language: "French",
    releaseDate: "2025-12-29",
    synopsis: "A deaf pianist and a blind composer create beautiful music together in this heartwarming tale.",
    director: "Pierre Laurent",
    cast: ["Marion Cotillard", "Omar Sy", "Léa Seydoux"],
    ageRating: "PG",
    status: "now_showing"
  },
  {
    id: "m12",
    title: "Planet X",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&h=600&fit=crop",
    rating: 8.8,
    duration: 178,
    genre: ["Sci-Fi", "Adventure"],
    language: "English",
    releaseDate: "2026-01-15",
    synopsis: "Humanity's first colony ship reaches a distant planet, only to find they're not the first visitors.",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Oscar Isaac"],
    ageRating: "PG-13",
    status: "coming_soon"
  },
  {
    id: "m13",
    title: "Laugh Out Loud",
    posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop",
    rating: 7.4,
    duration: 95,
    genre: ["Comedy"],
    language: "English",
    releaseDate: "2025-12-26",
    synopsis: "A struggling comedian gets one last chance to make it big at a legendary comedy club.",
    director: "Judd Apatow",
    cast: ["Kevin Hart", "Tiffany Haddish", "Pete Davidson"],
    ageRating: "R",
    status: "now_showing"
  },
  {
    id: "m14",
    title: "Dragon's Revenge",
    posterUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1200&h=600&fit=crop",
    rating: 8.3,
    duration: 155,
    genre: ["Fantasy", "Action"],
    language: "Mandarin",
    releaseDate: "2026-01-10",
    synopsis: "An ancient dragon awakens to reclaim its stolen treasure from a corrupt empire.",
    director: "Zhang Yimou",
    cast: ["Jackie Chan", "Gong Li", "Zhang Ziyi"],
    ageRating: "PG-13",
    status: "coming_soon"
  },
  {
    id: "m15",
    title: "The Detective",
    posterUrl: "https://images.unsplash.com/photo-1560363199-a1264d4ea5fc?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1481026469463-66327c86e544?w=1200&h=600&fit=crop",
    rating: 8.6,
    duration: 138,
    genre: ["Mystery", "Thriller"],
    language: "English",
    releaseDate: "2025-12-31",
    synopsis: "A brilliant detective races against time to solve a series of cryptic murders in Victorian London.",
    director: "Guy Ritchie",
    cast: ["Robert Downey Jr.", "Jude Law", "Rachel McAdams"],
    ageRating: "PG-13",
    status: "now_showing"
  },
  {
    id: "m16",
    title: "Jungle Quest",
    posterUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=1200&h=600&fit=crop",
    rating: 7.5,
    duration: 112,
    genre: ["Adventure", "Family"],
    language: "English",
    releaseDate: "2026-01-12",
    synopsis: "A group of kids must navigate a dangerous jungle to find their missing parents.",
    director: "Jon Favreau",
    cast: ["Dwayne Johnson", "Jack Black", "Karen Gillan"],
    ageRating: "PG",
    status: "coming_soon"
  },
  {
    id: "m17",
    title: "Silent Symphony",
    posterUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=600&fit=crop",
    rating: 7.9,
    duration: 108,
    genre: ["Drama", "Music"],
    language: "Italian",
    releaseDate: "2025-12-24",
    synopsis: "A retired opera singer finds her voice again when she mentors a troubled teenager.",
    director: "Paolo Sorrentino",
    cast: ["Sophia Loren", "Monica Bellucci", "Luca Marinelli"],
    ageRating: "PG",
    status: "now_showing"
  },
  {
    id: "m18",
    title: "Cyber Wars",
    posterUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=600&fit=crop",
    rating: 8.1,
    duration: 145,
    genre: ["Sci-Fi", "Action"],
    language: "English",
    releaseDate: "2026-01-20",
    synopsis: "In 2077, hackers wage war in both the virtual and real worlds for control of the megacity.",
    director: "Lana Wachowski",
    cast: ["Keanu Reeves", "Carrie-Anne Moss", "Yahya Abdul-Mateen II"],
    ageRating: "R",
    status: "coming_soon"
  },
  {
    id: "m19",
    title: "Ocean's Fury",
    posterUrl: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1439405326854-014607f694d7?w=1200&h=600&fit=crop",
    rating: 7.7,
    duration: 128,
    genre: ["Action", "Thriller"],
    language: "English",
    releaseDate: "2026-01-18",
    synopsis: "A submarine crew must stop a rogue captain from starting World War III.",
    director: "Kathryn Bigelow",
    cast: ["Matt Damon", "Emily Blunt", "Michael Shannon"],
    ageRating: "R",
    status: "coming_soon"
  },
  {
    id: "m20",
    title: "Fairy Tale Kingdom",
    posterUrl: "https://images.unsplash.com/photo-1512818512084-50bde93e3a58?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1516981442399-a91139e20ff8?w=1200&h=600&fit=crop",
    rating: 8.2,
    duration: 102,
    genre: ["Animation", "Family"],
    language: "English",
    releaseDate: "2026-01-22",
    synopsis: "A brave princess teams up with unlikely allies to save her kingdom from an evil sorcerer.",
    director: "Chris Buck",
    cast: ["Animated"],
    ageRating: "G",
    status: "coming_soon"
  },
  {
    id: "m21",
    title: "The Heist",
    posterUrl: "https://images.unsplash.com/photo-1579165466949-7c5c8a5c946f?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop",
    rating: 8.4,
    duration: 133,
    genre: ["Crime", "Thriller"],
    language: "English",
    releaseDate: "2026-01-25",
    synopsis: "A master thief assembles a team for one last impossible heist: stealing from the world's most secure vault.",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Tom Hardy", "Marion Cotillard"],
    ageRating: "PG-13",
    status: "coming_soon"
  },
  {
    id: "m22",
    title: "Tokyo Nights",
    posterUrl: "https://images.unsplash.com/photo-1490604001847-b712b0c2f967?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=600&fit=crop",
    rating: 7.3,
    duration: 110,
    genre: ["Drama", "Romance"],
    language: "Japanese",
    releaseDate: "2025-12-23",
    synopsis: "Two strangers meet in Tokyo and spend one magical night exploring the city and falling in love.",
    director: "Sofia Coppola",
    cast: ["Ryo Yoshizawa", "Kasumi Arimura", "Takeru Satoh"],
    ageRating: "PG-13",
    status: "now_showing"
  },
  {
    id: "m23",
    title: "Haunted Manor",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=1200&h=600&fit=crop",
    rating: 6.9,
    duration: 92,
    genre: ["Horror"],
    language: "English",
    releaseDate: "2025-10-31",
    synopsis: "A paranormal investigator spends Halloween night in a mansion with a deadly history.",
    director: "Mike Flanagan",
    cast: ["Kate Siegel", "Carla Gugino", "Henry Thomas"],
    ageRating: "R",
    status: "ended"
  },
  {
    id: "m24",
    title: "Speed Demons",
    posterUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=600&fit=crop",
    rating: 7.8,
    duration: 119,
    genre: ["Action", "Adventure"],
    language: "English",
    releaseDate: "2025-11-15",
    synopsis: "Street racers must pull off impossible heists to save one of their own from a dangerous crime lord.",
    director: "Justin Lin",
    cast: ["Vin Diesel", "Michelle Rodriguez", "Tyrese Gibson"],
    ageRating: "PG-13",
    status: "ended"
  },
  {
    id: "m25",
    title: "Winter's Tale",
    posterUrl: "https://images.unsplash.com/photo-1491001664-ac86c2489d97?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=1200&h=600&fit=crop",
    rating: 7.1,
    duration: 98,
    genre: ["Drama", "Romance"],
    language: "Norwegian",
    releaseDate: "2025-12-21",
    synopsis: "A Norwegian village faces a harsh winter as two families battle over land and love.",
    director: "Joachim Trier",
    cast: ["Renate Reinsve", "Anders Danielsen Lie", "Herbert Nordrum"],
    ageRating: "PG",
    status: "now_showing"
  },
  {
    id: "m26",
    title: "Cosmic Voyage",
    posterUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&h=600&fit=crop",
    rating: 8.7,
    duration: 167,
    genre: ["Sci-Fi", "Drama"],
    language: "English",
    releaseDate: "2026-02-01",
    synopsis: "An astronaut's journey to the edge of the universe becomes a profound meditation on humanity's place in the cosmos.",
    director: "Alfonso Cuarón",
    cast: ["Sandra Bullock", "George Clooney", "Ed Harris"],
    ageRating: "PG-13",
    status: "coming_soon"
  },
  {
    id: "m27",
    title: "The Magician",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=1200&h=600&fit=crop",
    rating: 8.0,
    duration: 126,
    genre: ["Fantasy", "Mystery"],
    language: "English",
    releaseDate: "2026-01-28",
    synopsis: "A stage magician discovers his tricks have become real magic, attracting dangerous attention.",
    director: "Guillermo del Toro",
    cast: ["Bradley Cooper", "Cate Blanchett", "Rooney Mara"],
    ageRating: "R",
    status: "coming_soon"
  },
  {
    id: "m28",
    title: "Family Reunion",
    posterUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=600&fit=crop",
    rating: 7.2,
    duration: 105,
    genre: ["Comedy", "Drama"],
    language: "English",
    releaseDate: "2025-12-26",
    synopsis: "A dysfunctional family gathers for the holidays, leading to chaos, laughter, and unexpected healing.",
    director: "Nancy Meyers",
    cast: ["Diane Keaton", "Meryl Streep", "Steve Martin"],
    ageRating: "PG-13",
    status: "now_showing"
  },
  {
    id: "m29",
    title: "Samurai's Honor",
    posterUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&h=600&fit=crop",
    rating: 8.5,
    duration: 152,
    genre: ["Action", "Drama"],
    language: "Japanese",
    releaseDate: "2026-01-30",
    synopsis: "A ronin seeks redemption by protecting a village from bandits in feudal Japan.",
    director: "Akira Kurosawa",
    cast: ["Hiroyuki Sanada", "Ken Watanabe", "Rinko Kikuchi"],
    ageRating: "R",
    status: "coming_soon"
  },
  {
    id: "m30",
    title: "Dance Revolution",
    posterUrl: "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=400&h=600&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1200&h=600&fit=crop",
    rating: 7.4,
    duration: 115,
    genre: ["Music", "Drama"],
    language: "Spanish",
    releaseDate: "2026-02-05",
    synopsis: "An underground dance crew competes for glory in the world's most prestigious street dance competition.",
    director: "Carlos Saura",
    cast: ["Antonio Banderas", "Penélope Cruz", "Javier Bardem"],
    ageRating: "PG",
    status: "coming_soon"
  }
];

// Cinemas & Halls
export interface Hall {
  id: string;
  name: string;
  type: "Standard" | "IMAX" | "Dolby" | "4DX";
  totalSeats: number;
  status: "active" | "maintenance" | "closed";
}

export interface Cinema {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  halls: Hall[];
  status: "active" | "maintenance" | "closed";
}

export const cinemas: Cinema[] = [
  {
    id: "c1",
    name: "Galaxy Cineplex",
    location: "KLCC, Kuala Lumpur",
    address: "Level 3, Suria KLCC, Kuala Lumpur City Centre, 50088",
    phone: "+60 3-2382 0000",
    email: "klcc@galaxycineplex.com",
    status: "active",
    halls: [
      { id: "h1", name: "Hall 1", type: "IMAX", totalSeats: 120, status: "active" },
      { id: "h2", name: "Hall 2", type: "Dolby", totalSeats: 80, status: "active" },
      { id: "h3", name: "Hall 3", type: "Standard", totalSeats: 150, status: "active" },
      { id: "h4", name: "Hall 4", type: "4DX", totalSeats: 60, status: "active" }
    ]
  }
];

// Helper to generate dates from today
const generateDates = () => {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const availableDates = generateDates();

// Showtimes
export interface Showtime {
  id: string;
  movieId: string;
  hallId: string;
  hallName: string;
  hallType: string;
  date: string;
  time: string;
  price: number;
  vipPrice: number;
  status: "scheduled" | "cancelled" | "ended";
}

// Generate showtimes dynamically based on current date
const generateShowtimes = (): Showtime[] => {
  const times = ["10:30", "13:00", "15:30", "18:00", "20:30", "23:00"];
  const showtimesList: Showtime[] = [];
  let id = 1;

  movies.forEach(movie => {
    availableDates.forEach((date, dateIdx) => {
      // Each movie gets 2-4 showtimes per day
      const numShowtimes = 2 + Math.floor(Math.random() * 3);
      const shuffledTimes = [...times].sort(() => Math.random() - 0.5).slice(0, numShowtimes);
      
      shuffledTimes.forEach(time => {
        const hallIdx = Math.floor(Math.random() * cinemas[0].halls.length);
        const hall = cinemas[0].halls[hallIdx];
        
        showtimesList.push({
          id: `s${id++}`,
          movieId: movie.id,
          hallId: hall.id,
          hallName: hall.name,
          hallType: hall.type,
          date,
          time,
          price: hall.type === "IMAX" ? 25 : hall.type === "Dolby" ? 22 : hall.type === "4DX" ? 35 : 18,
          vipPrice: hall.type === "IMAX" ? 45 : hall.type === "Dolby" ? 40 : hall.type === "4DX" ? 55 : 32,
          status: "scheduled"
        });
      });
    });
  });

  return showtimesList;
};

export const showtimes: Showtime[] = generateShowtimes();

// Seat Layout
export interface Seat {
  id: string;
  hallId: string;
  row: string;
  number: number;
  gridX: number;
  gridY: number;
  type: "Standard" | "VIP" | "Twin" | "Wheelchair";
  isAvailable: boolean;
}

// Generate seats for Hall 1 (IMAX - 120 seats, 10 rows x 12 seats)
const generateSeatsForHall = (hallId: string, rows: number, seatsPerRow: number, hasVipRows: boolean = false): Seat[] => {
  const seats: Seat[] = [];
  const rowLabels = "ABCDEFGHIJKLMNOP".split("");
  
  for (let r = 0; r < rows; r++) {
    for (let s = 1; s <= seatsPerRow; s++) {
      // Add gap in the middle (aisle)
      let gridX = s;
      if (s > seatsPerRow / 2) {
        gridX = s + 2; // Gap of 2 for aisle
      }
      
      let type: Seat["type"] = "Standard";
      if (hasVipRows && r >= rows - 2) {
        type = "VIP";
      }
      // Twin seats at the back corners
      if (r === rows - 1 && (s <= 2 || s > seatsPerRow - 2)) {
        type = "Twin";
      }
      // Wheelchair accessible in front
      if (r === 0 && (s === 1 || s === seatsPerRow)) {
        type = "Wheelchair";
      }
      
      seats.push({
        id: `${hallId}-${rowLabels[r]}${s}`,
        hallId,
        row: rowLabels[r],
        number: s,
        gridX,
        gridY: r + 1,
        type,
        isAvailable: true
      });
    }
  }
  return seats;
};

export const seatLayouts: Seat[] = [
  ...generateSeatsForHall("h1", 10, 12, true),  // IMAX
  ...generateSeatsForHall("h2", 8, 10, true),   // Dolby
  ...generateSeatsForHall("h3", 12, 12, false), // Standard
  ...generateSeatsForHall("h4", 6, 10, true),   // 4DX
];

// Showtime Seat Status
export interface SeatStatus {
  showtimeId: string;
  seatId: string;
  status: "available" | "booked" | "locked";
}

// Generate random booked/locked seats for showtimes
const generateSeatStatus = (): SeatStatus[] => {
  const statuses: SeatStatus[] = [];
  
  showtimes.forEach(showtime => {
    const hallSeats = seatLayouts.filter(s => s.hallId === showtime.hallId);
    
    hallSeats.forEach(seat => {
      // Random 30% booked, 5% locked
      const rand = Math.random();
      let status: SeatStatus["status"] = "available";
      if (rand < 0.30) {
        status = "booked";
      } else if (rand < 0.35) {
        status = "locked";
      }
      
      statuses.push({
        showtimeId: showtime.id,
        seatId: seat.id,
        status
      });
    });
  });
  
  return statuses;
};

export const showtimeSeatStatus: SeatStatus[] = generateSeatStatus();

// Concession Items
export interface ConcessionItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Popcorn" | "Drinks" | "Snacks" | "Combos";
  imageUrl: string;
  stockLevel: number;
  isAvailable: boolean;
}

export const concessionItems: ConcessionItem[] = [
  {
    id: "ci1",
    name: "Large Popcorn",
    description: "Buttery, freshly popped goodness",
    price: 12,
    category: "Popcorn",
    imageUrl: "🍿",
    stockLevel: 100,
    isAvailable: true
  },
  {
    id: "ci2",
    name: "Caramel Popcorn",
    description: "Sweet caramelized delight",
    price: 14,
    category: "Popcorn",
    imageUrl: "🍿",
    stockLevel: 80,
    isAvailable: true
  },
  {
    id: "ci3",
    name: "Large Coke",
    description: "Ice-cold refreshment",
    price: 8,
    category: "Drinks",
    imageUrl: "🥤",
    stockLevel: 200,
    isAvailable: true
  },
  {
    id: "ci4",
    name: "Iced Latte",
    description: "Premium coffee blend",
    price: 12,
    category: "Drinks",
    imageUrl: "☕",
    stockLevel: 50,
    isAvailable: true
  },
  {
    id: "ci5",
    name: "Nachos Grande",
    description: "Loaded with cheese & jalapeños",
    price: 15,
    category: "Snacks",
    imageUrl: "🧀",
    stockLevel: 60,
    isAvailable: true
  },
  {
    id: "ci6",
    name: "Hot Dog",
    description: "Classic cinema hot dog",
    price: 10,
    category: "Snacks",
    imageUrl: "🌭",
    stockLevel: 75,
    isAvailable: true
  },
  {
    id: "ci7",
    name: "Movie Combo",
    description: "Large popcorn + 2 drinks",
    price: 25,
    category: "Combos",
    imageUrl: "🎬",
    stockLevel: 50,
    isAvailable: true
  },
  {
    id: "ci8",
    name: "Premium Combo",
    description: "Large popcorn + 2 drinks + nachos",
    price: 38,
    category: "Combos",
    imageUrl: "⭐",
    stockLevel: 30,
    isAvailable: true
  },
  {
    id: "ci9",
    name: "Medium Popcorn",
    description: "Perfect size for one",
    price: 9,
    category: "Popcorn",
    imageUrl: "🍿",
    stockLevel: 120,
    isAvailable: true
  },
  {
    id: "ci10",
    name: "Cheese Popcorn",
    description: "Savory cheddar flavored",
    price: 13,
    category: "Popcorn",
    imageUrl: "🍿",
    stockLevel: 70,
    isAvailable: true
  },
  {
    id: "ci11",
    name: "Sprite",
    description: "Lemon-lime refreshment",
    price: 8,
    category: "Drinks",
    imageUrl: "🥤",
    stockLevel: 180,
    isAvailable: true
  },
  {
    id: "ci12",
    name: "Bottled Water",
    description: "Pure mineral water",
    price: 5,
    category: "Drinks",
    imageUrl: "💧",
    stockLevel: 250,
    isAvailable: true
  },
  {
    id: "ci13",
    name: "Orange Juice",
    description: "Freshly squeezed",
    price: 10,
    category: "Drinks",
    imageUrl: "🍊",
    stockLevel: 80,
    isAvailable: true
  },
  {
    id: "ci14",
    name: "Candy Mix",
    description: "Assorted theater candies",
    price: 8,
    category: "Snacks",
    imageUrl: "🍬",
    stockLevel: 100,
    isAvailable: true
  },
  {
    id: "ci15",
    name: "Pretzel Bites",
    description: "Warm with cheese dip",
    price: 12,
    category: "Snacks",
    imageUrl: "🥨",
    stockLevel: 50,
    isAvailable: true
  },
  {
    id: "ci16",
    name: "Chicken Tenders",
    description: "Crispy with honey mustard",
    price: 16,
    category: "Snacks",
    imageUrl: "🍗",
    stockLevel: 40,
    isAvailable: true
  },
  {
    id: "ci17",
    name: "Ice Cream Cup",
    description: "Vanilla or chocolate",
    price: 9,
    category: "Snacks",
    imageUrl: "🍦",
    stockLevel: 60,
    isAvailable: true
  },
  {
    id: "ci18",
    name: "Family Combo",
    description: "2 large popcorn + 4 drinks",
    price: 45,
    category: "Combos",
    imageUrl: "👨‍👩‍👧‍👦",
    stockLevel: 25,
    isAvailable: true
  },
  {
    id: "ci19",
    name: "Date Night Combo",
    description: "Popcorn + 2 drinks + candy",
    price: 32,
    category: "Combos",
    imageUrl: "💑",
    stockLevel: 35,
    isAvailable: true
  },
  {
    id: "ci20",
    name: "Kids Combo",
    description: "Small popcorn + juice + candy",
    price: 18,
    category: "Combos",
    imageUrl: "🧒",
    stockLevel: 40,
    isAvailable: true
  }
];

// User & Membership
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipTier: "Bronze" | "Silver" | "Gold" | "Platinum";
  pointsBalance: number;
  memberSince: string;
  qrCode: string;
  role: "customer" | "staff" | "manager" | "admin";
  status: "active" | "inactive" | "locked";
  avatar?: string;
}

export const currentUser: User = {
  id: "u1",
  name: "Alex Chen",
  email: "alex.chen@email.com",
  phone: "+60 12-345 6789",
  membershipTier: "Gold",
  pointsBalance: 2450,
  memberSince: "2023-06-15",
  qrCode: "MEMBER-GOLD-2450-AC",
  role: "customer",
  status: "active"
};

// Mock users for auth demo
export const mockUsers: User[] = [
  currentUser,
  {
    id: "u2",
    name: "Admin User",
    email: "admin@galaxycinema.com",
    phone: "+60 12-000 0001",
    membershipTier: "Platinum",
    pointsBalance: 10000,
    memberSince: "2020-01-01",
    qrCode: "ADMIN-PLATINUM-AC",
    role: "admin",
    status: "active"
  },
  {
    id: "u3",
    name: "Staff Member",
    email: "staff@galaxycinema.com",
    phone: "+60 12-000 0002",
    membershipTier: "Silver",
    pointsBalance: 500,
    memberSince: "2022-06-01",
    qrCode: "STAFF-SILVER-SM",
    role: "staff",
    status: "active"
  }
];

// Booking History
export interface Booking {
  id: string;
  referenceCode: string;
  userId: string;
  movieTitle: string;
  posterUrl: string;
  date: string;
  time: string;
  hall: string;
  seats: string[];
  ticketTotal: number;
  concessionTotal: number;
  totalAmount: number;
  status: "confirmed" | "completed" | "cancelled";
  paymentMethod: string;
  createdAt: string;
}

export const bookingHistory: Booking[] = [
  {
    id: "b1",
    referenceCode: "GX-2025-001234",
    userId: "u1",
    movieTitle: "Neon Horizon",
    posterUrl: movies[0].posterUrl,
    date: availableDates[1],
    time: "19:30",
    hall: "Hall 1 (IMAX)",
    seats: ["E5", "E6"],
    ticketTotal: 90,
    concessionTotal: 25,
    totalAmount: 115,
    status: "confirmed",
    paymentMethod: "Credit Card",
    createdAt: new Date().toISOString()
  },
  {
    id: "b2",
    referenceCode: "GX-2025-001122",
    userId: "u1",
    movieTitle: "Shadow Protocol",
    posterUrl: movies[1].posterUrl,
    date: "2025-12-25",
    time: "14:00",
    hall: "Hall 2 (Dolby)",
    seats: ["D7", "D8", "D9"],
    ticketTotal: 126,
    concessionTotal: 38,
    totalAmount: 164,
    status: "completed",
    paymentMethod: "GrabPay",
    createdAt: "2025-12-25T10:30:00Z"
  }
];

// Membership Tiers
export interface MembershipTier {
  name: "Bronze" | "Silver" | "Gold" | "Platinum";
  minSpend: number;
  pointsMultiplier: number;
  benefits: string[];
  color: string;
}

export const membershipTiers: MembershipTier[] = [
  {
    name: "Bronze",
    minSpend: 0,
    pointsMultiplier: 1,
    benefits: ["Earn 1 point per RM spent", "Birthday reward"],
    color: "from-amber-700 to-amber-900"
  },
  {
    name: "Silver",
    minSpend: 500,
    pointsMultiplier: 1.5,
    benefits: ["Earn 1.5x points", "Priority booking", "Birthday reward", "Free small popcorn on signup"],
    color: "from-slate-400 to-slate-600"
  },
  {
    name: "Gold",
    minSpend: 2000,
    pointsMultiplier: 2,
    benefits: ["Earn 2x points", "Priority booking", "Birthday reward", "Free upgrades", "Exclusive previews"],
    color: "from-yellow-500 to-amber-600"
  },
  {
    name: "Platinum",
    minSpend: 5000,
    pointsMultiplier: 3,
    benefits: ["Earn 3x points", "Priority booking", "Birthday reward", "Free upgrades", "Exclusive previews", "VIP lounge access", "Companion benefits"],
    color: "from-slate-300 to-slate-500"
  }
];

// Rewards
export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: "tickets" | "concessions" | "experiences";
  imageUrl: string;
  available: boolean;
}

export const rewards: Reward[] = [
  {
    id: "r1",
    name: "Free Movie Ticket",
    description: "Redeem for any standard movie ticket",
    pointsCost: 500,
    category: "tickets",
    imageUrl: "🎟️",
    available: true
  },
  {
    id: "r2",
    name: "Large Popcorn Combo",
    description: "Free large popcorn + drink combo",
    pointsCost: 300,
    category: "concessions",
    imageUrl: "🍿",
    available: true
  },
  {
    id: "r3",
    name: "IMAX Upgrade",
    description: "Upgrade any ticket to IMAX experience",
    pointsCost: 200,
    category: "tickets",
    imageUrl: "🎬",
    available: true
  },
  {
    id: "r4",
    name: "VIP Lounge Access",
    description: "Access to VIP lounge for one visit",
    pointsCost: 400,
    category: "experiences",
    imageUrl: "👑",
    available: true
  }
];

// Ticket Types
export interface TicketType {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number;
  isActive: boolean;
}

export const ticketTypes: TicketType[] = [
  { id: "tt1", name: "Adult", description: "Standard adult ticket", priceMultiplier: 1, isActive: true },
  { id: "tt2", name: "Child", description: "Ages 3-12", priceMultiplier: 0.7, isActive: true },
  { id: "tt3", name: "Student", description: "With valid student ID", priceMultiplier: 0.85, isActive: true },
  { id: "tt4", name: "Senior", description: "Ages 60+", priceMultiplier: 0.75, isActive: true }
];

// Helper functions
export const getMovieById = (id: string) => movies.find(m => m.id === id);
export const getShowtimeById = (id: string) => showtimes.find(s => s.id === id);
export const getShowtimesForMovie = (movieId: string, date?: string) => 
  showtimes.filter(s => s.movieId === movieId && (!date || s.date === date));
export const getSeatsForHall = (hallId: string) => seatLayouts.filter(s => s.hallId === hallId);
export const getSeatStatusForShowtime = (showtimeId: string) => 
  showtimeSeatStatus.filter(s => s.showtimeId === showtimeId);
export const getBookingsForUser = (userId: string) => 
  bookingHistory.filter(b => b.userId === userId);

export const genres = ["All", "Sci-Fi", "Action", "Thriller", "Romance", "Drama", "Adventure", "Mystery"];
export const languages = ["All", "English", "Korean", "Mandarin"];
