// ═══════════════════════════════════════════════════════════
// SELAH STRIPE PORTAL — Creates billing portal session for subscription management
// ═══════════════════════════════════════════════════════════

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // Find customer by email
    const searchRes = await fetch(
      `https://api.stripe.com/v1/customers/search?query=email:'${encodeURIComponent(email.toLowerCase())}'`,
      {
        headers: { 'Authorization': `Bearer ${STRIPE_SECRET}` },
      }
    );
    const searchData = await searchRes.json();

    if (!searchData.data || searchData.data.length === 0) {
      return res.status(404).json({ error: 'No Stripe customer found for this email. Make sure your login email matches the email you used for payment.' });
    }

    const customerId = searchData.data[0].id;

    // Create billing portal session
    const portalRes = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `customer=${customerId}&return_url=${encodeURIComponent('https://selah-transcend.com')}`,
    });
    const portalData = await portalRes.json();

    if (portalData.url) {
      return res.status(200).json({ url: portalData.url });
    } else {
      console.error('Portal creation failed:', JSON.stringify(portalData));
      return res.status(500).json({ error: 'Could not create portal session' });
    }

  } catch (error) {
    console.error('Stripe portal error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
