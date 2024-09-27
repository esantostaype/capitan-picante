import { Category, Product } from '@/interfaces'
import { OrderMenuNav, OrderProductDetailPage } from '../../components'
import productsData from '@/data/products.json'
import categoriesData from '@/data/categories.json'

interface Props {
  params: {
		product: string
	}
}

export async function generateStaticParams() {
  const products: Product[] = productsData

  const staticProducts = products.map((product) => ({
    product: product.id
  }))

  return staticProducts.map(({ product }) => ({
    product: product
  }))
}

export default async function OrderMenuProductPage({ params }: Props) {
  const product: Product | undefined = productsData.find(
    (p) => p.id === params.product
  )
  const categories: Category[] = categoriesData

  return (
    <>
    <div className="hidden md:flex p-4 md:px-6 md:py-4 md:border-b md:border-b-gray50 sticky top-14 z-[999] md:bg-surface">
      <OrderMenuNav categories={ categories }/>
    </div>
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <OrderProductDetailPage product={ product }/>
    </div>
    </>
  )
}