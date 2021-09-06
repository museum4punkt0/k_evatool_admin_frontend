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
        <button type="button" class="primary mt-3">
            {{ $t('action_save') }}
        </button>
    </div>
</template>

<script>
import { onMounted, reactive } from 'vue'

export default {
    name: 'SurveyStep',
    setup() {
        let survey = reactive({ name: '' })

        onMounted(() => {})

        return {
            survey,
        }
    },
}
</script>

<style scoped></style>
