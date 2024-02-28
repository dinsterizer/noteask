import { slashCommand } from './slash-command'
import type * as _A from '.pnpm/@tiptap+extension-horizontal-rule@2.2.4_@tiptap+core@2.2.4_@tiptap+pm@2.2.4/node_modules/@tiptap/extension-horizontal-rule'
import type * as _B from '.pnpm/@tiptap+extension-link@2.2.4_@tiptap+core@2.2.4_@tiptap+pm@2.2.4/node_modules/@tiptap/extension-link'
import type * as _C from '.pnpm/@tiptap+extension-placeholder@2.0.3_@tiptap+core@2.2.4_@tiptap+pm@2.2.4/node_modules/@tiptap/extension-placeholder'
import type * as _D from '.pnpm/@tiptap+starter-kit@2.2.4_@tiptap+pm@2.2.4/node_modules/@tiptap/starter-kit'
import { cx } from 'class-variance-authority'
import {
  TiptapImage,
  TiptapLink,
  UpdatedImage,
  TaskList,
  TaskItem,
  HorizontalRule,
  StarterKit,
  Placeholder,
} from 'novel/extensions'
import { UploadImagesPlugin } from 'novel/plugins'

//TODO I am using cx here to get tailwind autocomplete working, idk if someone else can write a regex to just capture the class key in objects

//You can overwrite the placeholder with your own configuration
const placeholder = Placeholder
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      'text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer',
    ),
  },
})

const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [UploadImagesPlugin()]
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: cx('rounded-lg border border-muted'),
  },
})

const updatedImage = UpdatedImage.configure({
  HTMLAttributes: {
    class: cx('rounded-lg border border-muted'),
  },
})

const taskList = TaskList.configure({
  HTMLAttributes: {
    class: cx('not-prose pl-2'),
  },
})
const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: cx('flex items-start my-4'),
  },
  nested: true,
})

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx('mt-4 mb-6 border-t border-muted-foreground'),
  },
})

const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: cx('list-disc list-outside leading-3 -mt-2'),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx('list-decimal list-outside leading-3 -mt-2'),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx('leading-normal -mb-2'),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx('border-l-4 border-primary'),
    },
  },
  codeBlock: {
    HTMLAttributes: {
      class: cx('rounded-sm bg-muted border p-5 font-mono font-medium'),
    },
  },
  code: {
    HTMLAttributes: {
      class: cx('rounded-md bg-muted  px-1.5 py-1 font-mono font-medium'),
      spellcheck: 'false',
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: '#DBEAFE',
    width: 4,
  },
  gapcursor: false,
})

export const defaultExtensions = [
  starterKit,
  placeholder,
  tiptapLink,
  tiptapImage,
  updatedImage,
  taskList,
  taskItem,
  horizontalRule,
  slashCommand,
]
