/** @type {import('next').NextConfig} */
const nextConfig = {
  // The assignment names the endpoints GET /feed, POST /swipe, GET /matches.
  // They are served from /api/* and aliased at the root so both URLs work.
  async rewrites() {
    return [
      { source: "/feed", destination: "/api/feed" },
      { source: "/swipe", destination: "/api/swipe" },
      { source: "/matches", destination: "/api/matches" },
    ];
  },
};
export default nextConfig;
