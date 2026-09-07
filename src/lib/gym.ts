import logoAsset from "@/assets/logo.jpg.asset.json";
import najamAsset from "@/assets/najam.png.asset.json";
import adeelAsset from "@/assets/adeel.png.asset.json";
import fasihAsset from "@/assets/fasih.png.asset.json";

export const logoUrl = logoAsset.url;
export const najamUrl = najamAsset.url;

export const GYM = {
  name: "Apex Fit Club",
  email: "apexfitclub@gmail.com",
  whatsapp: "923305966918",
  whatsappDisplay: "0330-5966918",
  address:
    "1st Floor, Madina Tower, Near Punjab Cash & Carry, Range Road, Rawalpindi (above Meezan Bank, Range Road)",
  mapQuery: "Meezan Bank Range Road Rawalpindi Madina Tower",
  socials: {
    tiktok: "https://www.tiktok.com/@apexfitclub_official",
    instagram: "",
    facebook: "",
  },
} as const;

export const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  GYM.mapQuery,
)}&output=embed`;
export const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  GYM.mapQuery,
)}`;

export const services = [
  { title: "Personal Training", desc: "One-on-one coaching built around your goals and schedule." },
  { title: "Group Fitness Classes", desc: "High-energy sessions that keep the whole floor moving." },
  { title: "Cardio & CrossFit", desc: "Conditioning circuits, treadmills, rowers and functional rigs." },
  { title: "Nutritional Counseling", desc: "Diet plans matched to your training block and budget." },
  { title: "Locker Rooms", desc: "Clean, secure changing area and lockers for every member." },
  { title: "Physiotherapist", desc: "Injury screening, recovery work and mobility support." },
  { title: "Yoga Classes", desc: "Flexibility, breathing and balance sessions each week." },
] as const;

export type Trainer = {
  name: string;
  role: string;
  experience: string;
  specialties: string[];
  bio: string;
  whatsapp: string;
  phoneDisplay: string;
  photo: string | null;
  owner: boolean;
};

export const trainers: Trainer[] = [
  {
    name: "Najam Ali Tariq",
    role: "Owner",
    experience: "10 years experience",
    specialties: ["CrossFit", "Strength", "Full Body Building Training"],
    bio: "Founder of Apex Fit Club. Builds complete transformation plans — strength, conditioning and full body building coaching.",
    whatsapp: "923305966918",
    phoneDisplay: "0330-5966918",
    photo: najamAsset.url,
    owner: true,
  },
  {
    name: "Adeel",
    role: "Manager",
    experience: "7 years experience",
    specialties: ["CrossFit", "Cardio", "Strength", "Kickboxing Specialist"],
    bio: "Manages the training floor and coaches kickboxing, CrossFit and conditioning alongside strength programming.",
    whatsapp: "923335210375",
    phoneDisplay: "0333-5210375",
    photo: adeelAsset.url,
    owner: false,
  },
  {
    name: "Fasih",
    role: "Trainer",
    experience: "5 years experience",
    specialties: [],
    bio: "Floor trainer working one-on-one with members on technique, routine planning and steady progress.",
    whatsapp: "923224052167",
    phoneDisplay: "0322-4052167",
    photo: fasihAsset.url,
    owner: false,
  },
  {
    name: "Arslan",
    role: "Trainer",
    experience: "",
    specialties: ["CrossFit", "Strength"],
    bio: "CrossFit and strength coach for members who want power, conditioning and clean lifting form.",
    whatsapp: "923150428249",
    phoneDisplay: "0315-0428249",
    photo: null,
    owner: false,
  },
];

export const plans = [
  { name: "Admission Fee", price: 1000, note: "One-time, on joining" },
  { name: "Strength Training", price: 2500, note: "Per month" },
  { name: "Cardio", price: 3000, note: "Per month" },
  { name: "Strength + Cardio", price: 5000, note: "Per month", featured: true },
  { name: "Trial (1 Day)", price: 200, note: "Single session" },
  { name: "One-Day Cardio + Gym Pass", price: 400, note: "Single day" },
] as const;

export const offers = [
  "Pay 6 months upfront → get 1 month FREE",
  "Pay 1 year upfront → get 2 months FREE",
] as const;

export const timings = {
  gents: ["6:00 AM – 10:00 AM", "4:00 PM – 1:00 AM"],
  ladies: ["10:00 AM – 4:00 PM"],
} as const;

export const waLink = (number: string, text: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
