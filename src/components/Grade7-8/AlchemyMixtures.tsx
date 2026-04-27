import { useState, useMemo } from 'react';
import { useLanguage } from '../../LanguageContext';

// --- TYPES ---
interface Ingredient {
  id: string;
  name: string;
  state: string;
  color: string;
  icon: string;
  density: number;
  solubleInWater: boolean;
  solubleInAlcohol: boolean;
  magnetic?: boolean;
  grain?: string;
}

interface Tool {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

interface AnalysisResult {
  solution: string;
  title: string;
  reason?: string;
}

// --- CURRICULUM DATA ---
const INGREDIENTS: Ingredient[] = [
  { id: 'su', name: 'Saf Su', state: 'Sıvı', color: 'bg-cyan-400', icon: '💧', density: 1.0, solubleInWater: true, solubleInAlcohol: true },
  { id: 'alkol', name: 'Etil Alkol', state: 'Sıvı', color: 'bg-purple-300', icon: '🧪', density: 0.78, solubleInWater: true, solubleInAlcohol: true },
  { id: 'yag', name: 'Zeytinyağı', state: 'Sıvı', color: 'bg-amber-400', icon: '🍯', density: 0.92, solubleInWater: false, solubleInAlcohol: false },
  { id: 'tuz', name: 'Sofra Tuzu', state: 'Katı', color: 'bg-slate-100', icon: '🧂', density: 2.16, magnetic: false, solubleInWater: true, solubleInAlcohol: false, grain: 'small' },
  { id: 'seker', name: 'Toz Şeker', state: 'Katı', color: 'bg-white', icon: '🍬', density: 1.59, magnetic: false, solubleInWater: true, solubleInAlcohol: false, grain: 'small' },
  { id: 'kum', name: 'İnce Kum', state: 'Katı', color: 'bg-yellow-600', icon: '🏜️', density: 2.65, magnetic: false, solubleInWater: false, solubleInAlcohol: false, grain: 'small' },
  { id: 'demir', name: 'Demir Tozu', state: 'Katı', color: 'bg-slate-600', icon: '⚙️', density: 7.8, magnetic: true, solubleInWater: false, solubleInAlcohol: false, grain: 'small' },
  { id: 'talas', name: 'Odun Talaşı', state: 'Katı', color: 'bg-orange-200', icon: '🪵', density: 0.4, magnetic: false, solubleInWater: false, solubleInAlcohol: false, grain: 'medium' },
  { id: 'cakil', name: 'Çakıl Taşı', state: 'Katı', color: 'bg-slate-400', grain: 'large', icon: '🪨', density: 2.5, magnetic: false, solubleInWater: false, solubleInAlcohol: false },
  { id: 'nikel', name: 'Nikel Tozu', state: 'Katı', color: 'bg-slate-300', icon: '🔘', density: 8.9, magnetic: true, solubleInWater: false, solubleInAlcohol: false, grain: 'small' },
];

const TOOLS: Tool[] = [
  { id: 'magnet', name: 'Mıknatısla Ayırma', icon: '🧲', desc: 'Manyetik Özellik Farkı' },
  { id: 'funnel', name: 'Ayırma Hunisi', icon: '🏺', desc: 'Yoğunluk Farkı (Sıvı-Sıvı)' },
  { id: 'distillation', name: 'Ayrımsal Damıtma', icon: '⚗️', desc: 'Kaynama Noktası Farkı' },
  { id: 'evaporation', name: 'Buharlaştırma', icon: '♨️', desc: 'Sıvı Buharlaştırma' },
  { id: 'filtration', name: 'Süzme', icon: '🕸️', desc: 'Tanecik Boyutu (Katı-Sıvı)' },
  { id: 'sieve', name: 'Eleme', icon: '🧹', desc: 'Tanecik Boyutu (Katı-Katı)' },
  { id: 'flotation', name: 'Yüzdürme', icon: '🛶', desc: 'Yoğunluk Farkı (Katı-Sıvı)' },
  { id: 'crystallization', name: 'Ayrımsal Kristallendirme', icon: '❄️', desc: 'Çözünürlük Farkı' },
];

const AlchemyMixtures = () => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<Ingredient[]>([]);
  const [phase, setPhase] = useState<'selection' | 'mixed' | 'result'>('selection'); 
  const [isWaterAdded, setIsWaterAdded] = useState(false);
  const [feedback, setFeedback] = useState({ message: t('alchemyWelcome'), type: 'info' });

