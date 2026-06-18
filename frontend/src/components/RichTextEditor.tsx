'use client';

import { RichTextEditor as MantineEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  return (
    <MantineEditor editor={editor} mih={300}>
      <MantineEditor.Toolbar sticky>
        <MantineEditor.ControlsGroup>
          <MantineEditor.Bold />
          <MantineEditor.Italic />
          <MantineEditor.Strikethrough />
          <MantineEditor.Code />
        </MantineEditor.ControlsGroup>

        <MantineEditor.ControlsGroup>
          <MantineEditor.H1 />
          <MantineEditor.H2 />
          <MantineEditor.H3 />
        </MantineEditor.ControlsGroup>

        <MantineEditor.ControlsGroup>
          <MantineEditor.Blockquote />
          <MantineEditor.Hr />
          <MantineEditor.BulletList />
          <MantineEditor.OrderedList />
        </MantineEditor.ControlsGroup>

        <MantineEditor.ControlsGroup>
          <MantineEditor.Link />
          <MantineEditor.Unlink />
        </MantineEditor.ControlsGroup>
      </MantineEditor.Toolbar>

      <MantineEditor.Content />
    </MantineEditor>
  );
}
