"use client";
import { Doc } from "@/convex/_generated/dataModel";
import React, { useRef, useState } from "react";
import IconPicker from "./icon-picker";
import { Button } from "@/components/ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextareaAutoSize  from 'react-textarea-autosize'
import { useCoverImage } from "@/hooks/use-cover-image";

interface ToolbarProps {
  initialData: Doc<"documents">;
  preview?: boolean;
}


const Toolbar = ({ initialData, preview }: ToolbarProps) => {

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(initialData.title);
    const update = useMutation(api.documents.update);
    const removeIcon = useMutation(api.documents.removeIcon);
    const coverImage = useCoverImage()
    const enableInput = () => {
        if(preview) return;

        setIsEditing(true);
        setTimeout(() => {
            setValue(initialData.title)
            inputRef.current?.focus()  
        });
    }

    const disableInput = ()=>setIsEditing(false)


    const onInput = (value:string) => {
        setValue(value)
        update({
            id:initialData._id,
            title:value || "Untitled"
        })
    }


    const onKeyDown = (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === "Enter"){
            e.preventDefault();
            disableInput()
        }
    }

    const onIconSelect = (icon:string) => {
        update({
            id:initialData._id,
            icon
        })
    }

    const onRemoveIcon = () => {
        removeIcon({id:initialData._id})
    }
 
  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker onChange={onIconSelect}>
            <Button
              size={"sm"}
              variant="outline"
              className="text-muted-foreground text-xs"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}

        {!initialData.coverImage && !preview && (
          <Button
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
            onClick={coverImage.onOpen}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Add cover
          </Button>
        )}
      </div>
      {
        isEditing && !preview ? (
            <TextareaAutoSize 
            ref={inputRef} 
            onBlur={disableInput} 
            value={value}
            onKeyDown={onKeyDown} 
            onChange={(e)=>onInput(e.target.value)}
            className="text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#CFCFCF] resize-none"
            />
        ):
        (
            <div className="pb-[11.5px] text-5xl font-bold break-words text-[#3f3f3f] dark:text-[#CFCFCF]" onClick={enableInput}>
                {initialData.title}
            </div>
        )
      }
    </div>
  );
};

export default Toolbar;
