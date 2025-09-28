import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';

export async function GET() {
  try {
    console.log('🔍 Fetching Stripe data...');
    
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
        limit: 100
      })
    ]);

    console.log(`📊 Found ${customers.data.length} customers`);
    console.log(`📈 Found ${subscriptions.data.length} subscriptions`);
    
    // Debug: mostrar primeros clientes
    if (customers.data.length > 0) {
      console.log('👥 Sample customers:', customers.data.slice(0, 3).map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        created: c.created
      })));
    }

    // Calcular métricas
    const monthlyRecurring = subscriptions.data.reduce((total, sub) => {
      return total + (sub.items.data[0]?.price.unit_amount || 0);
    }, 0) / 100;

    const totalRevenue = balance.available[0]?.amount / 100 || 0;

    // Preparar datos de usuarios - FORMA MEJORADA
    const users = customers.data.map(customer => {
      // Buscar suscripciones activas para este cliente
      const customerSubscriptions = subscriptions.data.filter(sub => {
        // Asegurarnos de que el customer existe y comparar IDs
        if (sub.customer && typeof sub.customer === 'object' && 'id' in sub.customer) {
          return sub.customer.id === customer.id;
        }
        return false;
      });
      
      const hasActiveSubscription = customerSubscriptions.some(sub => 
        sub.status === 'active' || sub.status === 'trialing'
      );
      
      return {
        id: customer.id,
        name: customer.name || 'Cliente Sin Nombre',
        email: customer.email || 'sin-email@ejemplo.com',
        created: new Date(customer.created * 1000).toLocaleDateString('es-ES'),
        status: hasActiveSubscription ? 'active' : 'inactive',
        subscription: hasActiveSubscription ? 'active' : 'none',
        // Información adicional para debugging
        _debug: {
          subscriptionsCount: customerSubscriptions.length,
          subscriptionStatuses: customerSubscriptions.map(s => s.status)
        }
      };
    });

    // Preparar datos de suscripciones - FORMA MEJORADA
    const subscriptionList = subscriptions.data.map(sub => {
      let customerName = 'Cliente Sin Nombre';
      let customerEmail = 'sin-email@ejemplo.com';
      
      // Manejar diferentes formas en que Stripe puede devolver el customer
      if (sub.customer) {
        if (typeof sub.customer === 'object' && 'name' in sub.customer) {
          customerName = sub.customer.name || customerName;
          customerEmail = sub.customer.email || customerEmail;
        } else if (typeof sub.customer === 'string') {
          // Si customer es solo un ID, buscar en la lista de customers
          const customer = customers.data.find(c => c.id === sub.customer);
          if (customer) {
            customerName = customer.name || customerName;
            customerEmail = customer.email || customerEmail;
          }
        }
      }

      return {
        id: sub.id,
        customer: {
          name: customerName,
          email: customerEmail
        },
        status: sub.status,
        amount: (sub.items.data[0]?.price.unit_amount || 0) / 100,
        interval: sub.items.data[0]?.price.recurring?.interval || 'month',
        created: new Date(sub.created * 1000).toLocaleDateString('es-ES'),
        current_period_end: new Date(sub.current_period_end * 1000).toLocaleDateString('es-ES')
      };
    });

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
      recentPayments: paymentIntents.data.slice(0, 5).map(payment => {
        let customerName = 'Cliente';
        
        if (payment.customer) {
          if (typeof payment.customer === 'object' && 'name' in payment.customer) {
            customerName = payment.customer.name || customerName;
          } else if (typeof payment.customer === 'string') {
            const customer = customers.data.find(c => c.id === payment.customer);
            customerName = customer?.name || customerName;
          }
        }

        return {
          id: payment.id,
          amount: payment.amount / 100,
          status: payment.status,
          customer: customerName,
          created: new Date(payment.created * 1000).toLocaleDateString('es-ES')
        };
      }),
      recentSubscriptions: subscriptionList.slice(0, 5),
      
      // Datos de debugging
      _debug: {
        totalUsers: users.length,
        totalSubscriptions: subscriptionList.length,
        stripeCustomersCount: customers.data.length,
        stripeSubscriptionsCount: subscriptions.data.length
      }
    };

    console.log('✅ Dashboard data prepared successfully');
    console.log('📋 Final data summary:', {
      users: dashboardData.users.length,
      subscriptions: dashboardData.subscriptions.length,
      totalRevenue: dashboardData.totalRevenue,
      activeSubscriptions: dashboardData.activeSubscriptions
    });

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('❌ Error fetching Stripe data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch Stripe data',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}