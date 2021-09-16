<template>
    <label for="name" class="capitalize">{{ label }}</label>
    <div class="mt-1">
        <input
            id="name"
            v-model="valueLocal"
            type="text"
            name="name"
            autocomplete="off"
            :placeholder="placeholder"
        />
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
        },
        label: {
            type: String,
            default: 'label',
        },
        value: {
            type: [Number, String],
            default: 'label',
        },
        placeholder: {
            type: String,
            default: 'placeholder',
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
