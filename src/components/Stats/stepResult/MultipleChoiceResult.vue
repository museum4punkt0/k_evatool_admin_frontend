<template>
    <div
        v-tippy="{
            content: toolTipValues,
        }"
    >
        <p
            v-for="opt in values"
            :key="'options' + result?.value?.stepId + Date.now() + opt.value"
            class="pointer-events-none"
        >
            {{ opt.value === '...' ? opt.value : commentLabel(opt) }}
        </p>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import _ from 'lodash'

export default {
    name: 'MultipleChoiceResult',
    props: {
        result: {
            type: Object,
            required: true,
        },
        params: {
            type: Object,
            required: true,
        },
    },
    setup: function (props) {
        const showToolTip = ref(false)
        const store = useStore()
        const maxStringLength = 35

        function htmlDecode(input) {
            const doc = new DOMParser().parseFromString(input, 'text/html')
            return doc.documentElement.textContent
        }
        function i18nLabel(labels) {
            return labels[store.state.languageCode]
                ? labels[store.state.languageCode]
                : labels[0]
        }
        function shortenAnswer(input) {
            const newString = htmlDecode(input)

            if (newString.length > maxStringLength) {
                setToolTipTrue()
                return newString.substring(0, maxStringLength - 3) + '...'
            }
            return newString
        }

        const getMappedArray = computed(() => {
            const params = _.cloneDeep(props.params)
            return params
                .map((val) => {
                    const result = props.result?.value?.selected.find(
                        (x) => x.value === val.value,
                    )
                    if (result) {
                        if (result.comment) {
                            val.comment = result.comment
                        }
                        return val
                    }
                })
                .filter((x) => x)
        })

        const values = computed(() => {
            let showValues = _.cloneDeep(getMappedArray.value)
            if (showValues.length > 3) {
                showValues = showValues.slice(0, 2)
                showValues.push({ value: '...' })
            }
            return showValues
        })

        function commentLabel(opt) {
            const label = i18nLabel(
                props.params.find((x) => x.value === opt.value)?.labels,
            )

            if (opt.comment) {
                return shortenAnswer(label + ': ' + opt.comment)
            }
            return shortenAnswer(label)
        }

        const toolTipValues = computed(() => {
            if (!showToolTip.value) {
                return ''
            }
            const results = getMappedArray.value
            let toolTipString = ''
            results.forEach((result) => {
                const label = i18nLabel(result.labels)
                if (result.commentable) {
                    toolTipString +=
                        label + ': <br/>"' + result.comment + '"<br/>'
                } else {
                    toolTipString += label + '<br/>'
                }
            })
            return toolTipString
        })

        function setToolTipTrue() {
            showToolTip.value = true
        }

        return {
            commentLabel,
            showToolTip,
            store,
            toolTipValues,
            values,
        }
    },
}
</script>

<style scoped></style>
