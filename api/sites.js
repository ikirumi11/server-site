// Vercel serverless API.
// This endpoint provides the current site registry. For persistent writes,
// connect a database (for example Vercel Postgres/KV or another database)
// and replace the read section with database queries.

const fallbackSites = [
  {
    name: 'Ikirumi Games',
    description: 'Games, projects and updates.',
    url: 'https://ikirumi11.github.io/server-site/',
    category: 'Games'
  }
];

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vercel environment variable SITE_REGISTRY can contain JSON for a
  // server-side registry without changing the frontend.
  let sites = fallbackSites;
  if (process.env.SITE_REGISTRY) {
    try {
      const parsed = JSON.parse(process.env.SITE_REGISTRY);
      if (Array.isArray(parsed)) sites = parsed;
    } catch (_) {
      return res.status(500).json({ error: 'Invalid SITE_REGISTRY configuration' });
    }
  }

  return res.status(200).json({ sites });
}
