import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

export default createI18n({
  locale: "en", //essign codes to each language
  fallbackLocale: "en",
  messages: {
    en,
    fr,
  }, // contain the list of translation for our app
  numberFormats: {
    en: {
      currency: {
        // The currency to use in currency formatting.
        style: "currency",
        currency: "USD",
      },
    },
    ja: {
      currency: {
        // The currency to use in currency formatting.
        style: "currency",
        currency: "JPY",
      },
    },
  }, //translate numbers in messages
});
