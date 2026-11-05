export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  contextMode?: 'website' | 'dashboard';
  actions?: Array<{
    label: string;
    url?: string;
    onClickPrompt?: string;
  }>;
}

export const BEAUTIVA_SYSTEM_PROMPT = `You are "Beautiva AI Concierge & Operations Copilot", the intelligent assistant for Beautiva (beautiva.in).
Beautiva is India's leading on-demand luxury at-home salon, beauty & academy platform.

Key Information about Beautiva:
1. Operations & Locations:
- Operating Cities: Lucknow (Chinhat HQ, Gomti Nagar, Aliganj, Hazratganj, Indira Nagar, Krishna Vihar), Patna (Patliputra, Boring Road, Bailey Road, Kankarbagh), Kanpur (Swaroop Nagar, Civil Lines), Gorakhpur (Golghar, Taramandal), and Varanasi (Sigra, Cantt).
- Working Hours: 07:00 AM to 08:30 PM, 7 days a week.
- Average doorstep arrival time: 60 to 90 minutes from booking confirmation.

2. Safety & Hygiene Standards:
- 100% Single-use sealed mono-dose kits opened in front of the customer.
- 100% police-verified and background-checked female beauticians.
- Strict hygiene protocols: Sanitized tools, disposable bedsheets, headbands, gloves, disposable wooden spatulas, and post-service waste cleanup.

3. Key Categories & Pricing:
- Facials & Skincare:
  * VLCC Insta Glow Facial Package: ₹996 (75 mins, includes Face & Neck Bleach + Eyebrow shaping)
  * Lotus WhiteGlow Skin Whitening: ₹1,090 (90 mins, includes Bleach + Threading)
  * O3+ Seaweed Deep Purifying Facial: ₹2,199 (75 mins, best for acne/oily skin)
  * O3+ Bridal Glow Luxury Facial: ₹2,499 (90 mins, 24K gold & brightening essence)
  * Diamond Anti-Tan Cleanup: ₹799 (45 mins)
- Waxing & Grooming:
  * Rica White Chocolate Liposoluble Wax (Full Arms + Full Legs + Underarms): ₹1,299 (painless, colophony-free)
  * Honey Wax (Full Arms + Full Legs + Underarms): ₹699
  * Bikini Rica Wax: ₹999
- Hair Services & Spa:
  * L'Oréal Mythic Oil Nourishing Hair Spa: ₹1,299 (60 mins, includes scalp massage + steam + blowdry)
  * L'Oréal Keratin Hair Mask Infusion: ₹1,799 (75 mins, frizz control)
- Manicure & Pedicure:
  * SARA Crystal Pedicure & Foot Reflexology: ₹899 (60 mins)
  * O3+ Luxury Spa Manicure & Pedicure Combo: ₹1,599 (90 mins)
- Bridal & Pre-Bridal:
  * Pre-Bridal Radiance 3-Session Package: ₹7,999 (full body polishing, O3+ facial, hair spa, rica wax)
  * Royal Bridal HD Airbrush Makeup: ₹14,999 (HD airbrush, hairstyling, sari draping, premium lashes)
  * Celebrity Party Glam HD Makeup: ₹3,499 (hairstyling + HD makeup + draping)

4. Beautiva Beauty School / Academy:
- Diploma in Professional Cosmetology: 6 months, ₹38,000, 100% placement guarantee into Beautiva fleet or partner salons.
- Advanced Bridal & HD Airbrush Artistry: 3 months, ₹25,000.
- Hair Tech & Chemical Treatments: 6 weeks, ₹15,000.
- Campus Centers in Lucknow (Chinhat HQ) and Patna (Patliputra).

5. Dashboard & Operations Knowledge:
- Live Bookings: SL-94821 (Kavita Mehrotra, Gomti Nagar Lucknow, O3+ Bridal Glow, ₹2,499, In Transit by Ritu Verma), SL-94822 (Ananya Verma, Patliputra Patna, Rica Waxing Package, ₹1,299, Assigned to Priya Saxena), SL-94823 (Pooja Sharma, Aliganj Lucknow, L'Oreal Hair Spa, ₹1,299, Pending dispatch), SL-94824 (Sneha Kulkarni, Civil Lines Kanpur, Pre-Bridal Package, ₹7,999, In Progress by Meena Kumari).
- Fleet Status: 48 active verified stylists, 4.9 average rating.
- Inventory Status: O3+ Whitening kits at 38 units (reorder threshold 50), Rica White Chocolate Wax at 18 cans (Critical reorder alert), Disposable Towel packs at 340 units.
- Dispatch SLA: Order Received -> Hub Coordinator assigns nearest on-duty stylist -> Sealed kit checked out via barcode -> Doorstep transit -> In-home sanitized treatment -> OTP verification & feedback.

Tone and Style:
- Warm, professional, polished, and polite.
- Use formatting (bullet points, bold highlights, concise pricing) to make answers scannable.
- Provide actionable next steps or direct package suggestions.
- If asked about operational questions (bookings, fleet, inventory), provide precise, realistic dashboard details.`;

