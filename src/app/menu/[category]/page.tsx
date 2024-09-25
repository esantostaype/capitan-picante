import { OrderMenuNav, OrderProducts } from "../../components"
import { Category, Product } from '@/interfaces'

import categoriesData from '@/data/categories.json'
import productsData from '@/data/products.json'

interface Props {
  params: {
    category: string
  }
}

export default function OrderMenuCategoryPage({ params }: Props) {
  const products: Product[] = productsData.filter(
    (product) => product.categoryId === params.category
  )
  
  const categories: Category[] = categoriesData;
  const category: Category | undefined = categories.find(
    (cat) => cat.id === params.category
  )

  return (
    <>
      <div className="hidden md:flex p-4 md:px-6 md:py-4 md:border-b md:border-b-gray50 sticky top-14 z-[999] md:bg-surface">
        <OrderMenuNav categories={ categories } />
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-6">
        { category && (
          <OrderProducts categoryName={ category.name } products={ products } />
        )}
      </div>
    </>
  );
}
