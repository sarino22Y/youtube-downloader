import { NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const videoUrl = searchParams.get('url');

  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return NextResponse.json({ error: "Lien invalide" }, { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    // On nettoie le titre pour le nom du fichier
    const cleanTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '');

    // On récupère le flux (stream) de la meilleure qualité combinée
    const stream = ytdl(videoUrl, {
      quality: 'highestvideo',
      filter: 'audioandvideo'
    });

    // On renvoie le flux directement avec le bon nom de fichier !
    return new Response(stream as any, {
      headers: {
        'Content-Disposition': `attachment; filename="${cleanTitle}.mp4"`,
        'Content-Type': 'video/mp4',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Erreur serveur: " + error.message }, { status: 500 });
  }
}

// On ajoute aussi le POST pour l'analyse initiale (la recherche)
export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    const info = await ytdl.getInfo(url);
    const formats = ytdl.filterFormats(info.formats, 'audioandvideo').map(f => ({
      quality: f.qualityLabel,
      container: f.container,
      url: `/api/download?url=${encodeURIComponent(url)}` // On renvoie vers notre propre API GET
    }));

    return NextResponse.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
      formats
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}