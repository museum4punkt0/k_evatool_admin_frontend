<template>
    <div>
        <video controls>
            <source
                :src="
                    assets.find(
                        (item) => item.id === elementParams?.videoAssetId,
                    )?.urls.original
                "
                :type="
                    assets.find(
                        (item) => item.id === elementParams?.videoAssetId,
                    )?.mime
                "
            />
        </video>
        <div>
            <div class="rounded overflow-hidden flex flex-row mt-4 mb-4">
                <button
                    v-for="languageCode in Object.keys(results.comments)"
                    :key="languageCode"
                    class="text-white px-2 py-1 text-sm flex-auto pointer"
                    :class="{
                        primary: selectedLanguage === languageCode,
                        secondary: selectedLanguage !== languageCode,
                    }"
                    @click="setSelectedLanguage(languageCode)"
                >
                    {{ languageCode }}
                </button>
            </div>
            <div>
                <template
                    v-for="languageCode in Object.keys(results.comments)"
                    :key="languageCode"
                >
                    <div v-if="languageCode === selectedLanguage">
                        <div :class="`results_${languageCode}`">
                            <ul>
                                <li
                                    v-for="(comments, index) in results
                                        .comments[languageCode]"
                                    :key="index"
                                >
                                    <div>
                                        {{ comments.text }}
                                    </div>
                                    <span class="text-xs text-gray-500">
                                        {{ comments.sessionId }} -
                                        {{ comments.time }}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useState } from '../../../composables/state'

export default {
    name: 'VideoResults',
    components: {},
    props: {
        elementParams: {
            type: Object,
            required: true,
        },
        results: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const store = useStore()
        const assets = computed({
            get: () =>
                store.state.assets.assets.filter((x) =>
                    x.mime.includes('video'),
                ),
        })
        const [selectedLanguage, setSelectedLanguage] = useState(
            props.results.comments &&
                Object.keys(props.results.comments).length > 0
                ? Object.keys(props.results.comments)[0]
                : null,
        )
        return { store, assets, selectedLanguage, setSelectedLanguage }
    },
}
</script>

<style scoped></style>
