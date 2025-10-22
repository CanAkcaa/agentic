import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import tr from './tr-TR.json'
import en from './en-US.json'
import { CONFIG, EKEYS } from '../../config'



i18n.use(initReactI18next).init({
    resources: { tr, en },
    lng: JSON.parse(localStorage.getItem(EKEYS.languageKey)!) || CONFIG.defaultLang,
    fallbackLng: CONFIG.defaultLang
})
