import React, { useState, useEffect, useMemo } from 'react';

// --- CURRICULUM DATA ---
const PLANETS = [
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
  const [activeStep, setActiveStep] = useState(0);
  const [userOrder, setUserOrder] = useState([]);
  const [sizeOrder, setSizeOrder] = useState([]);
  const [categories, setCategories] = useState({ inner: [], outer: [] });
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [feedback, setFeedback] = useState({ message: 'Güneş Sistemi Görevine Hoş Geldin Kaptan!', type: 'info' });
  const [shuffledPlanets, setShuffledPlanets] = useState([]);

  useEffect(() => {
    setShuffledPlanets([...PLANETS].sort(() => Math.random() - 0.5));
  }, []);

  // --- ACTIONS ---
  const handleOrderAdd = (planet) => {
    if (userOrder.find(p => p.id === planet.id)) return;
    const newOrder = [...userOrder, planet];
    setUserOrder(newOrder);

    if (newOrder.length === PLANETS.length) {
      const isCorrect = newOrder.every((p, idx) => p.order === idx + 1);
      if (isCorrect) {
        setFeedback({ message: 'Harika! Gezegenleri doğru yörüngelerine yerleştirdin.', type: 'success' });
      } else {
        setFeedback({ message: 'Bazı gezegenler yanlış yörüngede. Sıralamayı kontrol et!', type: 'error' });
      }
    }
  };

  const handleOrderRemove = (planetId) => {
    const newOrder = userOrder.filter(p => p.id !== planetId);
    setUserOrder(newOrder);
    setFeedback({ message: 'Gezegen yörüngeden kaldırıldı.', type: 'info' });
  };

  const handleUndo = () => {
    if (activeStep === 0) {
      setUserOrder(prev => prev.slice(0, -1));
    } else if (activeStep === 2) {
      setSizeOrder(prev => prev.slice(0, -1));
    }
    setFeedback({ message: 'Son işlem geri alındı.', type: 'info' });
  };

  const handleSizeAdd = (planet) => {
    if (sizeOrder.find(p => p.id === planet.id)) return;
    const newOrder = [...sizeOrder, planet];
    setSizeOrder(newOrder);

    if (newOrder.length === PLANETS.length) {
      // Sort planets by size descending
      const correctSizeOrder = [...PLANETS].sort((a, b) => b.size - a.size);
      const isCorrect = newOrder.every((p, idx) => p.id === correctSizeOrder[idx].id);
      
      if (isCorrect) {
        setFeedback({ message: 'Mükemmel! Gezegenleri büyüklüklerine göre doğru sıraladın.', type: 'success' });
      } else {
        setFeedback({ message: 'Büyüklük sıralamasında hata var. Gaz devlerinin daha büyük olduğunu unutma!', type: 'error' });
      }
    }
  };

  const handleSizeRemove = (planetId) => {
    const newOrder = sizeOrder.filter(p => p.id !== planetId);
    setSizeOrder(newOrder);
  };

  const handleCategoryAdd = (planet, category) => {
    if (categories.inner.find(p => p.id === planet.id) || categories.outer.find(p => p.id === planet.id)) return;
    
    const newCategories = { ...categories, [category]: [...categories[category], planet] };
    setCategories(newCategories);

    if (newCategories.inner.length + newCategories.outer.length === PLANETS.length) {
      const innerCorrect = newCategories.inner.every(p => p.type === 'inner');
      const outerCorrect = newCategories.outer.every(p => p.type === 'outer');
      if (innerCorrect && outerCorrect) {
        setFeedback({ message: 'Tebrikler! İç ve Dış gezegenleri başarıyla gruplandırdın.', type: 'success' });
      } else {
        setFeedback({ message: 'Gruplandırmada hata var. Gezegenlerin yapılarını hatırla!', type: 'error' });
      }
    }
  };

  const resetStep = () => {
    setUserOrder([]);
    setSizeOrder([]);
    setCategories({ inner: [], outer: [] });
    setSelectedPlanet(null);
    setFeedback({ message: QUESTIONS[activeStep].text, type: 'info' });
  };

  const nextStep = () => {
    if (activeStep < QUESTIONS.length - 1) {
      const nextIdx = activeStep + 1;
      setActiveStep(nextIdx);
      setUserOrder([]);
      setSizeOrder([]);
      setCategories({ inner: [], outer: [] });
      setSelectedPlanet(null);
      setFeedback({ message: QUESTIONS[nextIdx].text, type: 'info' });
    } else {
      setFeedback({ message: 'Tebrikler Kaptan! Tüm görevleri başarıyla tamamladın. Sistem yeniden başlatılıyor...', type: 'success' });
      setTimeout(() => {
        setActiveStep(0);
        setUserOrder([]);
        setSizeOrder([]);
        setCategories({ inner: [], outer: [] });
        setSelectedPlanet(null);
        setFeedback({ message: QUESTIONS[0].text, type: 'info' });
      }, 3000);
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto p-12 bg-slate-950 rounded-[50px] border-[8px] border-slate-900 shadow-2xl overflow-hidden text-slate-100">
      
      {/* Background Stars */}
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
           GÜNEŞ SİSTEMİ KEŞİF ARACI
        </h1>
        <div className={`mt-4 inline-block px-8 py-2 rounded-xl border-2 transition-all backdrop-blur-xl
          ${feedback.type === 'success' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 
            feedback.type === 'error' ? 'bg-rose-500/10 border-rose-500 text-rose-400' : 
            'bg-slate-900/50 border-slate-700 text-slate-400'}
        `}>
          {feedback.message}
        </div>
        {QUESTIONS[activeStep] && (
          <p className="mt-2 text-slate-500 text-sm font-medium animate-pulse">
            💡 {QUESTIONS[activeStep].instruction}
          </p>
        )}
      </header>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Planet Selection Area */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest pl-2">Gezegen Paneli</h2>
          <div className="grid grid-cols-2 gap-3">
            {shuffledPlanets.map((planet) => (
              <button
                key={planet.id}
                onClick={() => {
                  if (activeStep === 0) handleOrderAdd(planet);
                  if (activeStep === 1) setSelectedPlanet(planet); // Show details before categorizing
                  if (activeStep === 2) handleSizeAdd(planet);
                }}
                disabled={(activeStep === 0 && userOrder.find(p => p.id === planet.id)) || 
                          (activeStep === 1 && (categories.inner.find(p => p.id === planet.id) || categories.outer.find(p => p.id === planet.id))) ||
                          (activeStep === 2 && sizeOrder.find(p => p.id === planet.id))}
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
                    <button onClick={() => handleCategoryAdd(selectedPlanet, 'inner')} className="flex-1 py-2 bg-stone-700 rounded-lg text-[9px] font-black hover:bg-stone-600">İÇ (KARASAL)</button>
                    <button onClick={() => handleCategoryAdd(selectedPlanet, 'outer')} className="flex-1 py-2 bg-amber-900 rounded-lg text-[9px] font-black hover:bg-amber-800">DIŞ (GAZ)</button>
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
              <span>↩️</span> GERİ AL
            </button>
          )}
        </div>

        {/* Workspace */}
        <div className="lg:col-span-9 bg-slate-900/40 rounded-[40px] border-2 border-slate-800 p-8 min-h-[500px] flex flex-col">
          
          {/* STEP 0: ORDERING */}
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
                             <span className="text-[8px] font-black">KALDIR</span>
                          </div>
                       </div>
                       <span className="text-[10px] font-black mt-2 text-slate-400">{planet.name}</span>
                       <span className="text-[8px] text-blue-500 font-bold">{idx + 1}. Yörünge</span>
                    </div>
                  ))}
                  {userOrder.length === 0 && (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl">
                       <p className="text-slate-600 font-black italic">Gezegenleri sırasıyla buraya ekle...</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* STEP 1: CATEGORIZING */}
          {activeStep === 1 && (
            <div className="flex-1 grid grid-cols-2 gap-8">
               <div className="bg-stone-900/40 rounded-3xl border-2 border-stone-800 p-6 flex flex-col">
                  <h3 className="text-center font-black text-stone-500 mb-4 uppercase tracking-widest text-sm">İç Gezegenler (Karasal)</h3>
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
                  <h3 className="text-center font-black text-amber-600 mb-4 uppercase tracking-widest text-sm">Dış Gezegenler (Gaz/Buz Devleri)</h3>
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

          {/* STEP 2: SIZE ORDERING */}
          {activeStep === 2 && (
            <div className="flex-1 flex flex-col">
               <div className="mb-6 flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                  <span className="text-xs font-black text-slate-400">EN BÜYÜK</span>
                  <div className="flex-1 mx-4 h-0.5 bg-slate-700" />
                  <span className="text-xs font-black text-slate-400">EN KÜÇÜK</span>
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
                             <span className="text-[8px] font-black text-white uppercase">Kaldır</span>
                          </div>
                       </div>
                       <span className="text-[10px] font-black mt-2 text-slate-400">{planet.name}</span>
                       <span className="text-[8px] text-blue-500 font-bold">{idx + 1}.</span>
                    </div>
                  ))}
                  {sizeOrder.length === 0 && (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl">
                       <p className="text-slate-600 font-black italic text-center">
                         Gezegenleri büyükten küçüğe doğru panolden seçerek buraya ekle...<br/>
                         <span className="text-[10px] opacity-50">(Örn: Önce Jüpiter)</span>
                       </p>
                    </div>
                  )}
               </div>
            </div>
          )}

          <div className="mt-8 flex justify-between items-center border-t border-slate-800 pt-6">
            <div className="flex gap-2">
               {[...Array(QUESTIONS.length)].map((_, i) => (
                 <div key={i} className={`w-3 h-3 rounded-full ${activeStep === i ? 'bg-blue-500' : 'bg-slate-800'}`} />
               ))}
            </div>
            <div className="flex gap-4">
               <button onClick={resetStep} className="px-6 py-2 rounded-xl text-xs font-black text-slate-500 hover:text-white transition-colors">SIFIRLA</button>
               {feedback.type === 'success' && (
                 <button onClick={nextStep} className="px-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-500 shadow-lg shadow-blue-900/40 animate-bounce">
                    {activeStep === QUESTIONS.length - 1 ? 'TAMAMLA' : 'SONRAKİ GÖREV'}
                 </button>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="mt-8 grid grid-cols-3 gap-4">
         <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
            <h4 className="text-[10px] font-black text-blue-500 uppercase mb-1">Meteor</h4>
            <p className="text-[9px] text-slate-400">Güneş sistemindeki küçük kaya veya metal parçaları.</p>
         </div>
         <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
            <h4 className="text-[10px] font-black text-emerald-500 uppercase mb-1">Gök Taşı</h4>
            <p className="text-[9px] text-slate-400">Yeryüzüne ulaşabilen meteor parçaları.</p>
         </div>
         <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800">
            <h4 className="text-[10px] font-black text-orange-500 uppercase mb-1">Asteroit</h4>
            <p className="text-[9px] text-slate-400">Mars ve Jüpiter arasındaki kuşakta bolca bulunurlar.</p>
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
