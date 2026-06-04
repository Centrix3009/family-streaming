export default async function handler(req, res) {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({
      error: "Missing movie title"
    });
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(title)}`
    );

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        error: "Movie not found"
      });
    }

    const posterPath = data.results[0].poster_path;

    return res.status(200).json({
      poster: `https://image.tmdb.org/t/p/w500${posterPath}`
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to fetch poster"
    });
  }
}
