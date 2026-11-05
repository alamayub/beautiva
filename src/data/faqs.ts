export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Booking & Safety',
    question: 'How do doorstep salon appointments work with Beautiva?',
    answer: 'Simply select your desired services or packages, pick your preferred date and time slot, and submit your address. A verified, certified female beauty professional arrives at your doorstep equipped with all necessary tools, single-use disposables, and sealed branded cosmetics.'
  },
  {
    id: 'faq-2',
    category: 'Booking & Safety',
    question: 'Are the beauticians verified and trained?',
    answer: 'Yes. Every Beautiva beauty professional undergoes rigorous police and background verification, along with skills certification through our Beautiva Beauty School curriculum before handling customer appointments.'
  },
  {
    id: 'faq-3',
    category: 'Hygiene & Products',
    question: 'Are the cosmetic products genuine and sealed?',
    answer: 'We strictly partner with authorized distributors of VLCC, Lotus Herbals, O3+, Blossom Kochhar, and L’Oréal Professionnel. Mono-dose kits and sachets are unsealed directly in your presence so you have 100% transparency.'
  },
  {
    id: 'faq-4',
    category: 'Hygiene & Products',
    question: 'What hygiene measures are taken during the treatment?',
    answer: 'Our technicians wear sanitized aprons and masks, sanitize their hands and equipment before every phase, lay down fresh disposable bed sheets, and use single-use wooden wax spatulas and wipes. Afterward, all service waste is tidied up and disposed of by the beautician.'
  },
  {
    id: 'faq-5',
    category: 'Locations & Payment',
    question: 'In which cities does Beautiva currently operate?',
    answer: 'Beautiva provides extensive doorstep service coverage across Lucknow (Chinhat, Gomti Nagar, Aliganj, Hazratganj, Krishna Vihar, Indira Nagar), Patna (Patliputra, Boring Road, Bailey Road, Kankarbagh), Kanpur, Gorakhpur, and Varanasi.'
  },
  {
    id: 'faq-6',
    category: 'Locations & Payment',
    question: 'What payment modes are accepted?',
    answer: 'You can pay after the service completion via Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), or credit/debit card on spot with the stylist.'
  },
  {
    id: 'faq-7',
    category: 'Beautiva Beauty School',
    question: 'What is the Beautiva Beauty School?',
    answer: 'Beautiva Beauty School is our accredited vocational training institute offering government-aligned certifications in Cosmetology, Hair Technology, Advanced Bridal Artistry, and Nail Art, providing practical salon apprenticeships and placement assistance.'
  }
];
