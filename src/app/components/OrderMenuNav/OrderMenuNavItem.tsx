'use client'

import Link from 'next/link';
import { useParams } from 'next/navigation'
import { Category } from '@/interfaces'

interface Props {
  category: Category
}

export const OrderMenuNavItem = ({ category } : Props ) => {
  
  const params = useParams()
  const isActive = category.id === params.category

  return (
    <>
    { category.products.count !== 0 &&
    <li className={ `${ isActive ? "bg-accent text-white" : "bg-surface hover:bg-gray50 md:hover:bg-gray100 md:bg-gray50" } active:scale-[0.97] leading-tight text-center block rounded`}>
      <Link href={ `/menu/${ category.id }` } className="flex items-center justify-center h-full p-4 md:py-3">
        <div>
          <div className="font-bold md:font-normal">{ category.name }</div>
          <div className="text-gray500 text-xs mt-1 md:hidden">
            { category.products.count } Producto{ category.products.count !== 0 && "s" }
          </div>
        </div>
      </Link>
    </li>
    }
    </>
    
  );
}