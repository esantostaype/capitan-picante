'use client'
import { Category } from '@/interfaces'
import { OrderMenuNavItem } from './OrderMenuNavItem'
import { OrderMenuAllProductsItem } from './OrderMenuAllProductsItem'

interface Props {
  categories: Category[]
}

export const OrderMenuNav = ({ categories }: Props ) => {
  console.log({ categories })
  return (
    <nav className="flex flex-1 flex-col md:block md:flex-initial">
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:flex md:flex-wrap md:items-center gap-4 md:gap-3">
        <OrderMenuAllProductsItem/>
        { categories?.map( ( category: Category ) => (
          <OrderMenuNavItem key={ category.id } category={ category } />
        ))}
      </ul>
    </nav>
  )
}
