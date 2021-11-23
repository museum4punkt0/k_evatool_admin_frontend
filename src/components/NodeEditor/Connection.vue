<template>
    <svg
        v-if="validConnection"
        xmlns="http://www.w3.org/2000/svg"
        class="absolute w-full"
    >
        <defs>
            <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
            >
                <polygon points="0 0, 11 3.5, 0 7" />
            </marker>
            <path
                :id="`${id}_textpath`"
                :d="`M ${start.x} ${start.y} L ${end.x} ${end.y}`"
            />
        </defs>
        <line
            :x1="start.x"
            :y1="start.y"
            :x2="end.x"
            :y2="end.y"
            stroke="#000"
            stroke-width="2"
            marker-end="url(#arrowhead)"
            :stroke-dasharray="dashed ? 2 : 0"
        />
        <text
            v-if="dashed"
            class="text-middle"
            style="fill: #000"
            text-anchor="middle"
            dominant-baseline="text-top"
        >
            <textPath :xlink:href="`#${id}_textpath`" startOffset="50%">
                {{ label }}
            </textPath>
        </text>
        <text
            v-else
            class="text-start"
            style="fill: #000"
            text-anchor="start"
            :x="(start.x + end.x) / 2"
            :y="(start.y + end.y) / 2"
        >
            {{ label }}
        </text>
    </svg>
</template>

<script>
import { computed } from 'vue'

export default {
    name: 'Connection',
    components: {},
    props: {
        start: {
            type: Object,
            required: true,
        },
        end: {
            type: Object,
            required: true,
        },
        dashed: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            default: '',
        },
        id: {
            type: String,
            default: '',
        },
    },
    setup(props) {
        const validConnection = computed(() => {
            if (props.start.x && props.start.y && props.end.x && props.end.y) {
                return true
            }
            console.warn(
                'ERROR: could not draw connection ' +
                    props.label +
                    ' | id ' +
                    props.id,
            )
            return false
        })
        return { validConnection }
    },
}
</script>

<style scoped>
svg {
    transition: all 250ms ease-in-out;
    pointer-events: none;
    z-index: 1;
    transform-origin: left top;
}
.text-start {
    transform: translateX(1%);
}
.text-middle {
    transform: translateY(-1%);
}
</style>
