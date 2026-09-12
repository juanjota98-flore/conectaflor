export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://jbsgahlfsixbltvpdmqt.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impic2dhaGxmc2l4Ymx0dnBkbXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTY4NjQsImV4cCI6MjA5NTc3Mjg2NH0.didWmqYGuUYlx4LIXRnlEB14uElEErm_Ujn_tCcaufc';

    const { status = 'approved' } = req.query;

    const url = `${supabaseUrl}/rest/v1/listings?select=*&status=eq.${status}&order=created_at.desc`;

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
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}
