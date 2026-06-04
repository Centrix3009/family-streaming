// api/get-video-url.js
export default async function handler(req, res) {
  // Enable CORS for your frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Missing movie ID' });
  }

  // List of embed providers that work with TMDB ID
  // Format: just replace {id} with the actual ID
  const providers = [
    `https://vidsrc.to/embed/movie/${id}`,
    `https://vidsrc.xyz/embed/movie/${id}`,
    `https://vidsrc.pm/embed/movie/${id}`,
    `https://2embed.sx/embed/movie/${id}`,
    `https://embed.su/embed/movie/${id}`,
    `https://multiembed.mov/?video_id=${id}&tmdb=1`
  ];

  // Try each provider quickly (HEAD request) to find one that's alive
  for (const url of providers) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const check = await fetch(url, { method: 'HEAD', signal: controller.signal });
      clearTimeout(timeoutId);
      if (check.ok) {
        return res.status(200).json({ success: true, url });
      }
    } catch (err) {
      // Provider failed, continue to next
      console.log(`Provider failed: ${url}`);
    }
  }

  // If none responded, return the first provider anyway (it might still work)
  return res.status(200).json({ success: true, url: providers[0] });
}
