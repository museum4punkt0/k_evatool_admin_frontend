<template>
    <form>
        <h1 v-if="user.id">{{ t('edit_user') }}</h1>
        <h1 v-else>{{ t('new_user') }}</h1>
        <form-input
            v-model:value="user.name"
            name="name"
            class="mt-3"
            :label="t('names', 1)"
        />
        <form-input
            v-model:value="user.email"
            name="email"
            class="mt-3"
            :label="t('email')"
        />
        <form-input
            v-if="store.state.users.user.admin"
            v-model:value="user.password"
            type="password"
            autocomplete="new-password"
            name="password"
            class="mt-3"
            :label="t('passwords', 1)"
        />
        <form-input
            v-if="store.state.users.user.admin"
            v-model:value="user.passwordConfirmation"
            class="mt-3"
            type="password"
            autocomplete="new-password"
            name="password-confirmation"
            :label="t('password_confirmation')"
        />

        <form-toggle
            v-if="store.state.users.user.admin"
            v-model:enabled="user.admin"
            class="my-3"
            :label="'Admin'"
        />
    </form>

    <div class="flex flex-row">
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
import { email, minLength, required } from '@vuelidate/validators'
import FormToggle from '../Forms/FormToggle.vue'
import { useStore } from 'vuex'

export default {
    name: 'User',
    components: { FormToggle, FormInput },
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
        const user = ref({
            name: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            admin: false,
        })
        const savingUser = ref(false)

        const getUser = async (userId) => {
            user.value = await USERS.getUser(userId)
        }

        const cancelUser = async () => {
            emit('cancel')
        }
        const saveUser = async () => {
            savingUser.value = true
            if (user.value.password === '') {
                delete user.value.password
                delete user.value.passwordConfirmation
            }
            await USERS.saveUser(user.value)
            user.value = {
                name: '',
                email: '',
                password: '',
                passwordConfirmation: '',
                admin: false,
            }
            emit('saved')
            savingUser.value = false
        }

        watch(
            () => props.userId,
            (userId) => {
                if (userId > 0) {
                    getUser(userId)
                }
            },
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
                minLength: minLength(12),
            },
            passwordConfirmation: {
                minLength: minLength(12),
                matchPassword: () =>
                    user.value.passwordConfirmation === user.value.password,
            },
        }

        const userValidation = useVuelidate(validations, user, {
            $scope: 'user',
        })

        return {
            t,
            user,
            userValidation,
            saveUser,
            savingUser,
            cancelUser,
            store,
        }
    },
}
</script>

<style scoped></style>
