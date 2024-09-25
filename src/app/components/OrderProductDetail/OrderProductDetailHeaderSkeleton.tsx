'use client'
import { Skeleton } from '@mui/material'

export const OrderProductDetailHeaderSkeleton = () => {
  return (
    <>
    <div className="flex gap-4 items-center">
      <Skeleton variant='text' width={ 240 } height={ 32 } />
      <Skeleton variant='text' width={ 80 } height={ 32 } />
    </div>
    <Skeleton variant='text' width={ '90%' } />
    <Skeleton variant='text' width={ '30%' } />
    </>
  )
}