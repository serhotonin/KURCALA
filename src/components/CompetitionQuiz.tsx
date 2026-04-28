import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Stack, 
  alpha, 
  useTheme, 
  LinearProgress, 
  Fade, 
  Zoom, 
  Chip, 
  Divider,
  Tooltip,
  ClickAwayListener
} from '@mui/material';
import TrophyIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
import CloseIcon from '@mui/icons-material/Close';
import CorrectIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import { useLanguage } from '../LanguageContext';

interface Question {
  id: number;
  textTr: string;
  textEn: string;
  optionsTr: string[];
  optionsEn: string[];
  correctIndex: number;
  learningOutcome: string;
  outcomeDescTr: string;
  outcomeDescEn: string;
}

const formatScientific = (text: string) => {
  if (!text) return '';
  const parts = text.split(/(\$[^\$]+\$)/g);
  return parts.map((part, i) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const math = part.slice(1, -1);
      const subParts = math.split(/_\{([^\}]+)\}|_([a-zA-Z0-9]+)/g).filter(p => p !== undefined);
      return (
        <span key={i} style={{ fontStyle: 'italic', fontFamily: 'serif', fontWeight: 600, color: 'inherit' }}>
          {subParts.map((sub, j) => {
            if (j % 2 === 1) return <sub key={j} style={{ fontSize: '0.65em', bottom: '-0.25em' }}>{sub}</sub>;
            return sub;
          })}
        </span>
      );
    }
    return part;
  });
};

