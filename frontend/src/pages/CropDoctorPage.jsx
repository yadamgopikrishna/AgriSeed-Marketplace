import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Upload,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Volume2,
  VolumeX
} from 'lucide-react';
import { CROP_DISEASES_DB } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export const CropDoctorPage = () => {
  const { currentLang, t, localizeDisease } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('Paddy / Rice');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) return;
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

  const sampleImages = [
    { label: t('samplePaddyBlast'), crop: 'Paddy / Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80', resultIndex: 0 },
    { label: t('sampleCottonBollworm'), crop: 'Cotton', url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=400&q=80', resultIndex: 1 },
    { label: t('sampleWheatRust'), crop: 'Wheat', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80', resultIndex: 2 }
  ];

  const handleAnalyze = (sampleIndex = 0, imgUrl = null) => {
    setIsAnalyzing(true);
    setDiagnosisResult(null);
    setPreviewImage(imgUrl || sampleImages[sampleIndex].url);

    setTimeout(() => {
      setIsAnalyzing(false);
      setDiagnosisResult(CROP_DISEASES_DB[sampleIndex]);
    }, 1500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleAnalyze(0, url);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 px-3 py-1 rounded-full text-xs font-bold text-emerald-200 border border-emerald-700/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('aiDiagnosticBadge')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight">
            {t('aiDoctorTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed font-normal">
            {t('aiDoctorDesc')}
          </p>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Upload / Camera Card */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <h3 className="font-extrabold text-slate-900 text-base">
            {t('uploadPhotoTitle')}
          </h3>

          {/* Drag & Drop Box */}
          <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-emerald-50/40 transition-colors block">
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl mb-3 shadow-xs">
              <Camera className="w-7 h-7" />
            </div>
            <strong className="text-sm font-bold text-slate-900 block mb-1">
              {t('clickUploadPrompt')}
            </strong>
            <span className="text-xs text-slate-500">
              {t('uploadFormatsDesc')}
            </span>
          </label>

          {/* Quick Test Demo Samples */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              {t('tryInstantSamples')}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {sampleImages.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAnalyze(idx, s.url)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-left transition-colors cursor-pointer text-xs"
                >
                  <img src={s.url} alt={s.label} className="w-full h-16 object-cover rounded-lg mb-1" />
                  <span className="font-bold text-slate-800 text-[11px] block truncate">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Results */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs h-full flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base mb-4">
                {t('diagnosticPrescriptionTitle')}
              </h3>

              {isAnalyzing && (
                <div className="text-center py-16 space-y-3">
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mx-auto"></div>
                  <strong className="text-sm font-bold text-slate-800 block">
                    {t('analyzingPrompt')}
                  </strong>
                  <p className="text-xs text-slate-500">{t('comparingDatasets')}</p>
                </div>
              )}

              {!isAnalyzing && !diagnosisResult && (
                <div className="text-center py-16 space-y-2 text-xs text-slate-400">
                  <div className="text-3xl mb-2">🌿</div>
                  <strong className="text-slate-700 block font-bold text-sm">{t('noPhotoScanned')}</strong>
                  <p>{t('noPhotoScannedDesc')}</p>
                </div>
              )}

              {!isAnalyzing && diagnosisResult && (() => {
                const ld = localizeDisease(diagnosisResult);
                return (
                  <div className="space-y-4 text-xs animate-fadeIn">
                    
                    {previewImage && (
                      <div className="aspect-16/9 rounded-2xl overflow-hidden border border-slate-200 max-h-48 mb-3">
                        <img src={previewImage} alt="Diagnosed Leaf" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                          {t('pathogenDetectedBadge')}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSpeak(`${ld.name}. ${ld.symptoms}. ${t('recommendedTreatmentTitle')}: ${ld.recommendedTreatment?.productName}. ${ld.recommendedTreatment?.dosage}`)}
                            className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 transition-colors flex items-center gap-1 font-bold text-[10px] cursor-pointer"
                            title="Audio diagnosis"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-rose-700" />
                            <span>{isSpeaking ? t('playingAudio') : t('listenAudio')}</span>
                          </button>
                          <span className="text-rose-800 font-bold">{ld.crop}</span>
                        </div>
                      </div>
                      <h4 className="text-base font-black text-rose-950 font-serif">
                        {ld.name}
                      </h4>
                      <p className="text-slate-700">{ld.symptoms}</p>
                    </div>

                    {/* Treatment Card */}
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-emerald-950">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>{t('recommendedTreatmentTitle')}</span>
                      </div>
                      <p className="font-extrabold text-sm text-emerald-950">
                        {ld.recommendedTreatment?.productName}
                      </p>
                      <p>{t('dosageInstruction')} <strong>{ld.recommendedTreatment?.dosage}</strong></p>
                      <p className="text-slate-600 pt-1 border-t border-emerald-200/60">
                        💡 {ld.recommendedTreatment?.preventativeTip}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {diagnosisResult && (
              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link
                  to="/catalog?category=Pesticides"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-700/20"
                >
                  <span>{t('orderRemedyBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
