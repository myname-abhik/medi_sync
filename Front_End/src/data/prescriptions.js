// Sample prescriptions shown to every account in static mode. productId values refer to data/products.js
const day = (n) => new Date(Date.now() - n * 86400000).toISOString();

const prescriptions = [
  {
    id: "rx-2041",
    doctorId: "d-rahul-mehta",
    date: day(3),
    diagnosis: "Seasonal viral fever",
    notes: "Rest, drink plenty of fluids and review after 3 days if the fever persists.",
    items: [
      { productId: "p-paracetamol", dosage: "1 tablet every 6 hours after food", duration: "3 days" },
      { productId: "p-vitamin-c", dosage: "1 effervescent tablet in a glass of water", duration: "7 days" },
      { productId: "p-thermometer", dosage: "Check temperature morning and evening", duration: "Until recovered" },
    ],
  },
  {
    id: "rx-1987",
    doctorId: "d-ananya-sen",
    date: day(21),
    diagnosis: "Routine blood-pressure monitoring",
    notes: "Record readings at the same time every day and bring the log to your next visit.",
    items: [
      { productId: "p-bp-monitor", dosage: "Measure while seated, after 5 minutes of rest", duration: "Daily" },
      { productId: "p-multivitamin", dosage: "1 capsule after breakfast", duration: "30 days" },
    ],
  },
  {
    id: "rx-1850",
    doctorId: "d-sourav-ghosh",
    date: day(58),
    diagnosis: "Dry, irritated eyes",
    notes: "Reduce screen time and take a 20-second break every 20 minutes.",
    items: [{ productId: "p-eye-drops", dosage: "1-2 drops in each eye, 3 times a day", duration: "10 days" }],
  },
];

export default prescriptions;
