'use client';

import { Toggle } from '@/components/ui/toggle';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Strikethrough, Underline } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Underline as TipTapUnderline } from '@tiptap/extension-underline';

const Tiptap = ({ value }: { value: string }) => {
  const { setValue } = useFormContext();
  const editor = useEditor({
    extensions: [
      TipTapUnderline,
      Placeholder.configure({
        placeholder: 'Add a longer description for your products',
        emptyNodeClass:
          'first:before:text-gray-600 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none',
      }),
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4',
          },
        },

        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-4',
          },
        },
      }),
    ],
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setValue('description', content, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      },
    },
    content: value,
    immediatelyRender: false,
  });

  const buttons = useMemo(
    () => [
      {
        name: 'bold',
        icon: <Bold width={16} height={16} />,
        toggle: () => editor?.chain().focus().toggleBold().run(),
      },
      {
        name: 'italic',
        icon: <Italic width={16} height={16} />,
        toggle: () => editor?.chain().focus().toggleItalic().run(),
      },
      {
        name: 'underline',
        icon: <Underline width={16} height={16} />,
        toggle: () => editor?.chain().focus().toggleUnderline().run(),
      },
      {
        name: 'strike',
        icon: <Strikethrough width={16} height={16} />,
        toggle: () => editor?.chain().focus().toggleStrike().run(),
      },
      {
        name: 'orderedList',
        icon: <ListOrdered width={16} height={16} />,
        toggle: () => editor?.chain().focus().toggleOrderedList().run(),
      },
      {
        name: 'bulletList',
        icon: <List width={16} height={16} />,
        toggle: () => editor?.chain().focus().toggleBulletList().run(),
      },
    ],
    [editor],
  );

  useEffect(() => {
    if (editor?.isEmpty) editor.commands.setContent(value);
  }, [value]);

  return (
    <div className='flex flex-col gap-2'>
      {editor && (
        <div className='rounded-md border border-input'>
          {buttons.map((button) => (
            <Toggle
              key={button.name}
              pressed={editor.isActive(button.name)}
              onPressedChange={button.toggle}
              size='sm'
            >
              {button.icon}
            </Toggle>
          ))}
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
