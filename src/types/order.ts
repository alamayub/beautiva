export interface CartItem {
  product: import('./product').Product;
  quantity: number;
  selectedOption?: import('./product').ServiceOption;
}

export interface Address {
  fullName: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  houseFlat: string;
  streetArea: string;
  landmark?: string;
  city: string;
  pincode: string;
  serviceDate: string;
  serviceTimeSlot: string;
  instructions?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  address: Address;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'confirmed' | 'technician_assigned' | 'completed' | 'cancelled';
  assignedBeautician?: {
    name: string;
    verified: boolean;
    rating: number;
  };
}
