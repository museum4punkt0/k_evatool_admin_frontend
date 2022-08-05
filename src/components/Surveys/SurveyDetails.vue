<template>
    <h1>{{ surveyTitle }}</h1>

    <form-input
        v-model:value="survey.name"
        class="mt-3"
        name="name"
        type="text"
        :invalid="v$.survey.name.$invalid"
        :label="t('names', 1)"
    />

    <div v-if="survey.id" class="mt-3">
        <label>Url</label>
        <div class="flex">
            <span class="flex-grow">
                {{
                    `${previewUrl}/#/?survey=${
                        survey?.slug ? survey?.slug : ''
                    }`
                }}
            </span>
            <PencilIcon
                class="h-5 w-5 cursor-pointer"
                @click="setShowSlug(!showSlug)"
            />
        </div>
    </div>
    <form-input
        v-if="showSlug"
        v-model:value="survey.slug"
        v-tippy="{
            content: t('tooltip_survey_details_slug'),
        }"
        :invalid="v$.survey.slug.$invalid"
        name="slug"
        class="mt-3"
        type="text"
        :label="t('slugs', 1)"
    />

    <form-checkbox
        v-model:value="survey.languages"
        v-tippy="{
            content: t('tooltip_survey_details_languages'),
        }"
        :options="store.state.languages.languages"
        :invalid="v$.survey.languages.$invalid"
        name="language"
        class="mt-3"
        :label="t('languages', store.state.languages.languages.length)"
    />

    <form-select
        v-model:selected="survey.settingId"
        :options="surveySettings"
        title-key="name"
        value-key="id"
        name="settingId"
        class="mt-3"
        :default-value="-1"
        :label="t('survey_settings')"
        :invalid="v$.survey.settingId.$invalid"
    />

    <form-input
        v-model:value="survey.description"
        class="mt-3"
        name="description"
        type="text"
        :label="t('descriptions', 1)"
    />
    <!-- <label for="description">{{ t('descriptions', 1) }}</label> -->
    <!-- <tiny-mce v-model:text="survey.description" name="description" /> -->

    <form-toggle
        v-model:enabled="survey.singleStepAccess"
        class="mt-3"
        :label="t('single_step_access')"
    />

    <div class="flex flex-row mt-8">
        <action-button
            :action-text="t('action_cancel')"
            class="mr-2"
            color="secondary"
            :executing="false"
            @click="cancel"
        />
        <action-button
            class="flex-grow"
            :disabled="v$.$invalid || surveySaving"
            :action-text="
                store.state.surveys.survey ? t('action_save') : t('action_add')
            "
            @click="saveSurvey"
        />
    </div>

    <data-viewer class="mt-3" :data="survey" />
</template>

<script>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import SURVEYS from '../../services/surveyService'
import useVuelidate from '@vuelidate/core'
import {
    helpers,
    maxLength,
    minLength,
    minValue,
    required,
} from '@vuelidate/validators'
const slugValidator = helpers.regex(/(^[a-z][a-z0-9]+(?:[-_][a-z0-9]+)*$)+/)

import ActionButton from '../Common/ActionButton.vue'
import DataViewer from '../Common/DataViewer.vue'
import FormInput from '../Forms/FormInput.vue'
import FormCheckbox from '../Forms/FormCheckbox.vue'
import TinyMce from '../Common/TinyMce.vue'
import { useState } from '@/composables/state'
import { PencilIcon } from '@heroicons/vue/outline'
import FormToggle from '../Forms/FormToggle.vue'
import FormSelect from '../Forms/FormSelect.vue'

export default {
    name: 'SurveyDetails',
    components: {
        FormToggle,
        FormCheckbox,
        FormInput,
        FormSelect,
        ActionButton,
        DataViewer,
        TinyMce,
        PencilIcon,
    },
    props: {
        surveyId: { type: Number, default: -1 },
        resetAfterSave: { type: Boolean, default: true },
    },
    emits: ['saved', 'cancel'],
    setup: function (props, { emit }) {
        const { t } = useI18n()
        const store = useStore()
        const survey = ref({
            name: '',
        })
        const surveyTitle = ref(t('new_survey'))
        const surveySaving = ref(false)
        const previewUrl = `${import.meta.env.VITE_PREVIEW_URL}`
        const [showSlug, setShowSlug] = useState(false)

        const surveySettings = computed(
            () => store.state.surveySettings.settings,
        )

        watch(
            () => props.surveyId,
            (surveyId) => {
                setSurvey(surveyId)
            },
        )

        const setSurvey = async (surveyId) => {
            if (surveyId > 0) {
                survey.value = await SURVEYS.getSurvey(surveyId)
                surveyTitle.value = t('edit_survey')
            } else {
                initSurvey()
            }
        }

        const saveSurvey = async () => {
            surveySaving.value = true
            await store.dispatch('surveys/saveSurvey', survey.value)
            emit('saved')
            if (props.resetAfterSave) {
                initSurvey()
            }
            surveySaving.value = false
        }

        const initSurvey = () => {
            survey.value = {
                name: '',
                language: [],
            }
            surveyTitle.value = t('new_survey')
        }

        const cancel = () => {
            store.dispatch('surveyElements/setSurveyElement', null)
            emit('cancel')
        }

        setSurvey(props.surveyId)

        return {
            survey,
            v$: useVuelidate(),
            saveSurvey,
            surveyTitle,
            t,
            store,
            surveySaving,
            cancel,
            previewUrl,
            showSlug,
            setShowSlug,
            surveySettings,
        }
    },
    validations: {
        survey: {
            name: {
                required,
                minLength: minLength(3),
                maxLength: maxLength(100),
            },
            slug: {
                minLength: minLength(3),
                maxLength: maxLength(100),
                slugValidator,
            },
            languages: {
                required,
                minLength: minLength(1),
            },
            settingId: {
                required,
                minValue: minValue(1),
            },
        },
    },
}
</script>

<style scoped></style>
