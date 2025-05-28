"use client";

import React from "react";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { PartialBlock } from "@blocknote/core";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";
interface BlockNoteEditorProps {
  onChange: (content: string) => void;
  initialData: string | undefined;
  editable?: boolean;
}

const Editor = ({ initialData, onChange, editable }: BlockNoteEditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
 


  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file,
    });

    return response.url;
  };


   const editor = useCreateBlockNote({
    initialContent: initialData
      ? (JSON.parse(initialData) as PartialBlock[])
      : undefined,
      uploadFile: handleUpload,
  });


  
  editor.onChange((editor) => {
    const fullContent = editor.document;
    onChange(JSON.stringify(fullContent));
  });

  return (
    <BlockNoteView
    editable={editable}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      editor={editor}
      className="w-full h-full"
    />
  );
};

export default Editor;
