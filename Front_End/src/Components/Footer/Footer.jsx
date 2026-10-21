import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/MedicoAI.png";

const columns = [
  { title: "Shop", links: [["Products", "/products"], ["Your cart", "/user/cart"], ["Prescriptions", "/user/precriptions"]] },
  { title: "Care", links: [["Find a doctor", "/services"], ["Meetings", "/user/meetings"], ["Chats", "/user/chats"]] },
  { title: "Account", links: [["Login", "/login"], ["Sign up", "/signup"], ["Dashboard", "/user/dashboard"], ["Notifications", "/user/notifications"]] },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true); // demo only: nothing is sent anywhere
    setEmail("");
  };

  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-start lg:gap-8">
          <img src={logo} className="mr-3 h-10 w-auto" alt="Medisync logo" />

          <div className="mt-8 grid grid-cols-2 gap-8 lg:mt-0 lg:grid-cols-6 lg:gap-y-16">
            <div className="col-span-2">
              <h2 className="text-2xl font-bold text-white">Health tips, in your inbox</h2>
              <p className="mt-4 text-gray-400">Seasonal health advice and offers from Medisync. Unsubscribe at any time.</p>
            </div>

            <div className="col-span-2 lg:col-span-4 lg:flex lg:items-end">
              <form className="w-full" onSubmit={subscribe}>
                <div className="relative max-w-lg">
                  <label className="sr-only" htmlFor="footer-email">Email</label>
                  <input
                    className="w-full rounded-full border-gray-200 outline-none bg-gray-100 p-4 pe-32 text-sm font-medium"
                    id="footer-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setDone(false); }}
                  />
                  <button type="submit" className="absolute end-1 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700">
                    Subscribe
                  </button>
                </div>
                {done && <p className="mt-2 text-sm text-green-400" role="status">Thanks! You&apos;re on the list.</p>}
              </form>
            </div>

            {columns.map((col) => (
              <div key={col.title} className="col-span-2 sm:col-span-1">
                <p className="font-medium text-white">{col.title}</p>
                <ul style={{ listStyle: "none" }} className="mt-6 space-y-4 text-sm">
                  {col.links.map(([label, to]) => (
                    <li key={to}>
                      <Link to={to} className="text-gray-200 transition hover:opacity-75">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Medisync. Information on this site is not a substitute for professional medical advice.
            In an emergency call your local emergency number (112 in India).
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
