// Generates a unique placeholder "photo" (gradient + initial) as SVG, so the
// app has no dependency on third-party image hosts and works offline.
function hash(str) {
  let h = 2166136261;
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return Math.abs(h);
}

export async function GET(request, { params }) {
  const { id } = await params;
  const name = new URL(request.url).searchParams.get("n") || id;
  const initial = (name.trim()[0] || "?").toUpperCase().replace(/[<>&"']/g, "?");
  const h = hash(id);
  const h1 = h % 360;
  const h2 = (h1 + 40 + (h % 60)) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${h1} 70% 62%)"/><stop offset="1" stop-color="hsl(${h2} 65% 38%)"/></linearGradient></defs>
<rect width="600" height="800" fill="url(#g)"/>
<circle cx="${150 + (h % 300)}" cy="${120 + (h % 160)}" r="210" fill="#fff" opacity=".08"/>
<circle cx="${420 - (h % 200)}" cy="${520 + (h % 120)}" r="260" fill="#fff" opacity=".07"/>
<text x="300" y="400" text-anchor="middle" dominant-baseline="central" font-family="Georgia,serif" font-size="280" fill="#fff" opacity=".9">${initial}</text>
</svg>`;
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
