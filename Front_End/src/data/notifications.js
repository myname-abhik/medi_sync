const ago = (minutes) => new Date(Date.now() - minutes * 60000).toISOString();

// First-run notifications for a new account.
export const seedNotifications = (name = "there") => [
  { id: "n-welcome", type: "info", title: `Welcome to Medisync, ${name.split(" ")[0]}!`, body: "Browse medicines, book a doctor or ask the assistant a quick health question.", time: ago(5), read: false },
  { id: "n-profile", type: "info", title: "Complete your profile", body: "Add your phone number and address on the dashboard so doctors and deliveries can reach you.", time: ago(60), read: false },
  { id: "n-offer", type: "offer", title: "Use code MEDI10 for 10% off", body: "Apply it in your cart on any order.", time: ago(60 * 26), read: true },
];
