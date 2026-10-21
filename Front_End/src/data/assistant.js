// Offline answers for the floating health assistant (static mode). These are general wellness
// tips, not medical advice - the assistant always points people to a doctor.
export const GREETING = "Hi! I'm the Medisync assistant. Ask me about common symptoms, our medicines or how to book a doctor.";

export const QUICK_REPLIES = ["I have a fever", "Book a doctor", "Find medicines", "Cough and cold"];

const EMERGENCY = /chest pain|can'?t breathe|cannot breathe|difficulty breathing|unconscious|severe bleeding|stroke|suicid|overdose/i;

const RULES = [
  { match: /fever|temperature/i, text: "For a mild fever: rest, drink plenty of fluids and check your temperature regularly. If it stays above 39 °C, lasts more than 3 days, or comes with a rash or stiff neck, see a doctor. You can find thermometers and fever tablets under Products." },
  { match: /cough|cold|sore throat|flu/i, text: "Warm fluids, rest and steam inhalation help most colds. A cough lasting more than 2 weeks, or with breathlessness, needs a doctor's review. Our herbal cough syrup and vitamin C are in Products." },
  { match: /head ?ache|migraine/i, text: "Rest in a quiet, dark room and stay hydrated. See a doctor if headaches are sudden and severe, follow an injury, or come with vision changes." },
  { match: /book|appoint|doctor|consult|meeting/i, text: "Open Services, choose a doctor marked Available and pick a date and time. Your booking appears under Meetings, where you can join the call." },
  { match: /medicine|tablet|product|buy|order|cart/i, text: "Head to Products to search by name or category. Add items to your cart, apply a promo code such as MEDI10 and check out." },
  { match: /prescri/i, text: "Your prescriptions are under Prescriptions in the profile menu. You can reorder every medicine on one with a single click." },
  { match: /hello|hi|hey/i, text: "Hello! What can I help you with today?" },
  { match: /thank/i, text: "Happy to help! Stay healthy." },
];

export const assistantReply = (input) => {
  if (EMERGENCY.test(input)) {
    return "This could be an emergency. Please call your local emergency number now (112 in India) or go to the nearest hospital. Don't wait for an online reply.";
  }
  const rule = RULES.find((r) => r.match.test(input));
  return rule ? rule.text : "I can help with general questions, but I can't diagnose. For personal medical advice, book a consultation from the Services page.";
};
