export type Destination = {
  id: string;
  city: string;
  country: string;
  displayName: string;
  aliases: string[];
  imageUrl: string;
};

export const destinations: Destination[] = [
  {
    id: "mvd",
    city: "Montevideo",
    country: "Uruguay",
    displayName: "Montevideo, Uruguay",
    aliases: ["mvd", "monte"],
    imageUrl: "https://images.unsplash.com/photo-1589830508933-4f9e4e040316?auto=format&fit=crop&q=80"
  },
  {
    id: "bue",
    city: "Buenos Aires",
    country: "Argentina",
    displayName: "Buenos Aires, Argentina",
    aliases: ["baires", "bsas"],
    imageUrl: "https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?auto=format&fit=crop&q=80"
  },
  {
    id: "cor",
    city: "Córdoba",
    country: "Argentina",
    displayName: "Córdoba, Argentina",
    aliases: ["cordoba", "cor"],
    imageUrl: "https://images.unsplash.com/photo-1616422285623-13861df40df7?auto=format&fit=crop&q=80"
  },
  {
    id: "mdz",
    city: "Mendoza",
    country: "Argentina",
    displayName: "Mendoza, Argentina",
    aliases: ["mendoza", "mdz"],
    imageUrl: "https://images.unsplash.com/photo-1582298538104-5e1975e5e01b?auto=format&fit=crop&q=80"
  },
  {
    id: "brc",
    city: "Bariloche",
    country: "Argentina",
    displayName: "Bariloche, Argentina",
    aliases: ["san carlos de bariloche", "brc"],
    imageUrl: "https://images.unsplash.com/photo-1518182170546-076616fd4aa6?auto=format&fit=crop&q=80"
  },
  {
    id: "scl",
    city: "Santiago",
    country: "Chile",
    displayName: "Santiago, Chile",
    aliases: ["santiago de chile", "scl"],
    imageUrl: "https://images.unsplash.com/photo-1550954518-b2160d268d02?auto=format&fit=crop&q=80"
  },
  {
    id: "val",
    city: "Valparaíso",
    country: "Chile",
    displayName: "Valparaíso, Chile",
    aliases: ["valparaiso", "valpo"],
    imageUrl: "https://images.unsplash.com/photo-1584883494793-1d701dfc14de?auto=format&fit=crop&q=80"
  },
  {
    id: "gru",
    city: "São Paulo",
    country: "Brazil",
    displayName: "São Paulo, Brazil",
    aliases: ["sao paulo", "sp"],
    imageUrl: "https://images.unsplash.com/photo-1543059080-d9b127ceec30?auto=format&fit=crop&q=80"
  },
  {
    id: "gig",
    city: "Rio de Janeiro",
    country: "Brazil",
    displayName: "Rio de Janeiro, Brazil",
    aliases: ["rio", "rj"],
    imageUrl: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80"
  },
  {
    id: "fln",
    city: "Florianópolis",
    country: "Brazil",
    displayName: "Florianópolis, Brazil",
    aliases: ["floripa", "fln"],
    imageUrl: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&q=80"
  },
  {
    id: "lim",
    city: "Lima",
    country: "Peru",
    displayName: "Lima, Peru",
    aliases: ["lima", "lim"],
    imageUrl: "https://images.unsplash.com/photo-1532156641155-e7a93444fcce?auto=format&fit=crop&q=80"
  },
  {
    id: "cuz",
    city: "Cusco",
    country: "Peru",
    displayName: "Cusco, Peru",
    aliases: ["cuzco", "machu picchu"],
    imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=80"
  },
  {
    id: "bog",
    city: "Bogotá",
    country: "Colombia",
    displayName: "Bogotá, Colombia",
    aliases: ["bogota", "bog"],
    imageUrl: "https://images.unsplash.com/photo-1583515433068-1eb202ea6f3f?auto=format&fit=crop&q=80"
  },
  {
    id: "mde",
    city: "Medellín",
    country: "Colombia",
    displayName: "Medellín, Colombia",
    aliases: ["medellin", "mde"],
    imageUrl: "https://images.unsplash.com/photo-1614088059048-52e1e0aae0b1?auto=format&fit=crop&q=80"
  },
  {
    id: "ctg",
    city: "Cartagena",
    country: "Colombia",
    displayName: "Cartagena, Colombia",
    aliases: ["ctg"],
    imageUrl: "https://images.unsplash.com/photo-1580838384998-3168dcd2cb56?auto=format&fit=crop&q=80"
  },
  {
    id: "mex",
    city: "Mexico City",
    country: "Mexico",
    displayName: "Mexico City, Mexico",
    aliases: ["cdmx", "mexico"],
    imageUrl: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&q=80"
  },
  {
    id: "cun",
    city: "Cancún",
    country: "Mexico",
    displayName: "Cancún, Mexico",
    aliases: ["cancun", "cun"],
    imageUrl: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&q=80"
  },
  {
    id: "mty",
    city: "Monterrey",
    country: "Mexico",
    displayName: "Monterrey, Mexico",
    aliases: ["mty"],
    imageUrl: "https://images.unsplash.com/photo-1629806461993-9c8e100ec5e4?auto=format&fit=crop&q=80"
  },
  {
    id: "mad",
    city: "Madrid",
    country: "Spain",
    displayName: "Madrid, Spain",
    aliases: ["mad"],
    imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20202d0d4?auto=format&fit=crop&q=80"
  },
  {
    id: "bcn",
    city: "Barcelona",
    country: "Spain",
    displayName: "Barcelona, Spain",
    aliases: ["bcn", "barca"],
    imageUrl: "https://images.unsplash.com/photo-1583422409516-15eba534e622?auto=format&fit=crop&q=80"
  },
  {
    id: "cdg",
    city: "Paris",
    country: "France",
    displayName: "Paris, France",
    aliases: ["paris", "cdg"],
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e907a5ea071?auto=format&fit=crop&q=80"
  },
  {
    id: "fco",
    city: "Rome",
    country: "Italy",
    displayName: "Rome, Italy",
    aliases: ["roma", "rome"],
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80"
  },
  {
    id: "vce",
    city: "Venice",
    country: "Italy",
    displayName: "Venice, Italy",
    aliases: ["venezia", "venice"],
    imageUrl: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&q=80"
  },
  {
    id: "lhr",
    city: "London",
    country: "United Kingdom",
    displayName: "London, United Kingdom",
    aliases: ["london", "uk"],
    imageUrl: "https://images.unsplash.com/photo-1513635269975-5969336cd1f2?auto=format&fit=crop&q=80"
  },
  {
    id: "jfk",
    city: "New York",
    country: "USA",
    displayName: "New York, USA",
    aliases: ["nyc", "new york city"],
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80"
  },
  {
    id: "mia",
    city: "Miami",
    country: "USA",
    displayName: "Miami, USA",
    aliases: ["mia", "florida"],
    imageUrl: "https://images.unsplash.com/photo-1514361892635-6b07a3ba7259?auto=format&fit=crop&q=80"
  },
  {
    id: "lax",
    city: "Los Angeles",
    country: "USA",
    displayName: "Los Angeles, USA",
    aliases: ["la", "lax", "hollywood"],
    imageUrl: "https://images.unsplash.com/photo-1580659328760-b0b30daea8b1?auto=format&fit=crop&q=80"
  },
  {
    id: "nrt",
    city: "Tokyo",
    country: "Japan",
    displayName: "Tokyo, Japan",
    aliases: ["tokyo", "tyo"],
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80"
  },
  {
    id: "icn",
    city: "Seoul",
    country: "South Korea",
    displayName: "Seoul, South Korea",
    aliases: ["seoul"],
    imageUrl: "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&q=80"
  },
  {
    id: "lis",
    city: "Lisbon",
    country: "Portugal",
    displayName: "Lisbon, Portugal",
    aliases: ["lisboa", "lis"],
    imageUrl: "https://images.unsplash.com/photo-1585211969224-3e9929861590?auto=format&fit=crop&q=80"
  },
  {
    id: "ams",
    city: "Amsterdam",
    country: "Netherlands",
    displayName: "Amsterdam, Netherlands",
    aliases: ["ams"],
    imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&q=80"
  },
  {
    id: "ber",
    city: "Berlin",
    country: "Germany",
    displayName: "Berlin, Germany",
    aliases: ["ber"],
    imageUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&q=80"
  },
  {
    id: "yul",
    city: "Montréal",
    country: "Canada",
    displayName: "Montréal, Canada",
    aliases: ["montreal", "yul"],
    imageUrl: "https://images.unsplash.com/photo-1519119286820-20e36ecab4b3?auto=format&fit=crop&q=80"
  }
];
