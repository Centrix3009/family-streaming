// api/get-video-url.js
import { getVidLinkProVideo } from 'vidsrc-bypass';

export default async function handler(req, res) {
  // 1. Tell the browser it's okay for your frontend site to talk to this API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  // 2. A quick check for a pre-flight request from the browser
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Get the movie ID from the request (e.g., from a query like ?id=12345)
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Movie ID is required' });
  }

  try {
    // 4. Ask the library to find a video URL for this movie ID
    const movieVideo = await getVidLinkProVideo({ id, type: "movie" });
    
    if (movieVideo && movieVideo.url) {
      // 5. If found, send the URL back to your main website
      return res.status(200).json({ success: true, url: movieVideo.url });
    } else {
      // 6. If not, let the frontend know it couldn't find one
      return res.status(404).json({ success: false, error: 'Video URL not found' });
    }
  } catch (error) {
    // 7. Catch any unexpected errors
    console.error('Error fetching video URL:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
