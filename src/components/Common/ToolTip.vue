<template>
    <Popper
        :content="content"
        hover
        placement="right"
        arrow
        close-delay="1000000"
    >
        <slot></slot>
    </Popper>
    <!-- https://github.com/maciejziemichod/v-tooltip -->
</template>

<script>
import Popper from 'vue3-popper'
export default {
    name: 'ToolTip',
    components: {
        Popper,
    },
    props: {
        content: {
            type: String,
            required: true,
        },
    },
    setup() {
        return {}
    },
}
</script>

<style scoped></style>
