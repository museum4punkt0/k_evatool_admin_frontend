<template>
    <h1>{{ $tc('steps', 1) }}</h1>

    <div
        v-for="(error, index) of v$.survey.name.$errors"
        :key="index"
        class="input-errors"
    >
        <div class="error-msg">{{ error.$message }}</div>
    </div>
    <div>
        <label for="email" class="capitalize">{{ $tc('names', 1) }}</label>
        <div class="mt-1">
            <input
                id="name"
                v-model="survey.name"
                type="text"
                name="name"
                autocomplete="off"
                :placeholder="$tc('names', 1)"
            />
        </div>
        <form-select
            v-if="elementTypes?.data"
            v-model="survey.elementType"
            class="mt-3"
            :options="elementTypes.data"
            :label="$tc('types', 1)"
            title-key="name"
            value-key="key"
        />

        <div class="mt-3">
            <element-type-star-rating
                v-if="survey.elementType === 'starRating'"
                v-model="survey.params"
            />
            <element-type-emoji
                v-if="survey.elementType === 'emoji'"
                v-model="survey.params"
            />
            <element-type-video
                v-if="survey.elementType === 'video'"
                v-model="survey.params"
            />
            <element-type-binary-question
                v-if="survey.elementType === 'binary'"
                v-model="survey.params"
            />
            <element-type-multiple-choice
                v-if="survey.elementType === 'multipleChoice'"
                v-model:params="survey.params"
            />
            <element-type-simple-text
                v-if="survey.elementType === 'simpleText'"
                v-model:params="survey.params"
            />
            <element-type-yay-nay
                v-if="survey.elementType === 'yayNay'"
                v-model="survey.params"
            />
        </div>

        <button
            type="button"
            class="primary mt-3"
            :disabled="v$.$invalid"
            @click="saveSurveyStep"
        >
            {{ $t('action_save') }}
        </button>
        <data-viewer class="mt-3" :data="survey" />
    </div>
</template>

<script>
import { onMounted, reactive, ref, watch } from 'vue'
import FormSelect from '../Forms/FormSelect.vue'

import { useStore } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

// element types
import ElementTypeStarRating from '../SurveySteps/ElementTypes/ElementTypeStarRating.vue'
import ElementTypeEmoji from '../SurveySteps/ElementTypes/ElementTypeEmoji.vue'
import ElementTypeVideo from '../SurveySteps/ElementTypes/ElementTypeVideo.vue'
import ElementTypeBinaryQuestion from '../SurveySteps/ElementTypes/ElementTypeBinaryQuestion.vue'
import ElementTypeMultipleChoice from '../SurveySteps/ElementTypes/ElementTypeMultipleChoice.vue'
import ElementTypeSimpleText from '../SurveySteps/ElementTypes/ElementTypeSimpleText.vue'
import ElementTypeYayNay from '../SurveySteps/ElementTypes/ElementTypeYayNay.vue'

// default params
import defaultParams from '../SurveySteps/ElementTypes/defaultParams'
import DataViewer from '../Common/DataViewer.vue'

export default {
    name: 'SurveyStep',
    components: {
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
    setup() {
        const store = useStore()
        let survey = reactive({ name: '', params: null })
        const elementTypes = ref(null)

        onMounted(async () => {
            elementTypes.value = store.state.elementTypes
        })

        watch(
            () => survey.elementType,
            (value) => {
                survey.params = defaultParams[value]
            },
        )

        const saveSurveyStep = () => {
            console.log('save')
        }

        return {
            v$: useVuelidate(),
            survey,
            elementTypes,
            store,
            saveSurveyStep,
        }
    },
    data() {
        return {
            name: '',
        }
    },
    validations: {
        survey: {
            name: {
                required,
                minLength: minLength(1),
            },
        },
    },
}
</script>

<style scoped></style>
