<template>
    <Layout>
        <PageHeader :title="$t('New language')">
            <Toolbar>
                <Button @click="handlers.onCreate">create</Button>
            </Toolbar>
        </PageHeader>
        <ScrollContent>
            <ul>
                <li>
                    <input v-model.lazy="language.code" @change="update" />
                </li>
                <li>
                    <input v-model.lazy="language.sub_code" @change="update" />
                </li>
                <li>
                    <input v-model.lazy="language.title" @change="update" />
                </li>
                <li>
                    <input v-model="language.default" type="checkbox" />
                </li>
                <li>
                    <input v-model="language.published" type="checkbox" />
                </li>
            </ul>
        </ScrollContent>
    </Layout>
</template>

<script>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import Button from '../Common/Button'
import Header from '../Common/Header.vue'
import Layout from '../Common/Layout'
import ScrollContent from '../Common/ScrollContent'
import Toolbar from '../Common/Toolbar.vue'
const { useState, useActions } = createNamespacedHelpers('languages')

export default {
    components: {
        Button,
        PageHeader: Header,
        Layout,
        Toolbar,
    },
    setup(props) {
        const router = useRouter()
        const language = ref({
            code: '',
            sub_code: '',
            title: 'title',
            published: true,
            default: false,
        })
        // const { surveys } = useState(['surveys'])
        const { createOneSelectAndUpdateStore } = useActions([
            'createOneSelectAndUpdateStore',
        ])
        return {
            language,
            handlers: {
                onCreate: () => {
                    createOneSelectAndUpdateStore(language.value).then(
                        (response) => {
                            router.push({
                                name: 'language',
                                params: { id: response.id },
                            })
                        },
                    )
                },
            },
        }
    },
}
</script>

<style></style>
