<template>
    <div class="flex">
        <label class="flex-grow">{{ label }}</label>
        <language-switch-small v-if="languageSwitch" />
    </div>
    <div :class="invalid ? 'invalid' : ''">
        <editor
            v-model="textLocal"
            :initial-value="text"
            :api-key="tinyMceKey"
            :init="{
                height: 200,
                menubar: false,
                plugins: [
                    'advlist autolink lists link image charmap',
                    'searchreplace visualblocks code fullscreen',
                    'print preview anchor insertdatetime media',
                    'paste code help wordcount table',
                ],
                toolbar: 'undo redo | bold italic',
                paste_as_text: true,
            }"
        ></editor>
    </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import { computed } from 'vue'
import LanguageSwitchSmall from '../../components/Languages/LanguageSwitchSmall.vue'

export default {
    name: 'TinyMce',
    components: { LanguageSwitchSmall, Editor },
    props: {
        label: {
            type: String,
            default: '',
        },
        text: {
            type: String,
            default: '',
        },
        invalid: {
            type: Boolean,
            default: false,
        },
        languageSwitch: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:text'],
    setup(props, { emit }) {
        const tinyMceKey = 'c9kxwmlosfk0pm4jnj8j1pm8hzprlnt04hhftgpsnunje615'
        const textLocal = computed({
            get: () => props.text,
            set: (text) => emit('update:text', text),
        })
        return { tinyMceKey, textLocal }
    },
}
</script>

<style scoped></style>
