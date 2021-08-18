<template>
    <div>
        <ul>
            <li>
                <router-link to="/">Home</router-link>
            </li>
            <li>
                <router-link to="/about">About</router-link>
            </li>
        </ul>

        <form>
            <label>{{ $t('message.language') }}</label>
            <select v-model="$i18n.locale">
                <option value="en">en</option>
                <option value="de">de</option>
            </select>
        </form>
        <p>{{ $t('message.hello') }}</p>

        Store Title: {{ title }}
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: this.$store.state.title,
        }
    },
}
</script>

<style></style>
