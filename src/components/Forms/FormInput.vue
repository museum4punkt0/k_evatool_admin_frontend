<template>
    <div>
        <div class="flex">
            <label :for="name" class="flex-grow">{{ label }}</label>
            <div class="languages flex">
                <button
                    v-for="language in languages"
                    :key="language.code"
                    class="language"
                    :class="{
                        primary: language.code === activeLanguage.code,
                        secondary: language.code !== activeLanguage.code,
                    }"
                    @click="$emit('languageSelect', language)"
                >
                    {{ language.code }}
                </button>
            </div>
        </div>
        <div class="mt-1">
            <input
                :id="name"
                v-model="valueLocal"
                :class="invalid ? 'invalid' : ''"
                :type="type"
                :name="name"
                autocomplete="off"
                :placeholder="placeholder"
            />
        </div>
        <p v-if="helptext" class="text-gray-500 text-xs mt-1 ml-1">
            {{ helptext }}
        </p>
        <!-- <template v-if="typeof helptext === Array">
            <p
                v-for="(text, index) in helptext"
                :key="`helptext_${index}`"
                class="text-gray-500 text-xs mt-1 ml-1"
            >
                {{ text }}
            </p>
        </template> -->
    </div>
</template>

<script>
import { computed } from 'vue'

export default {
    name: 'FormInput',
    props: {
        name: {
            type: String,
            default: 'name',
            required: true,
        },
        label: {
            type: String,
            default: 'label',
        },
        value: {
            type: [Number, String],
            default: '',
        },
        helptext: {
            type: String,
            default: '',
        },
        subhelptext: {
            type: String,
            default: '',
        },
        invalid: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'text',
        },
        languages: {
            type: Array,
            default: () => [],
        },
        activeLanguage: {
            type: Object,
            required: false,
            default: () => null,
        },
    },
    emits: ['update:value', 'languageSelect'],
    setup(props, { emit }) {
        const valueLocal = computed({
            get: () => props.value,
            set: (val) => emit('update:value', val),
        })

        return {
            valueLocal,
        }
    },
}
</script>

<style scoped>
button.language {
    padding: 2px 8px;
}
</style>
