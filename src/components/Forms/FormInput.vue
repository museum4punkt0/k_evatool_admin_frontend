<template>
    <div>
        <label :for="name">{{ label }}</label>
        <div class="mt-1">
            <input
                :id="name"
                v-model="valueLocal"
                :class="invalid ? 'invalid' : ''"
                :type="type"
                :name="name"
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

export default {
    name: 'FormInput',
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
        invalid: {
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
