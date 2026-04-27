import { useState, useEffect } from 'react';
import { useLanguage } from '../../LanguageContext';

// --- TYPES ---
interface Planet {
  id: string;
  name: string;
  type: string;
  order: number;
  color: string;
  image: string;
  size: number;
  features: string[];
}

// --- CURRICULUM DATA ---
const PLANETS: Planet[] = [
  { 
    id: 'mercury', 
    name: 'Merkür', 
    type: 'inner', 
    order: 1, 
    color: 'bg-stone-400', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg', 
    size: 7, // Scaled down
    features: ['Güneş\'e en yakın', 'En küçük gezegen', 'Uydusu yok'] 
  },
  { 
    id: 'venus', 
    name: 'Venüs', 
    type: 'inner', 
    order: 2, 
    color: 'bg-orange-300', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Venus_from_Mariner_10.jpg', 
    size: 17, 
    features: ['Çok sıcak (Sera etkisi)', 'Dünya\'nın ikizi', 'Uydusu yok'] 
  },
  { 
    id: 'earth', 
    name: 'Dünya', 
    type: 'inner', 
    order: 3, 
    color: 'bg-blue-500', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg', 
    size: 18, 
    features: ['Üzerinde yaşam olan tek yer', 'Tek uydusu Ay', 'Su varlığı'] 
  },
  { 
    id: 'mars', 
    name: 'Mars', 
    type: 'inner', 
    order: 4, 
    color: 'bg-red-600', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg', 
    size: 10, 
    features: ['Kızıl Gezegen', 'İki uydusu var', 'Toz fırtınaları'] 
  },
  { 
    id: 'jupiter', 
    name: 'Jüpiter', 
    type: 'outer', 
    order: 5, 
    color: 'bg-amber-700', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg', 
    size: 200, // Scaled down from 336
    features: ['En büyük gezegen', 'Gaz devi', 'Büyük Kırmızı Leke'] 
  },
  { 
    id: 'saturn', 
    name: 'Satürn', 
    type: 'outer', 
    order: 6, 
    color: 'bg-yellow-500', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg', 
    size: 170, 
    features: ['Belirgin halkaları var', 'Gaz devi', 'Yoğunluğu sudan az'] 
  },
  { 
    id: 'uranus', 
    name: 'Uranüs', 
    type: 'outer', 
    order: 7, 
    color: 'bg-cyan-300', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg', 
    size: 72, 
    features: ['Buz devi', 'Yana yatmış varil gibi döner', 'Zayıf halkalar'] 
  },
  { 
    id: 'neptune', 
    name: 'Neptün', 
    type: 'outer', 
    order: 8, 
    color: 'bg-blue-800', 
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg', 
    size: 70, 
    features: ['En uzak gezegen', 'Buz devi', 'Çok soğuk ve fırtınalı'] 
  },
];

const QUESTIONS = [
  { id: 1, text: "Güneş'e olan uzaklıklarına göre gezegenleri sırala!", task: 'ordering', instruction: "Gezegenleri Güneş'e en yakından en uzağa doğru seçerek yörüngelere yerleştir." },
  { id: 2, text: "İç ve Dış gezegenleri doğru kutulara ayır!", task: 'categorizing', instruction: "Gezegene tıkla, özelliklerini oku ve doğru gruba (İç veya Dış) yerleştir." },
  { id: 3, text: "Gezegenleri büyüklüklerine göre sırala!", task: 'size-ordering', instruction: "Gezegenleri en büyükten en küçüğe doğru seçerek sırala." },
];

