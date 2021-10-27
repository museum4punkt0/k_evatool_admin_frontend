<template>
    <div>
        <label :for="name">{{ label }}</label>
        <div class="mt-2">
            <div
                v-for="(option, index) in options"
                :key="'checkbox_option_' + index"
                @click.prevent.stop="changeValue(option.code)"
            >
                <label class="inline-flex items-center pointer-events-none">
                    <input
                        type="checkbox"
                        class="form-checkbox rounded"
                        :checked="value.includes(option.code)"
                    />
                    <span class="ml-2">{{ option.title }}</span>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
    name: 'FormCheckbox',
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
        options: {
            type: Array,
            required: true,
            default: () => [],
        },
        value: {
            type: Array,
            default: () => [],
        },
        helptext: {
            type: String,
            default: '',
        },
    },
    emits: ['update:value'],
    setup(props, { emit }) {
        const valueLocal = ref([])

        watch(
            () => valueLocal,
            () => {
                emit('update:value', valueLocal)
            },
            { deep: true },
        )

        return {
            valueLocal,
        }
    },
    methods: {
        changeValue(value) {
            const index = this.valueLocal.indexOf(value)
            if (index < 0) {
                this.valueLocal.push(value)
            } else {
                this.valueLocal.splice(index, 1)
            }
        },
    },
}
</script>

<style scoped></style>
