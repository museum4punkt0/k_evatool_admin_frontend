<template>
    <div class="w-full flex justify-center">
        <div class="w-96">
            <h1>Login</h1>
            <form-input
                v-model:value="user.email"
                class="mt-3"
                :label="t('email')"
            />
            <form-input
                v-model:value="user.password"
                class="mt-3"
                type="password"
                :label="t('passwords', 1)"
            />
            <button
                class="primary w-full mt-3"
                :disabled="v$.$invalid"
                @click="login"
            >
                Login
            </button>
        </div>
    </div>
</template>

<script>
import FormInput from './Forms/FormInput.vue'
import { reactive } from 'vue'

import useVuelidate from '@vuelidate/core'
import { minLength, required, email } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

export default {
    name: 'Login',
    components: { FormInput },
    setup() {
        const { t } = useI18n()
        const store = useStore()
        const user = reactive({
            email: 'ms@2av.de',
            password: 'passwordpassword',
        })

        const login = async () => {
            const userLoggedIn = await store.dispatch('users/loginUser', user)
            console.log(userLoggedIn)
        }

        return { user, v$: useVuelidate(), t, login }
    },
    validations: {
        user: {
            email: {
                required,
                email,
            },
            password: {
                required,
                minLength: minLength(12),
            },
        },
    },
}
</script>

<style scoped></style>
