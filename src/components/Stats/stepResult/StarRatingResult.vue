<template>
    <div class="flex flex-col w-full">
        <div v-if="result?.value?.rating" class="flex w-full justify-startmb-3">
            <button
                v-for="i in parseInt(stars)"
                :key="i"
                type="button"
                :class="{ 'mr-1': i < stars }"
            >
                <star-icon
                    class="h-4 w-4"
                    :class="[
                        result.value.rating >= i
                            ? 'text-blue currentColor'
                            : 'text-grey',
                    ]"
                />
            </button>
        </div>
    </div>
    <!--    {{ result }}-->
    <!--    <div>{{ result?.value?.rating }} a</div>-->
</template>

<script>
import { computed } from 'vue'
import { StarIcon } from '@heroicons/vue/outline'

export default {
    name: 'StarRatingResult',
    components: {
        StarIcon,
    },
    props: {
        result: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const stars = computed({
            get: () => props.result?.value?.rating,
        })

        return { stars }
    },
}
</script>

<style>
.text-blue {
    color: #1a56db;
    fill: #1a56db;
}
</style>
