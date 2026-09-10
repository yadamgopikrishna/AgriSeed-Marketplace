import React, { useState } from 'react';
import { CloudRain, Sun, Wind, Droplets, MapPin, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const REGIONAL_WEATHER_DATA = {
  punjab: {
    name: 'Punjab (Ludhiana / Bathinda)',
    temp: '28°C',
    humidity: '68%',
    rainChance: '15%',
    wind: '12 km/h',
    condition: 'Partly Cloudy • Optimal Sowing Window',
    soilMoisture: 'Adequate (64%)',
    sowingTipEn: 'Ideal soil moisture for Basmati 1121 and Wheat 1105. Apply basal NPK dose before sowing.',
    sowingTipHi: 'बासमती 1121 और गेहूं 1105 के लिए आदर्श मिट्टी की नमी। बुवाई से पहले बेसल NPK खाद डालें।',
    sowingTipPa: 'ਬਾਸਮਤੀ 1121 ਅਤੇ ਕਣਕ 1105 ਲਈ ਢੁਕਵੀਂ ਸਿੱਲ। ਬਿਜਾਈ ਤੋਂ ਪਹਿਲਾਂ NPK ਖਾਦ ਦਾ ਛੱਟਾ ਦਿਓ।',
    sowingTipTe: 'బాస్మతి 1121 మరియు గోధుమ 1105 విత్తడానికి అనుకూలమైన తేమ. విత్తే ముందు NPK ఎరువులు వేయండి.'
  },
  haryana: {
    name: 'Haryana (Karnal / Kurukshetra)',
    temp: '29°C',
    humidity: '62%',
    rainChance: '10%',
    wind: '10 km/h',
    condition: 'Sunny & Favorable for Field Prep',
    soilMoisture: 'Optimal (60%)',
    sowingTipEn: 'Favorable conditions for Bt Cotton and Hybrid Tomato nursery transplanting.',
    sowingTipHi: 'बीटी कपास और हाइब्रिड टमाटर नर्सरी रोपाई के लिए अनुकूल मौसम।',
    sowingTipPa: 'ਬੀਟੀ ਨਰਮਾ ਅਤੇ ਟਮਾਟਰ ਪਨੀਰੀ ਲਗਾਉਣ ਲਈ ਉੱਤਮ ਮੌਸਮ।',
    sowingTipTe: 'బిటి పత్తి మరియు టమోటా నర్సరీ నాటడానికి అనుకూల వాతావరణం.'
  },
  andhra: {
    name: 'Andhra Pradesh (Guntur / Krishna)',
    temp: '32°C',
    humidity: '75%',
    rainChance: '30%',
    wind: '16 km/h',
    condition: 'Warm & Humid • Paddy Active Window',
    soilMoisture: 'High (72%)',
    sowingTipEn: 'Kharif paddy transplanting in progress. Spray Bio-Neem shield to prevent pink bollworm in cotton.',
    sowingTipHi: 'धान रोपाई जारी। कपास में गुलाबी सुंडी से बचाव हेतु बायो-नीम स्प्रे करें।',
    sowingTipPa: 'ਝੋਨੇ ਦੀ ਲੁਆਈ ਜਾਰੀ। ਨਰਮੇ ਵਿੱਚ ਗੁਲਾਬੀ ਸੁੰਡੀ ਦੀ ਰੋਕਥਾਮ ਲਈ ਬਾਇਓ-ਨੀਮ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।',
    sowingTipTe: 'వరి నాట్లు వేయడానికి అనుకూలం. పత్తిలో గులాబీ రంగు పురుగు నివారణకు బయో-నీమ్ స్ప్రే చేయండి.'
  },
  up: {
    name: 'Uttar Pradesh (Meerut / Varanasi)',
    temp: '30°C',
    humidity: '65%',
    rainChance: '20%',
    wind: '11 km/h',
    condition: 'Clear Sky • Excellent Field Condition',
    soilMoisture: 'Adequate (62%)',
    sowingTipEn: 'Prepare fields with organic neem cake to eliminate root nematodes before sowing vegetables.',
    sowingTipHi: 'सब्जियों की बुवाई से पहले दीमक और निमाटोड नियंत्रण हेतु नीम की खली का प्रयोग करें।',
    sowingTipPa: 'ਸਬਜ਼ੀਆਂ ਦੀ ਬਿਜਾਈ ਤੋਂ ਪਹਿਲਾਂ ਸਿਉਂਕ ਰੋਕਥਾਮ ਲਈ ਜੈਵਿਕ ਨਿੰਮ ਖਲ ਪਾਓ।',
    sowingTipTe: 'కూరగాయల విత్తే ముందు నెమటోడ్ల నివారణకు వేప పిండిని నేలలో కలపండి.'
  }
};

export const WeatherAdvisoryWidget = () => {
  const { currentLang, t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState('punjab');

  const data = REGIONAL_WEATHER_DATA[selectedRegion];
  const adviceKey = currentLang === 'hi' ? 'sowingTipHi' : currentLang === 'pa' ? 'sowingTipPa' : currentLang === 'te' ? 'sowingTipTe' : 'sowingTipEn';
  const advice = data[adviceKey] || data.sowingTipEn;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs relative overflow-hidden space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-xs">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-base">
                {t('weatherWidgetTitle')}
              </h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Live Doppler
              </span>
            </div>
            <p className="text-xs text-slate-500">{t('weatherWidgetSubtitle')}</p>
          </div>
        </div>

        {/* Region Selector */}
        <div className="flex items-center gap-2 text-xs">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 outline-none focus:border-emerald-500 cursor-pointer text-xs"
          >
            <option value="punjab">Punjab (Ludhiana / Bathinda)</option>
            <option value="haryana">Haryana (Karnal / Kurukshetra)</option>
            <option value="andhra">Andhra Pradesh (Guntur / Krishna)</option>
            <option value="up">Uttar Pradesh (Meerut / Varanasi)</option>
          </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-0.5">{t('tempLabel')}</span>
          <strong className="text-xl sm:text-2xl font-black text-amber-950 font-sans">{data.temp}</strong>
          <span className="text-[10px] text-amber-700 block mt-0.5">Optimal Range</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-0.5">{t('humidityLabel')}</span>
          <strong className="text-xl sm:text-2xl font-black text-blue-950 font-sans">{data.humidity}</strong>
          <span className="text-[10px] text-blue-700 block mt-0.5">Moisture Index</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-0.5">{t('rainfallLabel')}</span>
          <strong className="text-xl sm:text-2xl font-black text-teal-950 font-sans">{data.rainChance}</strong>
          <span className="text-[10px] text-teal-700 block mt-0.5">Low Precipitation</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-0.5">Soil Moisture</span>
          <strong className="text-lg sm:text-xl font-black text-emerald-950 font-sans">{data.soilMoisture}</strong>
          <span className="text-[10px] text-emerald-700 block mt-0.5">Field Ready</span>
        </div>
      </div>

      {/* Sowing Advice Banner */}
      <div className="p-4 rounded-2xl bg-emerald-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <strong className="font-bold text-amber-300">{t('sowingAdvisoryLabel')}:</strong>
              <span className="text-[11px] text-emerald-200">({data.name})</span>
            </div>
            <p className="text-emerald-100 leading-relaxed font-normal">
              {advice}
            </p>
          </div>
        </div>

        <span className="bg-emerald-800 text-emerald-200 text-[10px] font-black px-3 py-1 rounded-full uppercase shrink-0 self-start sm:self-center border border-emerald-700/60">
          {t('optimalSowingCondition')}
        </span>
      </div>

    </div>
  );
};
