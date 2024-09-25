import Image from 'next/image'
import { Product } from '@/interfaces'
import { formatCurrency } from '@/utils'
import { OrderSummaryCounter } from './OrderSummaryCounter'

interface Props {
  item: Product
}

export const OrderSummaryItem = ({ item }: Props ) => {
  return (
    <li>
      <div className="flex items-start gap-2 justify-between">
        <div className="flex items-start gap-2">
          <div className="w-12 h-12 flex-[0_0_3rem] relative">
            { item.image ? (
              <Image src={ item.image } alt={ item.name } width={ 48 } height={ 48 } className="object-cover aspect-square rounded-full" />
            ) : (
              <div className="bg-gray100 flex items-center justify-center w-12 h-12 rounded-full">
                <i className="fi fi-tr-image-slash text-gray600"></i>
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold leading-[1.25em] mb-1">{ item.name }</div>
            <div className="text-gray500">{ formatCurrency( item.price ) }</div>
          </div>
        </div>
        <div className='font-semibold flex-[0_0_5rem] text-right'>{ formatCurrency( item.subtotal || 0 ) }</div>  
      </div>
      <div className="flex flex-col gap-4 pl-14 mt-2">
        <div>
          { item.selectedVariations && (
            <div className="text-gray500 text-xs">
              { Object.entries( item.selectedVariations ).map(([variation, option]) => (
                <div key={variation}>{variation}: <span className="font-semibold">{option}</span></div>
              ))}
            </div>
          )}
        </div>
        <OrderSummaryCounter item={ item } currentValue={ item.quantity || 0 } />
      </div> 
    </li>
  )
}
