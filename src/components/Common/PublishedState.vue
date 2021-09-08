<template>
    <span
        :class="
            published
                ? ' bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
        "
        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
    >
        {{ published ? $t('state_published') : $t('state_unpublished') }}
    </span>
</template>

<script>
export default {
    name: 'PublishedState',
    props: {
        published: {
            type: Boolean,
            default: true,
        },
    },
}
</script>

<style scoped></style>
