# The Fashion Store — Women's Clothing E-Commerce (MERN)

A production-style clone/upgrade of thefabricstore.pk, built with the MERN stack
(MongoDB, Express, React, Node.js) per the 25-day development plan. This package
contains the full, working codebase for every phase of that plan — you just need to
add your own MongoDB Atlas and Cloudinary credentials and run it.

## What's included

**Backend** (`/backend`) — Node.js + Express + MongoDB (Mongoose)
- JWT authentication with bcrypt password hashing and role-based access control
  (customer / admin / superadmin)
- Product & category CRUD with Cloudinary image uploads and stock-tracked variants
  (size/color)
- Cart, checkout, and order management with a status pipeline
  (Pending → Processing → Shipped → Delivered)
- Full-text product search (MongoDB text index) with size/color/price filters and sorting
- Wishlist and star-rating product reviews
- Admin API: dashboard stats, product/order/category management, super-admin can
  create new admin accounts
- Seed script that populates categories + ~30 sample products modeled on a real
  unstitched/pret/formal/shawl catalog, plus a super-admin account

**Frontend** (`/frontend`) — React (Vite) + Tailwind CSS + React Router
- Header/footer matching the plan's nav (Sale, Unstitched, Ready To Wear, Formal,
  Shawl, New Arrivals) with mobile hamburger menu
- Home page: hero banners, category grid, featured & best-seller sections
- Category pages with size/price filters and sorting, paginated grid
- Product detail page: image gallery, size/color selector, add-to-cart, tabs for
  details + reviews
- Cart, checkout (COD), order history with a visual status tracker
- Wishlist with heart-icon toggling from any product card
- Full admin panel: dashboard, product manager (with image upload), order manager
  (status updates), category manager, super-admin "create admin" screen
- Loading skeletons, empty states, toast notifications, mobile-responsive throughout

## Improvements over the reference site
- Full wishlist, star-rating reviews, and real-time stock/out-of-stock display —
  all missing on the reference site
- Multi-filter product browsing (size + price + sort) combined in one view
- Fast MongoDB full-text search instead of a slow catalog crawl
- A real admin dashboard with revenue/order analytics and role-based admin creation
- JWT + bcrypt + rate limiting, input validation, and RBAC baked in from day one

## Getting started

### 1. Backend
```bash
cd backend
cp .env.example .env       
npm install
npm run seed               
npm run dev                  
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env       
npm install
npm run dev                
```

### 3. Credentials you need to supply
- **MongoDB Atlas**: create a free cluster at https://cloud.mongodb.com, grab the
  connection string, put it in `backend/.env` as `MONGO_URI`.
- **Cloudinary**: create a free account at https://cloudinary.com, grab your cloud
  name/API key/secret from the dashboard, put them in `backend/.env`.
- **Google Sign-In**: create a Google OAuth web client in Google Cloud Console. Set
  `VITE_GOOGLE_CLIENT_ID` in `frontend/.env` and `GOOGLE_CLIENT_ID` in `backend/.env`
  to the same client ID. Add your local and deployed frontend origins to the OAuth
  client's authorized JavaScript origins.
- After running `npm run seed`, log in as the super-admin using the email/password
  you set in `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` (defaults to
  `admin@tfsclone.com` / `ChangeMe123!` — change this immediately).

### 4. Deployment on Vercel
- **Multi-service Vercel deployment**: import the repository root. The root
  `vercel.json` defines the Vite frontend service, the Node backend service, and
  routes `/api/*` to the backend while sending all other paths to the frontend.
- Set `VITE_API_URL` to `/api` in the Vercel frontend environment so browser
  requests use the same Vercel domain and the service rewrite handles them.
- Set the backend environment variables from your local `backend/.env` in Vercel,
  including MongoDB, Cloudinary, JWT, and `CLIENT_URL`.
- Set `CLIENT_URL` to the deployed Vercel URL, then redeploy after changing
  environment variables. Do not use the local `frontend/.env` value in production.

## Project structure
```
tfs-clone/
├── backend/
│   ├── config/          # DB + Cloudinary connection
│   ├── controllers/     # Route handler logic
│   ├── middleware/       # auth, RBAC, error handling, file upload
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routers
│   ├── utils/seed.js     # Sample data seeder
│   └── server.js
└── frontend/
    └── src/
        ├── api/           # axios client
        ├── components/    # Header, Footer, ProductCard, etc.
        ├── context/        # Auth + Cart state
        ├── pages/          # Home, Category, ProductDetail, Cart, Checkout, etc.
        └── pages/admin/    # Admin dashboard, product/order/category managers
```

## Notes
- Placeholder product photos (picsum.photos) are used in the seed data — replace
  them by uploading real photos through the admin panel (they'll go to Cloudinary).
- Shipping is free above Rs. 3,000 and Rs. 250 otherwise, matching the reference
  site's promo banner — adjust `SHIPPING_FEE`/`FREE_SHIPPING_THRESHOLD` in
  `backend/controllers/orderController.js` as needed.
- This was generated as a complete starter codebase, not a tested/deployed app —
  run `npm install` in both folders and fix any dependency-version hiccups as they
  come up before going to production.
