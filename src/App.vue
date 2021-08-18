<template>
    <div>
        <ul>
            <li>
                <router-link to="/">Home</router-link>
            </li>
            <li>
                <router-link to="/about">About</router-link>
            </li>
        </ul>

        <form>
            <label>{{ $t('message.language') }}</label>
            <select v-model="$i18n.locale">
                <option value="en">en</option>
                <option value="de">de</option>
            </select>
        </form>
        <p>{{ $t('message.hello') }}</p>

        Store Title: {{ title }}
        <router-view></router-view>
    </div>
</template>

<script>
import surveyLanguageService from './services/surveyLanguages'
surveyLanguageService.getAll(
    (data) => {
        console.log('got all languages', data)
    },
    (error) => {
        console.error('could not get all languages', error)
    },
)

surveyLanguageService.getOne(
    2,
    (data) => {
        console.log('got one language', data)
    },
    (error) => {
        console.error('could not get one language', error)
    },
)

export default {
    data() {
        return {
            title: this.$store.state.title,
        }
    },
    async mounted() {
        const languages = await surveyLanguageService.getAll()
        console.log('languages', languages)

        const language = await surveyLanguageService.getOne(2)
        console.log('language', language)

        const createdLanguage = await surveyLanguageService.createOne({
            code: 'de',
            sub_code: 'de_DE',
            title: 'Deutsch',
            default: true,
            published: true,
        })
        console.log('createdLanguage', createdLanguage)
        const updatedLanguage = await surveyLanguageService.updateOne(
            createdLanguage.id,
            {
                code: 'de',
                sub_code: 'de_DE',
                title: 'Deutsch',
                default: true,
                published: false,
            },
        )
        console.log('updatedLanguage', updatedLanguage)
        const deletedLanguage = await surveyLanguageService.deleteOne(
            createdLanguage.id,
        )
        console.log('deletedLanguage', deletedLanguage)
    },
}
</script>

<style></style>
