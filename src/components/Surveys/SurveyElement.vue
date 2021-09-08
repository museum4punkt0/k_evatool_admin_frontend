<template>
    <h2>{{ $tc('elements', 1) }}</h2>
    <label for="name" class="capitalize">{{ $tc('names', 1) }}</label>
    <div class="mt-1">
        <input
            id="name"
            v-model="surveyElement.name"
            type="text"
            name="name"
            autocomplete="off"
            :placeholder="$tc('names', 1)"
        />
    </div>
    <form-select
        v-if="elementTypes?.data"
        v-model="surveyElement.elementType"
        class="mt-3"
        :options="elementTypes.data"
        :label="$tc('types', 1)"
        title-key="name"
        value-key="key"
    />
    <div class="mt-3">
        <element-type-star-rating
            v-if="surveyElement.elementType === 'starRating'"
            v-model="surveyElement.params"
            :validation="v$"
        />
        <element-type-emoji
            v-if="surveyElement.elementType === 'emoji'"
            v-model="surveyElement.params"
        />
        <element-type-video
            v-if="surveyElement.elementType === 'video'"
            v-model="surveyElement.params"
        />
        <element-type-binary-question
            v-if="surveyElement.elementType === 'binary'"
            v-model="surveyElement.params"
        />
        <element-type-multiple-choice
            v-if="surveyElement.elementType === 'multipleChoice'"
            v-model:params="surveyElement.params"
        />
        <element-type-simple-text
            v-if="surveyElement.elementType === 'simpleText'"
            v-model:params="surveyElement.params"
            :validation="v$"
        />
        <element-type-yay-nay
            v-if="surveyElement.elementType === 'yayNay'"
            v-model="surveyElement.params"
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
import FormSelect from '../Forms/FormSelect.vue'
import DataViewer from '../Common/DataViewer.vue'

import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import defaultParams from '../SurveySteps/ElementTypes/defaultParams'

export default {
    name: 'SurveyElement',
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
        const surveyElement = ref({ name: '', elementType: '' })
        const elementTypes = ref(null)

        onMounted(async () => {
            elementTypes.value = store.state.elementTypes
        })

        watch(
            () => surveyElement.value.elementType,
            (value) => {
                surveyElement.value.params = defaultParams[value]
            },
        )

        return {
            surveyElement,
            elementTypes,
        }
    },
}
</script>

<style scoped></style>
