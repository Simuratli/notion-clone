"use client"
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { PlusCircle } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const Documents = () => {
  const {user} = useUser()
  const create = useMutation(api.documents.create);
  const router = useRouter()

  const handleClickCreate = async () => {
    const promise = create({title: 'New Document'}).then((documentId)=>{
      router.push(`/documents/${documentId}`)
    })
    toast.promise(promise, {
      loading: 'Creating document...',
      success: 'Document created successfully!',
      error: `Error creating document`
    })
  }


  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
        <Image src="/empty.png" width={300} height={300}  alt='Empty' className='dark:hidden' />
        <Image src="/empty-dark.png" width={300} height={300}  alt='Empty' className='hidden dark:block' />
        <h2 className='text-lg font-medium'>Welcome to {user?.firstName}&apos;s Jotion</h2>
       <Button onClick={handleClickCreate}><PlusCircle className='h-4 w-4 mr-2'/> Create a note</Button>
    </div>
  )
}

export default Documents
