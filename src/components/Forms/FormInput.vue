<template>
    <div>
        <label :for="name">{{ label }}</label>
        <div class="mt-1">
            <input
                :id="name"
                v-model="valueLocal"
                :type="type"
                :name="name"
                autocomplete="off"
                :placeholder="placeholder"
            />
        </div>
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
