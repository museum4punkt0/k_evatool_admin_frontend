<template>
    <div class="mx-2 pb-2">
        <template v-for="step in timeBasedSteps">
            <p class="text-xs">{{ step.description }} / {{ step.timecode }}</p>
        </template>
    </div>
</template>

<script>
export default {
    name: 'ElementTimeBasedStepsPreview',
    props: { timeBasedSteps: { type: Object, required: true } },
}
</script>

<style scoped></style>
