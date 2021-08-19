<template>
    <div>languages tes</div>
    <button @click="fetchLanguagesAndSet">fetch languages and set</button>
    <ul>
        <li v-for="language in languages" :key="language.id">
            {{ language.id }} {{ language.title }} {{ language.code }}
            {{ language.sub_code }}
            {{ language.default }}
            {{ language.published }}
        </li>
    </ul>
</template>

<script>
import { createNamespacedHelpers } from 'vuex-composition-helpers'

const { useState, useActions } = createNamespacedHelpers('languages')

export default {
    setup(props) {
        const { languages } = useState(['languages'])
        const { fetchLanguagesAndSet } = useActions(['fetchLanguagesAndSet'])
        return {
            languages,
            fetchLanguagesAndSet,
        }
    },
}
</script>

<style></style>
