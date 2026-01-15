import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();

    // On utilise un moteur de recherche de liens MP4 universel
    return NextResponse.json({
      id: videoId,
      // Ces 3 moteurs sont des moteurs "Search" qui ne sont pas encore bloqués
      moteurs: [
        { name: "EXTRACTION ALPHA", url: `https://www.youtube-nocookie.com/embed/${videoId}` },
        { name: "EXTRACTION BETA", url: `https://en.savefrom.net/1-youtube-video-downloader-385v/` },
        { name: "EXTRACTION GAMMA", url: `https://9xbuddy.com/process?url=${encodeURIComponent(url)}` }
      ]
    });
  } catch (error) {
    return NextResponse.json({ error: "Lien non valide" }, { status: 400 });
  }
}