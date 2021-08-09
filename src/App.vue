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
