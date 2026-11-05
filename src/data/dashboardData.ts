export interface BookingRecord {
  id: string;
  customerName: string;
  phone: string;
  city: 'Lucknow' | 'Patna' | 'Kanpur' | 'Gorakhpur' | 'Varanasi';
  locality: string;
  fullAddress: string;
  serviceNames: string[];
  totalAmount: number;
  date: string;
  timeSlot: string;
  status: 'pending' | 'assigned' | 'in_transit' | 'in_progress' | 'completed' | 'cancelled';
  assignedStylistId?: string;
  assignedStylistName?: string;
  paymentMethod: 'Cash on Delivery' | 'UPI on Spot' | 'Prepaid Card';
  paymentStatus: 'paid' | 'pending';
  specialNotes?: string;
  createdAt: string;
}

export interface StylistRecord {
  id: string;
  name: string;
  phone: string;
  city: 'Lucknow' | 'Patna' | 'Kanpur' | 'Gorakhpur' | 'Varanasi';
  locality: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  totalTrips: number;
  monthlyEarnings: number;
  status: 'on_duty' | 'in_service' | 'off_duty';
  policeVerified: boolean;
  academyCertified: boolean;
  avatarInitials: string;
  activeKitBatch: string;
}

export interface InventoryItem {
  id: string;
  brand: string;
  productName: string;
  category: 'Facial Kit' | 'Waxing' | 'Hair Care' | 'Disposables';
  unit: string;
  currentStock: number;
  minThreshold: number;
  unitCost: number;
  sellingValue: number;
  batchNumber: string;
  expiryDate: string;
  status: 'sufficient' | 'low_stock' | 'critical';
}

export interface AcademyStudent {
  id: string;
  studentName: string;
  phone: string;
  course: string;
  city: 'Lucknow' | 'Patna';
  enrollmentDate: string;
  progressPercent: number;
  apprenticeshipHours: number;
  status: 'training' | 'apprenticeship' | 'graduated' | 'inquiry';
  placementStatus: 'pending' | 'placed_beautiva' | 'external_salon';
}

