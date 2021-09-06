<template>
    <h1>{{ $tc('steps', 1) }}</h1>
    <div>
        <label for="email" class="capitalize">{{ $t('name') }}</label>
        <div class="mt-1">
            <input
                id="name"
                v-model="survey.name"
                type="text"
                name="name"
                autocomplete="off"
                :placeholder="$t('name')"
            />
        </div>
        <form-select :options="options" />
        <button type="button" class="primary mt-3">
            {{ $t('action_save') }}
        </button>
    </div>
</template>

<script>
import { onMounted, reactive } from 'vue'
import FormSelect from '../Forms/FormSelect.vue'

export default {
    name: 'SurveyStep',
    components: { FormSelect },
    setup() {
        let survey = reactive({ name: '' })

        const options = [
            { title: 'Option 1', id: 1 },
            { title: 'Option 2', id: 2 },
            { title: 'Option 3', id: 3 },
        ]

        onMounted(() => {})

        return {
            survey,
            options,
        }
    },
}
</script>

<style scoped></style>
