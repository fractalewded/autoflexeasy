// config/pricing.ts

import { Tables } from '@/types/db';

// ——— Front-facing pricing model (para tu UI) ———
export interface Plan {
  name: string;
  description: string;
  features: string[];
  // usamos centavos: 2500 = $25.00, 9000 = $90.00
  monthlyPrice: number;
  yearlyPrice?: number; // no aplicable (opcional)
}

// mismo set de features en ambos planes
const sharedFeatures = [
  '24/7 automatic block capture',
  'Smart filtering & notifications',
  'Safe, lightweight, and easy setup',
  'Email support',
  'Free updates',
  'Satisfaction guarantee',
  'Referral program',
];

const pricingPlans: Plan[] = [
  {
    name: 'Weekly Plan',
    description: 'Full access for 7 days. Perfect for testing our service.',
    features: sharedFeatures,
    monthlyPrice: 2500, // $25.00 in cents (weekly UI card)
    yearlyPrice: 0,
  },
  {
    name: 'Monthly Plan',
    description: 'Full access for 30 days. Our most popular choice.',
    features: sharedFeatures,
    monthlyPrice: 9000, // $90.00 in cents (monthly UI card)
    yearlyPrice: 0,
  },
];

export default pricingPlans;

// ——— Dummy pricing (útil si renderizas con tu tipado de Supabase sin leer de la DB) ———
type Product = Tables<'products'>;
type Price = Tables<'prices'>;
export interface ProductWithPrices extends Product {
  prices: Price[];
}

// Ojo: estos IDs son “dummy”; en producción usa los de tu DB/Stripe.
export const dummyPricing: ProductWithPrices[] = [
  {
    id: 'weekly-plan',
    name: 'Weekly Plan',
    description: 'Full access for 7 days',
    active: true,
    image: null,
    metadata: null,
    prices: [
      {
        id: 'weekly-price',
        currency: 'USD',
        unit_amount: 2500, // $25.00
        interval: 'week',
        interval_count: 1,
        trial_period_days: null,
        type: 'recurring',
        active: true,
        product_id: 'weekly-plan',
        description: null,
        metadata: null,
      } as Price,
    ],
  } as ProductWithPrices,
  {
    id: 'monthly-plan',
    name: 'Monthly Plan',
    description: 'Full access for 30 days',
    active: true,
    image: null,
    metadata: null,
    prices: [
      {
        id: 'monthly-price',
        currency: 'USD',
        unit_amount: 9000, // $90.00
        interval: 'month',
        interval_count: 1,
        trial_period_days: null,
        type: 'recurring',
        active: true,
        product_id: 'monthly-plan',
        description: null,
        metadata: null,
      } as Price,
    ],
  } as ProductWithPrices,
];
