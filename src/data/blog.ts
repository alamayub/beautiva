export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'post-monsoon-facial-care-vlcc-guide',
    title: 'The Essential Post-Monsoon Facial Routine: Why Skin Needs Deep Hydration',
    excerpt: 'Humidity shifts often strip skin of vital lipids. Learn how fruit enzymes and botanical steam restore equilibrium.',
    category: 'Skincare Advice',
    readTime: '4 min read',
    date: '18 Oct 2026',
    author: 'Sunita Rawat, Head Aesthetician',
    image: '/images/beautiva_facial_skincare_1792923326387.jpg',
    content: [
      'Transitioning between intense humidity and dry autumn air causes sebum imbalances, resulting in clogged pores alongside dehydrated surface patches.',
      'A professional facial such as the VLCC Insta Glow or Lotus WhiteGlow utilizes gentle micro-exfoliation to dissolve dead skin build-up without rupturing the lipid barrier.',
      'Follow your facial with hyaluronic layering and non-comedogenic sunscreen to protect freshly revealed cellular layers from ambient UV exposure.'
    ]
  },
  {
    slug: 'bridal-beauty-timeline-3-month-guide',
    title: '3-Month Pre-Bridal Beauty Roadmap: From Hair Spa to HD Makeup Readiness',
    excerpt: 'Planning your wedding glow? Here is our week-by-week schedule for facials, hair nourishment, and body polishing.',
    category: 'Bridal Prep',
    readTime: '6 min read',
    date: '10 Oct 2026',
    author: 'Neha Kapoor, Master Bridal Artist',
    image: '/images/beautiva_bridal_makeup_1792923326741.jpg',
    content: [
      'Month 1: Focus on scalp wellness and deep conditioning with monthly hair spas, paired with a purifying SARA green apple facial to balance complexion.',
      'Month 2: Introduce targeted brightening treatments such as O3+ Radiant Glow and full-body ubtan polishing to erase accumulated tanning.',
      'Month 3: The final countdown! Complete full body Rica waxing 4 days prior to ceremonies, followed by a calming Korean hydration session 48 hours before wedding day.'
    ]
  },
  {
    slug: 'home-salon-hygiene-checklist',
    title: 'Why Single-Use Disposable Kits are Non-Negotiable in Home Beauty Services',
    excerpt: 'Discover the 5 hygiene protocols that protect your skin during doorstep salon and waxing treatments.',
    category: 'Hygiene & Safety',
    readTime: '3 min read',
    date: '25 Sep 2026',
    author: 'Beautiva Quality Team',
    image: '/images/beautiva_hero_luxury_1792923326581.jpg',
    content: [
      'Cross-contamination in conventional salons often occurs through double-dipping wax spatulas or unsterilized steel blackhead extractors.',
      'At Beautiva, every client receives mono-dose factory-sealed cosmetic kits and virgin single-use wax strips.',
      'Our beauticians sterilize metallic instruments with medical-grade isopropyl sprays before and after each session.'
    ]
  }
];
