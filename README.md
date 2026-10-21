# Medisync

Online pharmacy and doctor-consultation web app: browse and order medicines, book video consultations, chat with doctors, and keep prescriptions and notifications in one place.

**Stack:** React 18 + Vite, Redux Toolkit, React Router, Tailwind (footer) and CSS modules · Express + MongoDB (Mongoose) + Cloudinary · optional ZegoCloud video.

## Quick start

```bash
cd Front_End
npm install
npm run dev        # http://localhost:5173
```

## Automatic mode: backend when available, static data when not

By default (`VITE_USE_STATIC` unset or `auto`) the website decides at runtime:

- **Backend reachable and its database connected** -> products, doctors, signup/login and profile updates use the API.
- **Otherwise** -> everything falls back to the built-in static data and `localStorage`, so the site never breaks.

The check calls `GET VITE_API_URL` (default `http://localhost:8000/`), is cached for 10 seconds and is repeated after a failed request, so starting or stopping the backend is picked up without restarting the frontend. The browser console says which mode is active. Set `VITE_USE_STATIC=true` to force static or `false` to force the API.

| Feature | Backend available | Backend not available |
|---|---|---|
| Products, doctors | database | `src/data/*.js`, `public/images/**` |
| Accounts, login, profile | bcrypt + JWT, Cloudinary avatar | `localStorage` (demo only, unhashed) |
| Cart, meetings, notifications, chats | `localStorage`, per user | same |
| Prescriptions | `src/data/prescriptions.js` | same |
| Video call | ZegoCloud if keys are set, else simulated | simulated |
| Health assistant | Chatbase if an id is set, else built-in | built-in |

Demo login (offline): `demo@medisync.com` / `demo1234`. Promo codes: `MEDI10` (10%), `HEALTH20` (20%). Accounts created while the backend was offline keep working after it comes back.

## Running the backend

```bash
cd Backend
cp .env.example .env     # fill in MONGO_URI, JWT_SECRET and ADMIN_KEY (Cloudinary is optional)
npm install
npm run seed             # loads the sample products and doctors
npm run dev              # http://localhost:8000
```

Nothing to change in the frontend: as soon as the backend is up and the page is refreshed, the website uses it. If `CLIENT_ORIGIN` is set in `Backend/.env`, it must match the exact address of the website (including the port), otherwise the browser blocks the check and the site stays in static mode.

## Admin panel (add data through API requests)

With the backend running, open **http://localhost:8000/admin** and enter the `ADMIN_KEY` from `Backend/.env`.

- **Products / Doctors:** add, edit and delete. The image can be a URL, a site path such as `/images/products/paracetamol.svg`, or an uploaded file (needs Cloudinary).
- **Users:** read-only list (passwords are never returned).
- Every form shows the exact API request and a ready-to-copy `curl` command.

The same endpoints can be called directly. All need the header `x-admin-key: <ADMIN_KEY>`:

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/admin/check`, `/stats` | verify the key, counts |
| GET / POST | `/api/v1/admin/products`, `/doctors` | list / create |
| PUT / DELETE | `/api/v1/admin/products/:id`, `/doctors/:id` | update / delete |
| GET | `/api/v1/admin/users` | list users |

```bash
curl -X POST http://localhost:8000/api/v1/admin/products \
  -H "x-admin-key: $ADMIN_KEY" -H "Content-Type: application/json" \
  -d '{"title":"Cetirizine 10mg","description":"Allergy relief","price":3.5,"discount":10,"category":"Allergy","storeName":"Medisync Pharmacy","storeId":"store-001","image":"https://example.com/c.png"}'
```

Set `FRONTEND_URL` so the panel can preview `/images/...` paths. Products and doctors you add appear on the website after a refresh whenever the backend is available. If `ADMIN_KEY` is empty, all admin endpoints are disabled.

## Preview build

`Front_End/vite.preview.config.js` builds the whole site into one HTML file (hash routing, storage-backed session) for hosting on a static page: `VITE_HASH_ROUTER=true npx vite build -c vite.preview.config.js`.

## Scripts (Front_End)

`npm run dev` · `npm run build` · `npm run lint` · `npm test` (unit tests + a full user-flow test in jsdom)

## Project layout

```
Front_End/src
  data/        static products, doctors, chats, prescriptions, notifications, assistant
  services/    auth, catalog, session, storage (static vs. API switch lives here)
  redux/       user, cart, meetings, notifications (+ per-user localStorage persistence)
  pages/ Components/ css/
Front_End/public/images   product and doctor illustrations
Backend/       Express API (controllers, routes, middleware, models, seed)
```

## Security notes

The original repository contained live MongoDB, Cloudinary and ZegoCloud credentials and a JWT secret in source. They have been moved to environment variables, but **they remain in your git history: rotate them** (MongoDB user password, Cloudinary API secret, ZegoCloud server secret) and use a new `JWT_SECRET`.
