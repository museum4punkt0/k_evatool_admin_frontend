<template>
    <button
        type="button"
        class="primary mt-3"
        :disabled="disabled || executing"
        @click="emitExecute"
    >
        {{ $t('action_save') }}
    </button>
</template>

<script>
export default {
    name: 'ActionButton',
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        executing: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['execute'],
    setup(props, { emit }) {
        const emitExecute = () => {
            emit('execute')
        }
        return { emitExecute }
    },
}
</script>

<style scoped></style>
