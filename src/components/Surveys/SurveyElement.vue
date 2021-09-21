<template>
    <h3 v-if="surveyElementId > 0">{{ $tc('elements', 1) }}</h3>
    <h3 v-else>Neues Element</h3>
    <label for="name" class="capitalize">{{ $tc('names', 1) }}</label>
    <div class="mt-1">
        <input
            id="name"
            v-model="surveyElement.name"
            type="text"
            name="name"
            autocomplete="off"
            :placeholder="t('names', 1)"
        />
    </div>

    <form-select
        v-if="elementTypes?.data"
        v-model:selected="surveyElement.surveyElementType"
        class="mt-3"
        :options="elementTypes.data"
        :label="t('types', 1)"
        title-key="name"
        value-key="key"
    />

    <div class="mt-3">
        <element-type-star-rating
            v-if="surveyElement.surveyElementType === 'starRating'"
            v-model:params="surveyElement.params"
        />
        <element-type-emoji
            v-if="surveyElement.surveyElementType === 'emoji'"
            v-model:params="surveyElement.params"
        />
        <element-type-video
            v-if="surveyElement.surveyElementType === 'video'"
            v-model:params="surveyElement.params"
        />
        <element-type-binary-question
            v-if="surveyElement.surveyElementType === 'binary'"
            v-model:params="surveyElement.params"
        />
        <element-type-multiple-choice
            v-if="surveyElement.surveyElementType === 'multipleChoice'"
            v-model:params="surveyElement.params"
        />
        <element-type-simple-text
            v-if="surveyElement.surveyElementType === 'simpleText'"
            v-model:params="surveyElement.params"
        />
        <element-type-yay-nay
            v-if="surveyElement.surveyElementType === 'yayNay'"
            v-model:params="surveyElement.params"
        />
    </div>
    <action-button
        :disabled="v$.$invalid"
        :executing="savingSurveyElement"
        :action-text="t('action_save')"
        @execute="saveSurveyElement"
    />

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
import FormSelect from '../Forms/FormSelect.vue'
import DataViewer from '../Common/DataViewer.vue'
import ActionButton from '../Common/ActionButton.vue'

import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import defaultParams from '../SurveySteps/ElementTypes/defaultParams'

import SURVEY_ELEMENT_SERVICE from '../../services/surveyElementService'
import useVuelidate from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'

export default {
    name: 'SurveyElement',
    components: {
        ActionButton,
        DataViewer,
        ElementTypeYayNay,
        ElementTypeSimpleText,
        ElementTypeMultipleChoice,
        ElementTypeBinaryQuestion,
        ElementTypeVideo,
        ElementTypeEmoji,
        ElementTypeStarRating,
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
    emits: ['saved'],
    setup(props, { emit }) {
        const store = useStore()
        const { t } = useI18n()
        const surveyElement = ref({})
        const elementTypes = ref(null)
        const savingSurveyElement = ref(false)
        const paramsValid = ref(false)

        onMounted(async () => {
            elementTypes.value = store.state.elementTypes
        })

        const getSurveyElement = async (surveyElementId) => {
            surveyElement.value = await SURVEY_ELEMENT_SERVICE.getSurveyElement(
                surveyElementId,
            )
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
            }
            savingSurveyElement.value = false
        }

        onMounted(() => {
            if (props.surveyElementId > 0) {
                getSurveyElement(props.surveyElementId)
            }
        })

        watch(
            () => surveyElement.value?.surveyElementType,
            (value) => {
                // Resets to default value when survey element type is changed
                // Todo: Ask for user confirmation and reset if denied.
                if (!surveyElement.value.params) {
                    surveyElement.value.params = defaultParams[value]
                }
            },
        )

        const validations = {
            surveyElement: {
                name: {
                    required,
                    minLength: minLength(1),
                },
            },
        }

        /* watch(
            () => props.surveyElementId,
            (value) => {
                console.log(value)
                if (value > 0) {
                    getSurveyElement(value)
                }
            },
        )*/

        return {
            v$: useVuelidate(),
            surveyElement,
            elementTypes,
            saveSurveyElement,
            savingSurveyElement,
            t,
            validations,
            paramsValid,
        }
    },
    validations: {
        surveyElement: {
            name: {
                required,
                minLength: minLength(1),
            },
        },
    },
}
</script>

<style scoped></style>