export const initialBookings: BookingRecord[] = [
  {
    id: 'SL-94821',
    customerName: 'Kavita Mehrotra',
    phone: '9839012345',
    city: 'Lucknow',
    locality: 'Gomti Nagar Phase 2',
    fullAddress: '3/45, Vipul Khand, Gomti Nagar, Lucknow',
    serviceNames: ['Lotus WhiteGlow Package', 'Threading'],
    totalAmount: 1090,
    date: '2026-10-25',
    timeSlot: '11:30 AM - 02:00 PM',
    status: 'in_progress',
    assignedStylistId: 'sty-1',
    assignedStylistName: 'Pooja Rawat',
    paymentMethod: 'UPI on Spot',
    paymentStatus: 'pending',
    specialNotes: 'Sensitive skin test requested for face bleach',
    createdAt: '2026-10-24 16:30'
  },
  {
    id: 'SL-94822',
    customerName: 'Sunita Agrawal',
    phone: '9415087654',
    city: 'Lucknow',
    locality: 'Mahanagar',
    fullAddress: 'Flat 402, Shalimar Gallant, Mahanagar, Lucknow',
    serviceNames: ['ALL IN 1 Package (Rica Wax)'],
    totalAmount: 2799,
    date: '2026-10-25',
    timeSlot: '02:30 PM - 05:00 PM',
    status: 'assigned',
    assignedStylistId: 'sty-2',
    assignedStylistName: 'Meena Devi',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'pending',
    createdAt: '2026-10-24 18:45'
  },
  {
    id: 'SL-94823',
    customerName: 'Anamika Prasad',
    phone: '9798023456',
    city: 'Patna',
    locality: 'Patliputra Colony',
    fullAddress: 'House 14B, Road No. 3, Patliputra Colony, Patna',
    serviceNames: ['O3+ Glowing Package', 'VLCC Hair SPA Package'],
    totalAmount: 2798,
    date: '2026-10-25',
    timeSlot: '05:30 PM - 08:00 PM',
    status: 'assigned',
    assignedStylistId: 'sty-3',
    assignedStylistName: 'Sunita Rawat',
    paymentMethod: 'UPI on Spot',
    paymentStatus: 'pending',
    specialNotes: 'Ring bell twice; service setup in guest bedroom',
    createdAt: '2026-10-25 08:15'
  },
  {
    id: 'SL-94824',
    customerName: 'Dr. Shalini Tripathi',
    phone: '9935012389',
    city: 'Kanpur',
    locality: 'Swaroop Nagar',
    fullAddress: '12/480, Swaroop Nagar, Kanpur',
    serviceNames: ['Party Makeup', 'Hair Curling'],
    totalAmount: 2598,
    date: '2026-10-25',
    timeSlot: '04:00 PM - 06:30 PM',
    status: 'pending',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'pending',
    specialNotes: 'Wedding reception attendance at 7 PM sharp',
    createdAt: '2026-10-25 09:20'
  },
  {
    id: 'SL-94825',
    customerName: 'Priya Srivastava',
    phone: '9450098712',
    city: 'Lucknow',
    locality: 'Aliganj',
    fullAddress: 'Sector B, Near Kapoorthala, Aliganj, Lucknow',
    serviceNames: ['VLCC Facial Package', 'Blowdry'],
    totalAmount: 1395,
    date: '2026-10-25',
    timeSlot: '09:00 AM - 11:30 AM',
    status: 'completed',
    assignedStylistId: 'sty-1',
    assignedStylistName: 'Pooja Rawat',
    paymentMethod: 'UPI on Spot',
    paymentStatus: 'paid',
    createdAt: '2026-10-24 14:10'
  },
  {
    id: 'SL-94826',
    customerName: 'Neetu Sinha',
    phone: '9304011223',
    city: 'Patna',
    locality: 'Boring Road',
    fullAddress: 'Om Shanti Apartments, Boring Canal Road, Patna',
    serviceNames: ['SARA Green Apple Package'],
    totalAmount: 1350,
    date: '2026-10-26',
    timeSlot: '11:30 AM - 02:00 PM',
    status: 'assigned',
    assignedStylistId: 'sty-4',
    assignedStylistName: 'Rinki Kumari',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'pending',
    createdAt: '2026-10-25 10:05'
  },
  {
    id: 'SL-94827',
    customerName: 'Garima Tandon',
    phone: '9838045612',
    city: 'Lucknow',
    locality: 'Indira Nagar',
    fullAddress: 'Block C, Sector 18, Indira Nagar, Lucknow',
    serviceNames: ['Korean Facial Package'],
    totalAmount: 1699,
    date: '2026-10-26',
    timeSlot: '02:30 PM - 05:00 PM',
    status: 'pending',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'pending',
    createdAt: '2026-10-25 11:40'
  },
  {
    id: 'SL-94828',
    customerName: 'Roshni Jaiswal',
    phone: '9451077889',
    city: 'Varanasi',
    locality: 'Sigra',
    fullAddress: 'Mahmoorganj Road, Sigra, Varanasi',
    serviceNames: ['Blossom Package', 'Homely Groom Package'],
    totalAmount: 2198,
    date: '2026-10-26',
    timeSlot: '11:00 AM - 01:30 PM',
    status: 'assigned',
    assignedStylistId: 'sty-5',
    assignedStylistName: 'Archana Singh',
    paymentMethod: 'UPI on Spot',
    paymentStatus: 'pending',
    createdAt: '2026-10-25 12:15'
  },
  {
    id: 'SL-94829',
    customerName: 'Deepika Maurya',
    phone: '9839445566',
    city: 'Lucknow',
    locality: 'Hazratganj',
    fullAddress: '5 Sapru Marg, Hazratganj, Lucknow',
    serviceNames: ['Party Makeup', 'Lotus WhiteGlow Package'],
    totalAmount: 3190,
    date: '2026-10-27',
    timeSlot: '03:00 PM - 05:30 PM',
    status: 'assigned',
    assignedStylistId: 'sty-6',
    assignedStylistName: 'Neha Kapoor',
    paymentMethod: 'Prepaid Card',
    paymentStatus: 'paid',
    specialNotes: 'Anniversary celebration party makeup',
    createdAt: '2026-10-25 14:20'
  },
  {
    id: 'SL-94830',
    customerName: 'Suman Chaurasia',
    phone: '9450332211',
    city: 'Gorakhpur',
    locality: 'Civil Lines',
    fullAddress: 'Park Road, Civil Lines, Gorakhpur',
    serviceNames: ['ALL IN 1 Package (Rica Wax)'],
    totalAmount: 2799,
    date: '2026-10-27',
    timeSlot: '10:00 AM - 12:30 PM',
    status: 'pending',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'pending',
    specialNotes: 'Please confirm 1 hour prior to dispatch',
    createdAt: '2026-10-25 15:45'
  },
  {
    id: 'SL-94831',
    customerName: 'Tanvi Saxena',
    phone: '9838776655',
    city: 'Kanpur',
    locality: 'Kakadeo',
    fullAddress: 'Block M, Naveen Nagar, Kakadeo, Kanpur',
    serviceNames: ['O3+ Glowing Package'],
    totalAmount: 1899,
    date: '2026-10-28',
    timeSlot: '01:00 PM - 03:30 PM',
    status: 'assigned',
    assignedStylistId: 'sty-2',
    assignedStylistName: 'Meena Devi',
    paymentMethod: 'UPI on Spot',
    paymentStatus: 'pending',
    createdAt: '2026-10-25 16:30'
  },
  {
    id: 'SL-94832',
    customerName: 'Pooja Bhatnagar',
    phone: '9415889900',
    city: 'Lucknow',
    locality: 'Jankipuram',
    fullAddress: 'Sector F, Jankipuram Extension, Lucknow',
    serviceNames: ['Korean Facial Package', 'Threading'],
    totalAmount: 1799,
    date: '2026-10-28',
    timeSlot: '11:00 AM - 01:30 PM',
    status: 'pending',
    paymentMethod: 'UPI on Spot',
    paymentStatus: 'pending',
    createdAt: '2026-10-25 17:10'
  },
  {
    id: 'SL-94833',
    customerName: 'Alka Rastogi',
    phone: '9335123478',
    city: 'Varanasi',
    locality: 'Bhelupur',
    fullAddress: 'Near Vijaya Cinema, Bhelupur, Varanasi',
    serviceNames: ['VLCC Facial Package', 'ALL IN 1 Package (Rica Wax)'],
    totalAmount: 4194,
    date: '2026-10-29',
    timeSlot: '02:00 PM - 05:00 PM',
    status: 'assigned',
    assignedStylistId: 'sty-5',
    assignedStylistName: 'Archana Singh',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'pending',
    createdAt: '2026-10-25 18:00'
  },
  {
    id: 'SL-94834',
    customerName: 'Manju Keshri',
    phone: '9798443322',
    city: 'Patna',
    locality: 'Kankarbagh',
    fullAddress: 'Lohia Nagar, Kankarbagh, Patna',
    serviceNames: ['SARA Green Apple Package'],
    totalAmount: 1350,
    date: '2026-10-24',
    timeSlot: '10:00 AM - 12:30 PM',
    status: 'completed',
    assignedStylistId: 'sty-4',
    assignedStylistName: 'Rinki Kumari',
    paymentMethod: 'UPI on Spot',
    paymentStatus: 'paid',
    createdAt: '2026-10-23 09:30'
  }
];

