import { OrderMenuNav, OrderProducts } from '../components'
import { Category, Product } from '@/interfaces'
import categoriesData from '@/data/categories.json'
import productsData from '@/data/products.json'

export default async function OrderMenuPage() {
  const categories: Category[] = categoriesData
  const products: Product[] = productsData
  return (
    <>
    <div className="flex flex-1 flex-col md:flex-initial p-4 md:px-6 md:py-4 md:border-b md:border-b-gray50 sticky top-14 z-[999] md:bg-surface">
      <OrderMenuNav categories={ categories }/>
    </div>
    <div className="hidden md:flex md:flex-1 md:flex-col p-4 md:p-6">
      <OrderProducts products={ products } />
    </div>
    </>
  )
}