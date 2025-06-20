import React from 'react'
import { Loader } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const spinnerVariants = cva("text-muted-foreground animate-spin", {
  variants: {
    size: {
      default: "h-4 w-4",
      sm: "h-2 w-2",
      lg: "h-6 w-6",
      icon: "h-10 h-10",
    }
  },
  defaultVariants: {
    size: "default",
  }
})

const Spinner = ({ size }: VariantProps<typeof spinnerVariants>) => {
  return <Loader className={cn(spinnerVariants({ size }))} />
}

export default Spinner
