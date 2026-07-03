export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const email = body.email || body.purchase?.email;
    const saleId = body.sale_id || body.id;
    
    if (!email) {
      return res.status(400).json({ error: 'No email found' });
    }

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const response = await fetch(
      'https://lpupgomwykhnyrcfnghy.supabase.co/rest/v1/users',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdXBnb213eWtobnlyY2ZuZ2h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjU4MTkzMSwiZXhwIjoyMDk4MTU3OTMxfQ.kNGL5uPnbCnVtQCBAOWlV89sqVbvjO0yzVnCw_2f8XA',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdXBnb213eWtobnlyY2ZuZ2h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjU4MTkzMSwiZXhwIjoyMDk4MTU3OTMxfQ.kNGL5uPnbCnVtQCBAOWlV89sqVbvjO0yzVnCw_2f8XA',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          expires_at: expiresAt.toISOString(),
          gumroad_sale_id: saleId
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Supabase error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    return res.status(200).json({ success: true, email });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
                    }
