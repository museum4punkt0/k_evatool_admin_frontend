<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            <h1>{{ users.length }} {{ t('users', users.length) }}</h1>
            <div class="table-wrap mt-3">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.id">
                            <td>{{ user.id }}</td>
                            <td>{{ user.name }}</td>
                            <td>{{ user.email }}</td>
                            <td class="px-6 py-4 flex flex-row">
                                <PencilAltIcon
                                    v-if="store.state.users.user.admin"
                                    class="mx-1 h-5 w-5"
                                    @click="editUser(user.id)"
                                />
                                <TrashIcon
                                    v-if="store.state.users.user.admin"
                                    class="mx-1 h-5 w-5 text-red-500 pointer"
                                    @click="deleteUser(user.id)"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
        <aside>
            <user
                v-if="store.state.users.user.admin"
                :user-id="userId"
                @saved="getUsers"
            />
        </aside>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { TrashIcon, PencilAltIcon } from '@heroicons/vue/outline'

import User from './User.vue'

export default {
    name: 'Users',
    components: { User, TrashIcon, PencilAltIcon },
    setup() {
        const store = useStore()
        const { t } = useI18n()

        const userId = ref(-1)

        const users = computed(() => store.state.users.users)

        const getUsers = () => {
            store.dispatch('users/getUsers')
        }

        const editUser = (userIdToEdit) => {
            userId.value = userIdToEdit
        }

        const deleteUser = (userId) => {
            console.log(userId)
        }

        getUsers()

        return {
            users,
            t,
            userId,
            getUsers,
            editUser,
            deleteUser,
            store,
        }
    },
}
</script>

<style scoped></style>
