import najamAsset from "@/assets/najam.png.asset.json";
import adeelAsset from "@/assets/adeel.png.asset.json";
import fasihAsset from "@/assets/fasih-new.png.asset.json";
import shehzadiAsset from "@/assets/shehzadi.jpg.asset.json";

import cardioTreadmills from "@/assets/gallery/cardio-treadmills.jpg.asset.json";
import cableTraining from "@/assets/gallery/cable-training.jpg.asset.json";
import strengthFloor from "@/assets/gallery/strength-floor.jpg.asset.json";
import boxingZone from "@/assets/gallery/boxing-zone.jpg.asset.json";
import cardioZone from "@/assets/gallery/cardio-zone.jpg.asset.json";
import spinBikes from "@/assets/gallery/spin-bikes.jpg.asset.json";
import cyclingStudio from "@/assets/gallery/cycling-studio.jpg.asset.json";
import strengthMachine from "@/assets/gallery/strength-machine.jpg.asset.json";
import memberLockers from "@/assets/gallery/member-lockers.jpg.asset.json";
import nutritionShelf from "@/assets/gallery/nutrition-shelf.jpg.asset.json";

export const najamUrl = najamAsset.url;

export const MEMBER_STAT = "2500+";

export const GYM = {
  name: "Apex Fit Club",
  email: "apexfitclub@gmail.com",
  whatsapp: "923305966918",
  whatsappDisplay: "0330-5966918",
  address:
    "Opposite 1st Floor Madina Tower, Near Punjab Cash and Carry, Range Road, Rawalpindi",
  mapQuery: "Madina Tower Range Road Rawalpindi Punjab Cash and Carry",
  socials: {
    tiktok: "https://www.tiktok.com/@apexfitclub_official",
    instagram: "https://www.instagram.com/apexfitclub_offical?stkn=ejg2cGt5Zmcwc3N4",
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
  {
    title: "Personal Training",
    desc: "One-on-one coaching built around your goals and schedule.",
    photo: strengthFloor.url,
  },
  {
    title: "Group Fitness Classes",
    desc: "High-energy sessions that keep the whole floor moving.",
    photo: cyclingStudio.url,
  },
  {
    title: "Cardio & CrossFit",
    desc: "Conditioning circuits, treadmills, rowers and functional rigs.",
    photo: cardioTreadmills.url,
  },
  {
    title: "Strength & Machines",
    desc: "Full cable stations, plate machines and a loaded free-weight floor.",
    photo: cableTraining.url,
  },
  {
    title: "Boxing & Kickboxing",
    desc: "Bag work, pad rounds and conditioning on the turf zone.",
    photo: boxingZone.url,
  },
  {
    title: "Spin & Cycling",
    desc: "Indoor cycling bikes for fat loss and endurance sessions.",
    photo: spinBikes.url,
  },
  {
    title: "Nutritional Counseling",
    desc: "Diet plans matched to your training block and budget.",
    photo: nutritionShelf.url,
  },
  {
    title: "Locker Rooms",
    desc: "Clean, secure changing area and lockers for every member.",
    photo: memberLockers.url,
  },
  {
    title: "Cardio Zone",
    desc: "Treadmills, ellipticals and steady-state cardio equipment.",
    photo: cardioZone.url,
  },
  {
    title: "Physiotherapy & Recovery",
    desc: "Injury screening, recovery work and mobility support.",
    photo: strengthMachine.url,
  },
] as const;

export type Trainer = {
  name: string;
  role: string;
  experience: string;
  specialties: string[];
  certifications?: string[];
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
    specialties: ["Strength", "Muscle Gain", "Fat Loss", "Cardio", "CrossFit", "HIIT"],
    bio: "Founder of Apex Fit Club. Builds complete transformation plans — strength, conditioning and full body building coaching.",
    whatsapp: "923305966918",
    phoneDisplay: "0330-5966918",
    photo: najamAsset.url,
    owner: true,
  },
  {
    name: "Adil",
    role: "Manager",
    experience: "7 years experience",
    specialties: [
      "Boxing",
      "Kickboxing",
      "Strength",
      "Cardio",
      "CrossFit",
      "HIIT",
      "Fat Loss",
      "Diet Plan",
    ],
    bio: "Manages the training floor and coaches boxing, kickboxing, CrossFit and conditioning alongside strength programming.",
    whatsapp: "923335210375",
    phoneDisplay: "0333-5210375",
    photo: adeelAsset.url,
    owner: false,
  },
  {
    name: "Fasih",
    role: "Trainer",
    experience: "5 years experience",
    specialties: ["Strength", "Muscle Gain", "Fat Loss"],
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
    specialties: ["Cardio", "Strength", "Muscle Gain", "Full Body Fitness", "Diet Plan"],
    bio: "Coach for members who want power, conditioning, clean lifting form and full body fitness.",
    whatsapp: "923150428249",
    phoneDisplay: "0315-0428249",
    photo: null,
    owner: false,
  },
];

export const ladiesTrainers: Trainer[] = [
  {
    name: "Shehzadi Wafa Waqar",
    role: "Ladies Master Trainer",
    experience: "PSCA Certified — Level I, II & III",
    specialties: ["Get Pro Fitness", "Strength and Cardio"],
    certifications: [
      "PSCA Level I Certified",
      "PSCA Level II (Fitness, Nutrition & Rehabilitation)",
      "PSCA Level III Certified — Master Trainer (Sports Nutrition, Fitness, Gym, Rehabilitation & First Aid)",
    ],
    bio: "Ladies-only master trainer coaching strength, cardio, nutrition and rehabilitation in our private women's hours.",
    whatsapp: "923110091690",
    phoneDisplay: "0311-0091690",
    photo: shehzadiAsset.url,
    owner: false,
  },
];

export const trainersFor = (gender: "male" | "female") =>
  gender === "female" ? ladiesTrainers : trainers;

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
