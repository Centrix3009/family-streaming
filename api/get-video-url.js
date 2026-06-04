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

  // List of working embed providers (June 2026)
  const providers = [
    `https://vidsrc.to/embed/movie/${id}`,
    `https://vidsrc.xyz/embed/movie/${id}`,
    `https://vidsrc.pm/embed/movie/${id}`,
    `https://2embed.sx/embed/movie/${id}`,
    `https://embed.su/embed/movie/${id}`,
    `https://multiembed.mov/?video_id=${id}&tmdb=1`
  ];

  // Try each provider with a 3-second timeout
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

  // If all checks fail, return the first URL anyway (it might still load in the iframe)
  return res.status(200).json({ success: true, url: providers[0] });
}
