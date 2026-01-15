import ytdl from '@distube/ytdl-core';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!ytdl.validateURL(url)) return NextResponse.json({ error: "Lien invalide" }, { status: 400 });

    const info = await ytdl.getInfo(url);
    // Filtrage pour éviter le timeout : uniquement les formats combinés (Audio+Vidéo)
    const formats = ytdl.filterFormats(info.formats, 'audioandvideo').map(f => ({
      quality: f.qualityLabel,
      container: f.container,
      url: f.url, // Lien direct vers les serveurs de Google
    }));

    return NextResponse.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0].url,
      formats
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur d'extraction" }, { status: 500 });
  }
}