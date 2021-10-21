<template>
    <div class="tiptap">
        <div v-if="editor" class="toolbar bg-gray-200">
            <button
                class="
                    text-black
                    px-2
                    py-1
                    text-sm
                    flex-auto
                    pointer
                    bg-gray-500
                "
                :class="{ 'is-active': editor.isActive('bold') }"
                @click="editor.chain().focus().toggleBold().run()"
            >
                bold
            </button>
            <button
                class="
                    text-black
                    px-2
                    py-1
                    text-sm
                    flex-auto
                    pointer
                    bg-gray-500
                "
                :class="{ 'is-active': editor.isActive('italic') }"
                @click="editor.chain().focus().toggleItalic().run()"
            >
                italic
            </button>
            <!-- <button
                :class="{ 'is-active': editor.isActive('strike') }"
                @click="editor.chain().focus().toggleStrike().run()"
            >
                strike
            </button>
            <button
                :class="{ 'is-active': editor.isActive('code') }"
                @click="editor.chain().focus().toggleCode().run()"
            >
                code
            </button> -->
            <!-- <button @click="editor.chain().focus().unsetAllMarks().run()">
                clear marks
            </button>
            <button @click="editor.chain().focus().clearNodes().run()">
                clear nodes
            </button> -->
            <!-- <button
                :class="{ 'is-active': editor.isActive('paragraph') }"
                @click="editor.chain().focus().setParagraph().run()"
            >
                paragraph
            </button> -->
            <!-- <button
                :class="{
                    'is-active': editor.isActive('heading', { level: 1 }),
                }"
                @click="
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                "
            >
                h1
            </button>
            <button
                :class="{
                    'is-active': editor.isActive('heading', { level: 2 }),
                }"
                @click="
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                "
            >
                h2
            </button>
            <button
                :class="{
                    'is-active': editor.isActive('heading', { level: 3 }),
                }"
                @click="
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                "
            >
                h3
            </button>
            <button
                :class="{
                    'is-active': editor.isActive('heading', { level: 4 }),
                }"
                @click="
                    editor.chain().focus().toggleHeading({ level: 4 }).run()
                "
            >
                h4
            </button>
            <button
                :class="{
                    'is-active': editor.isActive('heading', { level: 5 }),
                }"
                @click="
                    editor.chain().focus().toggleHeading({ level: 5 }).run()
                "
            >
                h5
            </button>
            <button
                :class="{
                    'is-active': editor.isActive('heading', { level: 6 }),
                }"
                @click="
                    editor.chain().focus().toggleHeading({ level: 6 }).run()
                "
            >
                h6
            </button> -->
            <button
                class="
                    text-black
                    px-2
                    py-1
                    text-sm
                    flex-auto
                    pointer
                    bg-gray-500
                "
                :class="{ 'is-active': editor.isActive('bulletList') }"
                @click="editor.chain().focus().toggleBulletList().run()"
            >
                bullet list
            </button>
            <button
                class="
                    text-black
                    px-2
                    py-1
                    text-sm
                    flex-auto
                    pointer
                    bg-gray-500
                "
                :class="{ 'is-active': editor.isActive('orderedList') }"
                @click="editor.chain().focus().toggleOrderedList().run()"
            >
                ordered list
            </button>
            <!-- <button
                :class="{ 'is-active': editor.isActive('codeBlock') }"
                @click="editor.chain().focus().toggleCodeBlock().run()"
            >
                code block
            </button> -->
            <!-- <button
                :class="{ 'is-active': editor.isActive('blockquote') }"
                @click="editor.chain().focus().toggleBlockquote().run()"
            >
                blockquote
            </button>
            <button @click="editor.chain().focus().setHorizontalRule().run()">
                horizontal rule
            </button>
            <button @click="editor.chain().focus().setHardBreak().run()">
                hard break
            </button> -->
            <button
                class="
                    text-black
                    px-2
                    py-1
                    text-sm
                    flex-auto
                    pointer
                    bg-gray-500
                "
                @click="editor.chain().focus().undo().run()"
            >
                undo
            </button>
            <!-- <button @click="editor.chain().focus().redo().run()">redo</button> -->
        </div>
        <editor-content
            :editor="editor"
            class="bg-gray-50 border-black border"
        ></editor-content>
    </div>
</template>
<script>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

export default {
    name: 'TipTap',
    components: { EditorContent },
    props: {
        value: {
            type: String,
            required: true,
        },
    },
    emits: ['update:value'],
    setup(props, { emit }) {
        const editor = useEditor({
            content: props.value,
            extensions: [StarterKit],
            onUpdate({ editor }) {
                emit('update:value', editor.getHTML())
                console.log(editor.getHTML())
            },
        })
        return {
            editor,
        }
    },
}
</script>
<style scoped>
button {
    margin: 5px;
}
</style>
