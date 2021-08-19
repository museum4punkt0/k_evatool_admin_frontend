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
        <Languages></Languages>
    </div>
</template>

<script>
import surveyLanguagesService from './services/surveyLanguages'
import surveysService from './services/surveys'

import Languages from './components/Languages.vue'
surveyLanguagesService.getAll(
    (data) => {
        console.log('got all languages', data)
    },
    (error) => {
        console.error('could not get all languages', error)
    },
)

surveyLanguagesService.getOne(
    2,
    (data) => {
        console.log('got one language', data)
    },
    (error) => {
        console.error('could not get one language', error)
    },
)

export default {
    components: {
        Languages,
    },
    data() {
        return {
            title: this.$store.state.title,
        }
    },
    async mounted() {
        const languages = await surveyLanguagesService.getAll()
        console.log('languages', languages)

        const language = await surveyLanguagesService.getOne(2)
        console.log('language', language)

        const createdLanguage = await surveyLanguagesService.createOne({
            code: 'de',
            sub_code: 'de_DE',
            title: 'Deutsch',
            default: true,
            published: true,
        })
        console.log('createdLanguage', createdLanguage)
        const updatedLanguage = await surveyLanguagesService.updateOne(
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
        const deletedLanguage = await surveyLanguagesService.deleteOne(
            createdLanguage.id,
        )
        console.log('deletedLanguage', deletedLanguage)

        const surveys = await surveysService.getAll()
        console.log(surveys)
        const surveySteps = await surveysService.getAllSurveySteps(
            surveys[0].id,
        )
        console.log(surveySteps)
    },
}
</script>

<style></style>
