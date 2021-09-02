<template>
    <form>
        <label>{{ $t('language') }}</label>
        <select v-model="$i18n.locale">
            <option value="en">en</option>
            <option value="de">de</option>
        </select>
    </form>
    <p>{{ $t('hello') }}</p>
</template>

<script>
export default {
    setup() {
        return {}
    },
}
</script>

<style></style>
