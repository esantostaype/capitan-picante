'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const OrderMenuAllProductsItem = () => {
  
  const pathName = usePathname()

  return (
    <li className={ `${ pathName === "/menu" ? "bg-accent text-white" : "hover:bg-gray100 bg-gray50" } active:scale-[0.97] leading-tight text-center hidden md:block rounded aspect-square md:aspect-auto`}>
      <Link href="/menu" className="flex items-center justify-center px-5 py-3 h-full">
        Todo
      </Link>
    </li>
  );
}