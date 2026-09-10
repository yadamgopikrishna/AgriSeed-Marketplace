import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';
import { INITIAL_PRODUCTS } from '../data/mockData';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('agriseed_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('agriseed_lang', currentLang);
  }, [currentLang]);

  const t = (key) => {
    if (translations[currentLang] && translations[currentLang][key]) {
      return translations[currentLang][key];
    }
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return key;
  };

  const getLocalizedCategory = (cat) => {
    if (!cat) return cat;
    if (cat === 'Seeds' || cat === 'Seeds & Hybrids') return t('seedsTitle') || cat;
    if (cat === 'Fertilizers' || cat === 'Fertilizers & Nutrients') return t('fertilizersTitle') || cat;
    if (cat === 'Pesticides' || cat === 'Pesticides & Protection') return t('pesticidesTitle') || cat;
    if (cat === 'Farming Equipment' || cat === 'Equipment & Sprayers') return t('equipmentTitle') || cat;
    return cat;
  };

  const localizeProduct = (product) => {
    if (!product) return product;
    const id = product.id;
    if (!id) return product;

    const nameKey = `${id}_name`;
    const shortKey = `${id}_short`;
    const descKey = `${id}_desc`;
    const cropKey = `${id}_crop`;
    const seasonKey = `${id}_season`;
    const dosageKey = `${id}_dosage`;
    const unitKey = `${id}_unit`;

    const name = t(nameKey) !== nameKey ? t(nameKey) : product.name;
    const shortName = t(shortKey) !== shortKey ? t(shortKey) : (product.shortName || name);
    const description = t(descKey) !== descKey ? t(descKey) : product.description;
    const cropSuitability = t(cropKey) !== cropKey ? t(cropKey) : product.cropSuitability;
    const season = t(seasonKey) !== seasonKey ? t(seasonKey) : product.season;
    const dosageGuide = t(dosageKey) !== dosageKey ? t(dosageKey) : product.dosageGuide;
    const unit = t(unitKey) !== unitKey ? t(unitKey) : product.unit;

    const packSizes = product.packSizes?.map((p, idx) => {
      const packKey = `${id}_pack_${idx}`;
      return {
        ...p,
        size: t(packKey) !== packKey ? t(packKey) : p.size
      };
    }) || product.packSizes;

    const category = getLocalizedCategory(product.category);

    return {
      ...product,
      name,
      shortName,
      description,
      cropSuitability,
      season,
      dosageGuide,
      unit,
      packSizes,
      category
    };
  };

  const getLocalizedProductName = (itemOrId) => {
    if (!itemOrId) return '';
    if (typeof itemOrId === 'string') {
      const key = `${itemOrId}_name`;
      if (t(key) !== key) return t(key);
      const matched = INITIAL_PRODUCTS.find(p => p.id === itemOrId || p.name === itemOrId);
      if (matched) {
        const mKey = `${matched.id}_name`;
        if (t(mKey) !== mKey) return t(mKey);
        return matched.name;
      }
      return itemOrId;
    }
    const id = itemOrId.productId || itemOrId.id;
    if (id) {
      const key = `${id}_name`;
      if (t(key) !== key) return t(key);
    }
    const rawName = itemOrId.productName || itemOrId.name;
    if (rawName) {
      const matched = INITIAL_PRODUCTS.find(p => p.id === id || p.name === rawName);
      if (matched) {
        const mKey = `${matched.id}_name`;
        if (t(mKey) !== mKey) return t(mKey);
      }
      return rawName;
    }
    return '';
  };

  const localizeDisease = (disease) => {
    if (!disease) return disease;
    const id = disease.id;
    if (!id) return disease;

    const nameKey = `${id}_name`;
    const cropKey = `${id}_crop`;
    const sympKey = `${id}_symptoms`;
    const tProdKey = `${id}_treatment_prod`;
    const tDosKey = `${id}_treatment_dosage`;
    const tTipKey = `${id}_treatment_tip`;

    const name = t(nameKey) !== nameKey ? t(nameKey) : disease.name;
    const crop = t(cropKey) !== cropKey ? t(cropKey) : disease.crop;
    const symptoms = t(sympKey) !== sympKey ? t(sympKey) : disease.symptoms;

    const recommendedTreatment = {
      productName: t(tProdKey) !== tProdKey ? t(tProdKey) : disease.recommendedTreatment?.productName,
      dosage: t(tDosKey) !== tDosKey ? t(tDosKey) : disease.recommendedTreatment?.dosage,
      preventativeTip: t(tTipKey) !== tTipKey ? t(tTipKey) : disease.recommendedTreatment?.preventativeTip
    };

    return {
      ...disease,
      name,
      crop,
      symptoms,
      recommendedTreatment
    };
  };

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' }
  ];

  return (
    <LanguageContext.Provider value={{
      currentLang,
      setLang: setCurrentLang,
      t,
      languages,
      localizeProduct,
      getLocalizedProductName,
      localizeDisease,
      getLocalizedCategory
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

