<template>
    <h2>Surveys</h2>
    <button @click="refresh">refresh</button>
    <ul>
        <li v-for="survey in surveys" :key="survey.id">{{ survey.id }}</li>
    </ul>
</template>

<script>
import { createNamespacedHelpers } from 'vuex-composition-helpers'

const { useState, useActions } = createNamespacedHelpers('surveys')
export default {
    setup(props) {
        const { surveys } = useState(['surveys'])
        const { refresh } = useActions(['refresh'])
        console.log(surveys)
        return {
            surveys,
            refresh,
        }
    },
}
</script>

<style></style>
