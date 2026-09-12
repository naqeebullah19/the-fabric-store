# The Fashion Store  Women's Clothing E-Commerce (MERN)

A production-style clone/upgrade of thefabricstore.pk, built with the MERN stack
(MongoDB, Express, React, Node.js) per the 25-day development plan. This package
contains the full, working codebase for every phase of that plan you just need to
add your own MongoDB Atlas and Cloudinary credentials and run it.

## What's included

**Backend** (`/backend`)  Node.js + Express + MongoDB (Mongoose)
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

**Frontend** (`/frontend`) React (Vite) + Tailwind CSS + React Router
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
- Full wishlist, star-rating reviews, and real-time stock/out-of-stock display
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
- After running `npm run seed`, log in as the super-admin using the email/password
  you set in `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` (defaults to
  `admin@tfsclone.com` / `ChangeMe123!`  change this immediately).



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


