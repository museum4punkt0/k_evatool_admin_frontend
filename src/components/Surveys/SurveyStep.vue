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
                v-model="survey"
            />
            <element-type-emoji
                v-if="survey.elementType === 'emoji'"
                v-model="survey"
            />
            <element-type-video
                v-if="survey.elementType === 'video'"
                v-model="survey"
            />
            <element-type-binary-question
                v-if="survey.elementType === 'binary'"
                v-model="survey"
            />
            <element-type-multiple-choice
                v-if="survey.elementType === 'multipleChoice'"
                v-model="survey"
            />
            <element-type-simple-text
                v-if="survey.elementType === 'simpleText'"
                v-model="survey"
            />
            <element-type-yay-nay
                v-if="survey.elementType === 'yayNay'"
                v-model="survey"
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
        <div class="bg-yellow-100 py-3 px-3 rounded mt-3 text-xs">
            <pre>{{ survey }}</pre>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
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

export default {
    name: 'SurveyStep',
    components: {
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
        let survey = reactive({ name: '' })
        const elementTypes = ref(null)

        onMounted(async () => {
            await store.dispatch(
                'elementTypes/getAllElementTypesAndUpdateStore',
            )
            elementTypes.value = store.state.elementTypes
        })

        return {
            v$: useVuelidate(),
            survey,
            elementTypes,
        }
    },
    data() {
        return {
            name: '',
        }
    },
    methods: {
        saveSurveyStep() {
            console.log('save')
        },
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
