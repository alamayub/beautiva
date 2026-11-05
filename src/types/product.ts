export interface ServiceOption {
  id: string;
  name: string;
  priceDelta: number;
  description?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  categoryId: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  durationMinutes: number;
  description: string;
  shortDescription: string;
  image: string;
  inclusions: string[];
  options?: ServiceOption[];
  badge?: string;
  isPopular?: boolean;
  isPackage?: boolean;
  skinType?: string;
  stepsCount?: number;
  safetyProtocol: string[];
}
