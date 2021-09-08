<template>
    <div
        ref="node"
        class="
            absolute
            h-32
            w-64
            p-2
            bg-white
            sm:rounded-lg
            flex
            border-gray-500 border-2
        "
        :class="{ 'border-blue-900': selected, 'border-1': selected }"
        :style="{
            left: `${position?.x}px`,
            top: `${position?.y}px`,
        }"
    >
        <!-- :style="{
            transform: `translateX(${position?.x}px) translateY(${position?.y}px)`,
        }" -->
        <Inlets>
            <Inlet
                v-for="inlet in inlets"
                :id="inlet.key"
                :key="inlet.key"
                :name="inlet.name"
                :value="inlet.value"
                @click.prevent.stop="
                    emit('inletClicked', { node: data, inlet })
                "
                @mousedown.prevent.stop=""
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
                @click.prevent.stop="
                    emit('outletClicked', { node: data, outlet })
                "
                @mousedown.prevent.stop=""
            />
        </Outlets>
    </div>
</template>

<script>
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
        selected: {
            type: Boolean,
            required: false,
            default: () => false,
        },
        position: {
            type: Object,
            required: true,
        },
    },
    emits: ['outletClicked', 'inletClicked'],
    setup(props, { emit }) {
        return { emit }
    },
}
</script>

<style></style>
