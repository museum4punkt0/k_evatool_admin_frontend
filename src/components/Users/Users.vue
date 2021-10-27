<template>
    <div class="flex overflow-hidden">
        <main class="flex h-full w-full flex-col p-3">
            <div class="flex flex-row justify-between">
                <h1>{{ users.length }} {{ t('users', users.length) }}</h1>
                <button
                    v-if="store.state.users.user.admin"
                    class="primary mr-1"
                    @click="setShowSideBar(true)"
                >
                    {{ t('action_new_user') }}
                </button>
            </div>
            <div class="table-wrap mt-3">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th v-if="store.state.users.user.admin">Admin</th>
                            <th>
                                {{ t('last_login') }}
                            </th>
                            <th v-if="store.state.users.user.admin"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="user in users"
                            :key="user.id"
                            @click.prevent.stop="editUser(user.id)"
                        >
                            <td>{{ user.id }}</td>
                            <td>
                                {{ user.name }}
                                <p class="text-gray-500 text-xs">
                                    {{ user.email }}
                                </p>
                            </td>

                            <td v-if="store.state.users.user.admin">
                                <check-icon v-if="user.admin" class="w-5 h-5" />
                            </td>
                            <td>
                                <span class="text-xs">
                                    {{ user.last_login }}
                                </span>
                            </td>
                            <td
                                v-if="store.state.users.user.admin"
                                class="px-6 py-4 flex flex-row"
                            >
                                <PencilAltIcon
                                    v-if="store.state.users.user.admin"
                                    class="mx-1 h-5 w-5"
                                    @click.prevent.stop="editUser(user.id)"
                                />
                                <TrashIcon
                                    v-if="store.state.users.user.admin"
                                    class="mx-1 h-5 w-5 text-red-500 pointer"
                                    @click.prevent.stop="deleteUser(user.id)"
                                />
                                <MailIcon
                                    v-if="store.state.users.user.admin"
                                    class="mx-1 h-5 w-5 pointer"
                                    @click.prevent.stop="inviteUser(user.id)"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
        <aside v-if="showSideBar">
            <user
                v-if="store.state.users.user.admin"
                :user-id="userId"
                @saved="onSave"
                @cancel="onCancel"
            />
        </aside>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useState } from '../../composables/state'
import userService from '../../services/userService'

import {
    TrashIcon,
    PencilAltIcon,
    CheckIcon,
    MailIcon,
} from '@heroicons/vue/outline'

import User from './User.vue'

export default {
    name: 'Users',
    components: { User, TrashIcon, PencilAltIcon, CheckIcon, MailIcon },
    setup() {
        const store = useStore()
        const { t } = useI18n()

        const userId = ref(-1)

        const users = computed(() => store.state.users.users)
        const [showSideBar, setShowSideBar] = useState(false)

        const getUsers = () => {
            store.dispatch('users/getUsers')
        }
        const onSave = () => {
            setShowSideBar(false)
            getUsers()
        }
        const onCancel = () => {
            setShowSideBar(false)
            userId.value = -1
            getUsers()
        }

        const editUser = (userIdToEdit) => {
            if (!store.state.users.user.admin) return
            userId.value = userIdToEdit
            setShowSideBar(true)
        }

        const deleteUser = (userId) => {
            console.log(userId)
        }

        const inviteUser = async (userId) => {
            const confirmInviteUser = confirm(t('confirm_send_invitation'))
            if (confirmInviteUser) {
                await userService.inviteUser(userId)
            }
        }

        getUsers()

        return {
            users,
            t,
            userId,
            onSave,
            onCancel,
            editUser,
            deleteUser,
            inviteUser,
            store,
            showSideBar,
            setShowSideBar,
        }
    },
}
</script>

<style scoped></style>