export const initialStylists: StylistRecord[] = [
  {
    id: 'sty-1',
    name: 'Pooja Rawat',
    phone: '+91 7236851991',
    city: 'Lucknow',
    locality: 'Chinhat / Gomti Nagar Hub',
    specialization: 'Cosmetology & Clinical Facials (VLCC / Lotus)',
    experienceYears: 6,
    rating: 4.94,
    totalTrips: 482,
    monthlyEarnings: 44250,
    status: 'in_service',
    policeVerified: true,
    academyCertified: true,
    avatarInitials: 'PR',
    activeKitBatch: 'VLCC-LKO-26/B'
  },
  {
    id: 'sty-2',
    name: 'Meena Devi',
    phone: '+91 7236851992',
    city: 'Lucknow',
    locality: 'Mahanagar / Aliganj Hub',
    specialization: 'Full Body Waxing & Relaxing Reflexology',
    experienceYears: 4,
    rating: 4.88,
    totalTrips: 340,
    monthlyEarnings: 38600,
    status: 'on_duty',
    policeVerified: true,
    academyCertified: true,
    avatarInitials: 'MD',
    activeKitBatch: 'RICA-LKO-19/A'
  },
  {
    id: 'sty-3',
    name: 'Sunita Rawat',
    phone: '+91 7236851993',
    city: 'Patna',
    locality: 'Patliputra / Boring Road Hub',
    specialization: 'O3+ Derma Treatments & Hair Spa Science',
    experienceYears: 7,
    rating: 4.96,
    totalTrips: 620,
    monthlyEarnings: 48900,
    status: 'on_duty',
    policeVerified: true,
    academyCertified: true,
    avatarInitials: 'SR',
    activeKitBatch: 'O3-PAT-04/C'
  },
  {
    id: 'sty-4',
    name: 'Rinki Kumari',
    phone: '+91 7236851994',
    city: 'Patna',
    locality: 'Kankarbagh / Bailey Road',
    specialization: 'SARA Botanicals & Organic Cleanup',
    experienceYears: 3,
    rating: 4.85,
    totalTrips: 215,
    monthlyEarnings: 32400,
    status: 'on_duty',
    policeVerified: true,
    academyCertified: true,
    avatarInitials: 'RK',
    activeKitBatch: 'SARA-PAT-12/A'
  },
  {
    id: 'sty-5',
    name: 'Archana Singh',
    phone: '+91 7236851995',
    city: 'Varanasi',
    locality: 'Sigra / Lanka Hub',
    specialization: 'Aromatherapy & Herbal Face Polishing',
    experienceYears: 5,
    rating: 4.91,
    totalTrips: 395,
    monthlyEarnings: 41200,
    status: 'on_duty',
    policeVerified: true,
    academyCertified: true,
    avatarInitials: 'AS',
    activeKitBatch: 'AROMA-VNS-08/B'
  },
  {
    id: 'sty-6',
    name: 'Neha Kapoor',
    phone: '+91 7236851996',
    city: 'Lucknow',
    locality: 'Hazratganj / Cantt',
    specialization: '3D HD & Airbrush Bridal Master Artist',
    experienceYears: 8,
    rating: 4.98,
    totalTrips: 512,
    monthlyEarnings: 56500,
    status: 'off_duty',
    policeVerified: true,
    academyCertified: true,
    avatarInitials: 'NK',
    activeKitBatch: 'BRIDAL-LKO-99/HD'
  }
];

