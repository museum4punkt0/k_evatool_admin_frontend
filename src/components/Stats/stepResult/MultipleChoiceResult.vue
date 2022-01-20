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

        function i18nLabel(labels) {
            return labels[store.state.languageCode]
                ? labels[store.state.languageCode]
                : labels[0]
        }

        const values = computed(() => {
            let longComment = ''

            const results = getMappedArray.value
            results.forEach((answer) => {
                let label = i18nLabel(answer?.labels)
                if (answer.comment && (label + answer.comment).length > 24) {
                    longComment = answer.value
                }
            })
            if (results.length > 3 || longComment) {
                setToolTipTrue()
                let showValues = _.cloneDeep(results.slice(2))
                if (results.length > 3) {
                    showValues.push({ value: '...' })
                }
                return showValues
            }
            return results
        })

        function commentLabel(opt) {
            const label = i18nLabel(
                props.params.find((x) => x.value === opt.value)?.labels,
            )

            if (opt.comment) {
                const fullComment = label + ': ' + opt.comment
                if (fullComment.length > 24) {
                    return fullComment.substring(0, 20) + ' ...'
                }
                return fullComment
            }
            return label
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
