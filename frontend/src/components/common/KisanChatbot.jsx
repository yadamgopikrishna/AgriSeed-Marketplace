import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
  HelpCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const KisanChatbot = () => {
  const { currentLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef(null);

  const initialWelcome = t('chatbotWelcome');

  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'bot',
      text: initialWelcome,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Update welcome on language change
  useEffect(() => {
    setMessages(prev => [
      {
        id: 'msg_welcome',
        sender: 'bot',
        text: t('chatbotWelcome'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev.filter(m => m.id !== 'msg_welcome')
    ]);
  }, [currentLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickChips = [
    {
      en: '🌾 Best time to sow Pusa Basmati 1121?',
      hi: '🌾 पूसा बासमती 1121 की बुवाई का सही समय?',
      pa: '🌾 ਪੂਸਾ ਬਾਸਮਤੀ 1121 ਦੀ ਬਿਜਾਈ ਦਾ ਸਹੀ ਸਮਾਂ?',
      te: '🌾 పూసా బాస్మతి 1121 విత్తే సరైన సమయం?'
    },
    {
      en: '💰 How to claim 10% Kisan Subsidy?',
      hi: '💰 10% किसान सब्सिडी कैसे प्राप्त करें?',
      pa: '💰 10% ਕਿਸਾਨ ਸਬਸਿਡੀ ਕਿਵੇਂ ਲਈਏ?',
      te: '💰 10% కిసాన్ సబ్సిడీని ఎలా పొందాలి?'
    },
    {
      en: '🧪 What is the dosage for NPK 19:19:19?',
      hi: '🧪 NPK 19:19:19 खाद की कितनी मात्रा डालें?',
      pa: '🧪 NPK 19:19:19 ਖਾਦ ਦੀ ਕਿੰਨੀ ਮਾਤਰਾ ਪਾਈਏ?',
      te: '🧪 NPK 19:19:19 ఎరువుల మోతాదు ఎంత?'
    },
    {
      en: '🚚 How to track my seed delivery?',
      hi: '🚚 मेरी बीज डिलीवरी कैसे ट्रैक करें?',
      pa: '🚚 ਮੇਰੇ ਬੀਜ ਦੀ ਡਿਲਿਵਰੀ ਕਿਵੇਂ ਟ੍ਰੈਕ ਕਰਾਂ?',
      te: '🚚 నా విత్తనాల డెలివరీని ఎలా ట్రాక్ చేయాలి?'
    }
  ];

  const getKnowledgeResponse = (query) => {
    const q = query.toLowerCase();

    // Sowing / Basmati
    if (q.includes('basmati') || q.includes('sow') || q.includes('बासमती') || q.includes('ਬਾਸਮਤੀ') || q.includes('బాస్మతి') || q.includes('బువాయి') || q.includes('ਬਿਜਾਈ')) {
      if (currentLang === 'hi') {
        return 'पूसा बासमती 1121 की नर्सरी मई के आखिरी सप्ताह से जून के मध्य तक तैयार करनी चाहिए। प्रति एकड़ 8-10 किलो प्रमाणित बीज का उपयोग करें। हमारे कैटलॉग में ICAR प्रमाणित लॉट 95% अंकुरण गारंटी के साथ उपलब्ध है!';
      }
      if (currentLang === 'pa') {
        return 'ਪੂਸਾ ਬਾਸਮਤੀ 1121 ਦੀ ਪਨੀਰੀ 25 ਮਈ ਤੋਂ 15 ਜੂਨ ਦਰਮਿਆਨ ਬੀਜੋ। ਪ੍ਰਤੀ ਏਕੜ 8-10 ਕਿਲੋ ਪ੍ਰਮਾਣਿਤ ਬੀਜ ਵਰਤੋ। ਸਾਡੇ ਪੋਰਟਲ ਤੇ ICAR ਟੈਸਟਡ ਬੀਜ 95% ਪੁੰਗਰਨ ਗਾਰੰਟੀ ਨਾਲ ਉਪਲਬਧ ਹੈ!';
      }
      if (currentLang === 'te') {
        return 'పూసా బాస్మతి 1121 నర్సరీని మే చివరి నుండి జూన్ మధ్య వరకు విత్తుకోవాలి. ఎకరానికి 8-10 కిలోల సర్టిఫైడ్ విత్తనాలు అవసరం. మా వద్ద 95% మొలక హామీతో ICAR ల్యాబ్ టెస్ట్ చేసిన స్టాక్ అందుబాటులో ఉంది!';
      }
      return 'For Pusa Basmati 1121, prepare the nursery bed between late May and mid-June. Use 8-10 kg of certified seeds per acre. Our catalog lots come with an ICAR 95% germination test guarantee!';
    }

    // Subsidy
    if (q.includes('subsidy') || q.includes('discount') || q.includes('coupon') || q.includes('सब्सिडी') || q.includes('ਸਬਸਿਡੀ') || q.includes('సబ్సిడీ')) {
      if (currentLang === 'hi') {
        return 'कृषि इनपुट्स पर 10% सरकारी सब्सिडी छूट प्राप्त करने के लिए चेकआउट के समय कूपन कोड KISAN50 लागू करें। ₹999 से अधिक के ऑर्डर पर गांव तक मुफ्त डिलीवरी भी मिलेगी!';
      }
      if (currentLang === 'pa') {
        return 'ਖੇਤੀ ਉਤਪਾਦਾਂ ਤੇ 10% ਕਿਸਾਨ ਸਬਸਿਡੀ ਛੋਟ ਲੈਣ ਲਈ ਚੈੱਕਆਉਟ ਵੇਲੇ ਕੂਪਨ KISAN50 ਲਗਾਓ। ₹999 ਤੋਂ ਵੱਧ ਦੇ ਆਰਡਰ ਤੇ ਪਿੰਡ ਤੱਕ ਮੁਫ਼ਤ ਡਿਲੀਵਰੀ ਦੀ ਸੁਵਿਧਾ ਵੀ ਹੈ!';
      }
      if (currentLang === 'te') {
        return '10% ప్రభుత్వ కిసాన్ సబ్సిడీ రాయితీ కోసం చెక్అవుట్ సమయంలో KISAN50 కూపన్ కోడ్ ఉపయోగించండి. ₹999 పైబడిన ఆర్డర్లపై గ్రామానికే ఉచిత డెలివరీ లభిస్తుంది!';
      }
      return 'To claim your 10% direct Kisan subsidy grant, enter coupon code KISAN50 during checkout! Orders above ₹999 also qualify for Free Farm Gate Rural Delivery.';
    }

    // NPK / Fertilizer
    if (q.includes('npk') || q.includes('fertilizer') || q.includes('खाद') || q.includes('ਖਾਦ') || q.includes('ఎరువు')) {
      if (currentLang === 'hi') {
        return 'NPK 19:19:19 100% पानी में घुलनशील खाद है। पत्तियों पर छिड़काव के लिए 5 ग्राम प्रति लीटर पानी और ड्रिप सिंचाई के लिए 2-3 किलोग्राम प्रति एकड़ का प्रयोग करें।';
      }
      if (currentLang === 'pa') {
        return 'NPK 19:19:19 ਪੂਰੀ ਤਰ੍ਹਾਂ ਘੁਲਣਸ਼ੀਲ ਖਾਦ ਹੈ। ਸਪਰੇਅ ਲਈ 5 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਅਤੇ ਤੁਪਕਾ ਸਿੰਚਾਈ ਲਈ 2-3 ਕਿਲੋ ਪ੍ਰਤੀ ਏਕੜ ਵਰਤੋਂ ਕਰੋ।';
      }
      if (currentLang === 'te') {
        return 'NPK 19:19:19 100% నీటిలో కరిగే ఎరువు. పిచికారీకి లీటరు నీటికి 5 గ్రాములు మరియు డ్రిప్ ద్వారా ఎకరానికి 2-3 కిలోలు వాడండి.';
      }
      return 'NPK 19:19:19 is 100% water-soluble. For foliar spray, dissolve 5g per litre of clean water. For drip irrigation, apply 2-3 kg per acre during the vegetative stage.';
    }

    // Tracking / Delivery
    if (q.includes('track') || q.includes('order') || q.includes('delivery') || q.includes('ऑर्डर') || q.includes('ਟਰੈਕ') || q.includes('ట్రాకింగ్') || q.includes('డెలివరీ')) {
      if (currentLang === 'hi') {
        return 'आप अपने ऑर्डर आईडी (जैसे AGRI-849201) को नेवबार में "ऑर्डर ट्रैक करें" पेज पर दर्ज करके 5-चरणीय लाइव डिलीवरी स्थिति और चालक का विवरण देख सकते हैं।';
      }
      if (currentLang === 'pa') {
        return 'ਤੁਸੀਂ ਆਪਣਾ ਆਰਡਰ ID (ਜਿਵੇਂ AGRI-849201) "ਆਰਡਰ ਟ੍ਰੈਕ ਕਰੋ" ਪੰਨੇ ਤੇ ਪਾ ਕੇ 5-ਪੜਾਵੀ ਲਾਈਵ ਡਿਲਿਵਰੀ ਸਟੇਟਸ ਅਤੇ ਡਰਾਈਵਰ ਜਾਣਕਾਰੀ ਵੇਖ ਸਕਦੇ ਹੋ।';
      }
      if (currentLang === 'te') {
        return 'మీ ఆర్డర్ ID (ఉదా. AGRI-849201) ను "ఆర్డర్ ట్రాకింగ్" పేజీలో నమోదు చేయడం ద్వారా 5-దశల లైవ్ డెలివరీ మరియు డ్రైవర్ వివరాలను తనిఖీ చేయవచ్చు.';
      }
      return 'You can track your agricultural consignment in real-time by entering your Order ID (e.g. AGRI-849201) on the "Track Order" page in the navigation bar.';
    }

    // Default response
    if (currentLang === 'hi') {
      return 'धन्यवाद किसान भाई! आपके प्रश्न के समाधान हेतु हमारी आईसीएआर प्रमाणित हेल्पलाइन 24 घंटे उपलब्ध है। आप हमारे एआई क्रॉप डॉक्टर या उत्पाद कैटलॉग से भी सीधे सहायता ले सकते हैं।';
    }
    if (currentLang === 'pa') {
      return 'ਧੰਨਵਾਦ ਕਿਸਾਨ ਵੀਰੋ! ਖੇਤੀਬਾੜੀ ਮਾਹਿਰਾਂ ਦੀ ਸਹਾਇਤਾ ਲਈ ਸਾਡਾ ਪੋਰਟਲ ਹਮੇਸ਼ਾ ਤਿਆਰ ਹੈ। ਤੁਸੀਂ ਕ੍ਰੌਪ ਡਾਕਟਰ ਸਕੈਨਰ ਜਾਂ ਕੈਟਾਲਾਗ ਦੀ ਵੀ ਵਰਤੋਂ ਕਰ ਸਕਦੇ ਹੋ।';
    }
    if (currentLang === 'te') {
      return 'ధన్యవాదాలు రైతు మిత్రమా! మీ వ్యవసాయ సంబంధిత సలహాల కోసం మా నిపుణుల సేవలు ఎల్లప్పుడూ సిద్ధంగా ఉన్నాయి. మీరు AI క్రాప్ డాక్టర్ ద్వారా కూడా పంట తెగుళ్లను గుర్తించవచ్చు.';
    }
    return 'Thank you! AgriSeed is dedicated to empowering farmers with ICAR-certified seeds, bio-nutrients, and instant AI plant pathology diagnosis. You can also explore our AI Crop Doctor or Full Catalog.';
  };

  const handleSend = (textToSend = null) => {
    const query = (textToSend || inputMsg).trim();
    if (!query) return;

    const userMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputMsg('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = getKnowledgeResponse(query);
      const botMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported by your browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = { en: 'en-IN', hi: 'hi-IN', pa: 'pa-IN', te: 'te-IN' };
    utterance.lang = langMap[currentLang] || 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-3xl text-white shadow-2xl flex items-center gap-2.5 transition-all duration-300 cursor-pointer hover:scale-105 ${
          isOpen ? 'bg-slate-900 rotate-90' : 'bg-gradient-to-r from-emerald-700 to-green-600 shadow-emerald-700/40'
        }`}
        title="Kisan AI Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <div className="relative">
              <Bot className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
            </div>
            <span className="font-extrabold text-xs hidden sm:inline">{t('chatbotTitle')}</span>
          </>
        )}
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-40 w-[92vw] sm:w-96 bg-white rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden flex flex-col h-[520px] animate-fadeIn">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow-xs">
                🌾
              </div>
              <div>
                <h3 className="font-black text-sm font-serif">{t('chatbotTitle')}</h3>
                <span className="text-[10px] text-emerald-300 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{t('chatbotSubtitle')}</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-xs">
                    🤖
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <p>{m.text}</p>
                  <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-slate-100/40 text-[10px]">
                    <span className={m.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}>{m.time}</span>
                    {m.sender === 'bot' && (
                      <button
                        onClick={() => handleSpeak(m.text)}
                        className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-0.5 cursor-pointer"
                        title="Listen Audio"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{isSpeaking ? t('playingAudio') : t('listenAudio')}</span>
                      </button>
                    )}
                  </div>
                </div>

                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-xs">
                    👨‍🌾
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-slate-400 text-xs pl-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Inquiries Chips */}
          <div className="p-2.5 bg-white border-t border-slate-100 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
              {t('chatbotQuickChipsTitle')}
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              {quickChips.map((chip, idx) => {
                const label = chip[currentLang] || chip.en;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(label)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-semibold cursor-pointer shrink-0 transition-colors"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2 items-center"
          >
            <input
              type="text"
              placeholder={t('chatbotPlaceholder')}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-emerald-500 font-medium"
            />
            <button
              type="submit"
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors cursor-pointer shadow-xs shrink-0"
              title={t('chatbotSend')}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
