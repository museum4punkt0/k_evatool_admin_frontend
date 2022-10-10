import { createI18n } from 'vue-i18n'
import messages from './localizations'

export default createI18n({
    locale: 'de',
    messages,
    fallbackLocale: 'de',
    silentTranslationWarn: true,
    silentFallbackWarn: true,
    missingWarn: false,
    fallbackWarn: false,
    legacy: false,
})