const SolarSystemSimulation = () => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [userOrder, setUserOrder] = useState<Planet[]>([]);
  const [sizeOrder, setSizeOrder] = useState<Planet[]>([]);
  const [categories, setCategories] = useState<{ inner: Planet[], outer: Planet[] }>({ inner: [], outer: [] });
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [feedback, setFeedback] = useState({ message: '', type: 'info' });
  const [shuffledPlanets, setShuffledPlanets] = useState<Planet[]>([]);

  const PLANETS_LOCALIZED: Planet[] = [
    { ...PLANETS[0], name: t('planets.mercury.name'), features: t('planets.mercury.features') },
    { ...PLANETS[1], name: t('planets.venus.name'), features: t('planets.venus.features') },
    { ...PLANETS[2], name: t('planets.earth.name'), features: t('planets.earth.features') },
    { ...PLANETS[3], name: t('planets.mars.name'), features: t('planets.mars.features') },
    { ...PLANETS[4], name: t('planets.jupiter.name'), features: t('planets.jupiter.features') },
    { ...PLANETS[5], name: t('planets.saturn.name'), features: t('planets.saturn.features') },
    { ...PLANETS[6], name: t('planets.uranus.name'), features: t('planets.uranus.features') },
    { ...PLANETS[7], name: t('planets.neptune.name'), features: t('planets.neptune.features') },
  ];

  const QUESTIONS_LOCALIZED = [
    { ...QUESTIONS[0], text: t('questions.0.text'), instruction: t('questions.0.instruction') },
    { ...QUESTIONS[1], text: t('questions.1.text'), instruction: t('questions.1.instruction') },
    { ...QUESTIONS[2], text: t('questions.2.text'), instruction: t('questions.2.instruction') },
  ];

  useEffect(() => {
    setShuffledPlanets([...PLANETS_LOCALIZED].sort(() => Math.random() - 0.5));
    setFeedback({ message: t('welcomeCaptain'), type: 'info' });
  }, [t]);

  // --- ACTIONS ---
  const handleOrderAdd = (planet: Planet) => {
    if (userOrder.find(p => p.id === planet.id)) return;
    const newOrder = [...userOrder, planet];
    setUserOrder(newOrder);

    if (newOrder.length === PLANETS.length) {
      const isCorrect = newOrder.every((p, idx) => p.order === idx + 1);
      if (isCorrect) {
        setFeedback({ message: t('orderingSuccess'), type: 'success' });
      } else {
        setFeedback({ message: t('orderingError'), type: 'error' });
      }
    }
  };

  const handleOrderRemove = (planetId: string) => {
    const newOrder = userOrder.filter(p => p.id !== planetId);
    setUserOrder(newOrder);
    setFeedback({ message: t('language') === 'tr' ? 'Gezegen yörüngeden kaldırıldı.' : 'Planet removed from orbit.', type: 'info' });
  };

  const handleUndo = () => {
    if (activeStep === 0) {
      setUserOrder(prev => prev.slice(0, -1));
    } else if (activeStep === 2) {
      setSizeOrder(prev => prev.slice(0, -1));
    }
    setFeedback({ message: t('undo') + '...', type: 'info' });
  };

  const handleSizeAdd = (planet: Planet) => {
    if (sizeOrder.find(p => p.id === planet.id)) return;
    const newOrder = [...sizeOrder, planet];
    setSizeOrder(newOrder);

    if (newOrder.length === PLANETS.length) {
      const correctSizeOrder = [...PLANETS_LOCALIZED].sort((a, b) => b.size - a.size);
      const isCorrect = newOrder.every((p, idx) => p.id === correctSizeOrder[idx].id);
      
      if (isCorrect) {
        setFeedback({ message: t('sizeSuccess'), type: 'success' });
      } else {
        setFeedback({ message: t('sizeError'), type: 'error' });
      }
    }
  };

  const handleSizeRemove = (planetId: string) => {
    const newOrder = sizeOrder.filter(p => p.id !== planetId);
    setSizeOrder(newOrder);
  };

  const handleCategoryAdd = (planet: Planet, category: 'inner' | 'outer') => {
    if (categories.inner.find(p => p.id === planet.id) || categories.outer.find(p => p.id === planet.id)) return;
    
    const newCategories = { ...categories, [category]: [...categories[category as 'inner' | 'outer'], planet] };
    setCategories(newCategories);

    if (newCategories.inner.length + newCategories.outer.length === PLANETS.length) {
      const innerCorrect = newCategories.inner.every(p => p.type === 'inner');
      const outerCorrect = newCategories.outer.every(p => p.type === 'outer');
      if (innerCorrect && outerCorrect) {
        setFeedback({ message: t('categorizingSuccess'), type: 'success' });
      } else {
        setFeedback({ message: t('categorizingError'), type: 'error' });
      }
    }
  };

  const resetStep = () => {
    setUserOrder([]);
    setSizeOrder([]);
    setCategories({ inner: [], outer: [] });
    setSelectedPlanet(null);
    setFeedback({ message: QUESTIONS_LOCALIZED[activeStep].text, type: 'info' });
  };

  const nextStep = () => {
    if (activeStep < QUESTIONS_LOCALIZED.length - 1) {
      const nextIdx = activeStep + 1;
      setActiveStep(nextIdx);
      setUserOrder([]);
      setSizeOrder([]);
      setCategories({ inner: [], outer: [] });
      setSelectedPlanet(null);
      setFeedback({ message: QUESTIONS_LOCALIZED[nextIdx].text, type: 'info' });
    } else {
      setFeedback({ message: t('allMissionsSuccess'), type: 'success' });
      setTimeout(() => {
        setActiveStep(0);
        setUserOrder([]);
        setSizeOrder([]);
        setCategories({ inner: [], outer: [] });
        setSelectedPlanet(null);
        setFeedback({ message: QUESTIONS_LOCALIZED[0].text, type: 'info' });
      }, 3000);
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto p-12 bg-slate-950 rounded-[50px] border-[8px] border-slate-900 shadow-2xl overflow-hidden text-slate-100">
      
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="absolute bg-white rounded-full" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 2}px`,
            height: `${Math.random() * 2}px`,
            opacity: Math.random(),
            animation: `pulse ${2 + Math.random() * 3}s infinite`
          }} />
        ))}
      </div>

      <header className="relative z-10 text-center mb-8">
        <h1 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
           {t('solarSystemTitle')}
        </h1>
        <div className={`mt-4 inline-block px-8 py-2 rounded-xl border-2 transition-all backdrop-blur-xl
          ${feedback.type === 'success' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 
            feedback.type === 'error' ? 'bg-rose-500/10 border-rose-500 text-rose-400' : 
            'bg-slate-900/50 border-slate-700 text-slate-400'}
        `}>
          {feedback.message}
        </div>
        {QUESTIONS_LOCALIZED[activeStep] && (
          <p className="mt-2 text-slate-500 text-sm font-medium animate-pulse">
            💡 {QUESTIONS_LOCALIZED[activeStep].instruction}
          </p>
        )}
      </header>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2">{t('planetPanel')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {shuffledPlanets.map((planet) => (
              <button
                key={planet.id}
                onClick={() => {
                  if (activeStep === 0) handleOrderAdd(planet);
                  if (activeStep === 1) setSelectedPlanet(planet); 
                  if (activeStep === 2) handleSizeAdd(planet);
                }}
                disabled={!!((activeStep === 0 && userOrder.find(p => p.id === planet.id)) || 
                          (activeStep === 1 && (categories.inner.find(p => p.id === planet.id) || categories.outer.find(p => p.id === planet.id))) ||
                          (activeStep === 2 && sizeOrder.find(p => p.id === planet.id)))}
                className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all duration-300
                  ${((activeStep === 0 && userOrder.find(p => p.id === planet.id)) || 
                     (activeStep === 1 && (categories.inner.find(p => p.id === planet.id) || categories.outer.find(p => p.id === planet.id))) ||
                     (activeStep === 2 && sizeOrder.find(p => p.id === planet.id)))
                    ? 'opacity-20 scale-90 grayscale' 
                    : 'bg-slate-900/60 border-slate-800 hover:border-blue-500 hover:scale-105'}
                `}
              >
                <img src={planet.image} alt={planet.name} className="w-12 h-12 object-cover rounded-full mb-1 shadow-lg border border-slate-700" />
                <span className="text-[10px] font-bold uppercase">{planet.name}</span>
              </button>
            ))}
          </div>
          
          {selectedPlanet && (
             <div className="p-4 bg-slate-900/80 border border-slate-700 rounded-3xl mt-4 animate-in slide-in-from-left duration-300">
                <div className="flex items-center gap-2 mb-2">
                   <img src={selectedPlanet.image} alt={selectedPlanet.name} className="w-10 h-10 object-cover rounded-full shadow-md border border-slate-700" />
                   <h3 className="font-black text-blue-400">{selectedPlanet.name}</h3>
                </div>
                <ul className="text-[10px] space-y-1 text-slate-300">
                   {selectedPlanet.features.map((f, i) => <li key={i}>• {f}</li>)}
                </ul>
                {activeStep === 1 && (
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => handleCategoryAdd(selectedPlanet!, 'inner')} className="flex-1 py-2 bg-stone-700 rounded-lg text-[9px] font-black hover:bg-stone-600">{t('language') === 'tr' ? 'İÇ (KARASAL)' : 'INNER (TERRESTRIAL)'}</button>
                    <button onClick={() => handleCategoryAdd(selectedPlanet!, 'outer')} className="flex-1 py-2 bg-amber-900 rounded-lg text-[9px] font-black hover:bg-amber-800">{t('language') === 'tr' ? 'DIŞ (GAZ)' : 'OUTER (GAS)'}</button>
                  </div>
                )}
             </div>
          )}

          {(activeStep === 0 || activeStep === 2) && (
            <button 
              onClick={handleUndo}
              disabled={(activeStep === 0 && userOrder.length === 0) || (activeStep === 2 && sizeOrder.length === 0)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl text-xs font-black transition-all border border-slate-700 flex items-center justify-center gap-2"
            >
              <span>↩️</span> {t('undo')}
            </button>
          )}
        </div>

        <div className="lg:col-span-9 bg-slate-900/40 rounded-[40px] border-2 border-slate-800 p-8 min-h-[500px] flex flex-col">
          
          {activeStep === 0 && (
            <div className="flex-1 flex flex-col">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-20 h-20 bg-yellow-500 rounded-full shadow-[0_0_50px_#eab308] flex items-center justify-center animate-pulse">
                     <span className="text-4xl">☀️</span>
                  </div>
                  <div className="flex-1 h-1 bg-slate-800 rounded-full relative">
                     <div className="absolute top-[-10px] left-0 w-full flex justify-between px-4">
                        {[...Array(8)].map((_, i) => (
                           <div key={i} className="w-5 h-5 border-2 border-slate-700 rounded-full bg-slate-950 flex items-center justify-center text-[8px] font-black text-slate-500">
                              {i + 1}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
               
               <div className="flex-1 flex items-center justify-start gap-4 overflow-x-auto pb-4">
                  {userOrder.map((planet, idx) => (
                    <div 
                      key={planet.id} 
                      onClick={() => handleOrderRemove(planet.id)}
                      className="flex flex-col items-center animate-in zoom-in duration-300 cursor-pointer group"
                    >
                       <div className={`relative rounded-full transition-all group-hover:ring-4 ring-rose-500/50 overflow-hidden shadow-lg border border-slate-700`} 
                            style={{ width: Math.max(40, planet.size / 2.5 + 30), height: Math.max(40, planet.size / 2.5 + 30) }}>
                          <img src={planet.image} alt={planet.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-rose-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                             <span className="text-[8px] font-black">{t('language') === 'tr' ? 'KALDIR' : 'REMOVE'}</span>
                          </div>
                       </div>
                       <span className="text-[10px] font-black mt-2 text-slate-400">{planet.name}</span>
                       <span className="text-[8px] text-blue-500 font-bold">{idx + 1}. {t('language') === 'tr' ? 'Yörünge' : 'Orbit'}</span>
                    </div>
                  ))}
                  {userOrder.length === 0 && (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl">
                       <p className="text-slate-600 font-black italic">{t('language') === 'tr' ? 'Gezegenleri sırasıyla buraya ekle...' : 'Add planets here in order...'}</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="flex-1 grid grid-cols-2 gap-8">
               <div className="bg-stone-900/40 rounded-3xl border-2 border-stone-800 p-6 flex flex-col">
                  <h3 className="text-center font-black text-stone-500 mb-4 uppercase tracking-widest text-sm">{t('innerPlanetsLabel')}</h3>
                  <div className="flex-1 flex flex-wrap gap-4 items-center justify-center">
                     {categories.inner.map(p => (
                        <div key={p.id} className="flex flex-col items-center">
                           <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded-full shadow-lg border border-slate-700 mb-2" />
                           <span className="text-[10px] font-bold">{p.name}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="bg-amber-900/20 rounded-3xl border-2 border-amber-900/40 p-6 flex flex-col">
                  <h3 className="text-center font-black text-amber-600 mb-4 uppercase tracking-widest text-sm">{t('outerPlanetsLabel')}</h3>
                  <div className="flex-1 flex flex-wrap gap-4 items-center justify-center">
                     {categories.outer.map(p => (
                        <div key={p.id} className="flex flex-col items-center">
                           <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded-full shadow-lg border border-slate-700 mb-2" />
                           <span className="text-[10px] font-bold">{p.name}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="flex-1 flex flex-col">
               <div className="mb-6 flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                  <span className="text-xs font-black text-slate-400">{t('largest')}</span>
                  <div className="flex-1 mx-4 h-0.5 bg-slate-700" />
                  <span className="text-xs font-black text-slate-400">{t('smallest')}</span>
               </div>
               <div className="flex-1 flex items-end justify-center gap-2 pb-10">
                  {sizeOrder.map((planet, idx) => (
                    <div 
                      key={planet.id} 
                      className="flex flex-col items-center group cursor-pointer animate-in slide-in-from-bottom duration-300"
                      onClick={() => handleSizeRemove(planet.id)}
                    >
                       <div 
                         className="relative rounded-full transition-all group-hover:ring-4 ring-rose-500/50 overflow-hidden shadow-2xl border border-slate-700" 
                         style={{ 
                            width: Math.max(15, planet.size * 0.5), 
                            height: Math.max(15, planet.size * 0.5) 
                         }} 
                       >
                          <img src={planet.image} alt={planet.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-rose-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                             <span className="text-[8px] font-black text-white uppercase">{t('language') === 'tr' ? 'Kaldır' : 'Remove'}</span>
                          </div>
                       </div>
                       <span className="text-[10px] font-black mt-2 text-slate-400">{planet.name}</span>
                       <span className="text-[8px] text-blue-500 font-bold">{idx + 1}.</span>
                    </div>
                  ))}
                  {sizeOrder.length === 0 && (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl">
                       <p className="text-slate-600 font-black italic text-center">
                         {t('language') === 'tr' ? 'Gezegenleri büyükten küçüğe doğru panolden seçerek buraya ekle...' : 'Add planets from largest to smallest by selecting from the panel...'}
                         <br/>
                         <span className="text-[10px] opacity-50">({t('language') === 'tr' ? 'Örn: Önce Jüpiter' : 'Ex: Jupiter first'})</span>
                       </p>
                    </div>
                  )}
               </div>
            </div>
          )}

          <div className="mt-8 flex justify-between items-center border-t border-slate-800 pt-6">
            <div className="flex gap-2">
               {[...Array(QUESTIONS_LOCALIZED.length)].map((_, i) => (
                 <div key={i} className={`w-3 h-3 rounded-full ${activeStep === i ? 'bg-blue-500' : 'bg-slate-800'}`} />
               ))}
            </div>
            <div className="flex gap-4">
               <button onClick={resetStep} className="px-6 py-2 rounded-xl text-xs font-black text-slate-500 hover:text-white transition-colors">{t('reset')}</button>
               {feedback.type === 'success' && (
                 <button onClick={nextStep} className="px-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-500 shadow-lg shadow-blue-900/40 animate-bounce">
                    {activeStep === QUESTIONS_LOCALIZED.length - 1 ? t('complete') : t('nextMission')}
                 </button>
               )}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 grid grid-cols-3 gap-4">
         <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
            <h4 className="text-[10px] font-black text-blue-500 uppercase mb-1">Meteor</h4>
            <p className="text-[9px] text-slate-400">{t('language') === 'tr' ? 'Güneş sistemindeki küçük kaya veya metal parçaları.' : 'Small pieces of rock or metal in the solar system.'}</p>
         </div>
         <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
            <h4 className="text-[10px] font-black text-emerald-500 uppercase mb-1">{t('language') === 'tr' ? 'Gök Taşı' : 'Meteorite'}</h4>
            <p className="text-[9px] text-slate-400">{t('language') === 'tr' ? 'Yeryüzüne ulaşabilen meteor parçaları.' : 'Meteor fragments that can reach the Earth\'s surface.'}</p>
         </div>
         <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
            <h4 className="text-[10px] font-black text-orange-500 uppercase mb-1">{t('language') === 'tr' ? 'Asteroit' : 'Asteroid'}</h4>
            <p className="text-[9px] text-slate-400">{t('language') === 'tr' ? 'Mars ve Jüpiter arasındaki kuşakta bolca bulunurlar.' : 'They are abundant in the belt between Mars and Jupiter.'}</p>
         </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SolarSystemSimulation;
