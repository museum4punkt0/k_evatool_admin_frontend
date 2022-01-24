<template>
    <div class="loader flex space-x-1 ml-5">
        <div class="animate-bounce bg-white w-2 h-2 rounded-full"></div>
        <div class="animate-bounce bg-white w-2 h-2 rounded-full"></div>
        <div class="animate-bounce bg-white w-2 h-2 rounded-full"></div>
    </div>
</template>

<script>
export default {
    name: 'Loader',
    setup() {},
}
</script>

<style scoped>
.loader div {
    animation-duration: 0.5s;
}
.loader div:first-child {
    animation-delay: 0.1s;
}
.loader div:nth-child(2) {
    animation-delay: 0.3s;
}
.loader div:nth-child(3) {
    animation-delay: 0.7s;
}
</style>
