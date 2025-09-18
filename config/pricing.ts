interface Plan {
  name: string;
  description: string;
  features: string[];
  monthlyPrice: number;
  yearlyPrice: number;
}

const pricingPlans: Plan[] = [
  {
    name: 'Weekly Plan',
    description: 'Full access for 7 days. Perfect for testing our service.',
    features: [
      '24/7 automatic block capture',
      'Instant mobile alerts',
      'Priority WhatsApp support',
      'Free updates',
      '7-day satisfaction guarantee',
      'Referral program: Earn 10% commission'
    ],
    monthlyPrice: 2500, // $25.00 in cents
    yearlyPrice: 0 // Not applicable for weekly plan
  },
  {
    name: 'Monthly Plan',
    description: 'Full access for 30 days. Our most popular choice.',
    features: [
      '24/7 automatic block capture',
      'Instant mobile alerts',
      'Priority WhatsApp support',
      'Free updates',
      '30-day satisfaction guarantee',
      'Advanced performance statistics',
      'Access to exclusive blocks',
      '24/7 priority support',
      'Custom configurations',
      'Referral program: Earn 15% commission'
    ],
    monthlyPrice: 9000, // $90.00 in cents
    yearlyPrice: 0 // Not applicable for monthly plan
  }
];

export default pricingPlans;

import { Tables } from '@/types/db';

type Product = Tables<'products'>;
type Price = Tables<'prices'>;
interface ProductWithPrices extends Product {
  prices: Price[];
}

export const dummyPricing: ProductWithPrices[] = [
  {
    id: 'weekly-plan',
    name: 'Weekly Plan',
    description: 'Full access for 7 days',
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
        metadata: null
      }
    ],
    image: null,
    metadata: null,
    active: true
  },
  {
    id: 'monthly-plan',
    name: 'Monthly Plan',
    description: 'Full access for 30 days',
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
        metadata: null
      }
    ],
    image: null,
    metadata: null,
    active: true
  }
];