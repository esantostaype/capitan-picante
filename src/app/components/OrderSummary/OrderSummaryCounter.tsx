'use client'
import { useOrderStore } from '@/store/order-store'
import { IconButton } from '@/components'
import { IconButtonShape, OrderItem, Size, Variant } from '@/interfaces'

interface Props {
	item: OrderItem
	currentValue: number
}

const MAX_ITEMS = 10
const MIN_ITEMS = 1

export const OrderSummaryCounter = ({ item, currentValue }: Props) => {
	const increaseQuantity = useOrderStore(( state ) => state.increaseQuantity )
  const decreaseQuantity = useOrderStore(( state ) => state.decreaseQuantity )
  
  const handleIncrease = () => {
    if ( currentValue < MAX_ITEMS ) {
      increaseQuantity( item.id, item.uniqueId )
    }
	}
	
	const handleDecrease = () => {
    decreaseQuantity( item.id, item.uniqueId )
	}

  return (
    <div className="flex items-center gap-2">
      <IconButton
        size={ Size.SM }
        variant={ Variant.GHOST }
        shape={ IconButtonShape.SQUARE }
        iconName={ currentValue === 1 ? 'trash' : 'minus-small' }
        onClick={ handleDecrease }
      />
      <span className="min-w-6 text-center">{ currentValue }</span>			
      <IconButton
        disabled={ MAX_ITEMS === currentValue }
        size={ Size.SM }
        variant={ Variant.GHOST }
        shape={ IconButtonShape.SQUARE }
        iconName='plus-small'
        onClick={ handleIncrease }
      />
    </div>
  )
}