  const INGREDIENTS_LOCALIZED = INGREDIENTS.map(i => ({
    ...i,
    name: t(`ingredients.${i.id}`),
    state: i.state === 'Katı' ? (t('language') === 'tr' ? 'Katı' : 'Solid') : (t('language') === 'tr' ? 'Sıvı' : 'Liquid')
  }));

  const TOOLS_LOCALIZED = TOOLS.map(tool => ({
    ...tool,
    name: t(`tools.${tool.id}`),
    desc: t(`toolDescs.${tool.id}`)
  }));

  // --- CORE ENGINE LOGIC ---
  const analysis = useMemo<AnalysisResult | null>(() => {
    if (selected.length < 2) return null;
    
    const items = [...selected];
    const hasWater = items.some(i => i.id === 'su') || isWaterAdded;
    const hasAlcohol = items.some(i => i.id === 'alkol');
    const hasOil = items.some(i => i.id === 'yag');
    const solids = items.filter(i => i.state === 'Katı');
    const liquids = items.filter(i => i.state === 'Sıvı');

    const magneticCount = solids.filter(s => s.magnetic).length;
    if (magneticCount > 1) return { solution: 'none', title: 'HATA!', reason: t('language') === 'tr' ? 'İki madde de manyetik! Mıknatıs ikisini de çeker, ayıramazsın.' : 'Both substances are magnetic! The magnet will attract both, you cannot separate them.' };
    if (magneticCount === 1 && liquids.length === 0 && !isWaterAdded) return { solution: 'magnet', title: t('language') === 'tr' ? 'Manyetik Karışım' : 'Magnetic Mixture' };

    if (liquids.length >= 2) {
      if ((hasWater && hasOil) || (hasAlcohol && hasOil)) return { solution: 'funnel', title: t('language') === 'tr' ? 'Heterojen Sıvı (Emülsiyon)' : 'Heterogeneous Liquid (Emulsion)' };
      if (hasWater && hasAlcohol) return { solution: 'distillation', title: t('language') === 'tr' ? 'Homojen Sıvı (Çözelti)' : 'Homogeneous Liquid (Solution)' };
    }

    if (solids.length >= 2 && liquids.length === 0 && !isWaterAdded) {
      if (solids.some(s => s.grain === 'large')) return { solution: 'sieve', title: t('language') === 'tr' ? 'Katı-Katı Heterojen' : 'Solid-Solid Heterogeneous' };
      if (solids.some(s => s.id === 'tuz') && solids.some(s => s.id === 'seker')) return { solution: 'crystallization', title: t('language') === 'tr' ? 'Tuz-Şeker Karışımı' : 'Salt-Sugar Mixture' };
      return { solution: 'need_water', title: t('language') === 'tr' ? 'Çözme Gerekiyor' : 'Dissolving Required', reason: t('language') === 'tr' ? 'Bu iki katıyı doğrudan ayıramazsın. Önce "Su Ekle" butonuna basmalısın!' : 'You cannot separate these two solids directly. You must first press the "Add Water" button!' };
    }

    if (isWaterAdded) {
      const solubleSolids = solids.filter(s => s.solubleInWater);
      const insolubleSolids = solids.filter(s => !s.solubleInWater);

      if (insolubleSolids.length > 0) {
         if (insolubleSolids.some(s => s.id === 'talas')) return { solution: 'flotation', title: t('language') === 'tr' ? 'Yüzen Katı-Sıvı' : 'Floating Solid-Liquid' };
         return { solution: 'filtration', title: t('language') === 'tr' ? 'Sulu Karışım (Süspansiyon)' : 'Aqueous Mixture (Suspension)' };
      }
      if (solubleSolids.length > 0) return { solution: 'evaporation', title: t('language') === 'tr' ? 'Homojen Çözelti' : 'Homogeneous Solution' };
    }

    if (liquids.length === 1 && solids.length === 1) {
      const liquid = liquids[0];
      const solid = solids[0];
      
      if (liquid.id === 'alkol' && solid.id === 'tuz') return { solution: 'filtration', title: t('language') === 'tr' ? 'Alkol-Tuz Karışımı' : 'Alcohol-Salt Mixture', reason: t('language') === 'tr' ? 'Unutma! Tuz alkolde çözünmez, süzerek ayrılır.' : 'Remember! Salt does not dissolve in alcohol, it is separated by filtration.' };
      
      if (liquid.id === 'su' && solid.solubleInWater) return { solution: 'evaporation', title: t('language') === 'tr' ? 'Homojen Çözelti' : 'Homogeneous Solution' };
      if (solid.density < liquid.density) return { solution: 'flotation', title: t('language') === 'tr' ? 'Yüzdürme Gerektiren Karışım' : 'Mixture Requiring Flotation' };
      return { solution: 'filtration', title: t('language') === 'tr' ? 'Heterojen Karışım' : 'Heterogeneous Mixture' };
    }

    return { solution: 'complex', title: t('language') === 'tr' ? 'Karışım Hazır' : 'Mixture Ready' };
  }, [selected, isWaterAdded, t]);

