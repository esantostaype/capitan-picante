import { Product } from '@/interfaces'
import productsData from '@/data/products.json'
import { OrderProductDetail } from '../../../components'

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
  return (
    <OrderProductDetail product={ product } productId={ product?.id }/>
  )
}