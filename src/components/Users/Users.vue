<template>
    <div class="flex flex-grow overflow-hidden">
        <main
            class="flex h-full flex-col p-3"
            :class="showSideBar ? 'w-2/3' : 'w-full'"
        >
            <div class="flex flex-row">
                <h1
                    v-if="
                        filteredUsers.length > 0 &&
                        filteredUsers.length < users.length
                    "
                >
                    {{ filteredUsers.length }} {{ t('of') }} {{ users.length }}
                    {{ t('users', filteredUsers.length) }}
                </h1>
                <h1 v-else>
                    {{ users.length }} {{ t('users', users.length) }}
                </h1>
                <div class="flex-1 flex flex-row justify-end">
                    <form-input
                        v-model:value="searchQuery"
                        name="name"
                        type="text"
                        label=""
                        :placeholder="`${t('filter', 1)}: ${t('id')}, ${t(
                            'names',
                            1,
                        )}, ${t('email')}`"
                    />
                    <button
                        v-if="
                            store.state.users.user.role.includes('admin') ||
                            store.state.users.user.role.includes('userCreator')
                        "
                        class="primary ml-4 mr-1"
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
                            <th>Rolle</th>
                            <th>
                                {{ t('last_login') }}
                            </th>
                            <th
                                v-if="
                                    store.state.users.user.role.includes(
                                        'admin',
                                    ) ||
                                    store.state.users.user.role.includes(
                                        'userCreator',
                                    )
                                "
                            >
                                Aktionen
                            </th>
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

                            <td>
                                <p>
                                    <span
                                        v-for="role in user.role"
                                        :key="user.id + '_' + role"
                                    >
                                        {{ role }}
                                    </span>
                                </p>
                            </td>
                            <td>
                                <span class="text-xs">
                                    {{ user.last_login }}
                                </span>
                            </td>
                            <td
                                v-if="
                                    store.state.users.user.role.includes(
                                        'admin',
                                    ) ||
                                    store.state.users.user.role.includes(
                                        'userCreator',
                                    )
                                "
                                class="px-6 py-4 flex flex-row"
                            >
                                <PencilAltIcon
                                    class="mx-1 h-5 w-5"
                                    @click.prevent.stop="editUser(user.id)"
                                />
                                <TrashIcon
                                    v-if="
                                        store.state.users.user.role.includes(
                                            'admin',
                                        )
                                    "
                                    class="mx-1 h-5 w-5 text-red-500 pointer"
                                    :class="
                                        user.id === store.state.users.user.id
                                            ? 'disabled opacity-10'
                                            : 'opacity-100'
                                    "
                                    @click.prevent.stop="deleteUser(user.id)"
                                />
                                <MailIcon
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
            <user :user-id="userId" @saved="onSave" @cancel="onCancel" />
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
        const [filteredUsers, setFilteredUsers] = useState(users.value)
        const getUsers = async () => {
            await store.dispatch('users/getUsers')
            await store.dispatch('users/getRoles')
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
            if (
                store.state.users.user.role.includes('admin') ||
                store.state.users.user.role.includes('userCreator')
            ) {
                userId.value = userIdToEdit
                setShowSideBar(true)
            }
        }

        const deleteUser = async (userToDelete) => {
            const confirmed = confirm(t('confirm_delete_user'))
            if (confirmed) {
                if (userToDelete !== store.state.users.user.id) {
                    await userService.deleteUser(
                        store.state.users.user.id,
                        userToDelete,
                    )
                    await store.dispatch('users/getUsers')
                } else {
                    console.log('cannot delete yourself')
                }
            }
        }

        const inviteUser = async (userId) => {
            const confirmInviteUser = confirm(t('confirm_send_invitation'))
            if (confirmInviteUser) {
                await userService.inviteUser(userId)
            }
        }

        const filter = (user) =>
            searchForWordsInString([user], searchQuery.value, [
                'id',
                'name',
                'email',
            ]).length > 0

        watch(searchQuery, () => {
            const filteredUsers = users.value.filter(filter)
            setFilteredUsers(filteredUsers)
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
            filteredUsers,
        }
    },
}
</script>

<style scoped></style>
