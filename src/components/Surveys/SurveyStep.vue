<template>
    <h1>{{ $tc('steps', 1) }}</h1>
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
        <button type="button" class="primary mt-3">
            {{ $t('action_save') }}
        </button>
        <div class="bg-yellow-100 py-3 px-3 rounded mt-3">
            {{ survey }}
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import FormSelect from '../Forms/FormSelect.vue'

import SURVEY_ELEMENT_TYPES from '../../services/surveyElementTypes'

export default {
    name: 'SurveyStep',
    components: { FormSelect },
    setup() {
        let survey = reactive({ name: '' })
        const elementTypes = ref(null)

        onMounted(async () => {
            elementTypes.value = await SURVEY_ELEMENT_TYPES.getAll()
        })

        return {
            survey,
            elementTypes,
        }
    },
}
</script>

<style scoped></style>
