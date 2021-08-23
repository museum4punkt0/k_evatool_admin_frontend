<template>
    <Record title="language">
        <router-view></router-view>
    </Record>
</template>

<script>
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import Button from '../Button'
import Record from '../record/Record.vue'

const { useState, useActions } = createNamespacedHelpers('currentSurvey')

export default {
    components: {
        Button,
        Record,
    },
    setup(props) {
        return {}
    },
}
</script>

<style></style>
