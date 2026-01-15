"use client";
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleBypass = async () => {
    setLoading(true);
    const res = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const result = await res.json();
    setData(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#000] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg border-2 border-zinc-800 bg-zinc-950 p-10 rounded-[3rem] shadow-[0_0_80px_rgba(255,255,255,0.05)]">
        
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-black italic tracking-tighter">SARINO<span className="text-red-600">.</span>LAB</h1>
          <p className="text-[8px] tracking-[0.8em] text-zinc-600 uppercase mt-2">Protocol: Anti-Censorship 2026</p>
        </div>

        <input 
          className="w-full bg-zinc-900 border border-white/5 p-5 rounded-2xl outline-none mb-4 text-center text-sm focus:border-red-600 transition-all"
          placeholder="COLLE TON LIEN YOUTUBE"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        
        <button 
          onClick={handleBypass}
          disabled={loading}
          className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-red-600 hover:text-white transition-all duration-500"
        >
          {loading ? "SCAN EN COURS..." : "FORCER L'EXTRACTION"}
        </button>

        {data && (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4">
            <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-2xl text-[10px] text-red-500 text-center uppercase font-bold">
              Attention: Les serveurs classiques sont fermés. Utilisation du mode Scan.
            </div>

            {/* MOTEUR 9XBUDDY : Le survivant ultime */}
            <button 
              onClick={() => window.open(`https://9xbuddy.com/process?url=${encodeURIComponent(url)}`, '_blank')}
              className="w-full bg-zinc-800 p-6 rounded-2xl font-black flex items-center justify-between group hover:bg-zinc-700 transition-all"
            >
              <span>🚀 MOTEUR SCANNER GAMMA</span>
              <span className="text-xs bg-red-600 px-2 py-1 rounded">ON</span>
            </button>

            {/* MOTEUR DE SECOURS : Y2MATE INDIRECT */}
            <button 
              onClick={() => window.open(`https://www.y2mate.com/fr/youtube/${data.id}`, '_blank')}
              className="w-full border border-white/10 p-4 rounded-2xl text-sm font-bold opacity-50 hover:opacity-100 transition-all"
            >
              Lien de secours (Si actif)
            </button>
          </div>
        )}
      </div>
      
      <footer className="mt-12 text-zinc-800 text-[10px] font-bold uppercase tracking-[0.4em]">
        Sarino Lab • 2026 • The Last Bridge
      </footer>
    </div>
  );
}