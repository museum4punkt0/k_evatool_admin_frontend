<template>
    <form>
        <h1 v-if="user.id">{{ t('edit_user') }}</h1>
        <h1 v-else>{{ t('new_user') }}</h1>
        <form-input
            v-model:value="user.name"
            name="name"
            class="mt-3"
            :disabled="
                user.id && !store.state.users.user.role.includes('admin')
            "
            :label="t('names', 1)"
        />
        <form-input
            v-model:value="user.email"
            name="email"
            class="mt-3"
            :disabled="
                user.id && !store.state.users.user.role.includes('admin')
            "
            :label="t('email')"
        />
        <form-input
            v-model:value="user.password"
            type="password"
            autocomplete="new-password"
            name="password"
            class="mt-3"
            :label="t('passwords', 1)"
        />
        <form-input
            v-model:value="user.passwordConfirmation"
            class="mt-3"
            type="password"
            autocomplete="new-password"
            name="password-confirmation"
            :label="t('password_confirmation')"
        />
        <div class="mt-3">
            <Listbox v-model="selectedRole">
                <ListboxLabel>{{ t('role') }}</ListboxLabel>
                <div class="relative mt-1">
                    <ListboxButton
                        class="shadow-sm relative block w-full py-2 pl-3 pr-3 text-left bg-white border border-gray-300 rounded-md cursor-default sm:text-sm"
                    >
                        <div class="flex flex-row justify-between">
                            <span class="block truncate">
                                {{ selectedRole.displayName }}
                            </span>
                            <ChevronDownIcon class="w-5 h-5" />
                        </div>
                    </ListboxButton>

                    <transition
                        leave-active-class="transition duration-100 ease-in"
                        leave-from-class="opacity-100"
                        leave-to-class="opacity-0"
                    >
                        <ListboxOptions
                            class="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 sm:text-sm z-10"
                        >
                            <ListboxOption
                                v-for="role in getArray()"
                                v-slot="{ active, selected }"
                                :key="role.id"
                                :value="role"
                                as="template"
                            >
                                <li
                                    :class="[
                                        active
                                            ? 'bg-blue-900 text-white'
                                            : 'text-gray-900',
                                        'cursor-default select-none relative py-2 pl-10 pr-4',
                                    ]"
                                >
                                    <span
                                        :class="[
                                            selected
                                                ? 'font-medium'
                                                : 'font-normal',
                                            'block truncate',
                                        ]"
                                    >
                                        {{ role.displayName }}
                                    </span>
                                </li>
                            </ListboxOption>
                        </ListboxOptions>
                    </transition>
                </div>
            </Listbox>
        </div>
    </form>

    <div class="flex flex-row mt-3">
        <button class="secondary mr-3" @click="cancelUser">
            {{ t('action_cancel') }}
        </button>
        <button
            v-if="user.id"
            class="primary flex-1"
            :disabled="savingUser || userValidation.$invalid"
            @click="saveUser"
        >
            {{ t('action_save') }}
        </button>
        <button
            v-else
            class="primary flex-1"
            :disabled="savingUser || userValidation.$invalid"
            @click="saveUser"
        >
            {{ t('action_add') }}
        </button>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import FormInput from '../Forms/FormInput.vue'
import { ref, watch } from 'vue'

import USERS from '../../services/userService'

import useVuelidate from '@vuelidate/core'
import { email, minLength, required, requiredIf } from '@vuelidate/validators'

import FormToggle from '../Forms/FormToggle.vue'
import { useStore } from 'vuex'
import {
    Listbox,
    ListboxButton,
    ListboxLabel,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/vue'

import { ChevronDownIcon } from '@heroicons/vue/solid'

export default {
    name: 'User',
    components: {
        ListboxLabel,
        Listbox,
        ListboxButton,
        ListboxOption,
        ListboxOptions,
        FormToggle,
        FormInput,
        ChevronDownIcon,
    },
    props: {
        userId: {
            type: Number,
            default: -1,
        },
    },
    emits: ['saved', 'cancel'],
    setup(props, { emit }) {
        const { t } = useI18n()
        const store = useStore()
        const selectedRole = ref(
            store.state.users.roles.find((e) => e.name === 'basicUser'),
        )
        const user = ref({
            name: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            role: selectedRole,
        })
        const savingUser = ref(false)

        const getArray = () => {
            return store.state.users.roles.filter((e) => {
                if (store.state.users.user.role.includes('admin')) {
                    return e
                } else {
                    if (e.name !== 'admin') {
                        return e
                    }
                }
            })
        }

        const getUser = async (userId) => {
            user.value = await USERS.getUser(userId)
        }

        const cancelUser = async () => {
            emit('cancel')
        }
        const saveUser = async () => {
            savingUser.value = true

            if (store.state.users.user.role.includes('admin')) {
                await USERS.saveUser(user.value)
            }
            if (store.state.users.user.role.includes('userCreator')) {
                const { id } = await USERS.saveUser(user.value)
                await USERS.inviteUser(id)
            }

            user.value = {
                name: '',
                email: '',
                password: '',
                passwordConfirmation: '',
                role: 1,
            }
            emit('saved')
            savingUser.value = false
        }

        watch(
            () => selectedRole.value,
            () => console.log(selectedRole.value),
        )

        watch(
            () => props.userId,
            (userId) => {
                if (userId > 0) {
                    getUser(userId)
                }
            },
        )

        watch(
            () => user.value,
            (value) => {
                if (value.id) {
                    if (value.password === '') {
                        delete value.password
                    }
                    if (value.passwordConfirmation === '') {
                        delete value.passwordConfirmation
                    }
                }
            },
            { deep: true, immediate: true },
        )

        if (props.userId > 0) {
            getUser(props.userId)
        }

        const validations = {
            name: { required, minLength: minLength(1) },
            email: {
                required,
                email,
            },
            password: {
                required: requiredIf(() => {
                    return !user.value.id || user.value.id <= 0
                }),
                minLength: minLength(12),
            },
            passwordConfirmation: {
                required: requiredIf(() => {
                    return !user.value.id || user.value.id <= 0
                }),
                minLength: minLength(12),
                matchPassword: () =>
                    user.value.passwordConfirmation === user.value.password,
            },
        }

        const userValidation = useVuelidate(validations, user, {
            $scope: 'user',
        })

        return {
            getArray,
            t,
            user,
            userValidation,
            saveUser,
            selectedRole,
            savingUser,
            cancelUser,
            store,
        }
    },
}
</script>

<style scoped></style>
