"use client"
import React from 'react'
import Cover from '@/components/cover'
import Toolbar from '@/components/toolbar'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import Editor from '@/components/editor'


const DocumentIdPage = () => {
  const params = useParams()
  const update = useMutation(api.documents.update)
 const documentId = params.documentId as Id<"documents">;
  const document = useQuery(api.documents.getById, {
    documentId
  })


  const onChange = (content: string) => {
    update({
      id: documentId,
      content: content
    })
  }

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className='md:max-w-3xl lg:max-w-4xl mx-auto mt-10'>
          <div className='space-y-4 pl-8 pt-4'>
            <Skeleton className='h-14 w-[50%]' />
            <Skeleton className='h-4 w-[80%]' />
            <Skeleton className='h-4 w-[40%]' />
            <Skeleton className='h-4 w-[70%]' />
          </div>
        </div>
      </div>
    )
  }

  if (document === null) {
    return <div>Not found</div>
  }

  return (
    <div className='pb-40'>
      <div className='h-[35vh]'>
        <Cover url={document.coverImage} />
      </div>
      <div className='md:max-w-3xl lg:max-w-4xl mx-auto'>
        <Toolbar initialData={document} />
        <Editor
          onChange={onChange}
          initialData={document.content}
        />
      </div>
    </div>
  )
}

export default DocumentIdPage
