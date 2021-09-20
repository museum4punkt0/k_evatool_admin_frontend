<template>
    <h1 v-if="user.id">{{ t('edit_user') }}</h1>
    <h1 v-else>{{ t('new_user') }}</h1>
    <form-input v-model:value="user.name" class="mt-3" :label="t('names', 1)" />
    <form-input v-model:value="user.email" class="mt-3" :label="t('email')" />
    <form-input
        v-if="!user.id"
        v-model:value="user.password"
        type="password"
        class="mt-3"
        :label="t('passwords', 1)"
    />
    <form-input
        v-if="!user.id"
        v-model:value="user.passwordConfirmation"
        class="mt-3"
        type="password"
        :label="t('password_confirmation')"
    />

    <form-toggle
        v-if="store.state.users.user.admin"
        v-model:enabled="user.admin"
        class="my-3"
        :label="'Admin'"
    />

    <button class="primary mt-3" :disabled="savingUser" @click="saveUser">
        {{ t('action_save') }}
    </button>
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
    emits: ['saved'],
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

        const saveUser = async () => {
            savingUser.value = true
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
            getUser()
        }

        return { t, user, v$: useVuelidate(), saveUser, savingUser, store }
    },
    validations: {
        user: {
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
            },
        },
    },
}
</script>

<style scoped></style>
