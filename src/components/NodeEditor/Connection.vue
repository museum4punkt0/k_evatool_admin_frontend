<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :style="{
            width: `${width}px`,
            height: `${height}px`,
            zIndex: 1,
        }"
        class="absolute"
    >
        <!-- 'background-color': 'rgba(200,0,0,0.4)', -->
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
        <text style="fill: #000">
            <textPath :xlink:href="`${id}_textpath`">{{ label }}</textPath>
        </text>
        <!-- <text
            :x="start.x"
            :y="start.y"
            dominant-baseline="middle"
            text-anchor="left"
        >
            testText
        </text> -->
    </svg>
</template>

<script>
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
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
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
    setup() {
        return {}
    },
}
</script>

<style></style>
