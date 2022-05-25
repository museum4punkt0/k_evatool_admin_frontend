<template>
    <div>
        <div class="flex">
            <label :for="name" class="flex-grow">{{ label }}</label>
            <language-switch-small v-if="languageSwitch" />
        </div>
        <div class="mt-1">
            <input
                :id="name"
                v-model="valueLocal"
                :readonly="readonly"
                :class="invalid ? 'invalid' : ''"
                :type="type"
                :name="name"
                :disabled="disabled"
                autocomplete="off"
                :placeholder="placeholder"
            />
        </div>
        <p v-if="helptext" class="text-gray-500 text-xs mt-1 ml-1">
            {{ helptext }}
        </p>
    </div>
</template>

<script>
import { computed } from 'vue'
import LanguageSwitchSmall from '../../components/Languages/LanguageSwitchSmall.vue'

export default {
    name: 'FormInput',
    components: { LanguageSwitchSmall },
    props: {
        name: {
            type: String,
            default: 'name',
            required: true,
        },
        label: {
            type: String,
            default: 'label',
        },
        value: {
            type: [Number, String],
            default: '',
        },
        helptext: {
            type: String,
            default: '',
        },
        subhelptext: {
            type: String,
            default: '',
        },
        invalid: {
            type: Boolean,
            default: false,
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'text',
        },
        languageSwitch: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:value'],
    setup(props, { emit }) {
        const valueLocal = computed({
            get: () => props.value,
            set: (val) => emit('update:value', val),
        })

        return {
            valueLocal,
        }
    },
}
</script>

<style scoped></style>
