const ago = (minutes) => new Date(Date.now() - minutes * 60000).toISOString();

// Doctors the patient can message in static mode (ids match data/doctors.js).
export const chatContacts = ["d-rahul-mehta", "d-ananya-sen", "d-priya-nair", "d-kavita-rao", "d-sneha-roy"];

export const seedChats = () => ({
  "d-rahul-mehta": [
    { id: "m1", from: "doctor", text: "Hello! How are you feeling today?", time: ago(185) },
    { id: "m2", from: "me", text: "Much better, the fever is gone. Should I keep taking the vitamin C?", time: ago(180) },
    { id: "m3", from: "doctor", text: "Yes, finish the 7-day course and keep drinking plenty of water.", time: ago(176) },
  ],
  "d-ananya-sen": [
    { id: "m1", from: "doctor", text: "Please share your last week of blood-pressure readings before our next visit.", time: ago(60 * 30) },
  ],
  "d-priya-nair": [
    { id: "m1", from: "doctor", text: "Hi! Send a clear photo of the rash in daylight and I'll take a look.", time: ago(60 * 52) },
  ],
  "d-kavita-rao": [
    { id: "m1", from: "doctor", text: "Welcome. This is a private space - tell me what's on your mind whenever you're ready.", time: ago(60 * 80) },
  ],
  "d-sneha-roy": [
    { id: "m1", from: "doctor", text: "Your reports look normal. Let me know if you have any questions.", time: ago(60 * 120) },
  ],
});

const replies = [
  { match: /thank/i, text: "You're welcome! Let me know if anything changes." },
  { match: /prescri|medicine|tablet|dose/i, text: "I've listed your medicines under Prescriptions. Please follow the dosage written there." },
  { match: /appoint|meeting|book|visit/i, text: "You can book a video consultation from the Services page - pick any time that suits you." },
  { match: /pain|fever|cough|rash|headache/i, text: "Thanks for the details. Keep track of how it changes over the next day, and book a consultation if it gets worse." },
];
const fallbacks = [
  "Noted. I'll review this and get back to you shortly.",
  "Thanks for letting me know. Anything else you'd like to add?",
  "Understood. Let's discuss it in detail during your consultation.",
];
export const cannedReply = (text, count) => replies.find((r) => r.match.test(text))?.text ?? fallbacks[count % fallbacks.length];
