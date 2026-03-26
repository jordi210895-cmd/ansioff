import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const session = event.data.object as any;
      const userId = session.metadata?.userId;
      
      if (userId) {
        // Update user profile to premium
        await supabase
          .from('profiles')
          .update({ is_premium: true, stripe_customer_id: session.customer as string })
          .eq('id', userId);
      }
      break;
    
    case 'customer.subscription.deleted':
      const subscription = event.data.object as any;
      const customerId = subscription.customer as string;
      
      // Update user profile to not premium
      await supabase
        .from('profiles')
        .update({ is_premium: false })
        .eq('stripe_customer_id', customerId);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
