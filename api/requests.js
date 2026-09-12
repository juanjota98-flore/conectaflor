export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://jbsgahlfsixbltvpdmqt.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impic2dhaGxmc2l4Ymx0dnBkbXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTY4NjQsImV4cCI6MjA5NTc3Mjg2NH0.didWmqYGuUYlx4LIXRnlEB14uElEErm_Ujn_tCcaufc';

    if (req.method === 'POST') {
      const { requester_id, recipient_id, kind } = req.body;

      if (!requester_id || !recipient_id || !kind) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/requests`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          requester_id,
          recipient_id,
          kind,
          status: 'open',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Supabase error:', errorText);
        return res.status(response.status).json({ error: errorText });
      }

      const data = await response.json();
      if (!data || !Array.isArray(data)) {
        return res.status(500).json({ error: 'Invalid response from Supabase' });
      }
      res.status(201).json(data[0]);
      return;
    }

    if (req.method === 'GET') {
      const { user_id, status = 'open' } = req.query;

      if (!user_id) {
        return res.status(400).json({ error: 'Missing user_id' });
      }

      const query = `requester_id=eq.${user_id},recipient_id=eq.${user_id}`;
      const statusFilter = status ? `&status=eq.${status}` : '';
      const url = `${supabaseUrl}/rest/v1/requests?or=(${query})${statusFilter}&order=created_at.desc`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: errorText });
      }

      const data = await response.json();
      res.status(200).json(data);
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
