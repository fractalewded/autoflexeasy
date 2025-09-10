interface Plan {
  name: string;
  description: string;
  features: string[];
  monthlyPrice: number;
  yearlyPrice: number;
}

const pricingPlans: Plan[] = [
  {
    name: 'Plan Semanal',
    description: 'Acceso completo por 7 días. Ideal para probar el servicio.',
    features: [
      'Captura automática de bloques 24/7',
      'Alertas instantáneas en tu móvil',
      'Soporte prioritario por WhatsApp',
      'Actualizaciones gratuitas',
      'Garantía de satisfacción de 7 días'
    ],
    monthlyPrice: 2500, // $25.00 en centavos
    yearlyPrice: 0 // No aplica para plan semanal
  },
  {
    name: 'Plan Mensual',
    description: 'Acceso completo por 30 días. El favorito de los conductores.',
    features: [
      'Todo lo del plan semanal',
      'Estadísticas de rendimiento avanzadas',
      'Acceso a bloques exclusivos',
      'Soporte prioritario 24/7',
      'Configuraciones personalizadas',
      'Ahorras $40 vs el plan semanal'
    ],
    monthlyPrice: 9000, // $90.00 en centavos
    yearlyPrice: 0 // No aplica para plan mensual
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
    name: 'Plan Semanal',
    description: 'Acceso completo por 7 días',
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
    name: 'Plan Mensual',
    description: 'Acceso completo por 30 días',
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
