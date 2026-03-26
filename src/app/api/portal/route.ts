import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId, customerId } = await req.json();

    if (!customerId) {
        return NextResponse.json({ error: 'No se encontró ID de cliente de Stripe' }, { status: 400 });
    }

    const { url } = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${req.nextUrl.origin}/`,
    });

    return NextResponse.json({ url });
  } catch (err: any) {
    console.error(`Portal Error: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
