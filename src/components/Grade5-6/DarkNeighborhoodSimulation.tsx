import { useState, useEffect } from 'react';
import { useLanguage } from '../../LanguageContext';

// --- TYPES ---
interface CircuitElement {
  id: string;
  name: string;
  type: 'battery' | 'bulb' | 'switch' | 'wire';
  symbol: string;
  image: string;
  description: string;
}

interface Level {
  id: number;
  title: string;
  mission: string;
  requiredElements: string[];
  hint: string;
}

const ELEMENTS_DATA: any[] = [
  { id: 'battery', type: 'battery', symbol: '—| |—', image: '🔋' },
  { id: 'bulb', type: 'bulb', symbol: '—(X)—', image: '💡' },
  { id: 'switch', type: 'switch', symbol: '—/ —', image: '⏻' }
];

const DarkNeighborhoodSimulation = () => {
  const { t } = useLanguage();
  const [activeLevel, setActiveLevel] = useState(0);
  const [selectedElements, setSelectedElements] = useState<{ [key: string]: CircuitElement[] }>({
    battery: [],
    bulb: [],
    switch: []
  });
  const [isSwitchClosed, setIsSwitchClosed] = useState(false);
  const [showSymbols, setShowSymbols] = useState(false);
  const [feedback, setFeedback] = useState({ message: t('schemaWelcome'), type: 'info' });

  const ELEMENTS_LOCALIZED: CircuitElement[] = ELEMENTS_DATA.map(el => ({
    ...el,
    name: t(`elements.${el.id}.name`),
    description: t(`elements.${el.id}.desc`)
  }));

  const LEVELS_LOCALIZED: Level[] = [
    { id: 1, ...t('levels.0'), requiredElements: ['battery', 'bulb'] },
    { id: 2, ...t('levels.1'), requiredElements: ['battery', 'bulb', 'switch'] },
    { id: 3, ...t('levels.2'), requiredElements: ['battery', 'bulb', 'bulb', 'switch'] },
  ];

  // --- LOGIC ---
  const handleAddElement = (type: 'battery' | 'bulb' | 'switch') => {
    const elTemplate = ELEMENTS_LOCALIZED.find(e => e.type === type);
    if (!elTemplate) return;

    const currentCount = selectedElements[type].length;
    let maxAllowed = 1;
    if (type === 'bulb' && LEVELS_LOCALIZED[activeLevel].id === 3) maxAllowed = 2;

    if (currentCount < maxAllowed) {
      setSelectedElements({
        ...selectedElements,
        [type]: [...selectedElements[type], { ...elTemplate, id: `${type}_${Date.now()}` }]
      });
    }
  };

  const removeElement = (type: string, id: string) => {
    setSelectedElements({
      ...selectedElements,
      [type]: selectedElements[type].filter(e => e.id !== id)
    });
  };

  const isCircuitComplete = () => {
    const level = LEVELS_LOCALIZED[activeLevel];
    const hasBattery = selectedElements.battery.length >= 1;
    const hasBulb = selectedElements.bulb.length >= (level.id === 3 ? 2 : 1);
    const hasSwitch = level.id >= 2 ? selectedElements.switch.length >= 1 : true;
    
    return hasBattery && hasBulb && hasSwitch;
  };

  const isLightOn = () => {
    if (!isCircuitComplete()) return false;
    if (LEVELS_LOCALIZED[activeLevel].id >= 2 && !isSwitchClosed) return false;
    return true;
  };

  useEffect(() => {
    if (isLightOn()) {
      setFeedback({ message: t('circuitSuccess'), type: 'success' });
    }
  }, [selectedElements, isSwitchClosed, t]);

  return (
    <div className="relative w-full max-w-7xl mx-auto p-8 bg-[#0f172a] rounded-[40px] border-[12px] border-[#1e293b] shadow-2xl overflow-hidden font-sans text-white">
      
      <div className={`absolute inset-0 transition-all duration-1000 ${isLightOn() ? 'bg-yellow-500/10 shadow-[inset_0_0_100px_rgba(234,179,8,0.2)]' : 'bg-transparent'}`} />

      <header className="relative z-10 flex justify-between items-center mb-10 bg-slate-800/50 p-6 rounded-3xl border border-slate-700">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-yellow-500">LAB: {t('appName')}</h1>
          <p className="text-xs text-slate-400 font-medium">{(t('language') === 'tr' ? 'BÖLÜM' : 'LEVEL').toUpperCase()} {activeLevel + 1}: {LEVELS_LOCALIZED[activeLevel].title}</p>
        </div>
        <div className={`px-6 py-2 rounded-2xl border-2 font-black transition-all text-sm
          ${feedback.type === 'success' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-500'}
        `}>
          {feedback.message}
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-12 gap-8">
        
        <div className="col-span-3 space-y-4">
          <div className="bg-slate-900/80 p-6 rounded-[32px] border border-slate-800">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{t('partBox')}</h3>
            <div className="space-y-3">
              {ELEMENTS_LOCALIZED.map(el => (
                <button
                  key={el.id}
                  onClick={() => handleAddElement(el.type as any)}
                  className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl transition-all group"
                >
                  <span className="text-2xl">{el.image}</span>
                  <span className="text-xs font-bold">{el.name}</span>
                  <span className="text-[10px] text-yellow-500 font-black">+ {(t('language') === 'tr' ? 'EKLE' : 'ADD')}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 p-5 rounded-[32px] border border-slate-800">
            <h4 className="text-[10px] font-black text-blue-500 mb-2 uppercase">{t('mission')}</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">{LEVELS_LOCALIZED[activeLevel].mission}</p>
          </div>

          <button 
            onClick={() => setShowSymbols(!showSymbols)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-[10px] font-black transition-all shadow-lg shadow-blue-900/40"
          >
            {showSymbols ? t('switchToReal') : t('switchToSchema')}
          </button>
        </div>

        <div className="col-span-9 bg-[#020617] rounded-[50px] border-4 border-slate-800 relative h-[500px] flex items-center justify-center">
          
          <div className="relative w-[600px] h-[350px]">
            
            <div className={`absolute top-0 left-0 w-full h-1 transition-all ${isLightOn() ? 'bg-yellow-400 shadow-[0_0_15px_#facc15]' : 'bg-slate-800'}`} />
            <div className={`absolute bottom-0 left-0 w-full h-1 transition-all ${isLightOn() ? 'bg-yellow-400 shadow-[0_0_15px_#facc15]' : 'bg-slate-800'}`} />
            <div className={`absolute top-0 left-0 h-full w-1 transition-all ${isLightOn() ? 'bg-yellow-400 shadow-[0_0_15px_#facc15]' : 'bg-slate-800'}`} />
            <div className={`absolute top-0 right-0 h-full w-1 transition-all ${isLightOn() ? 'bg-yellow-400 shadow-[0_0_15px_#facc15]' : 'bg-slate-800'}`} />

            {isLightOn() && (
               <div className="absolute inset-0 pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="absolute w-2 h-2 bg-yellow-300 rounded-full shadow-[0_0_8px_white]"
                         style={{
                           animation: `currentFlow 4s linear infinite`,
                           animationDelay: `${i * 0.33}s`,
                           offsetPath: `path('M 0 0 L 600 0 L 600 350 L 0 350 Z')`
                         }} />
                  ))}
               </div>
            )}

            <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 flex gap-4">
              {selectedElements.battery.length > 0 ? selectedElements.battery.map(b => (
                <div key={b.id} onClick={() => removeElement('battery', b.id)} className="bg-[#020617] px-4 py-2 cursor-pointer hover:scale-110 transition-transform">
                  {showSymbols ? (
                    <svg width="60" height="40" viewBox="0 0 60 40">
                      <line x1="0" y1="20" x2="25" y2="20" stroke="#fbbf24" strokeWidth="3" />
                      <line x1="25" y1="10" x2="25" y2="30" stroke="#fbbf24" strokeWidth="2" />
                      <line x1="35" y1="5" x2="35" y2="35" stroke="#fbbf24" strokeWidth="4" />
                      <line x1="35" y1="20" x2="60" y2="20" stroke="#fbbf24" strokeWidth="3" />
                    </svg>
                  ) : <span className="text-4xl">🔋</span>}
                </div>
              )) : <div className="text-[8px] text-slate-700 font-bold uppercase tracking-widest bg-[#020617] px-2">{t('batteryHere')}</div>}
            </div>

            <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 flex gap-12">
              {selectedElements.bulb.length > 0 ? selectedElements.bulb.map(b => (
                <div key={b.id} onClick={() => removeElement('bulb', b.id)} className="bg-[#020617] px-4 py-2 cursor-pointer hover:scale-110 transition-all text-center">
                  <div className={`p-2 rounded-full transition-all ${isLightOn() ? 'bg-yellow-500/20 shadow-[0_0_30px_#f59e0b]' : ''}`}>
                    {showSymbols ? (
                      <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="15" fill="none" stroke="#fbbf24" strokeWidth="2" />
                        <line x1="10" y1="10" x2="30" y2="30" stroke="#fbbf24" strokeWidth="2" />
                        <line x1="10" y1="30" x2="30" y2="10" stroke="#fbbf24" strokeWidth="2" />
                      </svg>
                    ) : <span className={`text-4xl transition-all ${isLightOn() ? 'brightness-125' : 'grayscale'}`}>💡</span>}
                  </div>
                </div>
              )) : <div className="text-[8px] text-slate-700 font-bold uppercase tracking-widest bg-[#020617] px-2">{t('bulbHere')}</div>}
            </div>

            <div className="absolute right-[-35px] top-1/2 -translate-y-1/2 flex flex-col items-center">
              {selectedElements.switch.length > 0 ? selectedElements.switch.map(s => (
                <div key={s.id} className="bg-[#020617] py-4 px-2 flex flex-col items-center gap-2">
                   <div onClick={() => setIsSwitchClosed(!isSwitchClosed)} className="cursor-pointer hover:scale-110 transition-transform">
                    {showSymbols ? (
                      <svg width="40" height="60" viewBox="0 0 40 60">
                        <circle cx="20" cy="15" r="3" fill="#fbbf24" />
                        <circle cx="20" cy="45" r="3" fill="#fbbf24" />
                        {isSwitchClosed ? (
                          <line x1="20" y1="15" x2="20" y2="45" stroke="#fbbf24" strokeWidth="3" />
                        ) : (
                          <line x1="20" y1="15" x2="35" y2="35" stroke="#fbbf24" strokeWidth="3" />
                        )}
                      </svg>
                    ) : (
                      <div className={`text-3xl p-2 rounded-xl border-2 transition-all ${isSwitchClosed ? 'bg-emerald-500/20 border-emerald-500' : 'bg-rose-500/20 border-rose-500'}`}>
                        {isSwitchClosed ? '🔌' : '✂️'}
                      </div>
                    )}
                   </div>
                   <button onClick={() => removeElement('switch', s.id)} className="text-[8px] text-rose-500 font-black hover:underline">{(t('language') === 'tr' ? 'KALDIR' : 'REMOVE')}</button>
                </div>
              )) : (
                <div className="rotate-90 text-[8px] text-slate-700 font-bold uppercase tracking-widest bg-[#020617] px-2">{t('switchHere')}</div>
              )}
            </div>

            <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 -rotate-90 text-[8px] text-slate-700 font-bold uppercase tracking-widest bg-[#020617] px-2">
               {t('dummyWire')}
            </div>

          </div>

          <div className="absolute bottom-8 right-8 flex gap-3">
             <div className="px-4 py-2 bg-slate-900/80 border border-slate-700 rounded-xl flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isCircuitComplete() ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                <span className="text-[9px] font-black text-slate-400">{t('circuitComplete')}</span>
             </div>
             <div className="px-4 py-2 bg-slate-900/80 border border-slate-700 rounded-xl flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLightOn() ? 'bg-yellow-500 shadow-[0_0_8px_#eab308]' : 'bg-slate-700'}`} />
                <span className="text-[9px] font-black text-slate-400">{t('currentFlowing')}</span>
             </div>
          </div>
        </div>

      </div>

      <footer className="mt-8 grid grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900/40 rounded-[32px] border border-slate-800">
           <h4 className="text-[10px] font-black text-blue-400 mb-2 uppercase tracking-widest">{t('whatIsCurrent')}</h4>
           <p className="text-[11px] text-slate-400 leading-relaxed">{t('currentDesc')}</p>
        </div>
        <div className="p-6 bg-slate-900/40 rounded-[32px] border border-slate-800">
           <h4 className="text-[10px] font-black text-yellow-500 mb-2 uppercase tracking-widest">{t('symbolicLanguage')}</h4>
           <p className="text-[11px] text-slate-400 leading-relaxed">{t('symbolicDesc')}</p>
        </div>
        <div className="flex items-center justify-end">
          {feedback.type === 'success' && activeLevel < LEVELS_LOCALIZED.length - 1 && (
            <button 
              onClick={() => {
                setActiveLevel(activeLevel + 1);
                setSelectedElements({ battery: [], bulb: [], switch: [] });
                setIsSwitchClosed(false);
                setFeedback({ message: t('nextLevelReady'), type: 'info' });
              }}
              className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-3xl font-black text-sm transition-all shadow-xl shadow-emerald-900/20 animate-bounce"
            >
              {t('nextLevel')} ➔
            </button>
          )}
        </div>
      </footer>

      <style>{`
        @keyframes currentFlow {
          from { offset-distance: 0%; }
          to { offset-distance: 100%; }
        }
      `}</style>
    </div>
  );
};

export default DarkNeighborhoodSimulation;
