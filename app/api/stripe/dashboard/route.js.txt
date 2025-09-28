import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';

export async function GET() {
  try {
    // Obtener múltiples datos de Stripe en paralelo
    const [balance, subscriptions, paymentIntents, customers] = await Promise.all([
      stripe.balance.retrieve(),
      stripe.subscriptions.list({ 
        limit: 100, 
        status: 'active',
        expand: ['data.customer', 'data.items.data.price']
      }),
      stripe.paymentIntents.list({ 
        limit: 10,
        expand: ['data.customer']
      }),
      stripe.customers.list({ 
        limit: 100,
        expand: ['data.subscriptions']
      })
    ]);

    // Calcular métricas
    const monthlyRecurring = subscriptions.data.reduce((total, sub) => {
      return total + (sub.items.data[0]?.price.unit_amount || 0);
    }, 0) / 100;

    const totalRevenue = balance.available[0]?.amount / 100 || 0;

    // Preparar datos de usuarios
    const users = customers.data.map(customer => ({
      id: customer.id,
      name: customer.name || 'Cliente Sin Nombre',
      email: customer.email || 'Sin email',
      created: new Date(customer.created * 1000).toLocaleDateString('es-ES'),
      status: customer.subscriptions?.data?.length > 0 ? 'active' : 'inactive',
      subscription: customer.subscriptions?.data?.[0]?.status || 'none'
    }));

    // Preparar datos de suscripciones
    const subscriptionList = subscriptions.data.map(sub => ({
      id: sub.id,
      customer: {
        name: sub.customer?.name || 'Cliente Sin Nombre',
        email: sub.customer?.email || 'Sin email'
      },
      status: sub.status,
      amount: (sub.items.data[0]?.price.unit_amount || 0) / 100,
      interval: sub.items.data[0]?.price.recurring?.interval || 'month',
      created: new Date(sub.created * 1000).toLocaleDateString('es-ES'),
      current_period_end: new Date(sub.current_period_end * 1000).toLocaleDateString('es-ES')
    }));

    // Preparar datos para el dashboard
    const dashboardData = {
      totalRevenue,
      activeSubscriptions: subscriptions.data.length,
      monthlyRecurring,
      totalCustomers: customers.data.length,
      churnRate: 2.5,
      pendingInvoices: 0,
      users: users,
      subscriptions: subscriptionList,
      recentPayments: paymentIntents.data.slice(0, 5).map(payment => ({
        id: payment.id,
        amount: payment.amount / 100,
        status: payment.status,
        customer: payment.customer?.name || payment.customer?.email || 'Cliente',
        created: new Date(payment.created * 1000).toLocaleDateString('es-ES')
      })),
      recentSubscriptions: subscriptionList.slice(0, 5)
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching Stripe data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Stripe data' },
      { status: 500 }
    );
  }
}