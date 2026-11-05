import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Please enter your full name'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'),
  alternatePhone: z.string().optional(),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  houseFlat: z.string().min(2, 'Flat/House number is required'),
  streetArea: z.string().min(5, 'Street address or locality is required'),
  landmark: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
  serviceDate: z.string().min(1, 'Please select your preferred appointment date'),
  serviceTimeSlot: z.string().min(1, 'Please pick a preferred service time slot'),
  instructions: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const loginSchema = z.object({
  phoneOrEmail: z.string().min(4, 'Enter your registered mobile number or email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z.string().min(3, 'Enter your full name'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  email: z.string().email('Enter a valid email address'),
  city: z.string().min(2, 'Please select your city'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const contactSchema = z.object({
  name: z.string().min(3, 'Your name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit mobile required'),
  email: z.string().email('Valid email address required'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
