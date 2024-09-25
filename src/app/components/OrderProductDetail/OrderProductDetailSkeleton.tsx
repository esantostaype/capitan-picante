'use client'
import { ModalBody, SimpleSpinner } from '@/components'
import { Skeleton } from '@mui/material'

export const OrderProductDetailSkeleton = () => {
  return (
    <ModalBody>
      <div className="grid grid-cols-6 gap-8">
        <div className='col-span-2 sticky top-8'>
          <div className="relative z-20 bg-gray50 flex items-center justify-center rounded-lg w-full aspect-square animate-pulse animate-duration-1000">
          </div>
        </div>
        <div className='col-span-4 flex items-center justify-center'>
          <SimpleSpinner/>
        </div>
      </div>
    </ModalBody>
  )
}