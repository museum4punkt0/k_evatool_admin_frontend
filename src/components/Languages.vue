<template>
    <h2>{{ $t('message.language') }}</h2>
    <Button @click="refresh">refresh</Button>
    <ul>
        <li v-for="language in languages" :key="language.id">
            {{ language.id }} {{ language.title }} {{ language.code }}
            {{ language.sub_code }}
            {{ language.default }}
            {{ language.published }}
            <Button @click="deleteLanguage(language.id)">delete</Button>
            <Button
                @click="
                    updateLanguage({
                        id: language.id,
                        data: { title: 'updated title' },
                    })
                "
            >
                update
            </Button>
        </li>
    </ul>
    <button
        @click="
            addLanguage({
                title: 'Espanol',
                code: 'es',
                sub_code: 'es_ES',
                default: false,
                published: false,
            })
        "
    >
        add spanish
    </button>
</template>

<script>
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import Button from './Button'

const { useState, useActions } = createNamespacedHelpers('languages')

export default {
    components: {
        Button,
    },
    setup(props) {
        const { languages } = useState(['languages'])
        const { refresh, addLanguage, updateLanguage, deleteLanguage } =
            useActions([
                'refresh',
                'addLanguage',
                'updateLanguage',
                'deleteLanguage',
            ])
        return {
            languages,
            refresh,
            addLanguage,
            updateLanguage,
            deleteLanguage,
        }
    },
}
</script>

<style></style>
