<template>
    <div class="w-full flex justify-center">
        <div class="w-96 mt-5 p-3 border rounded-lg shadow bg-blue-100">
            <h1>Login</h1>

            <form-input
                v-model:value="user.email"
                name="email"
                class="mt-3"
                :label="t('email')"
            />
            <form-input
                v-model:value="user.password"
                name="password"
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
import { useRouter } from 'vue-router'

export default {
    name: 'Login',
    components: { FormInput },
    setup() {
        const { t } = useI18n()
        const store = useStore()
        const router = useRouter()

        const user = reactive({
            email: import.meta.env.VITE_PREFILL_EMAIL || '',
            password: import.meta.env.VITE_PREFILL_PASSWORD || '',
        })

        const login = async () => {
            const userLoggedIn = await store.dispatch('users/loginUser', user)
            if (userLoggedIn.id) {
                console.log(userLoggedIn)
                window.location.reload()
            }
        }

        if (store.state.users.user) {
            router.push('/')
        }

        return { user, v$: useVuelidate(), t, login, store }
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
