<template>
    <data-viewer class="mt-3" :data="validator" />
    <h3 v-if="surveyElementId > 0">{{ t('elements', 1) }}</h3>
    <h3 v-else>{{ t('new_element') }}</h3>
    <form-input
        v-model:value="surveyElement.name"
        class="mt-1"
        :invalid="validator.name.$invalid"
        type="text"
        :placeholder="t('names', 1)"
        :label="t('names', 1)"
        name="name"
        autocomplete="off"
    />
    <!-- TODO: get default language -->
    <!-- :title-getter="(elementType) => elementType.descriptions.title.de" -->
    <!-- :title-getter="
            (elementType) =>
                store.getters['elementTypes/getDisplayNameForKey'](
                    elementType?.key,
                )
        " -->
    <form-select
        v-if="elementTypes"
        v-model:selected="surveyElement.surveyElementType"
        :invalid="validator.surveyElementType.$invalid"
        class="mt-3"
        :options="elementTypes"
        :label="t('types', 1)"
        :title-getter="elementTypeTitleGetter"
        value-key="key"
        readonly
    />

    <div class="mt-3">
        <element-type-star-rating
            v-if="surveyElement.surveyElementType === 'starRating'"
            v-model:params="surveyElement.params"
            @is-valid="setParamsValid($event)"
        />
        <element-type-emoji
            v-if="surveyElement.surveyElementType === 'emoji'"
            v-model:params="surveyElement.params"
            @is-valid="setParamsValid($event)"
        />
        <element-type-video
            v-if="surveyElement.surveyElementType === 'video'"
            v-model:params="surveyElement.params"
            @is-valid="setParamsValid($event)"
        />
        <element-type-binary-question
            v-if="surveyElement.surveyElementType === 'binary'"
            v-model:params="surveyElement.params"
            @is-valid="setParamsValid($event)"
        />
        <element-type-multiple-choice
            v-if="surveyElement.surveyElementType === 'multipleChoice'"
            v-model:params="surveyElement.params"
            @is-valid="setParamsValid($event)"
        />
        <element-type-simple-text
            v-if="surveyElement.surveyElementType === 'simpleText'"
            v-model:params="surveyElement.params"
            @is-valid="setParamsValid($event)"
        />
        <element-type-yay-nay
            v-if="surveyElement.surveyElementType === 'yayNay'"
            v-model:params="surveyElement.params"
            @is-valid="setParamsValid($event)"
        />
        <element-type-text-input
            v-if="surveyElement.surveyElementType === 'textInput'"
            v-model:params="surveyElement.params"
            @is-valid="setParamsValid($event)"
        />
        <element-type-voice-input
            v-if="surveyElement.surveyElementType === 'voiceInput'"
            v-model:params="surveyElement.params"
            @is-valid="setParamsValid($event)"
        />
    </div>

    <div class="flex flex-row mt-8">
        <action-button
            color="secondary"
            class="mr-2 p-2"
            :action-text="t('action_cancel')"
            @execute="cancelEdit"
        />
        <action-button
            class="flex-grow p-2"
            :disabled="validator.$invalid || !paramsValid"
            :executing="savingSurveyElement"
            :action-text="t('action_save')"
            @execute="saveSurveyElement"
        />
    </div>

    <data-viewer class="mt-3" :data="surveyElement" />
</template>

<script>
// element types
import ElementTypeStarRating from '../SurveySteps/ElementTypes/ElementTypeStarRating.vue'
import ElementTypeEmoji from '../SurveySteps/ElementTypes/ElementTypeEmoji.vue'
import ElementTypeVideo from '../SurveySteps/ElementTypes/ElementTypeVideo.vue'
import ElementTypeBinaryQuestion from '../SurveySteps/ElementTypes/ElementTypeBinaryQuestion.vue'
import ElementTypeMultipleChoice from '../SurveySteps/ElementTypes/ElementTypeMultipleChoice.vue'
import ElementTypeSimpleText from '../SurveySteps/ElementTypes/ElementTypeSimpleText.vue'
import ElementTypeYayNay from '../SurveySteps/ElementTypes/ElementTypeYayNay.vue'
import ElementTypeTextInput from '../SurveySteps/ElementTypes/ElementTypeTextInput.vue'
import ElementTypeVoiceInput from '../SurveySteps/ElementTypes/ElementTypeVoiceInput.vue'
import FormSelect from '../Forms/FormSelect.vue'
import DataViewer from '../Common/DataViewer.vue'
import ActionButton from '../Common/ActionButton.vue'

