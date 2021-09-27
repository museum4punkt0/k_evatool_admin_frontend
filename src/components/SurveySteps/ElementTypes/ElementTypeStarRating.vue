<template>
    <form-input
        v-model:value="paramsLocal.numberOfStars"
        :label="t('number_of_stars')"
    />

    <form-toggle
        v-model:enabled="paramsLocal.allowHalfSteps"
        :label="t('allow_half_steps')"
        class="my-3"
    />

    <form-input
        v-for="language in store.state.languages.data"
        :key="'lang' + language.id"
        v-model:value="paramsLocal.question[language.code]"
        :label="'question (' + language.code + ')'"
    />
</template>

<script>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import FormInput from '../../Forms/FormInput.vue'
import FormToggle from '../../Forms/FormToggle.vue'
import { useStore } from 'vuex'

export default {
    name: 'ElementTypeStarRating',
    components: { FormToggle, FormInput },
    props: {
        params: {
            type: Object,
            default: () => null,
        },
    },
    emits: ['update:params'],
    setup(props, { emit }) {
        const { t } = useI18n()
        const store = useStore()

        const paramsLocal = computed({
            get: () => props.params,
            set: (val) => emit('update:params', val),
        })

        return {
            paramsLocal,
            t,
            store,
        }
    },
}
</script>

<style scoped></style>
