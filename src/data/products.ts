import { Product } from '../types/product';

export const products: Product[] = [
  {
    id: 'vlcc-facial-package',
    slug: 'vlcc-facial-package',
    title: 'VLCC Facial Package',
    brand: 'VLCC',
    category: 'Facial & Skincare',
    categoryId: 'facials-skincare',
    price: 996,
    originalPrice: 1600,
    discountPercent: 38,
    durationMinutes: 75,
    description: 'A signature rejuvenating package featuring the authentic VLCC Insta Glow treatment paired with complimentary face and neck de-tan bleach. Deeply cleanses impurities, exfoliates dead epidermal cells, and restores instantaneous radiance.',
    shortDescription: 'VLCC Insta Glow Facial + Face & Neck Bleach + Eyebrow Shaping.',
    image: '/images/beautiva_facial_skincare_1792923326387.jpg',
    inclusions: [
      'VLCC Insta Glow Cleanser & Exfoliation',
      'Gentle Steam & Blackhead Removal',
      'VLCC Face & Neck De-Tan Bleach',
      'Herbal Cooling Pack & Acupressure Massage',
      'Post-facial sun protector application'
    ],
    badge: 'Best Seller',
    isPopular: true,
    isPackage: true,
    skinType: 'All Skin Types',
    stepsCount: 6,
    safetyProtocol: [
      'Single-use sealed VLCC kit opened before you',
      'Beautician in sanitised disposable apron & gloves',
      'Disposable bed roll and hygiene wipes'
    ]
  },
  {
    id: 'lotus-whiteglow-package',
    slug: 'lotus-whiteglow-package',
    title: 'Lotus WhiteGlow Package',
    brand: 'Lotus Herbals',
    category: 'Facial & Skincare',
    categoryId: 'facials-skincare',
    price: 1090,
    originalPrice: 1850,
    discountPercent: 41,
    durationMinutes: 90,
    description: 'Formulated with grape, mulberry, and saxifraga extracts, this 90-minute intensive whitening and glow facial brightens dull skin while reducing sun tan and hyper-pigmentation. Includes face and neck bleach plus threading.',
    shortDescription: 'Lotus WhiteGlow Skin Whitening Facial + Face & Neck Bleach + Threading.',
    image: '/images/beautiva_hero_luxury_1792923326581.jpg',
    inclusions: [
      'Lotus WhiteGlow Cleansing Milk & Gel Scrub',
      'Gentle steam with ultrasonic blackhead extraction',
      'Deep acupressure whitening massage with active serum',
      'Face & neck herbal skin-tone bleach',
      'Lotus WhiteGlow Yogurt Pack & Sunblock',
      'Complimentary eyebrow and upper lip threading'
    ],
    badge: 'Popular',
    isPopular: true,
    isPackage: true,
    skinType: 'Uneven tone, Tanned or Dull skin',
    stepsCount: 7,
    safetyProtocol: [
      'Sealed Lotus single-application sachet kit',
      'Sanitised steel instruments sterilized with isopropyl alcohol',
      'Eco-friendly disposable bedsheets'
    ]
  },
  {
    id: 'party-glow-package',
    slug: 'party-glow-package',
    title: 'Party Glow Package',
    brand: 'VLCC',
    category: 'Facial & Skincare',
    categoryId: 'facials-skincare',
    price: 999,
    originalPrice: 1750,
    discountPercent: 43,
    durationMinutes: 80,
    description: 'Designed for instant pre-event radiance. Combines a light-reflecting Party Glow facial with deep pore detox, herbal face bleach, and eyebrow threading to ensure flawless makeup canvas.',
    shortDescription: 'Party Glow Facial + Face Bleach + Eyebrow & Upper Lip Threading.',
    image: '/images/beautiva_facial_skincare_1792923326387.jpg',
    inclusions: [
      'Hydrating fruit cleanse & micro-granule polish',
      'Pore unclogging steam & suction',
      'Gold shimmer radiance massage cream',
      'Anti-pollution peel-off glow pack',
      'Eyebrow and upper-lip grooming'
    ],
    badge: 'Instant Glow',
    isPopular: true,
    isPackage: true,
    skinType: 'Normal to Dry',
    stepsCount: 5,
    safetyProtocol: [
      'Single-use sterile sponge & wooden spatulas',
      'Hand sanitisation before every step'
    ]
  },
  {
    id: 'all-in-1-package',
    slug: 'all-in-1-package',
    title: 'ALL IN 1 Package',
    brand: 'VLCC',
    category: 'Waxing & Grooming',
    categoryId: 'waxing-grooming',
    price: 2499,
    originalPrice: 4200,
    discountPercent: 41,
    durationMinutes: 150,
    description: 'The ultimate monthly full-body grooming retreat at home. Encompasses full arms and full legs waxing with Rica gentle wax, underarm waxing, VLCC glowing facial, and an invigorating manicure & pedicure combo.',
    shortDescription: 'Full Body Rica Waxing + VLCC Facial + Manicure & Pedicure + Threading.',
    image: '/images/beautiva_hero_luxury_1792923326581.jpg',
    inclusions: [
      'Full Arms & Full Legs Waxing (Choice of Rica or Chocolate)',
      'Underarms Waxing',
      'VLCC Fruit or Insta Glow Facial',
      'Deluxe Foot Soak & Scrub Pedicure with Heel Buffing',
      'Hand Polishing & Cuticle Care Manicure',
      'Eyebrow & Upper Lip Threading'
    ],
    badge: 'Top Value',
    isPopular: true,
    isPackage: true,
    skinType: 'All Body Types',
    stepsCount: 8,
    safetyProtocol: [
      'Separate disposable cartridge or wax strips per client',
      'Sterilized cuticle nippers and pumice stones',
      'Complete post-wax calming lotion application'
    ],
    options: [
      { id: 'wax-rica', name: 'Rica Italian Wax (Gentle for sensitive skin)', priceDelta: 300 },
      { id: 'wax-choc', name: 'Chocolate Wax (Nourishing & Tan Removal)', priceDelta: 0 }
    ]
  },
  {
    id: 'o3-plus-glowing-package',
    slug: 'o3-plus-glowing-package',
    title: 'O3+ Glowing Package',
    brand: 'O3+',
    category: 'Facial & Skincare',
    categoryId: 'facials-skincare',
    price: 1899,
    originalPrice: 3000,
    discountPercent: 37,
    durationMinutes: 90,
    description: 'Clinical-grade oxygen glow infusion utilizing O3+ derma essentials. Gently melts away persistent pollution tan, boosts cellular oxygen absorption, and delivers a reflective glass-like glow.',
    shortDescription: 'O3+ Radiant Glow Derma Facial + O3+ D-Tan Pack + Eye Revitaliser.',
    image: '/images/beautiva_facial_skincare_1792923326387.jpg',
    inclusions: [
      'O3+ Cleansing foam & enzyme milk',
      'O3+ Micro derma peeling scrub',
      'Pure oxygen tonic compression',
      'O3+ Radiant glow tonic massage',
      'O3+ Rubberizing algae peel-off mask',
      'Hydrating derma sunblock SPF 50'
    ],
    badge: 'Derma Grade',
    isPopular: true,
    isPackage: true,
    skinType: 'Pigmented, Dull or Bridal Prep',
    stepsCount: 6,
    safetyProtocol: [
      'Single-serve vacuum sealed O3+ mono-doses',
      'Medical grade disposable facial gown & headband'
    ]
  },
  {
    id: 'korean-facial-package',
    slug: 'korean-facial-package',
    title: 'Korean Facial Package',
    brand: 'SARA',
    category: 'Facial & Skincare',
    categoryId: 'facials-skincare',
    price: 1699,
    originalPrice: 2800,
    discountPercent: 39,
    durationMinutes: 85,
    description: 'Inspired by Seoul glass-skin aesthetics. Includes gentle lymphatic ice-globe cryo massage, hyaluronic acid layering, bio-cellulose sheet mask, and jade roller lymphatic drainage.',
    shortDescription: 'Glass Skin Hydration + Cryo Ice Globe Therapy + Peptide Sheet Mask.',
    image: '/images/beautiva_facial_skincare_1792923326387.jpg',
    inclusions: [
      'Double cleansing with rice water & cleansing oil',
      'Mild enzyme exfoliation',
      'Ice-globe soothing cryo facial massage',
      'Hyaluronic acid essence infusion',
      'Hydrating Korean bio-cellulose sheet mask',
      'Gua sha contouring & ceramide barrier lock'
    ],
    badge: 'Trending',
    isPopular: true,
    isPackage: true,
    skinType: 'Dehydrated, sensitive, or tired skin',
    stepsCount: 7,
    safetyProtocol: [
      'Cryo globes sanitized with hospital grade disinfectant',
      'Hermetically sealed sheet mask unpacked in front of client'
    ]
  },
  {
    id: 'sara-green-apple-package',
    slug: 'sara-green-apple-package',
    title: 'SARA Green Apple Package',
    brand: 'SARA',
    category: 'Facial & Skincare',
    categoryId: 'facials-skincare',
    price: 1350,
    originalPrice: 2200,
    discountPercent: 39,
    durationMinutes: 95,
    description: 'Rich in malic acid from fresh green apples, this botanical package purifies congested pores and smooths tired skin while including a refreshing green apple pedicure.',
    shortDescription: 'SARA Green Apple Detox Facial + Green Apple Spa Pedicure.',
    image: '/images/beautiva_facial_skincare_1792923326387.jpg',
    inclusions: [
      'SARA Green Apple Purifying Cleanser',
      'Apple seed micro-scrub & steam',
      'Nourishing apple pectin cream massage',
      'Tightening green apple clay pack',
      'SARA pedicure: foot soak with green apple salts, scrub, buffing, and nail polish'
    ],
    isPopular: false,
    isPackage: true,
    skinType: 'Oily, combination, or breakout-prone',
    stepsCount: 6,
    safetyProtocol: [
      'Fresh fruit-derived extracts in sealed pouches',
      'Individual foot tub liner used for pedicure'
    ]
  },
  {
    id: 'sara-green-apple-facial-package',
    slug: 'sara-green-apple-facial-package',
    title: 'SARA Green Apple Facial Package',
    brand: 'SARA',
    category: 'Facial & Skincare',
    categoryId: 'facials-skincare',
    price: 1150,
    originalPrice: 1800,
    discountPercent: 36,
    durationMinutes: 65,
    description: 'Targeted green apple facial focusing exclusively on facial glow, blackhead elimination, skin clarifying, and pore minimization without pedicure.',
    shortDescription: 'SARA Green Apple Purifying Facial + De-Tan Face Pack.',
    image: '/images/beautiva_facial_skincare_1792923326387.jpg',
    inclusions: [
      'Clarifying apple gel cleanse',
      'Steam & blackhead clearing',
      'Circulation boosting face massage',
      'Green apple botanical mask & toner'
    ],
    isPackage: true,
    stepsCount: 5,
    safetyProtocol: ['Sealed packaging', 'Clean disposable wipes']
  },
  {
    id: 'blossom-package',
    slug: 'blossom-package',
    title: 'Blossom Package',
    brand: 'Blossom Kochhar',
    category: 'Facial & Skincare',
    categoryId: 'facials-skincare',
    price: 1299,
    originalPrice: 2100,
    discountPercent: 38,
    durationMinutes: 90,
    description: 'An aromatherapy immersion using Blossom Kochhar Aroma Magic Gold & Pearl organic preparations paired with a soothing upper back & neck massage.',
    shortDescription: 'Aroma Magic Gold Facial + Relaxing Back & Shoulder Massage.',
    image: '/images/beautiva_hero_luxury_1792923326581.jpg',
    inclusions: [
      'Grapefruit cleansing & peppermint gentle scrub',
      'Gold shimmer facial serum acupressure',
      'Aromatherapy back & shoulder tension relief massage',
      'Aroma Magic Pearl restorative mask',
      'Rosewater mist toner'
    ],
    badge: 'Aromatherapy',
    isPackage: true,
    skinType: 'Stressed, normal to dry skin',
    stepsCount: 6,
    safetyProtocol: ['100% toxic-free essential oils', 'Disposable massage sheets']
  },
  {
    id: 'lotus-anti-ageing-package',
    slug: 'lotus-anti-ageing-package',
    title: 'Lotus Anti-Ageing Package',
    brand: 'Lotus Herbals',
    category: 'Facial & Skincare',
    categoryId: 'facials-skincare',
    price: 1499,
    originalPrice: 2450,
    discountPercent: 39,
    durationMinutes: 85,
    description: 'Targeted skin tightening therapy using Lotus Phyto-Rx anti-ageing botanicals, collagen peptides, de-tan pack, and nourishing hand massage.',
    shortDescription: 'Lotus Phyto-Rx Facial + Collagen Infusion + Tan Removal Pack + Hand Polish.',
    image: '/images/beautiva_facial_skincare_1792923326387.jpg',
    inclusions: [
      'Phyto-Rx skin firming cleanse',
      'Micro-dermabrasion gentle exfoliation',
      'Firming collagen massage with lifting strokes',
      'Herbal de-tan pack for neck and face',
      'Hand moisturizing polish'
    ],
    isPackage: true,
    skinType: 'Mature, loose or sun-damaged skin',
    stepsCount: 6,
    safetyProtocol: ['Clean sealed kit', 'Sanitized equipment']
  },
  {
    id: 'vlcc-shine-package',
    slug: 'vlcc-shine-package',
    title: 'VLCC Shine Package',
    brand: 'VLCC',
    category: 'Facial & Skincare',
    categoryId: 'facials-skincare',
    price: 1199,
    originalPrice: 1950,
    discountPercent: 39,
    durationMinutes: 80,
    description: 'VLCC Diamond Shine treatment enriched with diamond bhasma and botanical actives to polish away dull skin, paired with under-eye dark circle therapy and pressure-point head massage.',
    shortDescription: 'VLCC Diamond Shine Facial + Under Eye Therapy + Head Massage.',
    image: '/images/beautiva_facial_skincare_1792923326387.jpg',
    inclusions: [
      'Diamond scrub with diamond dust particles',
      'Detox steam & gentle pore suction',
      'Diamond nourishing massage cream',
      'Soothing under-eye cucumber gel patch',
      'Diamond wash-off pack',
      '15-min stress relief dry head massage'
    ],
    isPackage: true,
    stepsCount: 6,
    safetyProtocol: ['Disposable eye pads', 'Sanitised therapist hands']
  },
  {
    id: 'vlcc-hair-spa-package',
    slug: 'vlcc-hair-spa-package',
    title: 'VLCC Hair SPA Package',
    brand: 'VLCC',
    category: 'Hair Services & Spa',
    categoryId: 'hair-services',
    price: 899,
    originalPrice: 1500,
    discountPercent: 40,
    durationMinutes: 60,
    description: 'A deep restorative hair treatment that repairs dry, damaged cuticles, restores shine, and soothes the scalp with VLCC botanical oils, followed by a professional blowdry.',
    shortDescription: 'Deep Conditioning Hair Spa + Scalp Massage + Steam + Blowdry.',
    image: '/images/beautiva_hair_spa_1792923327617.jpg',
    inclusions: [
      'Scalp analysis & pre-spa massage',
      'VLCC deep conditioning keratin cream application',
      'Warm towel steam therapy for hair follicles',
      'Gentle rinse and smoothing leave-in serum',
      'Professional in-curl or straight blowdry finish'
    ],
    badge: 'Popular',
    isPopular: true,
    isPackage: true,
    stepsCount: 5,
    safetyProtocol: ['Clean sterilized wide-tooth comb', 'Fresh salon cape']
  },
  {
    id: 'homely-groom-package',
    slug: 'homely-groom-package',
    title: 'Homely Groom Package',
    brand: 'Lotus Herbals',
    category: 'Waxing & Grooming',
    categoryId: 'waxing-grooming',
    price: 899,
    originalPrice: 1450,
    discountPercent: 38,
    durationMinutes: 70,
    description: 'Essential everyday maintenance: Full arms & half legs chocolate waxing, gentle Lotus herbal face cleanup, and eyebrow + upper lip threading.',
    shortDescription: 'Full Arms Waxing + Half Legs Waxing + Lotus Cleanup + Threading.',
    image: '/images/beautiva_hero_luxury_1792923326581.jpg',
    inclusions: [
      'Full Arms Honey Waxing',
      'Half Legs Honey Waxing',
      'Lotus Herbal Quick Cleanup with Scrub',
      'Eyebrow and Upper Lip Threading'
    ],
    isPackage: true,
    stepsCount: 4,
    safetyProtocol: ['Fresh disposable wax strips', 'Single-use wooden spatulas']
  },
  {
    id: 'party-makeup',
    slug: 'party-makeup',
    title: 'Party Makeup',
    brand: 'Beautiva Artistry',
    category: 'Makeup & Occasions',
    categoryId: 'makeup-styling',
    price: 1999,
    originalPrice: 3500,
    discountPercent: 43,
    durationMinutes: 90,
    description: 'High-definition glamour for weddings, cocktail evenings, and family festivities. Includes long-wear waterproof base, eye makeup, customized hairstyle, and saree or lehenga draping.',
    shortDescription: 'HD Party Glamour Look + Hairstyle + Saree/Lehenga Draping.',
    image: '/images/beautiva_bridal_makeup_1792923326741.jpg',
    inclusions: [
      'HD foundation base matching skin undertone',
      'Contour, blush, and highlighter blend',
      'Smokey or shimmer eye makeup with eyeliner & mascara',
      'Hairstyle of choice (Curl, Straight, or Updo)',
      'Saree, dupatta, or lehenga pleating and pinning'
    ],
    badge: 'Occasion Ready',
    isPopular: true,
    isPackage: false,
    stepsCount: 5,
    safetyProtocol: [
      'Sanitized makeup brushes and beauty blenders',
      'Disinfectant spray on palettes before application',
      'Disposable lip wands and mascara wands'
    ],
    options: [
      { id: 'lashes', name: 'Premium 3D False Eyelashes', priceDelta: 250 },
      { id: 'airbrush', name: 'Upgrade to Airbrush Base', priceDelta: 1000 }
    ]
  },
  {
    id: 'engagement-makeup',
    slug: 'engagement-makeup',
    title: 'Engagement Makeup',
    brand: 'Beautiva Artistry',
    category: 'Makeup & Occasions',
    categoryId: 'makeup-styling',
    price: 3999,
    originalPrice: 6500,
    discountPercent: 38,
    durationMinutes: 120,
    description: 'Flawless camera-ready makeup designed for ring ceremonies and sangeet celebrations. Features airbrush or 3D HD application, false lashes, designer hair styling, and jewelry setting.',
    shortDescription: '3D HD / Airbrush Makeup + False Lashes + Designer Hairstyle + Draping.',
    image: '/images/beautiva_bridal_makeup_1792923326741.jpg',
    inclusions: [
      'Skin prep & primer smoothing',
      'Long-wearing sweat-proof HD / Airbrush base',
      'Cut-crease or soft glam eye look with lashes',
      'Designer bun or romantic textured braid with accessories',
      'Dupatta, lehenga, or gown styling'
    ],
    badge: 'Ceremony Special',
    isPackage: true,
    stepsCount: 6,
    safetyProtocol: [
      'Hygiene-certified makeup artist',
      'UV-sanitized brush kit'
    ]
  },
  {
    id: 'bridal-makeup',
    slug: 'bridal-makeup',
    title: 'Bridal Makeup',
    brand: 'Beautiva Artistry',
    category: 'Makeup & Occasions',
    categoryId: 'makeup-styling',
    price: 7999,
    originalPrice: 14000,
    discountPercent: 43,
    durationMinutes: 180,
    description: 'Our premier bespoke bridal artistry. Includes pre-wedding skin consultation, luxurious 3D HD / Airbrush base, mink lashes, traditional floral or jewel hair styling, double dupatta draping, and touch-up kit.',
    shortDescription: 'Complete 3D HD Bridal Transformation + Lashes + Hairdo + Double Draping.',
    image: '/images/beautiva_bridal_makeup_1792923326741.jpg',
    inclusions: [
      'Pre-bridal skin and shade match consultation',
      'Waterproof 18-hour HD / Airbrush bridal base',
      'Intricate bridal eye artistry with premium lashes',
      'Traditional floral bun or royal bridal hairstyle',
      'Double dupatta pleating, heavy lehenga draping, and jewelry fixing',
      'Bridal touch-up kit provided'
    ],
    badge: 'Luxury Bridal',
    isPopular: true,
    isPackage: true,
    stepsCount: 7,
    safetyProtocol: [
      'Master Bridal Artist with 8+ years experience',
      'Fresh individual disposable sponges',
      '100% sealed luxury cosmetics (Huda, MAC, PAC, O3+)'
    ]
  },
  {
    id: 'hairdo',
    slug: 'hairdo',
    title: 'Hairdo',
    brand: "L'Oréal Professionnel",
    category: 'Hair Services & Spa',
    categoryId: 'hair-services',
    price: 499,
    originalPrice: 850,
    discountPercent: 41,
    durationMinutes: 45,
    description: 'Expert event hairstyle of your choice: traditional floral bun, mess-free sleek updo, French braid, or side-swept textured styling secured with professional pins and holding spray.',
    shortDescription: 'Classic or Designer Hair Updo / Bun / Braid for events.',
    image: '/images/beautiva_hair_spa_1792923327617.jpg',
    inclusions: [
      'Hair texturizing & backcombing for volume',
      'Pinning and structure setting',
      'Accessory / floral attachment (accessories provided by client)',
      'High-hold anti-humidity finishing spray'
    ],
    isPackage: false,
    stepsCount: 3,
    safetyProtocol: ['Sanitized hairbrushes and combs', 'Fresh hair nets']
  },
  {
    id: 'blowdry',
    slug: 'blowdry',
    title: 'Blowdry',
    brand: "L'Oréal Professionnel",
    category: 'Hair Services & Spa',
    categoryId: 'hair-services',
    price: 399,
    originalPrice: 650,
    discountPercent: 39,
    durationMinutes: 35,
    description: 'Professional ceramic blowdry giving tresses bouncy volume, mirror shine, and lasting shape. Available in out-curl, in-curl, or sleek straight styles.',
    shortDescription: 'Volume Blowdry styling (In-curl, Out-curl, or Sleek).',
    image: '/images/beautiva_hair_spa_1792923327617.jpg',
    inclusions: [
      'Heat protection serum application',
      'Sectional round-brush ceramic blowdry',
      'Cool shot set for longevity and shine'
    ],
    isPackage: false,
    stepsCount: 3,
    safetyProtocol: ['Clean brushes', 'Regulated heat settings']
  },
  {
    id: 'hair-curling',
    slug: 'hair-curling',
    title: 'Hair Curling',
    brand: "L'Oréal Professionnel",
    category: 'Hair Services & Spa',
    categoryId: 'hair-services',
    price: 599,
    originalPrice: 950,
    discountPercent: 37,
    durationMinutes: 45,
    description: 'Gorgeous tong curls, beach waves, or romantic loose curls created with professional tourmaline styling tools and thermal protectants.',
    shortDescription: 'Tourmaline Tong Curls or Mermaid Beach Waves.',
    image: '/images/beautiva_hair_spa_1792923327617.jpg',
    inclusions: [
      'L’Oréal heat shield mist',
      'Precision barrel curling by sections',
      'Serum glaze for frizz control'
    ],
    isPackage: false,
    stepsCount: 3,
    safetyProtocol: ['Ceramic heat control', 'Clean section clips']
  },
  {
    id: 'hair-straightening',
    slug: 'hair-straightening',
    title: 'Hair Straightening',
    brand: "L'Oréal Professionnel",
    category: 'Hair Services & Spa',
    categoryId: 'hair-services',
    price: 549,
    originalPrice: 890,
    discountPercent: 38,
    durationMinutes: 40,
    description: 'Silky smooth temporary ceramic flat-iron straightening that eliminates flyaways and leaves hair glass-like and effortlessly sleek.',
    shortDescription: 'Ceramic Iron Temporary Straightening with Gloss Serum.',
    image: '/images/beautiva_hair_spa_1792923327617.jpg',
    inclusions: [
      'Smoothing serum application',
      'Temperature-regulated ceramic flat-iron pass',
      'Anti-frizz hair seal'
    ],
    isPackage: false,
    stepsCount: 3,
    safetyProtocol: ['Damage-preventing temperature monitoring', 'Sanitised plates']
  },
  {
    id: 'nari-ayurvedic-ubtan-body-glow',
    slug: 'nari-ayurvedic-ubtan-body-glow',
    title: 'नारी (Nari) Ayurvedic Ubtan Glow',
    brand: 'नारी (Nari)',
    category: 'Bridal & Pre-Bridal',
    categoryId: 'bridal-packages',
    price: 1599,
    originalPrice: 2600,
    discountPercent: 38,
    durationMinutes: 90,
    description: 'Traditional Vedic full body polishing with authentic turmeric, sandalwood, saffron, and chickpea flour paste. Restores natural radiance and purifies the skin.',
    shortDescription: 'Full Body Ayurvedic Scrub + Rosewater Compression + Herbal Pack.',
    image: '/images/beautiva_hero_luxury_1792923326581.jpg',
    inclusions: [
      'Cold-pressed sesame oil gentle body rub',
      'Sandalwood & chickpea ubtan herbal exfoliation',
      'Steam towel wipe & pure damask rosewater spray',
      'Deep moisturizing saffron body emulsion'
    ],
    badge: 'Ayurvedic',
    isPackage: true,
    stepsCount: 4,
    safetyProtocol: ['Natural 100% edible-grade herbs', 'Disposable body drape']
  }
];

export const getStoredProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem('beautiva_catalog_products');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return products;
};

export const saveStoredProducts = (list: Product[]) => {
  try {
    localStorage.setItem('beautiva_catalog_products', JSON.stringify(list));
  } catch {}
};