export const QUICK_PROMPTS_WEBSITE = [
  'Recommend a glow facial for sensitive skin',
  'What sealed kits do you use for waxing?',
  'What is included in the Pre-Bridal package?',
  'Which cities do you provide doorstep salon in?',
  'What are the course fees for Beauty School?',
  'How do I book an appointment?',
];

export const QUICK_PROMPTS_DASHBOARD = [
  'What is the status of booking SL-94821?',
  'Show critical inventory stock alerts',
  'List available stylists in Lucknow hub',
  'What is our fleet utilization today?',
  'How many students are enrolled in Cosmetology?',
  'Explain the stylist dispatch workflow',
];

export function generateSmartLocalResponse(
  query: string,
  contextMode: 'website' | 'dashboard' = 'website'
): { text: string; actions?: Array<{ label: string; url?: string; onClickPrompt?: string }> } {
  const q = query.toLowerCase().trim();

  // 1. Booking Lookup
  if (q.includes('sl-94821') || (q.includes('94821') && q.includes('booking'))) {
    return {
      text: `### 📋 Booking Details: **#SL-94821**\n\n* **Customer:** Kavita Mehrotra\n* **Service:** O3+ Bridal Glow Luxury Facial\n* **Amount:** ₹2,499 (Paid via UPI on Spot)\n* **Location:** Flat 402, Rohtas Presidential Arcade, Gomti Nagar, Lucknow\n* **Slot:** Today, 02:30 PM – 04:00 PM\n* **Assigned Stylist:** **Ritu Verma** (Rating: 4.9 ★, Police Verified)\n* **Live Status:** 🛵 **In Transit** (ETA 12 mins)\n* **Active Kit Batch:** \`O3-GLOW-2026-08\` (Sealed mono-dose pouch verified at Chinhat Hub).\n\nCustomer was notified via SMS. Stylist is equipped with sanitized PPE and mobile steam device.`,
      actions: [
        { label: 'View in Admin Bookings', url: '/admin/bookings' },
        { label: 'Check Stylist Profile', url: '/admin/stylists' },
      ],
    };
  }

  if (q.includes('sl-94822') || (q.includes('94822'))) {
    return {
      text: `### 📋 Booking Details: **#SL-94822**\n\n* **Customer:** Ananya Verma\n* **Service:** Rica Waxing Package (Full Arms, Legs & Underarms)\n* **Amount:** ₹1,299 (Cash on Delivery)\n* **Location:** 14-B Patliputra Colony, Patna\n* **Slot:** Today, 03:00 PM – 04:15 PM\n* **Assigned Stylist:** **Priya Saxena** (Rating: 4.85 ★)\n* **Live Status:** 🟡 **Assigned** (Departing Patliputra Hub shortly)\n* **Active Kit Batch:** \`RICA-WHT-9821\` (Hypoallergenic White Chocolate Italian Wax).`,
      actions: [{ label: 'Open Bookings Console', url: '/admin/bookings' }],
    };
  }

  // 2. Facial Recommendations
  if (q.includes('facial') || q.includes('glow') || q.includes('skin') || q.includes('acne') || q.includes('tan')) {
    if (q.includes('acne') || q.includes('oily')) {
      return {
        text: `### 🌿 Best Facial for Acne & Oily Skin: **O3+ Seaweed Purifying Facial**\n\nFor oily, acne-prone, or congested skin, our dermatologically curated **O3+ Seaweed Treatment** is the gold standard:\n\n* **Price:** ₹2,199 (Save 35% on package)\n* **Duration:** 75 Minutes\n* **Key Benefits:** Regulates sebum, deeply clears clogged pores, calms inflammation with algae extracts, and prevents breakout recurrences.\n* **Inclusions:** Antibacterial tea tree wash, ultrasound pore extraction, seaweed rubber mask, and purifying dermal infusion.\n* **Hygiene Guarantee:** Single-use sealed mono-dose sachet unsealed at your dressing table.`,
        actions: [
          { label: 'Book O3+ Facial', url: '/services/facials-skincare' },
          { label: 'View All Facials', url: '/services' },
        ],
      };
    }

    if (q.includes('sensitive')) {
      return {
        text: `### 🌸 Facial for Sensitive Skin: **VLCC Rose & Fruit Calming Glow**\n\nFor reactive or easily irritated skin:\n\n* **Price:** ₹996 (Includes Face & Neck Bleach/De-Tan alternative + Eyebrows)\n* **Duration:** 75 Minutes\n* **Why It Works:** Uses calming aloe vera, pure rose water, and gentle botanical extracts without harsh astringents or artificial fragrances.\n* **Safety Protocol:** Our certified beautician performs a 2-minute patch test before proceeding.`,
        actions: [{ label: 'Book VLCC Package', url: '/package/vlcc-facial-package' }],
      };
    }

    return {
      text: `### ✨ Beautiva Premium Facial Repertoire\n\nHere are our top recommended doorstep facial therapies:\n\n1. **O3+ Bridal Glow Luxury Facial (₹2,499)**\n   * Best for: Weddings, receptions & high-glam radiance.\n   * Features: 24K gold foil infusion, glycolic peel, oxygen booster serum.\n\n2. **Lotus WhiteGlow Skin Whitening Package (₹1,090)**\n   * Best for: Sun tan removal, dullness & uneven pigmentation.\n   * Includes: 6-step yogurt enzyme treatment + face & neck bleach + threading.\n\n3. **VLCC Insta Glow Facial Package (₹996)**\n   * Best for: Monthly rejuvenation & instant hydration.\n   * Best Seller with over 14,000+ happy clients in UP & Bihar.\n\nAll facials use **100% genuine sealed mono-dose kits** unsealed directly in your room.`,
      actions: [
        { label: 'Explore All Facials', url: '/services/facials-skincare' },
        { label: 'Book VLCC Package (₹996)', url: '/package/vlcc-facial-package' },
      ],
    };
  }

  // 3. Waxing & Rica
  if (q.includes('wax') || q.includes('rica') || q.includes('bikini') || q.includes('hair removal')) {
    return {
      text: `### 🍯 Beautiva Hygienic Waxing Treatments\n\nWe provide painless, colophony-free waxing using authentic Italian **Rica Liposoluble Wax**:\n\n* **Rica White Chocolate Package (₹1,299)**: Full Arms + Full Legs + Underarms. Enriched with cocoa butter and titanium dioxide to reduce redness and pull hair from the root with minimal discomfort.\n* **Honey Soft Waxing Combo (₹699)**: Full Arms + Full Legs + Underarms. Quick, hygienic, and budget-friendly.\n* **Rica Bikini Line / Brazilian (₹999)**: Performed exclusively by senior certified female specialists with single-use pre-wax sanitizers and soothing post-wax lotions.\n\n**Hygiene Guarantee:** Never any double-dipping! We use disposable wooden spatulas and single-use cartridge strips.`,
      actions: [
        { label: 'View Waxing Services', url: '/services/waxing-grooming' },
        { label: 'Book Rica Package (₹1,299)', url: '/package/rica-waxing-package' },
      ],
    };
  }

  // 4. Bridal Packages
  if (q.includes('bridal') || q.includes('wedding') || q.includes('makeup') || q.includes('pre-bridal')) {
    return {
      text: `### 👰 Bespoke Bridal & Occasion Artistry\n\nBeautiva offers comprehensive bridal solutions at your residence or wedding venue:\n\n1. **Pre-Bridal Radiance 3-Session Package (₹7,999)**\n   * **Session 1:** Full body chocolate polishing + Deep scalp hair spa + Full Rica waxing.\n   * **Session 2:** Sara Crystal Deluxe Mani-Pedi + Eye contour treatment.\n   * **Session 3 (2 days before wedding):** O3+ 24K Bridal Luxury Facial + Rose body wrap.\n\n2. **Royal Bridal HD Airbrush Makeup (₹14,999)**\n   * Ultra-lightweight Temptu Airbrush or MAC HD base (16-hour sweat-proof).\n   * Intricate bridal hair design with floral settings, jewelry fixing & dupatta/sari draping.\n\n3. **Celebrity Party Glam HD Makeup (₹3,499)**\n   * Complete event makeover for sangeet, cocktail, or engagement.`,
      actions: [
        { label: 'View Bridal Services', url: '/services/bridal-packages' },
        { label: 'Explore Makeup & Styling', url: '/services/makeup-styling' },
      ],
    };
  }

  // 5. Locations & Operating Cities
  if (q.includes('city') || q.includes('cities') || q.includes('lucknow') || q.includes('patna') || q.includes('kanpur') || q.includes('varanasi') || q.includes('gorakhpur') || q.includes('location') || q.includes('where')) {
    return {
      text: `### 📍 Beautiva Coverage & Hub Network\n\nBeautiva currently serves 5 major tier-1 & tier-2 hubs with localized dispatch centers:\n\n* **Lucknow (Headquarters):**\n  - Hubs: Chinhat Central Hub, Gomti Nagar Hub, Aliganj, Hazratganj, Indira Nagar, Krishna Vihar, Jankipuram.\n* **Patna:**\n  - Hubs: Patliputra Colony, Kankarbagh, Boring Road, Bailey Road, Rajendra Nagar.\n* **Kanpur:**\n  - Coverage: Swaroop Nagar, Civil Lines, Kakadeo, Kidwai Nagar.\n* **Gorakhpur:**\n  - Coverage: Golghar, Taramandal, Medical College Road, Betiahata.\n* **Varanasi:**\n  - Coverage: Sigra, Cantt, Lanka, Bhelupur, Shivpur.\n\n⏰ **Operating Hours:** 07:00 AM – 08:30 PM (Daily).\n⚡ **Speed:** Doorstep arrival in **60–90 minutes** or pre-scheduled up to 30 days in advance.`,
      actions: [
        { label: 'Check Services', url: '/services' },
        { label: 'Contact Us', url: '/contact-us' },
      ],
    };
  }

  // 6. Beauty School & Academy
  if (q.includes('academy') || q.includes('school') || q.includes('course') || q.includes('fee') || q.includes('admission') || q.includes('diploma') || q.includes('career') || q.includes('learn')) {
    return {
      text: `### 🎓 Beautiva Beauty School Academy\n\nOur certified academy trains the next generation of professional beauty stylists with **100% placement guarantee** in the Beautiva fleet:\n\n1. **Diploma in Professional Cosmetology (6 Months)**\n   * **Fee:** ₹38,000 (Installments available)\n   * **Curriculum:** Advanced skincare histology, chemical peels, electro-facials, L'Oréal hair spa, Rica waxing, salon hygiene.\n   * **Hands-on:** 120+ client hours + apprenticeship stipend.\n\n2. **Advanced Bridal & HD Airbrush Artistry (3 Months)**\n   * **Fee:** ₹25,000\n   * **Curriculum:** Color theory, face contouring, airbrush makeup, couture hair up-dos, lighting photography.\n\n3. **Hair Technology Certification (6 Weeks)**\n   * **Fee:** ₹15,000\n\n📍 Campuses: **Chinhat HQ (Lucknow)** & **Patliputra (Patna)**.`,
      actions: [
        { label: 'Visit Beauty School Page', url: '/beauty-school' },
        { label: 'Apply For Admission', url: '/contact-us' },
      ],
    };
  }

  // 7. Safety, Hygiene & Sealed Kits
  if (q.includes('hygiene') || q.includes('safety') || q.includes('safe') || q.includes('kit') || q.includes('clean') || q.includes('police')) {
    return {
      text: `### 🛡️ The Beautiva 5-Point Safety Standard\n\nWe ensure the highest hygiene rating in the home salon industry:\n\n1. **Mono-Dose Sealed Kits:** Every cream, scrub, mask, and bleach is a factory-sealed single-use pack, opened exclusively in your presence.\n2. **100% Police Verified Female Stylists:** Thorough background checks and government photo ID verification for every beautician.\n3. **Disposables Only:** Disposable bed sheets, towels, aprons, gloves, and wooden spatulas (no reusing of linen or utensils).\n4. **Sterilized Hardware:** High-frequency wands, steamers, and scissors undergo UV-sterilization before every trip.\n5. **Post-Treatment Cleanup:** The beautician cleans up all discarded materials, leaving your home spotless.`,
      actions: [
        { label: 'Read Our Core Values', url: '/core-values' },
        { label: 'Book Safe Salon', url: '/services' },
      ],
    };
  }

  // 8. Dashboard: Inventory Alerts
  if (q.includes('inventory') || q.includes('stock') || q.includes('alert') || q.includes('critical')) {
    return {
      text: `### 📦 Real-Time Inventory & Stock Audit\n\n* **Critical Stock Alert (Immediate Reorder Required):**\n  - **Rica White Chocolate Wax (800ml Cans):** Current 18 cans (Min threshold 30). **Status: Critical ⚠️**\n* **Low Stock Alert:**\n  - **O3+ Seaweed Whitening Sachets:** Current 38 kits (Min threshold 50). Status: Low Stock.\n* **Sufficient Stock:**\n  - **L'Oréal Mythic Oil Spa Tubs (500ml):** Current 44 tubs (Min threshold 20).\n  - **Disposable Bio-Cellulose Towel Packs:** Current 340 packs (Min threshold 100).\n  - **VLCC Insta Glow Mono-Dose Pouches:** Current 110 kits (Min threshold 40).\n\nAutomated purchase orders have been drafted for Lucknow Chinhat Central Warehouse.`,
      actions: [
        { label: 'Open Inventory Management', url: '/admin/inventory' },
        { label: 'View Central Hubs', url: '/admin' },
      ],
    };
  }

  // 9. Dashboard: Stylist Fleet Status
  if (q.includes('stylist') || q.includes('fleet') || q.includes('beautician') || q.includes('staff')) {
    return {
      text: `### 👩‍💼 Active Fleet Overview\n\n* **Total Active Stylists:** 48 certified professionals\n* **Current On Duty:** 34 beauticians across 5 cities\n* **Currently In Service:** 18 beauticians\n* **Available for Immediate Dispatch:** 16 beauticians\n* **Top Rated Stylists Today:**\n  - **Ritu Verma (Lucknow):** 4.95 ★ (1,240 completed trips)\n  - **Priya Saxena (Patna):** 4.88 ★ (890 completed trips)\n  - **Meena Kumari (Kanpur):** 4.91 ★ (620 completed trips)\n\nAll beauticians carry verified kit batches and active GPS telemetry via the partner app.`,
      actions: [
        { label: 'Manage Stylists', url: '/admin/stylists' },
        { label: 'Live Bookings Map', url: '/admin/bookings' },
      ],
    };
  }

  // 10. Dashboard: Dispatch Workflow
  if (q.includes('dispatch') || q.includes('workflow') || q.includes('order process') || q.includes('how it works')) {
    return {
      text: `### ⚡ Beautiva Dispatch & Fulfillment Lifecycle\n\n1. **Order Intake:** Customer places booking via web/app; auto-routed to regional hub.\n2. **Hub Coordinator Assignment:** Smart routing matches nearest on-duty stylist specializing in the requested service.\n3. **Mono-Dose Kit Checkout:** Stylist scans barcode of sealed kit batch from hub locker.\n4. **Doorstep Transit:** Stylist travels via two-wheeler/cab with sanitized equipment kit.\n5. **At-Home Service Execution:** Stylist unseals single-use kit before the customer.\n6. **Digital OTP Completion:** Customer verifies satisfaction code; payment settled (UPI/Cash).`,
      actions: [
        { label: 'View Dashboard Operations', url: '/admin' },
        { label: 'Live Bookings Table', url: '/admin/bookings' },
      ],
    };
  }

  // 11. Contact Info & Support
  if (q.includes('contact') || q.includes('phone') || q.includes('call') || q.includes('email') || q.includes('address') || q.includes('office') || q.includes('support') || q.includes('help') || q.includes('reach') || q.includes('number')) {
    return {
      text: `### 📞 Get in Touch with Beautiva\n\nWe are here to assist you 7 days a week from 07:00 AM to 08:30 PM:\n\n* **Call Us:**\n  - [+91 7236851999](tel:+917236851999)\n  - [+91 7007017309](tel:+917007017309)\n* **Email Us:**\n  - [info@beautiva.in](mailto:info@beautiva.in)\n* **Head Office:**\n  - **Beautiva, Sitkan Enterprises**\n  - P.No 1, KH. NO. 118, NewGulista Colony Faizabad Road, Chinhat, Lucknow, 226028\n* **Follow Us:**\n  - Instagram: [@beautiva.in](https://instagram.com/beautiva.in)\n  - Facebook: [@beautiva.in](https://facebook.com/beautiva.in)`,
      actions: [
        { label: 'Go to Contact Page', url: '/contact-us' },
        { label: 'About Beautiva', url: '/about-us' },
      ],
    };
  }

  // 12. Booking Slots, Calendar & Scheduling
  if (q.includes('book') || q.includes('slot') || q.includes('calendar') || q.includes('appointment') || q.includes('timing') || q.includes('available') || q.includes('schedule')) {
    return {
      text: `### 📅 Seamless Doorstep Slot Booking & Availability\n\nBeautiva offers interactive real-time slot checking right in our calendar:\n\n* **Slot Availability Checks:** Live status (Available, High Demand, or Fully Booked) across Morning (07:00 AM – 12:00 PM), Afternoon (12:00 PM – 05:00 PM), and Evening (05:00 PM – 08:30 PM).\n* **Express 60–90 Minute Arrival:** Need immediate pampering? Book an on-demand slot and our nearest verified stylist will arrive in 60 to 90 minutes.\n* **Advance Scheduling:** Plan appointments up to 30 days in advance for parties, weddings, or monthly grooming.\n* **Calendar View:** Pick your preferred date, see available slots, and book with one click.`,
      actions: [
        { label: 'Browse & Book Services', url: '/services' },
        { label: 'Open Custom Package Builder', url: '/services' },
      ],
    };
  }

  // 13. Per-Minute Model & Transparency
  if (q.includes('per minute') || q.includes('per-minute') || q.includes('minute model') || q.includes('pricing') || q.includes('rate') || q.includes('transparent') || q.includes('how much')) {
    return {
      text: `### ⏱️ Transparent Per-Minute Beauty Model\n\nBeautiva pioneered fair, transparent pricing so you only pay for what you receive:\n\n* **No Hidden Fees:** Zero travel surcharge, zero cleanup fees, and zero surge pricing.\n* **Real Per-Minute Rates:** Service packages are calculated precisely at transparent per-minute rates (₹6 to ₹8/min based on service tier).\n* **Sealed Kit Guarantee:** All premium cosmetics (O3+, L'Oréal, Rica, VLCC) are factory sealed and invoiced upfront.\n* **Digital Timer & OTP:** The service timer starts when the beautician begins treatment in your home.`,
      actions: [
        { label: 'Explore All Packages', url: '/services' },
        { label: 'Check Core Values', url: '/core-values' },
      ],
    };
  }

  // 14. Custom Package Builder
  if (q.includes('package builder') || q.includes('custom package') || q.includes('build') || q.includes('bundle') || q.includes('combo')) {
    return {
      text: `### 🎨 Beautiva Custom Package Builder\n\nCreate your own customized home salon session and save more:\n\n* **Mix & Match:** Combine Facials, Rica Waxing, L'Oréal Hair Spa, and Manicure/Pedicure according to your preference.\n* **Bundle Discount:** Automatically unlock **15% instant extra discount** when you combine 3 or more services!\n* **Real-time Price & Time Counter:** Watch your total duration and savings update dynamically as you select treatments.`,
      actions: [
        { label: 'Try Package Builder', url: '/services' },
        { label: 'Explore Featured Packages', url: '/#featured-packages' },
      ],
    };
  }

  // 15. Hair Care & Spa
  if (q.includes('hair') || q.includes('spa') || q.includes('keratin') || q.includes('scalp') || q.includes('dandruff')) {
    return {
      text: `### 💇‍♀️ Luxury Hair Therapies at Home\n\nRejuvenate your tresses with certified L'Oréal Professionnel treatments:\n\n1. **L'Oréal Mythic Oil Nourishing Spa (₹1,299 / 60 Mins)**\n   * Includes argan oil steam infusion, 20-min pressure point scalp massage, and smooth blowdry.\n2. **L'Oréal Keratin Protein Hair Mask (₹1,799 / 75 Mins)**\n   * Deep cuticle repair, intense frizz control, and long-lasting silkiness.\n3. **Anti-Dandruff Scalp Clarifying Treatment (₹1,099 / 50 Mins)**\n   * Zinc-pyrithione infusion and steam purification.`,
      actions: [
        { label: 'View Hair Services', url: '/services/hair-care' },
        { label: 'Book Hair Spa (₹1,299)', url: '/services' },
      ],
    };
  }

  // 16. Manicure & Pedicure
  if (q.includes('pedicure') || q.includes('manicure') || q.includes('feet') || q.includes('nails') || q.includes('hands')) {
    return {
      text: `### 💅 Spa Manicure & Pedicure at Your Doorstep\n\nExperience soothing foot and hand therapies in the comfort of your living room:\n\n* **SARA Crystal Deluxe Pedicure (₹899 / 60 Mins):** Crystal salts soak, dead skin exfoliation, cuticle cleaning, and 15-minute reflexology massage.\n* **O3+ Spa Manicure & Pedicure Combo (₹1,599 / 90 Mins):** Luxury brightening soak, sugar crystal scrub, whitening hand/foot pack, and nail shaping.\n* **Hygiene Guarantee:** Single-use disposable tub liners, sterile files, and sanitized clippers for each customer.`,
      actions: [
        { label: 'View Mani-Pedi Services', url: '/services/manicure-pedicure' },
        { label: 'Book Spa Combo (₹1,599)', url: '/services' },
      ],
    };
  }

  // 17. Coupons, Offers & Discounts
  if (q.includes('coupon') || q.includes('offer') || q.includes('discount') || q.includes('code') || q.includes('promo') || q.includes('save')) {
    return {
      text: `### 🏷️ Active Promo Codes & Offers\n\nApply these discount codes at checkout to save extra:\n\n* **\`FIRSTGLOW\`**: Flat **₹200 OFF** on your first doorstep booking above ₹999.\n* **\`BRIDAL30\`**: **30% OFF** on all Pre-Bridal and Bridal packages.\n* **\`RICA15\`**: **15% OFF** on Italian Rica Waxing combos.\n* **\`PERMIN10\`**: Extra **10% OFF** on custom package builder bundles.\n\nDiscounts apply instantly in your Cart and Checkout drawers!`,
      actions: [
        { label: 'View Offers Page', url: '/offers' },
        { label: 'Start Booking', url: '/services' },
      ],
    };
  }

  // 18. Cancellation, Refunds & Safety Policy
  if (q.includes('cancel') || q.includes('refund') || q.includes('reschedule') || q.includes('policy') || q.includes('money back')) {
    return {
      text: `### 🛡️ Customer Protection & Refund Policy\n\n* **Free Rescheduling:** Reschedule your booking slot anytime up to 2 hours before the scheduled appointment with zero penalty.\n* **Cancellation:** Hassle-free cancellation directly from your profile or by contacting support.\n* **100% Satisfaction Guarantee:** If a service does not meet our verified hygiene and quality standards, we offer a complimentary redo or full refund.\n* **Payment Methods:** UPI, Debit/Credit Cards, Net Banking, and Cash on Delivery (COD) accepted.`,
      actions: [
        { label: 'Read Policies', url: '/policies' },
        { label: 'Contact Support', url: '/contact-us' },
      ],
    };
  }

  // Default Fallback
  if (contextMode === 'dashboard') {
    return {
      text: `### ⚡ Beautiva Operations Copilot\n\nI have complete visibility into the Beautiva Operations Dashboard. You can ask me to:\n\n* **Look up live bookings:** "What is the status of booking SL-94821?"\n* **Inspect inventory:** "Show low stock alerts in Chinhat hub"\n* **Fleet management:** "How many stylists are currently on duty?"\n* **Academy metrics:** "How many students are enrolled in Cosmetology?"\n* **Service catalog:** "Show pricing and margins for O3+ facial"`,
      actions: [
        { label: 'Open Bookings', url: '/admin/bookings' },
        { label: 'Open Stylists Fleet', url: '/admin/stylists' },
        { label: 'Open Inventory', url: '/admin/inventory' },
      ],
    };
  }

  return {
    text: `### ✨ Welcome to Beautiva AI Concierge!\n\nI can assist you with all our doorstep salon services, pricing, appointments, and academy admissions:\n\n* 💆‍♀️ **Facials & Skincare:** Ask about our VLCC, Lotus, or O3+ luxury treatments.\n* 🍯 **Waxing & Grooming:** Inquire about painless Rica White Chocolate wax.\n* 💇‍♀️ **Hair & Mani-Pedi:** L'Oréal hair spas, SARA crystal pedicures & nail care.\n* 👰 **Bridal Packages:** Learn about 3-session pre-bridal and HD airbrush packages.\n* 📍 **Cities & Speed:** Doorstep coverage in Lucknow, Patna, Kanpur, Gorakhpur, and Varanasi.\n* 📞 **Support:** Reach us at +91 7236851999 or info@beautiva.in.\n* 🎓 **Beauty School:** Admissions for Cosmetology and Bridal Masterclasses.\n\nHow can I pamper you today?`,
    actions: [
      { label: 'Browse All Services', url: '/services' },
      { label: 'Book VLCC Package (₹996)', url: '/package/vlcc-facial-package' },
      { label: 'Explore Bridal (₹7,999)', url: '/services/bridal-packages' },
      { label: 'Contact Us', url: '/contact-us' },
    ],
  };
}
