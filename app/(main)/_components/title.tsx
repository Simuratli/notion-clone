import { Doc } from '@/convex/_generated/dataModel'
import React, { useRef, useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

interface TitleProps {
    initialData:Doc<"documents">
}

const Title = ({initialData}:TitleProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState(initialData.title || "Untitled")

    const update = useMutation(api.documents.update);
    const [isEditing, setIsEditing] = useState(false)


    const enableInput  = () => {
        setTitle(initialData.title);
        setIsEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.setSelectionRange(0,inputRef.current.value.length)
        }, 0);
    }


    const disableInput = () => {
        setIsEditing(false)
    }


    const onChange = (event:React.ChangeEvent<HTMLInputElement>)=>{
        setTitle(event.target.value)
        const promise = update({
            id:initialData._id,
            title:event.target.value || "Untitled"
        })

        toast.promise(promise,{
            success:"Updated Successfully",
            error:"Something went wrong",
        })
    }


    const onKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter"){
            disableInput()
        }
    }
 
  return (
    <div className='flex items-center gap-x-1'>
      { !!initialData.icon && <p>{initialData.icon}</p> }
        {isEditing ? <Input
        ref={inputRef}
        onClick={enableInput}
        onBlur={disableInput}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={title}
         className='h-7 px-2 focus-visible:ring-transparent'
        />: (
            <Button
                onClick={enableInput}
                variant={"ghost"}
                size={"sm"}
                className='font-normal h-auto p-1 cursor-pointer'
            >
                <span className='truncate'>
                {initialData?.title}
                </span>
            </Button>
        )}
    </div>
  )
}

export default Title


Title.Skeleton = function TitleSkeletopn () {
    return(
        <Skeleton className='h-9 w-24 rounded-md'/>
    )
}