export const initialInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    brand: 'VLCC',
    productName: 'Insta Glow Facial Mono-Dose Kit (6 Steps)',
    category: 'Facial Kit',
    unit: 'Single-use Kits',
    currentStock: 48,
    minThreshold: 20,
    unitCost: 420,
    sellingValue: 996,
    batchNumber: 'VLCC-2026-OCT-18',
    expiryDate: '11/2027',
    status: 'sufficient'
  },
  {
    id: 'inv-2',
    brand: 'Lotus Herbals',
    productName: 'WhiteGlow Skin Whitening Facial Pack (90 min)',
    category: 'Facial Kit',
    unit: 'Single-use Kits',
    currentStock: 32,
    minThreshold: 15,
    unitCost: 460,
    sellingValue: 1090,
    batchNumber: 'LOTUS-WG-892',
    expiryDate: '09/2027',
    status: 'sufficient'
  },
  {
    id: 'inv-3',
    brand: 'O3+',
    productName: 'Radiant Oxygen Derma Kit Mono-dose',
    category: 'Facial Kit',
    unit: 'Single-use Kits',
    currentStock: 9,
    minThreshold: 12,
    unitCost: 850,
    sellingValue: 1899,
    batchNumber: 'O3-DERMA-44',
    expiryDate: '01/2028',
    status: 'low_stock'
  },
  {
    id: 'inv-4',
    brand: 'Rica Italian Wax',
    productName: 'White Chocolate Liposoluble Wax Cartridges (800g)',
    category: 'Waxing',
    unit: 'Tins',
    currentStock: 6,
    minThreshold: 10,
    unitCost: 720,
    sellingValue: 1200,
    batchNumber: 'RICA-IT-781',
    expiryDate: '05/2028',
    status: 'low_stock'
  },
  {
    id: 'inv-5',
    brand: 'SARA',
    productName: 'Green Apple Purifying Clay & Pedicure Salts',
    category: 'Facial Kit',
    unit: 'Duo Kits',
    currentStock: 24,
    minThreshold: 10,
    unitCost: 510,
    sellingValue: 1350,
    batchNumber: 'SARA-GA-103',
    expiryDate: '08/2027',
    status: 'sufficient'
  },
  {
    id: 'inv-6',
    brand: 'Beautiva Disposables',
    productName: 'Sanitized Non-Woven Bed Roll (100 Sheets)',
    category: 'Disposables',
    unit: 'Rolls',
    currentStock: 14,
    minThreshold: 8,
    unitCost: 350,
    sellingValue: 0,
    batchNumber: 'HYG-ROLL-2026',
    expiryDate: '12/2029',
    status: 'sufficient'
  },
  {
    id: 'inv-7',
    brand: 'Beautiva Disposables',
    productName: 'Birchwood Wax Spatulas & Sterile Strips',
    category: 'Disposables',
    unit: 'Packs of 500',
    currentStock: 4,
    minThreshold: 6,
    unitCost: 220,
    sellingValue: 0,
    batchNumber: 'SPAT-WOOD-500',
    expiryDate: '12/2029',
    status: 'low_stock'
  }
];

