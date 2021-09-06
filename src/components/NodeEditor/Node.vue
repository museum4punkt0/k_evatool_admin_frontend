<template>
    <div
        ref="node"
        v-draggable=""
        class="
            h-32
            w-44
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
            <!-- <div
                ref="outlet"
                @click="$emit('nodeOutletClick')"
                @touchstart="$emit('nodeOutletClick')"
            >
                Out: {{ data.nextStepId }}
            </div> -->
            <Inlet
                v-for="inlet in inlets"
                :id="inlet.key"
                :key="inlet.key"
                :name="inlet.name"
                :value="inlet.value"
                :on-click="creators.onInletClick(data, inlet)"
            />
        </Inlets>
        <NodeContent>
            <h2>
                {{ data.name }}
            </h2>
            <ul>
                <li>id: {{ data.id }}</li>
                <li>element id: {{ data.surveyElementId }}</li>
            </ul>
        </NodeContent>

        <Outlets>
            <!-- <div
                ref="outlet"
                @click="$emit('nodeOutletClick')"
                @touchstart="$emit('nodeOutletClick')"
            >
                Out: {{ data.nextStepId }}
            </div> -->
            <Outlet
                v-for="outlet in outlets"
                :id="outlet.key"
                :key="outlet.key"
                :name="outlet.name"
                :value="outlet.value"
                :on-click="creators.onOutletClick(data, outlet)"
            />
        </Outlets>
    </div>
</template>

<script>
import { defineExpose, ref } from 'vue'
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
