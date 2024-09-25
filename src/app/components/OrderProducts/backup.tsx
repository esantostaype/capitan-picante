'use client'
import { OrderProductItem } from './OrderProductItem'
import { EmptyData, IconButton, LoadingData } from '@/components'
import { useParams } from 'next/navigation'
import { useCategory, useOrderProducts } from '@/hooks'
import { Color, Size, Variant } from '@/interfaces'

interface Props {
  token?: string
}

export const OrderProductsBackup = ({ token }: Props) => {

  const { category } = useParams()
  const categoryKey = Array.isArray( category ) ? category[0] : category
  const { isLoading, data:products } = useOrderProducts({ token, categoryKey })
  const { data:categoryData } = useCategory({ token, id: category })

  return (
    <>
      <div className="h-16 xl:h-auto px-4 xl:px-0 fixed md:hidden flex items-center gap-2 top-0 left-0 w-full xl:relative z-50 bg-surface border-b border-b-gray50 xl:border-b-0 xl:bg-transparent xl:mb-4">
        <div className="block xl:hidden">
          <IconButton iconName='arrow-left' size={ Size.SM } href="/order/menu"/>
        </div>
        <h1 className="text-lg xl:text-xl font-semibold xl:min-h-[1.72rem]">
          { category ? categoryData?.name : "Todo" }
        </h1>
      </div>
      { isLoading
      ? ( <LoadingData text="Productos"/> )
      : ( products && products.length === 0
        ? ( <EmptyData text='Productos' /> )
        : (
          <>
            <ul className="mt-16 md:mt-0 xl:mt-0 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
              { products?.map( ( product ) => (
                <OrderProductItem key={ product.id } product={ product } />
              ))}
            </ul>
          </>
        )
      )}
    </>
  )
}