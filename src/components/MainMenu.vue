<template>
    <div class="hidden w-28 bg-blue-900 overflow-y-auto md:block">
        <div class="w-full py-6 flex flex-col items-center">
            <div class="flex-shrink-0 flex items-center justify-center">
                <img class="h-12 w-auto" src="/logo.png" alt="Workflow" />
            </div>
            <div
                v-if="store.state.users.user"
                class="flex-1 mt-6 w-full px-2 space-y-1"
            >
                <template v-for="item in sidebarNavigation" :key="item.name">
                    <router-link
                        v-if="
                            !item.admin ||
                            (item.admin &&
                                store.state.users.user.role.includes('admin'))
                        "
                        :to="item.href"
                        class="text-blue-100 hover:bg-blue-800 hover:text-white group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium"
                        :aria-current="item.current ? 'page' : undefined"
                    >
                        <component
                            :is="item.icon"
                            :class="['h-6 w-6']"
                            aria-hidden="true"
                        />
                        <span class="mt-2 text-center capitalize">
                            {{ t(item.name, 2) }}
                        </span>
                    </router-link>
                </template>
            </div>
        </div>
    </div>

    <!-- Mobile menu -->
    <TransitionRoot as="template" :show="mobileMenuOpen">
        <Dialog as="div" class="md:hidden" @close="mobileMenuOpen = false">
            <div class="fixed inset-0 z-40 flex">
                <TransitionChild
                    as="template"
                    enter="transition-opacity ease-linear duration-300"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <DialogOverlay
                        class="fixed inset-0 bg-gray-600 bg-opacity-75"
                    />
                </TransitionChild>
                <TransitionChild
                    as="template"
                    enter="transition ease-in-out duration-300 transform"
                    enter-from="-translate-x-full"
                    enter-to="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leave-from="translate-x-0"
                    leave-to="-translate-x-full"
                >
                    <div
                        class="relative max-w-xs w-full bg-blue-900 pt-5 pb-4 flex-1 flex flex-col"
                    >
                        <TransitionChild
                            as="template"
                            enter="ease-in-out duration-300"
                            enter-from="opacity-0"
                            enter-to="opacity-100"
                            leave="ease-in-out duration-300"
                            leave-from="opacity-100"
                            leave-to="opacity-0"
                        >
                            <div class="absolute top-1 right-0 -mr-14 p-1">
                                <button
                                    type="button"
                                    class="h-12 w-12 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
                                    @click="mobileMenuOpen = false"
                                >
                                    <XIcon
                                        class="h-6 w-6 text-white"
                                        aria-hidden="true"
                                    />
                                    <span class="sr-only">Close sidebar</span>
                                </button>
                            </div>
                        </TransitionChild>
                        <div class="flex-shrink-0 px-4 flex items-center">
                            <img
                                class="h-8 w-auto"
                                src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
                                alt="Workflow"
                            />
                        </div>
                        <div class="mt-5 flex-1 h-0 px-2 overflow-y-auto">
                            <nav class="h-full flex flex-col">
                                <div class="space-y-1">
                                    <a
                                        v-for="item in sidebarNavigation"
                                        :key="item.name"
                                        :href="item.href"
                                        :class="[
                                            item.current
                                                ? 'bg-blue-800 text-white'
                                                : 'text-blue-100 hover:bg-blue-800 hover:text-white',
                                            'group py-2 px-3 rounded-md flex items-center text-sm font-medium',
                                        ]"
                                        :aria-current="
                                            item.current ? 'page' : undefined
                                        "
                                    >
                                        <component
                                            :is="item.icon"
                                            :class="[
                                                item.current
                                                    ? 'text-white'
                                                    : 'text-blue-300 group-hover:text-white',
                                                'mr-3 h-6 w-6',
                                            ]"
                                            aria-hidden="true"
                                        />
                                        <span
                                            class="text-center"
                                            v-html="item.name"
                                        />
                                    </a>
                                </div>
                            </nav>
                        </div>
                    </div>
                </TransitionChild>
                <div class="flex-shrink-0 w-14" aria-hidden="true">
                    <!-- Dummy element to force sidebar to shrink to fit close icon -->
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script>
import {
    TransitionChild,
    TransitionRoot,
    Dialog,
    DialogOverlay,
    Menu,
    MenuButton,
    MenuItem,
} from '@headlessui/vue'

import {
    ChartBarIcon,
    HomeIcon,
    PhotographIcon,
    ViewGridIcon,
    PresentationChartLineIcon,
    UsersIcon,
    GlobeAltIcon,
    CogIcon,
    XIcon,
    AcademicCapIcon,
} from '@heroicons/vue/outline'

import { ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
    name: 'MainMenu',
    components: {
        ChartBarIcon,
        CogIcon,
        TransitionRoot,
        TransitionChild,
        XIcon,
        Dialog,
        DialogOverlay,
        Menu,
        MenuItem,
        MenuButton,
        AcademicCapIcon,
    },
    setup() {
        const mobileMenuOpen = ref(false)
        const store = useStore()
        const { t } = useI18n()

        const sidebarNavigation = [
            { name: 'start', href: '/', icon: HomeIcon },
            {
                name: 'surveys',
                href: '/surveys',
                icon: PresentationChartLineIcon,
            },
            {
                name: 'elements',
                href: '/survey-elements',
                icon: ViewGridIcon,
            },
            {
                name: 'assets',
                href: '/assets',
                icon: PhotographIcon,
            },
            {
                name: 'languages',
                href: '/languages',
                icon: GlobeAltIcon,
            },
            {
                name: 'users',
                href: '/users',
                icon: UsersIcon,
            },
            {
                name: 'stats',
                href: '/stats',
                icon: ChartBarIcon,
            },
            {
                name: 'survey_settings',
                href: '/settings',
                icon: CogIcon,
            },
            {
                name: 'tutorial',
                href: '/tutorial',
                icon: AcademicCapIcon,
            },
        ]

        return {
            sidebarNavigation,
            mobileMenuOpen,
            store,
            t,
        }
    },
}
</script>

<style></style>
