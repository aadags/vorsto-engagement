

const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export const getCustomerBilling = async (customerId) => {
    try {
      
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: 'https://engage.vorsto.io',
      });

      return session;

    } catch (error) {
      console.error(error);
      throw error;
    }
};

export const getCustomerSession = async (customerId) => {
  try {
    
    const session = await stripe.customerSessions.create({
      customer: customerId,
      components: {
        pricing_table: {
          enabled: true,
        },
      },
    });

    return session;

  } catch (error) {
    console.error(error);
    throw error;
  }
};
  