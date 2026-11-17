// Deterministic seed data: 36 mock profiles. A fixed subset has "already liked"
// the logged-in user (`likesMe`). That flag is SERVER-ONLY and is stripped
// before any profile is sent to the client (see publicProfile in lib/db.js).

const PEOPLE = [
  ["Aanya", 21, "Delhi University"], ["Kabir", 23, "IIT Delhi"], ["Meera", 20, "Christ University, Bengaluru"],
  ["Rohan", 22, "BITS Pilani"], ["Ishita", 24, "Mumbai"], ["Arjun", 21, "NIT Trichy"],
  ["Sana", 22, "Jamia Millia Islamia"], ["Vihaan", 25, "Pune"], ["Diya", 20, "Ashoka University"],
  ["Kunal", 23, "IIIT Hyderabad"], ["Naina", 21, "Symbiosis, Pune"], ["Aditya", 24, "Gurugram"],
  ["Tara", 22, "St. Stephen's College"], ["Dev", 21, "VIT Vellore"], ["Riya", 23, "Jaipur"],
  ["Samar", 22, "IIM Indore"], ["Anika", 20, "Manipal University"], ["Yash", 25, "Chandigarh"],
  ["Zoya", 21, "Lady Shri Ram College"], ["Neil", 23, "IISc Bengaluru"], ["Pooja", 22, "Lucknow"],
  ["Ayaan", 21, "Amity University, Noida"], ["Kiara", 24, "Kolkata"], ["Harsh", 22, "IIT Bombay"],
  ["Myra", 20, "Presidency University"], ["Veer", 23, "SRCC, Delhi"], ["Tanvi", 21, "Nagpur"],
  ["Ishaan", 22, "DTU Delhi"], ["Sia", 23, "Goa"], ["Reyansh", 24, "Ahmedabad"],
  ["Avni", 20, "Miranda House"], ["Mihir", 22, "IIT Kanpur"], ["Kavya", 21, "Chennai"],
  ["Parth", 23, "Indore"], ["Leela", 22, "Mount Carmel, Bengaluru"], ["Aarav", 24, "Meerut"],
];

const BIOS = [
  "Will trade my last samosa for a good book recommendation.",
  "Weekend trekker, weekday overthinker.",
  "Chai first, opinions later.",
  "Building side projects that never quite ship. Yet.",
  "Looking for someone who laughs at their own jokes too.",
  "Probably at a gig or asleep. No in-between.",
  "Film school dropout turned cinephile. Ask me about Satyajit Ray.",
  "Fluent in sarcasm and mediocre Spanish.",
  "Marathon-in-progress. Currently at the 'why am I doing this' mile.",
  "Introvert with a loud playlist.",
  "Cooks better than I look. Dishes not included.",
  "Cricket on the terrace, always.",
];

const INTERESTS = [
  "Photography", "Hiking", "Coffee", "Indie music", "Stand-up comedy", "Chess", "Football", "Cricket",
  "Reading", "Cooking", "Anime", "Travel", "Gaming", "Yoga", "Startups", "Street food", "Poetry",
  "Cinema", "Dancing", "Podcasts", "Badminton", "Sketching", "Road trips", "Open mics",
];

// Indexes of profiles that have already liked the user (9 of 36).
// Spread through the deck so matches happen early *and* late in a demo.
const LIKES_ME = new Set([1, 3, 6, 9, 14, 19, 23, 27, 33]);

export function buildSeed() {
  const profiles = PEOPLE.map(([name, age, city], i) => {
    const n = 3 + (i % 3);
    const interests = Array.from({ length: n }, (_, k) => INTERESTS[(i * 5 + k * 7) % INTERESTS.length]);
    return {
      id: `p${i + 1}`,
      name,
      age,
      city,
      bio: BIOS[i % BIOS.length],
      interests: [...new Set(interests)],
      photo: `/api/photo/p${i + 1}?n=${encodeURIComponent(name)}`,
      likesMe: LIKES_ME.has(i),
    };
  });
  return { profiles, swipes: [], matches: [] };
}
