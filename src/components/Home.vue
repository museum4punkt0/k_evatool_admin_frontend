<template>
    <div>
        <router-view></router-view>
        <div
            v-for="i in 10"
            :key="i"
            class="
                border-gray-600
                my-4
                max-w-md
                mx-auto
                bg-white
                rounded-xl
                shadow-md
                overflow-hidden
                md:max-w-2xl
            "
        >
            <div class="md:flex">
                <div class="md:flex-shrink-0">
                    <img
                        class="h-48 w-full object-cover md:h-full md:w-48"
                        :src="'https://picsum.photos/400/400?random=' + i"
                        alt="Man looking at item at a store"
                    />
                </div>
                <div class="p-8 py-3">
                    <h1 class="text-3xl uppercase">EV-Tool {{ i }}</h1>
                    <div
                        class="
                            uppercase
                            tracking-wide
                            text-sm text-indigo-500
                            font-bold
                        "
                    >
                        Case study {{ i }}
                    </div>
                    <a
                        href="#"
                        class="
                            block
                            mt-1
                            text-lg
                            leading-tight
                            font-medium
                            text-black
                            hover:underline
                        "
                    >
                        Finding customers for your new business
                    </a>
                    <p class="mt-2 text-gray-500">
                        Getting a new business off the ground is a lot of hard
                        work. Here are five ideas you can use to find your first
                        customers.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script></script>

<style></style>
