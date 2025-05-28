
"use-client"
import React from 'react'
import {AlertDialog,AlertDialogContent,AlertDialogAction,AlertDialogHeader,AlertDialogTrigger,AlertDialogCancel,AlertDialogDescription, AlertDialogFooter}  from '@/components/ui/alert-dialog'
import { AlertDialogTitle } from '@radix-ui/react-alert-dialog'



interface ConfirmModalProps {
    children:React.ReactNode,
    onConfirm:()=>void
}

const ConfirmModal = ({children,onConfirm}:ConfirmModalProps) => {

    const handleConfirm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        e.stopPropagation();
        onConfirm();
    }

  return (
    <AlertDialog>
        <AlertDialogTrigger onClick={(e)=>{e.stopPropagation()}} asChild>
            {children}
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={(e)=>{e.stopPropagation()}}>
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirm}>
                    Confirm
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      
    </AlertDialog>
  )
}

export default ConfirmModal
