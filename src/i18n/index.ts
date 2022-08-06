import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zh_cn from "./lang/zh-cn.json";
import en from "./lang/en.json";
import ja from "./lang/ja.json";

export enum LanguageType {
  ZH_CN = "zh_cn",
  EN = "en",
  JA = "ja",
}

export const resources = {
  [LanguageType.EN]: {
    translation: en,
  },
  [LanguageType.ZH_CN]: {
    translation: zh_cn,
  },
  [LanguageType.JA]: { translation: ja },
};

i18n.use(initReactI18next).init({
  resources: resources,
  lng: LanguageType.ZH_CN,
  fallbackLng: LanguageType.ZH_CN,
  interpolation: {
    escapeValue: false,
  },
});