  // --- ACTIONS ---
  const toggleSelect = (ing: Ingredient) => {
    if (phase !== 'selection') return;
    if (selected.find(i => i.id === ing.id)) {
      setSelected(selected.filter(i => i.id !== ing.id));
    } else if (selected.length < 2) {
      setSelected([...selected, ing]);
    }
  };

  const handleMix = () => {
    if (selected.length < 2) return;
    setPhase('mixed');
    setFeedback({ message: t('mixedFeedback'), type: 'warning' });
  };

  const handleAddWater = () => {
    setIsWaterAdded(true);
    setFeedback({ message: t('waterAddedFeedback'), type: 'info' });
  };

  const handleToolUse = (toolId: string) => {
    if (!analysis) return;

    if (toolId === analysis.solution) {
      setPhase('result');
      setFeedback({ message: t('successSeparation'), type: 'success' });
    } else {
      const errorMsg = analysis.reason || (t('language') === 'tr' ? 'Hatalı yöntem! Maddelerin özelliklerini tekrar düşün.' : 'Incorrect method! Think about the properties of the substances again.');
      setFeedback({ message: errorMsg, type: 'error' });
    }
  };

  const reset = () => {
    setSelected([]);
    setPhase('selection');
    setIsWaterAdded(false);
    setFeedback({ message: t('labCleared'), type: 'info' });
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto p-12 bg-slate-950 rounded-[50px] border-[8px] border-slate-900 shadow-2xl overflow-hidden text-slate-100 selection:bg-cyan-500/30">
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
         <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600 blur-[150px] rounded-full" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-600 blur-[150px] rounded-full" />
      </div>

      <header className="relative z-10 text-center mb-12">
        <h1 className="text-5xl font-black tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
           {t('alchemyTitle')}
        </h1>
        <div className={`mt-6 inline-block px-10 py-3 rounded-2xl border-2 transition-all duration-500 backdrop-blur-xl shadow-2xl font-bold
          ${feedback.type === 'success' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 
            feedback.type === 'error' ? 'bg-rose-500/10 border-rose-500 text-rose-400 animate-shake' : 
            feedback.type === 'warning' ? 'bg-amber-500/10 border-amber-500 text-amber-400' :
            'bg-slate-900/50 border-slate-700 text-slate-400'}
        `}>
          {feedback.message}
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-4 opacity-50">{t('ingredientsLabel')}</h2>
          <div className="grid grid-cols-1 gap-2 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
            {INGREDIENTS_LOCALIZED.map((ing) => (
              <button
                key={ing.id}
                onClick={() => toggleSelect(INGREDIENTS.find(i => i.id === ing.id)!)}
                disabled={phase !== 'selection'}
                className={`flex items-center p-4 rounded-3xl border-2 transition-all duration-300
                  ${selected.find(i => i.id === ing.id) 
                    ? 'bg-blue-600/20 border-blue-500 shadow-lg' 
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100 cursor-pointer'}
                `}
              >
                <div className={`w-12 h-12 rounded-2xl ${ing.color} text-slate-900 flex items-center justify-center text-3xl shadow-xl mr-4`}>
                  {ing.icon}
                </div>
                <div className="text-left">
                  <div className="font-black text-sm text-slate-100">{ing.name}</div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase">{ing.state}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-80 h-72 md:w-96 md:h-80">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[112%] h-16 bg-slate-800 rounded-full border-b-[10px] border-slate-950 z-40 shadow-2xl" />
            
            <div className={`absolute inset-0 rounded-b-[140px] rounded-t-[50px] bg-slate-900 border-[10px] border-slate-800 shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] z-10 overflow-hidden transition-all duration-1000
              ${phase === 'mixed' ? 'scale-105' : ''}
            `}>
              <div className="absolute inset-0">
                {selected.length === 0 && !isWaterAdded && (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-800 font-black text-sm tracking-widest uppercase italic">{t('cauldronEmpty')}</div>
                )}

                {selected.filter(i=>i.state==='Sıvı').map((liq, idx) => (
                  <div 
                    key={liq.id} 
                    className="absolute inset-0 opacity-40 transition-all duration-1000"
                    style={{ 
                      backgroundColor: liq.color.replace('bg-', ''), 
                      top: `${(idx * 50)}%`
                    }}
                  />
                ))}

                {isWaterAdded && (
                  <div className="absolute inset-0 bg-cyan-400/30 animate-pulse z-20 backdrop-blur-[1px]" />
                )}

                <div className="absolute inset-0 z-30 pointer-events-none">
                  {selected.filter(i=>i.state==='Katı').map((sol) => (
                    <div key={sol.id} className={`absolute flex flex-wrap gap-2 p-12 transition-all duration-1000
                      ${(sol.solubleInWater && isWaterAdded) ? 'opacity-20 blur-xl scale-150' : 'opacity-100'}
                      ${sol.density > 1 ? 'bottom-0' : 'top-12'}
                    `}>
                       {[...Array(15)].map((_, i) => (
                         <div key={i} className={`w-5 h-5 rounded-sm ${sol.color} shadow-lg rotate-${i*15}`} />
                       ))}
                    </div>
                  ))}
                </div>

                {phase === 'result' && (
                  <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-2xl z-50 flex flex-col items-center justify-center animate-in zoom-in duration-500">
                    <span className="text-9xl mb-4 animate-bounce">✨</span>
                    <h3 className="text-3xl font-black text-emerald-400 tracking-tighter">{t('separated')}</h3>
                    <button onClick={reset} className="mt-8 px-12 py-4 bg-emerald-600 text-white rounded-full font-black tracking-widest hover:bg-emerald-500 shadow-xl shadow-emerald-900/40">{t('newExperiment')}</button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-20 flex items-end justify-center gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-4 bg-orange-600/40 rounded-full animate-pulse blur-sm" style={{ height: `${20 + Math.random()*30}px`, animationDelay: `${i*0.2}s` }} />
              ))}
            </div>
          </div>

          <div className="mt-28 flex flex-wrap gap-6 justify-center">
            {phase === 'selection' ? (
              <button
                onClick={handleMix}
                disabled={selected.length < 2}
                className={`px-16 py-6 rounded-[35px] font-black tracking-[0.4em] transition-all duration-500
                  ${selected.length === 2 ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-2xl hover:scale-110 active:scale-95' : 'bg-slate-900 text-slate-700 border-2 border-slate-800 opacity-40'}
                `}
              >
                {t('mix')}
              </button>
            ) : (
              <>
                {!isWaterAdded && analysis?.solution === 'need_water' && (
                   <button onClick={handleAddWater} className="px-12 py-5 rounded-[30px] bg-cyan-600 text-white font-black tracking-widest hover:bg-cyan-500 animate-pulse shadow-xl shadow-cyan-900/40">
                      {t('addWater')}
                   </button>
                )}
                <button onClick={reset} className="px-12 py-5 rounded-[30px] bg-slate-900 text-slate-400 font-black border-2 border-slate-800 hover:text-white transition-all shadow-xl">
                   {t('clear')}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-4 opacity-50">{t('toolsLabel')}</h2>
          <div className="grid grid-cols-1 gap-3 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
            {TOOLS_LOCALIZED.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolUse(tool.id)}
                disabled={phase !== 'mixed'}
                className={`group flex flex-col items-center p-6 rounded-[40px] border-2 transition-all duration-500
                  ${phase === 'mixed' 
                    ? 'bg-slate-900 border-slate-800 hover:border-blue-500 hover:bg-slate-800/80 shadow-2xl cursor-pointer hover:-translate-y-2' 
                    : 'bg-slate-900/20 border-transparent opacity-10 grayscale cursor-not-allowed'}
                `}
              >
                <div className="text-5xl mb-3 transition-transform group-hover:scale-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{tool.icon}</div>
                <div className="font-black text-[11px] text-slate-200 uppercase tracking-tighter">{tool.name}</div>
                <div className="text-[8px] text-blue-400 font-bold uppercase mt-2 tracking-widest opacity-80">{tool.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20% { transform: translate3d(2px, 0, 0); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default AlchemyMixtures;
