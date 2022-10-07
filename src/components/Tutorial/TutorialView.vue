<script setup>
import { videos } from './videos.json'
</script>

<template>
    <div class="flex flex-grow overflow-y-scroll">
        <main class="flex h-full w-full flex-col p-3">
            <h1 class="text">Tutorial-Videos</h1>
            <div class="grid grid-cols-4 gap-4">
                <div v-for="(video, v) in videos" :key="v" class="mt-5">
                    <h2 class="text-2xl">{{ v + 1 }}: {{ video.title }}</h2>
                    <video
                        poster="/logo.png"
                        preload="auto"
                        controls
                        class="mt-1 bg-blue-500"
                        :src="'/tutorial/videos/' + video.file"
                    />
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped lang="scss">
video {
    border: 1px solid black;
    width: 100%;
}
</style>
