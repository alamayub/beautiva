# Salonline.in — Premium Beauty & Salon E-commerce Platform

A modern, production-grade React web platform reconstructing **Salonline.in** (operated by Sitkan Enterprises, Lucknow) with a high-end editorial beauty aesthetic and service-discovery hierarchy inspired by leading at-home salon platforms.

---

## 💎 Features & Capabilities

1. **Brand Identity & Real Business Offerings**:
   - Preserves Salonline's genuine catalog: VLCC Facial Packages, Lotus WhiteGlow, ALL IN 1 Package, Blossom Aroma Magic, SARA Green Apple, Korean Glass-Skin, O3+ Glowing Treatment, HD Party & Bridal Artistry.
   - Genuine verified pricing, original crossed-out prices, and up to 43% savings.
   - Operating across **Lucknow, Patna, Kanpur, Gorakhpur, and Varanasi**.
   - Preserves authentic corporate data: Sitkan Enterprises, Faizabad Road, Chinhat, Lucknow, UP – 226028.

2. **Service Discovery & Clean Navigation**:
   - Category navigation: Facials & Skincare, Hair Spa & Styling, Waxing & Grooming, Mani-Pedi & Nails, Bridal & Pre-Bridal.
   - Dedicated Brand Showcase: VLCC, Lotus Herbals, Blossom Kochhar, SARA, O3+, नारी (Nari), and L'Oréal Professionnel.
   - Global search with live autocomplete and multi-field matching.

3. **Client-Side E-Commerce Flow**:
   - Redux Toolkit store with `cartSlice`, `wishlistSlice`, and `authSlice`.
   - RTK Query API layer with typed endpoints for products, categories, brands, and order generation.
   - Slide-over cart drawer and dedicated full-page cart.
   - Complete checkout with React Hook Form + Zod validation, preferred appointment slot picker, and cash/UPI pay-after-service model.

4. **Professional Operations & Fleet Management Dashboard (`/admin` & `/dashboard`)**:
   - **Dedicated Workspace**: Independent operational layout with a 260px dark navigation sidebar, regional city selector (Lucknow, Patna, Kanpur, Gorakhpur, Varanasi), real-time alerts, and instant storefront switcher.
   - **Live Dispatch & Bookings Ledger (`/admin/bookings`)**: High-density interactive table, status workflow (`Pending` → `Assigned` → `In Transit` → `In Progress` → `Completed`), verified stylist assignment, customer details inspector, and CSV ledger export.
   - **Stylist Fleet & Partner Roster (`/admin/stylists`)**: Roster of female beauticians with ratings, monthly earnings, completed trips, police verification, academy certification, duty status switcher, and new beautician onboarding modal.
   - **Sealed Kit & Consumables Inventory (`/admin/inventory`)**: Real-time buffer monitoring for mono-dose packs (VLCC, Lotus, O3+, SARA, Rica wax, sanitary rolls) with low-stock warnings and shipment receiving actions.
   - **Beauty School Academy (`/admin/academy`)**: Vocational trainee pipeline, practical apprenticeship hours tracking, and doorstep fleet placement rates.
   - **Regional City Analytics (`/admin/analytics`)**: CSAT metrics (4.92★), dispatch latency, repeat appointment frequencies (68%), and city volume breakdown.

4. **Academy & Career Portals**:
   - **Salonline Beauty School**: Accredited diploma programs in Cosmetology, Advanced Bridal Makeup, Hair Technology, and Nail Art.
   - **Stylist Careers**: Transparent onboarding portal for women beauty professionals earning ₹35,000–₹50,000/month.

5. **Customer & Corporate Content**:
   - Customer stories and testimonials from Lucknow, Patna, and Kanpur.
   - FAQ accordions addressing at-home hygiene, sealed mono-dose kits, and background verification.
   - Complete legal pages: Privacy Policy, Terms of Sale, Terms of Use, Reports Abuse & Takedown.
   - Beauty and skincare advice blog with detailed editorial guides.

---

## 🛠️ Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 with custom editorial font pairings (Plus Jakarta Sans & Playfair Display)
- **Routing**: React Router DOM (v7)
- **State Management**: Redux Toolkit & RTK Query
- **Animation**: Motion / Framer Motion
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form with Zod schema validation
- **Notifications**: Custom animated ToastProvider
