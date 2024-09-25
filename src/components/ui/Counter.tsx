'use client'
import { useState } from 'react'
import { IconButton } from '@/components'
import { IconButtonShape, Size } from '@/interfaces'
import { useUiStore } from '@/store/ui-store'

interface Props {
	value: number
  onQuantityChange: ( newQuantity: number ) => void
  acceptZero?: boolean
}

const MAX_ITEMS = 10
const MIN_ITEMS = 0

export const Counter = ({ value, onQuantityChange, acceptZero }: Props) => {

  const [ quantity, setQuantity ] = useState( value )
  const { closeModal } = useUiStore()
  
  const handleIncrease = () => {
    if ( quantity < MAX_ITEMS ) {
      const newQuantity = quantity + 1
      setQuantity( newQuantity )
      onQuantityChange( newQuantity )
    }
  }

  const handleDecrease = () => {
    if ( quantity > MIN_ITEMS ) {
      const newQuantity = quantity - 1
      setQuantity( newQuantity )
      onQuantityChange( newQuantity )
    }
  }

  const handleCloseModal = () => {
    closeModal()
    setTimeout(() => {
      setQuantity(1)
      window.history.back()
    }, 300)
  }

  return (
    <div className="flex items-center gap-2 bg-gray50 rounded">
      {
        quantity === 1 && !acceptZero ?
        <IconButton
          size={ Size.LG }
          shape={ IconButtonShape.SQUARE }
          iconName='trash'
          onClick={ handleCloseModal }
        />
        :
        <IconButton
          disabled={ MIN_ITEMS === quantity }
          size={ Size.LG }
          shape={ IconButtonShape.SQUARE }
          iconName='minus-small'
          onClick={ handleDecrease }
        />
      }
      <span className="min-w-6 text-center">{ quantity }</span>			
      <IconButton
        disabled={ MAX_ITEMS === quantity }
        size={ Size.LG }
        shape={ IconButtonShape.SQUARE }
        iconName='plus-small'
        onClick={ handleIncrease }
      />
    </div>
  )
}