export const initialAcademyStudents: AcademyStudent[] = [
  {
    id: 'acad-1',
    studentName: 'Anjali Tiwari',
    phone: '9838012399',
    course: 'Diploma in Cosmetology & Skin Science',
    city: 'Lucknow',
    enrollmentDate: '2026-08-01',
    progressPercent: 78,
    apprenticeshipHours: 140,
    status: 'apprenticeship',
    placementStatus: 'placed_beautiva'
  },
  {
    id: 'acad-2',
    studentName: 'Shreya Pandey',
    phone: '9450011228',
    course: 'Advanced Bridal & HD Makeup Artistry',
    city: 'Lucknow',
    enrollmentDate: '2026-09-15',
    progressPercent: 55,
    apprenticeshipHours: 65,
    status: 'training',
    placementStatus: 'pending'
  },
  {
    id: 'acad-3',
    studentName: 'Pooja Kashyap',
    phone: '9798088771',
    course: 'Professional Hair Technology',
    city: 'Patna',
    enrollmentDate: '2026-07-10',
    progressPercent: 95,
    apprenticeshipHours: 210,
    status: 'graduated',
    placementStatus: 'placed_beautiva'
  },
  {
    id: 'acad-4',
    studentName: 'Komal Verma',
    phone: '9415077123',
    course: 'Nail Art, Extensions & Reflexology',
    city: 'Lucknow',
    enrollmentDate: '2026-09-01',
    progressPercent: 62,
    apprenticeshipHours: 80,
    status: 'training',
    placementStatus: 'pending'
  }
];
