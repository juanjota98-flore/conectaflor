export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { table, status, order } = req.query;
    if (!table) {
      return res.status(400).json({ error: 'Missing table parameter' });
    }

    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impic2dhaGxmc2l4Ymx0dnBkbXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTY4NjQsImV4cCI6MjA5NTc3Mjg2NH0.didWmqYGuUYlx4LIXRnlEB14uElEErm_Ujn_tCcaufc';

    let query = `*`;
    if (status) query += `&status=eq.${status}`;
    if (order) query += `&order=${order}`;

    const response = await fetch(`https://jbsgahlfsixbltvpdmqt.supabase.co/rest/v1/${table}?select=${query}`, {
      method: 'GET',
      headers: {
        'apikey': anonKey,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
