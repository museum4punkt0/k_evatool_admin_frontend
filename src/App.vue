<template>
    <template v-if="store.state.appInfo?.status === 'ready'">
        <div class="h-screen bg-gray-50 flex overflow-hidden">
            <!-- Narrow sidebar -->
            <main-menu />

            <!-- Content area -->
            <div class="flex-1 flex flex-col overflow-hidden">
                <header class="w-full">
                    <div
                        class="relative z-5 flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm flex"
                    >
                        <button
                            v-if="store.state.users.user"
                            type="button"
                            class="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
                            @click="mobileMenuOpen = true"
                        >
                            <span class="sr-only">Open sidebar</span>
                            <MenuAlt2Icon class="h-6 w-6" aria-hidden="true" />
                        </button>
                        <div
                            v-if="store.state.users.user"
                            class="flex-1 flex justify-between px-4 sm:px-6"
                        >
                            <div class="flex-1 flex">
                                <!--                            <form
                  class="w-full flex md:ml-0"
                  action="#"
                  method="GET"
              >
                  <label for="search-field" class="sr-only">
                      &lt;!&ndash;                                    Search all files&ndash;&gt;
                  </label>
                  <div
                      class="
                          relative
                          w-full
                          text-gray-400
                          focus-within:text-gray-600
                      "
                  >
                      <div
                          class="
                              pointer-events-none
                              absolute
                              inset-y-0
                              left-0
                              flex
                              items-center
                          "
                      >
                          <SearchIcon
                              class="flex-shrink-0 h-5 w-5"
                              aria-hidden="true"
                          />
                      </div>
                      <input
                          id="search-field"
                          name="search-field"
                          class="
                              h-full
                              w-full
                              border-transparent
                              py-2
                              pl-8
                              pr-3
                              text-base text-gray-900
                              placeholder-gray-500
                              focus:outline-none
                              focus:ring-0
                              focus:border-transparent
                              focus:placeholder-gray-400
                          "
                          :placeholder="t('search')"
                          type="search"
                      />
                  </div>
              </form>-->
                            </div>
                            <div
                                class="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6"
                            >
                                <!-- Profile dropdown -->
                                <Menu as="div" class="relative flex-shrink-0">
                                    <!--                                <div>
    <MenuButton
        class="
            bg-white
            rounded-full
            flex
            text-sm
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            focus:ring-blue-500
        "
    >
        <span class="sr-only">
            Open user menu
        </span>

        <img
            class="h-8 w-8 rounded-full"
            src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
            alt=""
        />
    </MenuButton>
</div>-->
                                    <transition
                                        enter-active-class="transition ease-out duration-100"
                                        enter-from-class="transform opacity-0 scale-95"
                                        enter-to-class="transform opacity-100 scale-100"
                                        leave-active-class="transition ease-in duration-75"
                                        leave-from-class="transform opacity-100 scale-100"
                                        leave-to-class="transform opacity-0 scale-95"
                                    >
                                        <MenuItems
                                            class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        >
                                            <MenuItem
                                                v-for="item in userNavigation"
                                                :key="item.name"
                                                v-slot="{ active }"
                                            >
                                                <a
                                                    :href="item.href"
                                                    :class="[
                                                        active
                                                            ? 'bg-gray-100'
                                                            : '',
                                                        'block px-4 py-2 text-sm text-gray-700',
                                                    ]"
                                                >
                                                    {{ item.name }}
                                                </a>
                                            </MenuItem>
                                        </MenuItems>
                                    </transition>
                                </Menu>

                                <span class="text-xs text-gray-500 text-right">
                                    Admin-App: {{ version }}
                                    <br />
                                    Backend:
                                    {{ store.state.app.packageVersion }}
                                </span>
                                <language-switch></language-switch>
                                <button
                                    type="button"
                                    class="secondary flex p-2 px-4 rounded-full items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2"
                                    @click="logoutUser"
                                >
                                    <span class="text-sm mr-2">Logout</span>
                                    <LogoutIcon
                                        class="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                    <span class="sr-only">
                                        {{ t('users', 1) }}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Main content -->
                <div class="flex-1 flex items-stretch overflow-hidden">
                    <main class="flex-1 overflow-y-auto">
                        <!-- Primary column -->
                        <section
                            aria-labelledby="primary-heading"
                            class="min-w-0 flex-1 h-full flex flex-col overflow-scroll lg:order-last"
                        >
                            <router-view v-if="!loadingApp" />
                            <div v-else class="p-3 text-3xl">
                                {{ t('loading_app') }} ...
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
        <notifications></notifications>
        <div
            v-if="viewportIncompatible"
            class="absolute top-0 left-0 h-screen w-screen bg-gray-100 flex flex-col justify-center items-center p-12"
        >
            <exclamation-icon class="m-3 h-20 w-20 text-red-600" />
            <h1 class="text-red-600 text-center">
                {{ t('viewport_incompatible') }}
            </h1>
        </div>
    </template>
    <template v-else>
        {{ store.state.appInfo }}
    </template>
</template>

<script>
import { onMounted, ref } from 'vue'
import {
    Dialog,
    DialogOverlay,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'
import {
    MenuAlt2Icon,
    PlusIcon,
    XIcon,
    UserIcon,
    LogoutIcon,
    ExclamationIcon,
} from '@heroicons/vue/outline'
import { SearchIcon } from '@heroicons/vue/solid'
import MainMenu from './components/MainMenu.vue'
import Notifications from './components/Notifications/Notifications.vue'
import LanguageSwitch from './components/UserLanguageSwitch.vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Sign out', href: '#' },
]

import { version } from '../package.json'

export default {
    components: {
        MainMenu,
        Dialog,
        DialogOverlay,
        ExclamationIcon,
        Menu,
        MenuButton,
        MenuItem,
        MenuItems,
        TransitionChild,
        TransitionRoot,
        MenuAlt2Icon,
        PlusIcon,
        SearchIcon,
        XIcon,
        UserIcon,
        LogoutIcon,
        Notifications,
        LanguageSwitch,
    },
    setup() {
        const mobileMenuOpen = ref(false)
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const loadingApp = ref(true)
        const { t } = useI18n()
        let viewportIncompatible = ref(false)

        const dedicatedRoutes = ['/confirm-invitation']

        store.dispatch('getApp')

        const checkLogin = async () => {
            await store.dispatch('users/checkLogin')
            if (store.state.users.user) {
                await loadApp()
            } else {
                await router.push('/login')
                loadingApp.value = false
            }
        }

        router.beforeEach(() => {
            console.log(navigator.userAgent)
            viewportIncompatible.value =
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent,
                ) || window.outerWidth <= 1024
        })

        const loadApp = async () => {
            await store.dispatch('languages/getLanguages')
            await store.dispatch('elementTypes/getElementTypes')
            await store.dispatch('surveyElements/getSurveyElements')
            await store.dispatch('assets/getAssets')
            await store.dispatch('surveySettings/getSettings')
            loadingApp.value = false
        }

        const logoutUser = async () => {
            await store.dispatch('users/logoutUser')
        }

        onMounted(() => {
            setTimeout(async () => {
                if (dedicatedRoutes.includes(route.path)) {
                    loadingApp.value = false
                } else {
                    await checkLogin()
                }
            }, 0)
        })

        return {
            userNavigation,
            mobileMenuOpen,
            loadingApp,
            t,
            store,
            logoutUser,
            version,
            viewportIncompatible,
        }
    },
}
</script>
