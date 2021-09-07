<template>
    <div
        ref="node"
        v-draggable=""
        class="
            h-32
            w-64
            p-2
            bg-white
            shadow
            border-b border-gray-200
            sm:rounded-lg
            flex
        "
        @move="onMove"
    >
        <Inlets>
            <Inlet
                v-for="inlet in inlets"
                :id="inlet.key"
                :key="inlet.key"
                :name="inlet.name"
                :value="inlet.value"
                @click="emit('inletClicked', { node: data, inlet })"
            />
        </Inlets>
        <NodeContent>
            <h4>
                {{ data.name }}
            </h4>
            <!--            <ul>
                <li>id: {{ data.id }}</li>
                <li>element id: {{ data.surveyElementId }}</li>
            </ul>-->
        </NodeContent>

        <Outlets>
            <Outlet
                v-for="outlet in outlets"
                :id="outlet.key"
                :key="outlet.key"
                :name="outlet.name"
                :value="outlet.value"
                @click="emit('outletClicked', { node: data, outlet })"
            />
        </Outlets>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import NodeContent from './NodeContent.vue'
import Inlets from './Inlets.vue'
import Inlet from './Inlet.vue'
import Outlets from './Outlets.vue'
import Outlet from './Outlet.vue'

export default {
    name: 'Node',
    components: { NodeContent, Outlets, Inlets, Inlet, Outlet },
    props: {
        data: {
            type: Object,
            required: true,
            default: () => {},
        },
        onStart: {
            type: Function,
            required: false,
            default: () => {},
        },
        onMove: {
            type: Function,
            required: true,
        },
        onStop: {
            type: Function,
            required: false,
            default: () => {},
        },
        inlets: {
            type: Array,
            required: false,
            default: () => [],
        },
        outlets: {
            type: Array,
            required: false,
            default: () => [],
        },
    },
    emits: ['outletClicked', 'inletClicked'],
    setup(props, { emit }) {
        return { emit }
    },
}
</script>

<style></style>
