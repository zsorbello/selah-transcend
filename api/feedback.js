export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.FEEDBACK_EMAIL;

  if (!resendKey || !toEmail) {
    console.error('Missing RESEND_API_KEY or FEEDBACK_EMAIL');
    return res.status(500).json({ error: 'Email not configured' });
  }

  try {
    const { rating, what, improve, feature, userName } = req.body;

    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Phoenix' });

    const html = `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#F5F1E8;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="color:#2C2C2C;font-size:20px;font-weight:normal;margin:0;">New Selah Feedback</h1>
          <p style="color:#8A9884;font-size:12px;font-style:italic;margin:8px 0 0;">${timestamp}</p>
        </div>
        
        <div style="background:#fff;border-radius:8px;padding:20px;margin-bottom:16px;border:1px solid #e0ddd5;">
          <p style="color:#8A9884;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">From</p>
          <p style="color:#2C2C2C;font-size:16px;margin:0;">${userName || 'Anonymous user'}</p>
        </div>

        <div style="background:#fff;border-radius:8px;padding:20px;margin-bottom:16px;border:1px solid #e0ddd5;">
          <p style="color:#8A9884;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Rating</p>
          <p style="font-size:24px;margin:0;color:#D4A574;">${stars}</p>
          <p style="color:#2C2C2C;font-size:14px;margin:4px 0 0;">${rating} out of 5</p>
        </div>

        ${what ? `
        <div style="background:#fff;border-radius:8px;padding:20px;margin-bottom:16px;border:1px solid #e0ddd5;">
          <p style="color:#8A9884;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">What They Like</p>
          <p style="color:#2C2C2C;font-size:14px;font-style:italic;line-height:1.8;margin:0;">${what}</p>
        </div>` : ''}

        ${improve ? `
        <div style="background:#fff;border-radius:8px;padding:20px;margin-bottom:16px;border:1px solid #e0ddd5;">
          <p style="color:#B8856C;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">What Could Be Better</p>
          <p style="color:#2C2C2C;font-size:14px;font-style:italic;line-height:1.8;margin:0;">${improve}</p>
        </div>` : ''}

        ${feature ? `
        <div style="background:#fff;border-radius:8px;padding:20px;margin-bottom:16px;border:1px solid #e0ddd5;">
          <p style="color:#A8B5A2;font-size:10px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Feature Request</p>
          <p style="color:#2C2C2C;font-size:14px;font-style:italic;line-height:1.8;margin:0;">${feature}</p>
        </div>` : ''}

        <div style="text-align:center;margin-top:24px;padding-top:16px;border-top:1px solid #e0ddd5;">
          <p style="color:#8A9884;font-size:11px;font-style:italic;margin:0;">Selah Feedback System · selah-transcend.vercel.app</p>
        </div>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'Selah Feedback <onboarding@resend.dev>',
        to: [toEmail],
        subject: `${stars} Selah Feedback from ${userName || 'Anonymous'} — ${rating}/5`,
        html: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', response.status, JSON.stringify(data));
      return res.status(response.status).json(data);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Feedback email error:', error.message);
    return res.status(500).json({ error: 'Failed to send feedback' });
  }
}
