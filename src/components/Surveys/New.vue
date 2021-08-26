<template>
    <Layout>
        <PageHeader :title="$t('New survey')">
            <Toolbar>
                <Button @click="handlers.onCreate">create</Button>
            </Toolbar>
        </PageHeader>
        <ScrollContent>
            <ul>
                <li>
                    <input v-model.lazy="survey.name" @change="update" />
                </li>
                <li>
                    <input v-model.lazy="survey.description" @change="update" />
                </li>
            </ul>
        </ScrollContent>
    </Layout>
</template>

<script>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import Header from '../Common/Header.vue'
import Layout from '../Common/Layout'
import ScrollContent from '../Common/ScrollContent'
import Button from '../Common/Button'
const { useState, useActions } = createNamespacedHelpers('surveys')

export default {
    components: { Button, Layout, PageHeader: Header, ScrollContent },
    setup(props) {
        const router = useRouter()
        const survey = ref({ name: 'new name', description: 'new description' })
        // const { surveys } = useState(['surveys'])
        const { createOneSelectAndUpdateStore } = useActions([
            'createOneSelectAndUpdateStore',
        ])
        const { useActions: useNotificationsActions } =
            createNamespacedHelpers('notifications')
        const { addError } = useNotificationsActions(['addError'])
        return {
            survey,
            handlers: {
                onCreate: () => {
                    createOneSelectAndUpdateStore(survey.value)
                        .then((response) => {
                            router.push({
                                name: 'survey/edit',
                                params: { id: response.id },
                            })
                        })
                        .catch((error) => addError(error))
                },
            },
        }
    },
}
</script>

<style></style>
