<template>
    <div class="w-full flex justify-center">
        <div class="w-96 mt-5 p-3 border rounded-lg shadow bg-blue-100">
            <h1>{{ t('confirm_invitation') }}</h1>
            <template v-if="token && !success && !error">
                <form-input
                    v-model:value="password"
                    class="mt-3"
                    type="password"
                    :label="t('passwords', 1)"
                    :placeholder="t('passwords', 1)"
                    name="password"
                />
                <p class="text-gray-500 text-xs mt-1 ml-1">
                    {{ t('hint_password_requirements') }}
                </p>
                <button
                    class="primary w-full mt-3"
                    :disabled="validator.$invalid"
                    @click="confirmPassword"
                >
                    {{ t('action_confirm') }}
                </button>
            </template>
            <template v-else>
                <div v-if="success">
                    {{ t('success_confirm_password') }}
                </div>
                <div v-if="error" class="alert-danger mt-3">
                    {{ error }}
                </div>
                <router-link to="/login" class="btn-primary mt-3 w-full">
                    {{ t('login') }}
                </router-link>
            </template>
        </div>
    </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '@vuelidate/validators'

import FormInput from '../Forms/FormInput.vue'

import userService from '../../services/userService'

export default {
    name: 'ConfirmInvitation',
    components: { FormInput },
    setup() {
        const { t } = useI18n()
        const route = useRoute()
        const token = route?.query?.token

        const password = ref(import.meta.env.VITE_PREFILL_PASSWORD || '')
        const success = ref(false)
        const error = ref('')

        const confirmPassword = async () => {
            const confirmedPassword = await userService.confirmPassword(
                token,
                password.value,
            )

            if (confirmedPassword.id) {
                success.value = true
            } else {
                error.value = confirmedPassword.data
            }
        }

        return {
            password,
            t,
            token,
            validator: useVuelidate(),
            confirmPassword,
            success,
            error,
        }
    },
    validations: {
        password: {
            required,
            minLength: minLength(12),
            maxLength: maxLength(25),
        },
    },
}
</script>

<style scoped></style>
