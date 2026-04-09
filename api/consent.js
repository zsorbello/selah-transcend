export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET = parent clicking approval link
  if (req.method === 'GET') {
    const { code, action } = req.query;
    if (!code) return res.status(400).send('Missing consent code.');

    if (action === 'approve') {
      return res.status(200).send(`
        <html>
          <body style="font-family:Georgia,serif;max-width:500px;margin:60px auto;padding:24px;text-align:center;background:#F5F1E8;">
            <h1 style="color:#8FA88A;font-size:28px;font-weight:normal;">✓ Approved</h1>
            <p style="color:#2C2C2C;font-size:16px;line-height:1.8;">
              Thank you for giving your child permission to use Selah. Their account is now active.
            </p>
            <p style="color:#8A8A82;font-size:13px;font-style:italic;margin-top:24px;">
              Your child's reflections are stored locally on their device and are never shared.
              Crisis resources (988 Lifeline, Crisis Text Line) are always accessible in the app.
            </p>
            <p style="color:#8A8A82;font-size:12px;margin-top:32px;">
              Approval code: <strong>${code}</strong> — have your child enter this in the app.
            </p>
          </body>
        </html>
      `);
    }

    if (action === 'deny') {
      return res.status(200).send(`
        <html>
          <body style="font-family:Georgia,serif;max-width:500px;margin:60px auto;padding:24px;text-align:center;background:#F5F1E8;">
            <h1 style="color:#B8856C;font-size:28px;font-weight:normal;">Request Denied</h1>
            <p style="color:#2C2C2C;font-size:16px;line-height:1.8;">
              You've chosen not to approve access. Your child will not be able to use Selah.
            </p>
            <p style="color:#8A8A82;font-size:13px;font-style:italic;margin-top:24px;">
              If you change your mind, ask your child to go through the signup process again.
            </p>
          </body>
        </html>
      `);
    }

    return res.status(400).send('Invalid action.');
  }

  // POST = send consent email to parent
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error('Missing RESEND_API_KEY');
    return res.status(500).json({ error: 'Email not configured' });
  }

  try {
    const { parentEmail, childName, consentCode } = req.body;

    if (!parentEmail || !consentCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const baseUrl = req.headers.host ? `https://${req.headers.host}` : 'https://selah-transcend.vercel.app';
    const approveUrl = `${baseUrl}/api/consent?code=${consentCode}&action=approve`;
    const denyUrl = `${baseUrl}/api/consent?code=${consentCode}&action=deny`;

    const html = `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:0;background:#F5F1E8;">
        
        <div style="padding:40px 32px 24px;text-align:center;">
          <h1 style="color:#2C2C2C;font-size:26px;font-weight:normal;margin:0 0 4px;letter-spacing:1px;">selah</h1>
          <p style="color:#8A9884;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0;">be still & know</p>
        </div>

        <div style="background:#fff;border-radius:12px;padding:28px;margin:0 16px 16px;border:1px solid #e0ddd5;">
          <p style="color:#2C2C2C;font-size:16px;line-height:1.9;margin:0 0 20px;">
            Hi — <strong>${childName || 'your child'}</strong> just took a brave step. They want to use Selah to work on their mental health, and they need your permission.
          </p>
          <p style="color:#2C2C2C;font-size:16px;line-height:1.9;margin:0 0 20px;">
            We know how that sounds. Another app? For a teenager? Hear us out.
          </p>
          <p style="color:#2C2C2C;font-size:16px;line-height:1.9;margin:0;">
            <strong>Selah is the opposite of everything you're worried about.</strong>
          </p>
        </div>

        <div style="background:#fff;border-radius:12px;padding:28px;margin:0 16px 16px;border:1px solid #e0ddd5;">
          <p style="color:#8A9884;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px;font-weight:bold;">What Selah Is</p>
          <p style="color:#2C2C2C;font-size:15px;line-height:1.9;margin:0 0 16px;">
            A private, faith-rooted mental wellness space where young people can reflect on what they're carrying — stress, identity, purpose, faith, emotions — through guided journaling, breathing exercises, and AI-powered conversations that actually listen.
          </p>
          <p style="color:#2C2C2C;font-size:15px;line-height:1.9;margin:0;">
            Think of it as a safe place to pause and process. That's literally what "selah" means — <em>pause, reflect, take it in</em>.
          </p>
        </div>

        <div style="background:#fff;border-radius:12px;padding:28px;margin:0 16px 16px;border:1px solid #e0ddd5;">
          <p style="color:#8A9884;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px;font-weight:bold;">What Selah Is NOT</p>
          <p style="color:#2C2C2C;font-size:15px;line-height:2.0;margin:0;">
            ✕ Not social media<br>
            ✕ No ads, no data selling, no algorithms<br>
            ✕ No messaging, no strangers, no followers<br>
            ✕ No content designed to keep them scrolling<br>
            ✕ Nothing leaves their device — all data is stored locally
          </p>
        </div>

        <div style="background:#fff;border-radius:12px;padding:28px;margin:0 16px 16px;border:1px solid #e0ddd5;">
          <p style="color:#8A9884;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px;font-weight:bold;">How We Protect Your Child</p>
          <p style="color:#2C2C2C;font-size:15px;line-height:2.0;margin:0;">
            ✓ All AI conversations are age-filtered — no inappropriate content, ever<br>
            ✓ If they mention self-harm, abuse, or danger, the app immediately surfaces crisis resources<br>
            ✓ 988 Suicide & Crisis Lifeline and Crisis Text Line are always one tap away<br>
            ✓ We encourage them to talk to trusted adults — the app reinforces that consistently<br>
            ✓ Zero data collection, zero tracking, zero sharing with third parties
          </p>
        </div>

        <div style="background:#fff;border-radius:12px;padding:28px;margin:0 16px 16px;border:1px solid #e0ddd5;">
          <p style="color:#8A9884;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px;font-weight:bold;">Why This Matters</p>
          <p style="color:#2C2C2C;font-size:15px;line-height:1.9;margin:0;">
            Too many young people are carrying weight they don't know how to talk about — and the apps they're already using are making it worse. We built Selah because we believe everyone deserves a space to be honest with themselves without judgment. Your child is choosing to do the work. That takes courage.
          </p>
        </div>

        <div style="text-align:center;padding:28px 16px;">
          <p style="color:#2C2C2C;font-size:15px;font-style:italic;line-height:1.8;margin:0 0 24px;">
            One tap to let them begin:
          </p>
          <a href="${approveUrl}" style="display:inline-block;background:#8FA88A;color:#fff;text-decoration:none;padding:18px 48px;border-radius:6px;font-size:13px;letter-spacing:3px;text-transform:uppercase;font-family:Georgia,serif;">
            I Approve
          </a>
          <br><br>
          <a href="${denyUrl}" style="color:#B8856C;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-family:Georgia,serif;">
            Not at this time
          </a>
        </div>

        <div style="text-align:center;padding:16px 32px 32px;border-top:1px solid #e0ddd5;margin:0 16px;">
          <p style="color:#8A8A82;font-size:11px;font-style:italic;line-height:1.8;margin:0;">
            If you have questions, talk to your child — they can show you the app.<br>
            If you didn't expect this, you can safely ignore it.<br><br>
            Selah · selah-transcend.vercel.app<br>
            <em>Be still & know.</em>
          </p>
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
        from: 'Selah <onboarding@resend.dev>',
        to: [parentEmail],
        subject: `${childName || 'Your child'} wants to work on their mental health — they need your okay`,
        html: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', response.status, JSON.stringify(data));
      return res.status(response.status).json(data);
    }

    return res.status(200).json({ success: true, code: consentCode });
  } catch (error) {
    console.error('Consent email error:', error.message);
    return res.status(500).json({ error: 'Failed to send consent email' });
  }
}