const CompetitionQuiz: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { language } = useLanguage();
  const theme = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ team: 'A' | 'B'; correct: boolean } | null>(null);
  const [openTooltip, setOpenTooltip] = useState(false);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('sidebar-collapse', { detail: true }));
    return () => {
      window.dispatchEvent(new CustomEvent('sidebar-collapse', { detail: false }));
    };
  }, []);

  const questions: Question[] = [
    {
      id: 1,
      textTr: "Bir araştırmacı, K ve L şehirlerinde yıl boyunca yere dik olarak yerleştirdiği özdeş çubukların öğle vakti gölge boylarını ölçmüş ve aşağıdaki verileri elde etmiştir:\nK şehri: Gölge boyu yıl boyunca hiçbir zaman sıfır olmamıştır. En kısa gölge boyu 21 Haziran tarihinde ölçülmüştür.\nL şehri: Gölge boyu yılda iki kez sıfır olmuştur. 21 Aralık tarihindeki gölge boyu, 21 Haziran tarihindeki gölge boyundan daha uzundur.\nBuna göre aşağıdakilerden hangisi yanlıştır?",
      textEn: "A researcher measured noon shadow lengths in K and L cities:\nCity K: Shadow never zero, shortest on June 21.\nCity L: Shadow zero twice, Dec 21 shadow is longer than June 21.\nWhich statement is FALSE?",
      optionsTr: ["A) K şehri Yengeç Dönencesi ile Kuzey Kutbu arasındadır.", "B) L şehrine güneş 21 Mart ve 23 Eylül'de dik düşer.", "C) 21 Aralık'ta K'da gündüz, L'den daha kısadır.", "D) L şehri Ekvator ile Yengeç Dönencesi arasındadır."],
      optionsEn: ["A) K is between Tropic of Cancer and North Pole.", "B) Sun is perpendicular to L on equinoxes.", "C) On Dec 21, K has shorter daylight than L.", "D) L is between Equator and Tropic of Cancer."],
      correctIndex: 3,
      learningOutcome: "F.8.1.1.1",
      outcomeDescTr: "Mevsimlerin oluşumuna yönelik tahminlerde bulunur.",
      outcomeDescEn: "Predicts the formation of seasons."
    },
    {
      id: 2,
      textTr: "\"Aequorea\" isimli bitkide geniş yapraklılık (A) baskındır. Çiçek rengi modifikasyonla (magnezyumda mor, fakirde beyaz) belirlenir. Heterozigot geniş yapraklı iki bitki çaprazlanıp magnezyumca zengin toprağa ekilirse hangisi KESİNLİKLE doğrudur?",
      textEn: "In \"Aequorea\", broad leaf (A) is dominant. Color is modification (purple in magnesium). Two hybrid broad-leaf plants are crossed and seeds planted in magnesium-rich soil. Which is DEFINITELY true?",
      optionsTr: ["A) Dar yapraklı ihtimali %25'tir ve modifikasyondur.", "B) Yeni neslin tamamı Aa veya AA genotiplidir.", "C) Mor çiçekli olma modifikasyondur; fakirde beyaz açarlar.", "D) Tohumların %50'si Aa'dır ve bu bir mutasyondur."],
      optionsEn: ["A) 25% narrow leaf chance, which is modification.", "B) All new plants will have Aa or AA genotype.", "C) Purple is modification; they bloom white in poor soil.", "D) 50% are Aa, which is a mutation."],
      correctIndex: 2,
      learningOutcome: "F.8.2.2.2 / F.8.2.3.1 / F.8.2.4.1",
      outcomeDescTr: "Tek karakter çaprazlamaları ile ilgili problemler çözer. Mutasyon ve modifikasyonu açıklar. Canlıların çevreye uyumlarını açıklar.",
      outcomeDescEn: "Solves single-trait cross problems. Explains mutation and modification. Explains adaptation."
    },
    {
      id: 3,
      textTr: "Piston üzerinde $G$ ağırlıklı 3 tuğla varken ($P_{katı}$, $P_{gaz}$), bir tuğla alınıp kalan ikisi yan yana konuluyor (yüzey $2S$). Hangisi doğrudur?",
      textEn: "3 bricks of weight $G$ are on a piston ($P_{solid}$, $P_{gas}$). One is removed, two placed side-by-side ($2S$). Which is correct?",
      optionsTr: ["A) Tuğlaların pistona uyguladığı katı basıncı azalmıştır.", "B) Kap içindeki gaz basıncı artmıştır.", "C) Kuvvet değişmediği için $P_{gaz}$ sabit kalmıştır.", "D) Katı basıncı yarıya düşmüştür."],
      optionsEn: ["A) Solid pressure on the piston has decreased.", "B) Gas pressure inside has increased.", "C) $P_{gas}$ is constant as total force didn't change.", "D) Solid pressure halved."],
      correctIndex: 0,
      learningOutcome: "F.8.3.1.1 / F.8.3.1.3",
      outcomeDescTr: "Katı basıncını etkileyen değişkenleri deneyerek keşfeder. Katı ve gazların basınç özelliklerinin günlük yaşam uygulamalarına örnekler verir.",
      outcomeDescEn: "Discovers variables affecting solid pressure. Gives examples of solid and gas pressure applications."
    },
    {
      id: 4,
      textTr: "$X$ ve $Y$ tepkimeye girip $Z$ ve $T$ oluşturuyor. $Z$ fenolftaleinle pembe olurken, $T$ mavi turnusolu kırmızı yapar. Hangisine ULAŞILAMAZ?",
      textEn: "$X$ and $Y$ react to form $Z$ and $T$. $Z$ turns phenolphthalein pink, $T$ turns blue litmus red. Which is unreachable?",
      optionsTr: ["A) $X+Y$ kütle toplamı, $Z+T$ kütle toplamına eşittir.", "B) $Z$ maddesinin pH değeri 7'den büyüktür.", "C) $T$ maddesi metallerle tepkimeye girip hidrojen çıkarır.", "D) Tepkime nötralleşmedir ve $X, Y$ kesinlikle tuz ve sudur."],
      optionsEn: ["A) Total mass of $X+Y$ equals $Z+T$.", "B) $Z$ has pH > 7.", "C) $T$ reacts with metals to release hydrogen.", "D) It's neutralization; $X, Y$ are definitely salt and water."],
      correctIndex: 3,
      learningOutcome: "F.8.4.3.1 / F.8.4.4.1",
      outcomeDescTr: "Kimyasal tepkimelerin oluşumunu açıklar. Asit ve bazların genel özelliklerini ifade eder.",
      outcomeDescEn: "Explains chemical reaction formation. States general properties of acids and bases."
    },
    {
      id: 5,
      textTr: "$P$ yükünü kaldıran kaldıraç, makara ve eğik düzlem sisteminde $F$ kuvvetini kesinlikle azaltmak için hangisi yapılmalıdır?",
      textEn: "In a system with lever, pulley and plane lifting $P$, what definitely decreases force $F$?",
      optionsTr: ["A) Kaldıracın desteğini kuvvete yaklaştırmak.", "B) Eğik düzlemin boyunu uzatmak.", "C) Hareketli makara yerine sabit makara kullanmak.", "D) Eğik düzlemin boyunu kısaltmak."],
      optionsEn: ["A) Move lever support closer to force.", "B) Extend the length of the inclined plane.", "C) Use fixed pulley instead of movable.", "D) Shorten the inclined plane."],
      correctIndex: 1,
      learningOutcome: "F.8.5.1.1 / F.8.5.1.2",
      outcomeDescTr: "Basit makinelerin sağladığı avantajları örnekler üzerinden açıklar. Basit makine çeşitlerini tasarlar.",
      outcomeDescEn: "Explains advantages of simple machines through examples. Designs simple machine types."
    },
    {
      id: 6,
      textTr: "X bölgesinde havanın alçaldığını gören öğrenci 'Burası yüksek basınç ve hava soğuktur' diyor. Hangisi bu yanılgıyı düzeltir?",
      textEn: "Student sees air sinking in X and says 'It's high pressure and cold'. Which example corrects this?",
      optionsTr: ["A) Ekvatordaki yükselici hava ve bol yağış.", "B) Kutuplardaki alçalıcı hava ve buzullar.", "C) Sahra Çölü'nde 50°C'deki dinamik yüksek basınç alanları.", "D) Denizden karaya esen meltemler."],
      optionsEn: ["A) Rising air and rain in Equator.", "B) Sinking air and glaciers at poles.", "C) Dynamic high pressure in Sahara at 50°C.", "D) Sea breezes."],
      correctIndex: 2,
      learningOutcome: "F.8.1.2.1",
      outcomeDescTr: "İklim ve hava olayları arasındaki farkı açıklar.",
      outcomeDescEn: "Explains the difference between climate and weather phenomena."
    },
    {
      id: 7,
      textTr: "Tabanları eşit K (silindir), L (daralan), M (genişleyen) kaplarına eşit hacimde su konulursa taban basınçları nasıl sıralanır?",
      textEn: "Equal water in K, L, M with same base area. Pressure order?",
      optionsTr: ["A) $P_K = P_L = P_M$", "B) $P_L > P_K > P_M$", "C) $P_M > P_K > P_L$", "D) Verilerle bulunamaz."],
      optionsEn: ["A) $P_K = P_L = P_M$", "B) $P_L > P_K > P_M$", "C) $P_M > P_K > P_L$", "D) Cannot be found."],
      correctIndex: 1,
      learningOutcome: "F.8.3.2.1",
      outcomeDescTr: "Sıvı basıncını etkileyen değişkenleri tahmin eder ve test eder.",
      outcomeDescEn: "Predicts variables affecting liquid pressure and tests predictions."
    },
    {
      id: 8,
      textTr: "A şehrine ait 45 yıllık veriler yağışlı derken son 2 yıl kurak geçiyor. Bunun bilimsel açıklaması nedir?",
      textEn: "45-year data shows rain, but last 2 years were dry. Scientific explanation?",
      optionsTr: ["A) İklim ortalamadır; 2 yıl ekstrem olaydır, iklim hemen değişmez.", "B) İklim tamamen Karasal İklime dönüşmüştür.", "C) Raporlar hatalıdır.", "D) Yörünge değişmeden yağış rejimi değişmez."],
      optionsEn: ["A) Climate is average; 2 years are extreme.", "B) Climate turned into Steppe.", "C) Reports are wrong.", "D) Regime only changes with orbit."],
      correctIndex: 0,
      learningOutcome: "F.8.1.2.2",
      outcomeDescTr: "İklim biliminin (klimatoloji) bir bilim dalı olduğunu ve iklim bilimcileri bilir.",
      outcomeDescEn: "Recognizes climatology as a science branch."
    },
    {
      id: 9,
      textTr: "Kapalı hidrolik sistemde su yerine cıva kullanılırsa dengeleyen $F$ kuvveti nasıl değişir?",
      textEn: "In closed hydraulic system, if mercury replaces water, how does force $F$ change?",
      optionsTr: ["A) Cıva yoğun olduğu için $F$ azalır.", "B) Pascal prensibinde sıvı cinsi kuvveti değiştirmez.", "C) Cıva ağır olduğu için $F$ artar.", "D) Yoğunluk artışı sistemi kilitler."],
      optionsEn: ["A) $F$ decreases due to mercury.", "B) Fluid type doesn't change static force.", "C) $F$ increases as mercury is heavy.", "D) Density locks system."],
      correctIndex: 1,
      learningOutcome: "F.8.3.1.2",
      outcomeDescTr: "Sıvıların basıncı her yöne ilettiğini (Pascal Prensibi) keşfeder.",
      outcomeDescEn: "Understands Pascal's Principle."
    },
    {
      id: 10,
      textTr: "Kaba su akıtılıp musluk kapanıyor ve tuz ekleniyor. Taban basınç grafiği özelliği ne olmalıdır?",
      textEn: "Water added, tap closed, then salt added. What is the pressure graph property?",
      optionsTr: ["A) Orijinden başlamalı ve tuzda sabit kalmalıdır.", "B) Sıfırdan farklı başlamalı, akarken doğrusal artmalı, tuzda yoğunlukla artmalıdır.", "C) Tuzda $h$ değişmediği için sabit kalmalıdır.", "D) Akarken parabolik artmalıdır."],
      optionsEn: ["A) Start at origin, constant with salt.", "B) Start non-zero, linear with flow, increase with salt density.", "C) Constant with salt as $h$ is same.", "D) Parabolic with flow."],
      correctIndex: 1,
      learningOutcome: "F.8.3.2.2",
      outcomeDescTr: "Sıvı basıncının günlük yaşam ve teknolojideki uygulamalarına örnekler verir.",
      outcomeDescEn: "Gives examples of liquid pressure applications."
    }
  ];

  const handleAnswer = (team: 'A' | 'B', optionIndex: number) => {
    if (winner || feedback) return;
    const isCorrect = optionIndex === questions[currentQuestion].correctIndex;
    setFeedback({ team, correct: isCorrect });
    setTimeout(() => {
      if (isCorrect) {
        let finalA = scoreA;
        let finalB = scoreB;
        if (team === 'A') { finalA += 10; setScoreA(finalA); }
        else { finalB += 10; setScoreB(finalB); }
        
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setFeedback(null);
        } else {
          setWinner(finalA === finalB ? 'TIE' : (finalA > finalB ? 'TEAM A' : 'TEAM B'));
        }
      } else {
        setFeedback(null);
      }
    }, 1200);
  };

  const currentQ = questions[currentQuestion];
  const options = language === 'tr' ? currentQ.optionsTr : currentQ.optionsEn;

  return (
    <Box sx={{ 
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
      bgcolor: '#020617', zIndex: 10000, display: 'flex', flexDirection: 'column', 
      color: '#f8fafc', overflow: 'hidden'
    }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(255,255,255,0.1)', bgcolor: '#0f172a' }}>
        <Box sx={{ textAlign: 'center', minWidth: 140 }}>
          <Typography variant="button" sx={{ fontWeight: 900, color: '#60a5fa', letterSpacing: 2, fontSize: '1rem' }}>TEAM A</Typography>
          <Typography variant="h2" sx={{ fontWeight: 950, color: '#60a5fa' }}>{scoreA}</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: 1, color: '#f1f5f9' }}>{language === 'tr' ? 'FEN OLİMPİYATI' : 'SCIENCE OLYMPIAD'}</Typography>
          <Chip label={`${currentQuestion + 1} / 10`} sx={{ mt: 1, bgcolor: '#f8fafc', color: '#020617', fontWeight: 950, px: 2 }} />
        </Box>
        <Box sx={{ textAlign: 'center', minWidth: 140 }}>
          <Typography variant="button" sx={{ fontWeight: 900, color: '#f87171', letterSpacing: 2, fontSize: '1rem' }}>TEAM B</Typography>
          <Typography variant="h2" sx={{ fontWeight: 950, color: '#f87171' }}>{scoreB}</Typography>
        </Box>
      </Box>

      <LinearProgress variant="determinate" value={((currentQuestion + 1) / 10) * 100} sx={{ height: 8, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b' } }} />

      <Box sx={{ flexGrow: 1, display: 'flex', p: 4, gap: 3, alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '22%' }}>
           {options.map((opt, idx) => (
             <Button key={`A-${idx}`} variant="contained" onClick={() => handleAnswer('A', idx)} disabled={!!feedback} sx={{ py: 3, borderRadius: 3, fontWeight: 800, fontSize: '1.05rem', bgcolor: '#1e293b', border: '2px solid #3b82f6', color: '#fff', '&:hover': { bgcolor: '#3b82f6', transform: 'scale(1.05)' }, textTransform: 'none' }}>
               {formatScientific(opt)}
             </Button>
           ))}
        </Box>

        <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2 }}>
           <Fade in={true} key={currentQuestion}>
             <Paper elevation={24} sx={{ p: 6, borderRadius: 10, bgcolor: '#0f172a', border: '3px solid rgba(255,255,255,0.05)', width: '100%', maxWidth: 750, minHeight: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', lineHeight: 1.5, mb: 4, color: '#f8fafc' }}>
                  {formatScientific(language === 'tr' ? currentQ.textTr : currentQ.textEn)}
                </Typography>
                <Divider sx={{ width: '80%', mb: 4, borderBottomWidth: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                
                <ClickAwayListener onClickAway={() => setOpenTooltip(false)}>
                  <Box>
                    <Tooltip 
                      PopperProps={{ disablePortal: true }}
                      onClose={() => setOpenTooltip(false)}
                      open={openTooltip}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener
                      title={language === 'tr' ? currentQ.outcomeDescTr : currentQ.outcomeDescEn} 
                      arrow 
                      placement="bottom"
                    >
                      <Box onClick={() => setOpenTooltip(true)} sx={{ cursor: 'help', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InfoIcon sx={{ color: '#f59e0b', fontSize: 24, opacity: 0.8 }} />
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#f59e0b', letterSpacing: 5 }}>{currentQ.learningOutcome}</Typography>
                      </Box>
                    </Tooltip>
                  </Box>
                </ClickAwayListener>

                {feedback && (
                  <Zoom in={true}>
                    <Box sx={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: feedback.correct ? alpha('#10b981', 0.98) : alpha('#ef4444', 0.98) }}>
                      {feedback.correct ? <CorrectIcon sx={{ fontSize: 130, mb: 2, color: '#fff' }} /> : <CloseIcon sx={{ fontSize: 130, mb: 2, color: '#fff' }} />}
                      <Typography variant="h1" sx={{ fontWeight: 950, color: '#fff' }}>{feedback.correct ? (language === 'tr' ? 'DOĞRU!' : 'CORRECT!') : (language === 'tr' ? 'TEKRAR DENE' : 'TRY AGAIN')}</Typography>
                    </Box>
                  </Zoom>
                )}
             </Paper>
           </Fade>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '22%' }}>
           {options.map((opt, idx) => (
             <Button key={`B-${idx}`} variant="contained" onClick={() => handleAnswer('B', idx)} disabled={!!feedback} sx={{ py: 3, borderRadius: 3, fontWeight: 800, fontSize: '1.05rem', bgcolor: '#1e293b', border: '2px solid #ef4444', color: '#fff', '&:hover': { bgcolor: '#ef4444', transform: 'scale(1.05)' }, textTransform: 'none' }}>
               {formatScientific(opt)}
             </Button>
           ))}
        </Box>
      </Box>

      <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#020617' }}>
        <Button variant="text" color="inherit" onClick={onExit} sx={{ fontWeight: 900, opacity: 0.2, '&:hover': { opacity: 1 } }}>{language === 'tr' ? 'YARIŞMADAN AYRIL' : 'EXIT'}</Button>
      </Box>

      {winner && (
        <Fade in={true}>
          <Box sx={{ position: 'absolute', inset: 0, zIndex: 20000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#020617', textAlign: 'center' }}>
            <TrophyIcon sx={{ fontSize: 240, color: '#fbbf24', mb: 4 }} />
            <Typography variant="h1" sx={{ fontWeight: 950, mb: 1, color: '#fff' }}>{winner === 'TIE' ? (language === 'tr' ? 'BERABERE!' : 'TIE!') : `${winner} ${language === 'tr' ? 'KAZANDI!' : 'WINS!'}`}</Typography>
            <Typography variant="h3" sx={{ mb: 8, fontWeight: 700, color: '#fbbf24' }}>TEAM A: {scoreA} | TEAM B: {scoreB}</Typography>
            <Button variant="contained" size="large" onClick={onExit} sx={{ bgcolor: '#fbbf24', color: 'black', py: 3, px: 12, borderRadius: 4, fontWeight: 950, fontSize: '2rem' }}>{language === 'tr' ? 'BİTİR' : 'COMPLETE'}</Button>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default CompetitionQuiz;
