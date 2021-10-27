<template>
    <div class="flex overflow-hidden">
        <main class="flex h-full w-full flex-col p-3">
            <div class="flex flex-row">
                <h1>{{ titlePrefix }} {{ t('users', users.length) }}</h1>
                <div class="flex-1 flex flex-row justify-end">
                    <form-input
                        v-model:value="searchQuery"
                        name="name"
                        type="text"
                        label=""
                        :placeholder="`${t('filter', 1)}: ${t('name')}, ${t(
                            'email',
                        )}`"
                        class="mr-4"
                    />
                    <button
                        v-if="store.state.users.user.admin"
                        class="primary mr-1"
                        @click="setShowSideBar(true)"
                    >
                        {{ t('action_new_user') }}
                    </button>
                </div>
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
                            v-for="user in users.filter(filter)"
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
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useState } from '../../composables/state'
import userService from '../../services/userService'
import FormInput from '../Forms/FormInput.vue'
import { searchForWordsInString } from '../../utils/search'

import {
    TrashIcon,
    PencilAltIcon,
    CheckIcon,
    MailIcon,
} from '@heroicons/vue/outline'

import User from './User.vue'

export default {
    name: 'Users',
    components: {
        FormInput,
        User,
        TrashIcon,
        PencilAltIcon,
        CheckIcon,
        MailIcon,
    },
    setup() {
        const store = useStore()
        const { t } = useI18n()

        const userId = ref(-1)
        const searchQuery = ref('')

        const users = computed(() => store.state.users.users)
        const [showSideBar, setShowSideBar] = useState(false)
        const [titlePrefix, setTitlePrefix] = useState(users.value.length)
        const getUsers = async () => {
            await store.dispatch('users/getUsers')
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

        const filter = (user) =>
            searchForWordsInString([user], searchQuery.value, ['name', 'email'])
                .length > 0

        watch(users, (value) => {
            if (searchQuery.value === '') {
                setTitlePrefix(value.length)
            }
        })

        watch(searchQuery, () => {
            const matchedUsers = users.value.filter(filter)
            if (
                0 < matchedUsers.length &&
                matchedUsers.length < users.value.length
            ) {
                setTitlePrefix(`${matchedUsers.length}/${users.value.length}`)
            } else {
                setTitlePrefix(users.value.length)
            }
        })
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
            searchQuery,
            filter,
            titlePrefix,
        }
    },
}
</script>

<style scoped></style>
