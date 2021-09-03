<template>
    <div
        ref="node"
        v-draggable=""
        class="
            h-32
            w-44
            bg-white
            shadow
            border-b border-gray-200
            sm:rounded-lg
            flex
        "
    >
        <div ref="inlet">IN</div>
        <div>
            <h2>
                {{ data.name }}
            </h2>
            <ul>
                <li>id: {{ data.id }}</li>
                <li>element id: {{ data.surveyElementId }}</li>
            </ul>
        </div>
        <div
            ref="outlet"
            @click="$emit('nodeOutletClick')"
            @touchstart="$emit('nodeOutletClick')"
        >
            Out: {{ data.nextStepId }}
        </div>
    </div>
</template>

<script>
import { defineExpose, ref } from 'vue'

export default {
    name: 'Node',
    components: {},
    props: {
        data: {
            type: Object,
            required: true,
            default: () => {},
        },
    },
    setup() {
        let node = ref(null)
        defineExpose({ node })
        return {
            creators: {
                onInletClick: (node, inlet) => {
                    return () => {
                        console.log('inlet clicked', node, inlet)
                    }
                },
                onOutletClick: (node, outlet) => {
                    return () => {
                        console.log('outlet clicked', node, outlet)
                    }
                },
            },
        }
    },
}
</script>

<style></style>
