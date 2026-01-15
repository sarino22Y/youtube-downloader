import { NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!ytdl.validateURL(url)) {
      return NextResponse.json({ error: "Lien non valide" }, { status: 400 });
    }

    // Récupération du cookie depuis les variables d'environnement
    const COOKIE = process.env.YT_COOKIE || "";

    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          cookie: COOKIE,
          // Un User-Agent récent est indispensable avec le cookie
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        }
      }
    });

    const formats = ytdl.filterFormats(info.formats, 'audioandvideo').map(f => ({
      quality: f.qualityLabel || '720p',
      container: f.container || 'mp4',
      // On génère une URL qui pointe vers notre propre API de stream (GET)
      url: `/api/download?url=${encodeURIComponent(url)}&quality=${f.itag}`
    }));

    return NextResponse.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
      formats
    });

  } catch (error: any) {
    console.error('Erreur Sarino Lab:', error.message);
    return NextResponse.json({ error: "YouTube bloque la connexion (429). Vérifiez les cookies." }, { status: 500 });
  }
}

// L'API GET pour le téléchargement réel (Force le nom du fichier)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const videoUrl = searchParams.get('url');
  const itag = searchParams.get('quality');

  if (!videoUrl) return NextResponse.json({ error: "Lien manquant" }, { status: 400 });

  try {
    const COOKIE = process.env.YT_COOKIE || "";
    const info = await ytdl.getInfo(videoUrl, {
      requestOptions: { headers: { cookie: COOKIE } }
    });
    
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

    const stream = ytdl(videoUrl, {
      quality: itag ? parseInt(itag) : 'highest',
      requestOptions: { headers: { cookie: COOKIE } }
    });

    return new Response(stream as any, {
      headers: {
        'Content-Disposition': `attachment; filename="${title}.mp4"`,
        'Content-Type': 'video/mp4',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Erreur lors du stream" }, { status: 500 });
  }
}