import { onMounted, ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import defaultParamsCreator from '../SurveySteps/ElementTypes/defaultParams'

import SURVEY_ELEMENT_SERVICE from '../../services/surveyElementService'
import useVuelidate from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'
import FormInput from '../Forms/FormInput.vue'

export default {
    name: 'SurveyElement',
    components: {
        FormInput,
        ActionButton,
        DataViewer,
        ElementTypeYayNay,
        ElementTypeSimpleText,
        ElementTypeMultipleChoice,
        ElementTypeBinaryQuestion,
        ElementTypeVideo,
        ElementTypeEmoji,
        ElementTypeStarRating,
        ElementTypeVoiceInput,
        ElementTypeTextInput,
        FormSelect,
    },
    props: {
        surveyElementId: {
            type: Number,
            default: -1,
        },
        clearAfterSave: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['saved', 'cancel'],
    setup(props, { emit }) {
        const store = useStore()
        const { t } = useI18n()
        const surveyElement = ref({})
        const elementTypes = ref(null)
        const savingSurveyElement = ref(false)
        const paramsValid = ref(true)
        const languages = computed(() => store.state.languages.languages)
        let revertChanges = false

        onMounted(async () => {
            elementTypes.value = store.state.elementTypes.elementTypes
        })

        const getSurveyElement = async (surveyElementId) => {
            if (surveyElementId > 0) {
                surveyElement.value =
                    await SURVEY_ELEMENT_SERVICE.getSurveyElement(
                        surveyElementId,
                    )
            }
            revertChanges = true
        }

        const saveSurveyElement = async () => {
            savingSurveyElement.value = true
            const savedSurveyElement =
                await SURVEY_ELEMENT_SERVICE.saveSurveyElement(
                    surveyElement.value,
                )

            // reload all survey elements
            await store.dispatch('surveyElements/getSurveyElements')
            emit('saved', savedSurveyElement.id)
            if (props.clearAfterSave) {
                surveyElement.value = {}
                revertChanges = true
            }
            savingSurveyElement.value = false
        }

        onMounted(() => {
            if (props.surveyElementId > 0) {
                getSurveyElement(props.surveyElementId)
            }
        })

        watch(
            () => props.surveyElementId,
            (value) => {
                getSurveyElement(value)
            },
        )

        watch(
            () => surveyElement.value?.surveyElementType,
            (surveyElementType, oldSurveyElementType) => {
                if (revertChanges) {
                    revertChanges = false
                    return
                }
                const defaultParams = defaultParamsCreator(
                    surveyElementType,
                    languages.value,
                )
                if (!surveyElement.value.params) {
                    surveyElement.value.params = defaultParams
                }
                /** SURVEY ELEMENT TYPE HAS CHANGED **/
                if (
                    oldSurveyElementType &&
                    surveyElementType !== oldSurveyElementType
                ) {
                    const oldDefaultParams = defaultParamsCreator(
                        oldSurveyElementType,
                        languages.value,
                    )
                    if (
                        JSON.stringify(oldDefaultParams) ===
                        JSON.stringify(surveyElement.value.params)
                    ) {
                        surveyElement.value.params = defaultParams
                    } else {
                        const typeChangeConfirmation = confirm(
                            t('confirm_reset_survey_element'),
                        )
                        if (typeChangeConfirmation) {
                            surveyElement.value.params = defaultParams
                        } else {
                            revertChanges = true
                            surveyElement.value.surveyElementType =
                                oldSurveyElementType
                        }
                    }
                }
            },
        )

        const validations = computed({
            get: () => {
                return {
                    name: {
                        required,
                        minLength: minLength(1),
                    },
                    surveyElementType: {
                        required,
                        minLength: minLength(1),
                    },
                }
            },
        })

        const cancelEdit = () => {
            emit('cancel')
        }

        const setParamsValid = (isValid) => {
            paramsValid.value = isValid
        }

        const validator = useVuelidate(validations, surveyElement, {
            $scope: 'surveyElement',
        })

        const elementTypeTitleGetter = (elementType) => {
            return store.getters['elementTypes/getDisplayNameForKey'](
                elementType.key,
            )
        }

        return {
            validator,
            surveyElement,
            elementTypes,
            saveSurveyElement,
            savingSurveyElement,
            t,
            paramsValid,
            cancelEdit,
            setParamsValid,
            elementTypeTitleGetter,
        }
    },
}
</script>

<style scoped></style>
