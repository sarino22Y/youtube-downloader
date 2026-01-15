"use client";

import { useState } from 'react';
import { VideoInfo } from '@/types/youtube';

export default function Home() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<VideoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState('');

  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    setData(null); // Reset précédent
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      
      setData(result);
      if (result.formats?.length > 0) {
        setSelectedUrl(result.formats[0].url);
      }
    } catch (err: any) {
      alert(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header Sarino */}
      <header className="pt-16 pb-12 px-4 text-center">
        <div className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-white uppercase bg-red-600 rounded-md">
          Sarino Private Tool
        </div>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tighter mb-4">
          SARINO<span className="text-red-600">.</span>LAB
        </h1>
        <p className="text-lg text-slate-500 italic max-w-md mx-auto">
          &quot;Collez. Analysez. Gardez...&quot;
        </p>
        <div className="h-1.5 w-16 bg-red-600 mx-auto mt-6 rounded-full"></div>
      </header>

      <main className="max-w-2xl mx-auto px-4">
        {/* Input Section */}
        <div className="bg-white p-2 rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            className="flex-1 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50 border-none text-slate-800"
            placeholder="Collez votre lien YouTube ici..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-slate-900 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? "Analyse..." : "Extraire"}
          </button>
        </div>

        {/* Result Card */}
        {data && (
          <div className="mt-10 bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Image avec sécurité */}
            <div className="relative h-56 sm:h-72 w-full bg-slate-200">
              {data.thumbnail && (
                <img 
                  src={data.thumbnail} 
                  alt="Video Preview" 
                  className="w-full h-full object-cover" 
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <h2 className="absolute bottom-6 left-8 right-8 text-white font-bold text-xl sm:text-2xl line-clamp-2">
                {data.title}
              </h2>
            </div>

            <div className="p-8 sm:p-10">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                Qualité disponible
              </label>
              
              <div className="space-y-4">
                <select
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-red-600 outline-none appearance-none cursor-pointer font-medium"
                  value={selectedUrl}
                  onChange={(e) => setSelectedUrl(e.target.value)}
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1.25rem center',
                    backgroundSize: '1.2em'
                  }}
                >
                  {data.formats.map((f, i) => (
                    <option key={i} value={f.url}>
                      {f.quality} — format .{f.container}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => window.open(selectedUrl, '_blank')}
                  className="group flex items-center justify-center gap-3 w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-red-200 active:scale-[0.98]"
                >
                  <svg className="w-6 h-6 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  TÉLÉCHARGER MAINTENANT
                </button>
              </div>
              
              <p className="mt-6 text-[11px] text-center text-slate-400 leading-relaxed uppercase tracking-tighter">
                Note technique : Le flux est extrait directement des serveurs Google.<br/>
                En cas de blocage, clic-droit sur la vidéo {'>'} &quot;Enregistrer sous&quot;.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer Sarino */}
      <footer className="mt-20 text-center">
        <p className="text-slate-400 text-sm">
          Propulsé par la technologie <span className="font-bold text-slate-800">Sarino.Lab</span>
        </p>
        <div className="flex justify-center gap-4 mt-2 text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
          <span>Next.js 15</span>
          <span>•</span>
          <span>TypeScript</span>
          <span>•</span>
          <span>Vercel Edge</span>
        </div>
      </footer>
    </div>
  );
}