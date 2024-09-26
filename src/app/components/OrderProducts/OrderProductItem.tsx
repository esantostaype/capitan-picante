'use client'
import Image from 'next/image'
import { Product } from '@/interfaces'
import { formatCurrency, getMinVariantPrice } from '@/utils'
import Link from 'next/link'

interface Props {
  product: Product
}

export const OrderProductItem = ({ product } : Props ) => {

  const displayedPrice = getMinVariantPrice( product )
  const hasVariationPrices = displayedPrice !== product.price
    
  return (
    <li className="relative flex flex-col justify-between cursor-pointer group active:scale-[0.98] bg-surface group hover:bg-gray50 rounded-lg ">
      <Link href={`/product/${ product.id }`} className="flex flex-col flex-1">
        <div className="flex flex-1 gap-4 p-4 md:p-6">
          <div>
            <div className="relative z-20 bg-gray50 flex items-center justify-center rounded md:rounded-lg h-12 w-12 md:h-16 md:w-16 overflow-hidden">
            { product.image ? (
              <Image src={ product.image } alt={ product.name } width={ 128 } height={ 128 } className="object-cover aspect-square" />
            ) : (
              <i className="fi fi-tr-image-slash text-3xl text-gray500"></i>
            )}
            </div>
          </div>
          <div className='relative z-10 flex flex-col flex-1 w-full'>
            <div className="leading-tight">{ product.name }</div>
            <div className="flex items-center gap-1 mt-2 text-gray600">
              {
                hasVariationPrices &&
                <span className="leading-none">Desde:</span>
              }
              <span className="font-bold leading-none">
                { formatCurrency( displayedPrice! )}
              </span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex gap-4 px-4 xl:px-6 py-3 xl:py-4 border-t border-t-gray50 group-hover:border-t-gray100 flex-1">
          <p className="text-gray500 leading-tight overflow-ellipsis line-clamp-2">{ product.description || "Sin Descripción" }</p>
        </div>
      </Link>
    </li>
  )
}
