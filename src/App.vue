<template>
    <div class="h-screen bg-gray-50 flex overflow-hidden">
        <!-- Narrow sidebar -->
        <main-menu />

        <!-- Content area -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="w-full">
                <div
                    class="
                        relative
                        z-10
                        flex-shrink-0
                        h-16
                        bg-white
                        border-b border-gray-200
                        shadow-sm
                        flex
                    "
                >
                    <button
                        type="button"
                        class="
                            border-r border-gray-200
                            px-4
                            text-gray-500
                            focus:outline-none
                            focus:ring-2
                            focus:ring-inset
                            focus:ring-blue-500
                            md:hidden
                        "
                        @click="mobileMenuOpen = true"
                    >
                        <span class="sr-only">Open sidebar</span>
                        <MenuAlt2Icon class="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div class="flex-1 flex justify-between px-4 sm:px-6">
                        <div class="flex-1 flex">
                            <form
                                class="w-full flex md:ml-0"
                                action="#"
                                method="GET"
                            >
                                <label for="search-field" class="sr-only">
                                    Search all files
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
                                        :placeholder="$t('search')"
                                        type="search"
                                    />
                                </div>
                            </form>
                        </div>
                        <div
                            class="
                                ml-2
                                flex
                                items-center
                                space-x-4
                                sm:ml-6 sm:space-x-6
                            "
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
                                        class="
                                            origin-top-right
                                            absolute
                                            right-0
                                            mt-2
                                            w-48
                                            rounded-md
                                            shadow-lg
                                            py-1
                                            bg-white
                                            ring-1 ring-black ring-opacity-5
                                            focus:outline-none
                                        "
                                    >
                                        <MenuItem
                                            v-for="item in userNavigation"
                                            :key="item.name"
                                            v-slot="{ active }"
                                        >
                                            <a
                                                :href="item.href"
                                                :class="[
                                                    active ? 'bg-gray-100' : '',
                                                    'block px-4 py-2 text-sm text-gray-700',
                                                ]"
                                            >
                                                {{ item.name }}
                                            </a>
                                        </MenuItem>
                                    </MenuItems>
                                </transition>
                            </Menu>

                            <button
                                type="button"
                                class="
                                    flex
                                    bg-blue-600
                                    p-2
                                    rounded-full
                                    items-center
                                    justify-center
                                    text-white
                                    hover:bg-blue-700
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-offset-2
                                    focus:ring-blue-500
                                "
                            >
                                <UserIcon class="h-5 w-5" aria-hidden="true" />
                                <span class="sr-only">{{ t('users', 1) }}</span>
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
                        class="
                            min-w-0
                            flex-1
                            h-full
                            flex flex-col
                            overflow-scroll
                            lg:order-last
                        "
                    >
                        <router-view v-if="!loadingApp" />
                        <div v-else>Loading app ...</div>
                    </section>
                </main>
            </div>
        </div>
    </div>
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
import { MenuAlt2Icon, PlusIcon, XIcon, UserIcon } from '@heroicons/vue/outline'
import { SearchIcon } from '@heroicons/vue/solid'
import MainMenu from './components/MainMenu.vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Sign out', href: '#' },
]

export default {
    components: {
        MainMenu,
        Dialog,
        DialogOverlay,
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
    },
    setup() {
        const mobileMenuOpen = ref(false)
        const store = useStore()
        const loadingApp = ref(true)
        const { t } = useI18n()

        onMounted(async () => {
            await store.dispatch('languages/getAllLanguagesAndUpdateStore')
            await store.dispatch(
                'elementTypes/getAllElementTypesAndUpdateStore',
            )
            await store.dispatch('surveyElements/getSurveyElements')
            await store.dispatch('assets/getAssets')
            loadingApp.value = false
        })

        return {
            userNavigation,
            mobileMenuOpen,
            loadingApp,
            t,
        }
    },
}
</script>
