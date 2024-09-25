'use client'
import { useEffect, useMemo } from 'react'
import { useOrderStore } from '@/store/order-store'
import { IconButton } from '@/components'
import { OrderSummaryItem } from '..'
import { formatCurrency } from '@/utils'
import { Button } from '@/components'
import { Color, IconButtonShape, Product, Size, Variant } from '@/interfaces'
import { useUiStore } from '@/store/ui-store'

export const OrderSummary = () => {
  
  const order = useOrderStore(( state ) => state.order )
  const setOrder = useOrderStore((state) => state.setOrder)
  const clearOrder = useOrderStore(( state ) => state.clearOrder )
  const total = useMemo(() => order.reduce(( total, item ) => total + ( ( item.quantity || 0 ) * item.price ), 0), [ order ])
  const { openModalPage, openOrderSummary, closeOrderSummary, activeOrderSummary } = useUiStore()

  const subtotal = total / 1.18
  const igv = total - subtotal

  useEffect(() => {
    const storedOrder = localStorage.getItem('order')
    if ( storedOrder ) {
      const parsedOrder = JSON.parse( storedOrder )
      setOrder( parsedOrder )
    }
  }, [ setOrder ])

  const groupedOrder = useMemo(() => {
    const grouped = order.reduce((acc, item) => {
      if (!acc[item.category.name]) {
        acc[item.category.name] = {
          category: item.category,
          items: []
        };
      }
      acc[item.category.name].items.push(item);
      return acc;
    }, {} as Record<string, { category: { name: string, orderNumber: number }, items: Product[] }>)
  
    return Object.values(grouped).sort((a, b) => {
      return ( a.category.orderNumber ) - ( b.category.orderNumber  )
    });
  }, [ order ])

  const handleContinue = () => {
    openModalPage()
    closeOrderSummary()
  }

  return (
    <div className={`fixed xl:sticky right-0 flex flex-col h-dvh top-0 flex-[0_0_20rem] xl:w-80 ${ activeOrderSummary ? "z-[99999]" : "z-[9999]" }`}>
      <div className={`${ activeOrderSummary ? "right-80" : "right-0" } rounded-bl-lg fixed w-14 h-14 bg-gray50 hidden md:flex xl:hidden items-center justify-center top-0 z-20 transition-all`} onClick={ !activeOrderSummary ? openOrderSummary : closeOrderSummary }>
        <i className={`${ activeOrderSummary ? "fi-rr-arrow-right" : "fi-rr-shopping-bag" } fi text-xl`}></i>
      </div>
      <div className={`${ activeOrderSummary ? "right-0" : "-right-80 xl:right-0" } transition-all fixed xl:relative z-20 flex flex-col bg-surface border-l h-dvh top-0 border-l-gray50 w-80 xl:w-full overflow-y-auto`}>
        { order.length === 0
          ? (
          <div className="w-full flex-1 flex items-center justify-center text-base text-gray500">
            <div className="text-center">
              <i className="fi fi-rr-empty-set text-3xl"></i>
              <h3>La Comanda está Vacía</h3>
            </div>
          </div>
          )
          : (
          <>
          <div className="bg-surface border-b border-b-gray50 p-4 md:p-6 pb-2 sticky top-0 z-30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Orden</h3>
            </div>
            <div className="flex justify-between items-center font-bold">
              <div>Item</div>
              <div>Subtotal</div>
            </div>
          </div>
          <div className="flex-1 relative z-20">
            <ul className="flex flex-col">
              { groupedOrder.map(({ category, items }) => (
                <li key={ category.name } className="border-b border-b-gray50 p-4 md:p-6 last:border-b-transparent">
                  <h4 className="uppercase font-semibold mb-4 md:mb-6 text-gray600">{ category.name }</h4>
                  <ul className="flex flex-col gap-4 md:gap-6">
                    { items.map(item => (
                      <OrderSummaryItem key={item.uniqueId} item={item} />
                    ))}
                  </ul>
                </li>
              )) }
            </ul>
          </div>
          <div className="sticky bottom-0 bg-surface z-30">
            <div className="py-3 md:py-4 px-4 md:px-6 border-t border-b border-gray50">
              <table className="w-full text-gray600">
                <tr>
                  <td>Subtotal:</td>
                  <td className="text-right text-foreground font-semibold">{ formatCurrency( subtotal ) }</td>
                </tr>
                <tr>
                  <td>IGV:</td>
                  <td className="text-right text-foreground font-semibold">{ formatCurrency( igv ) }</td>
                </tr>
                <tr>
                  <td className="pt-2">Total:</td>
                  <td className="text-accent text-right pt-2 font-semibold">{ formatCurrency( total ) }</td>
                </tr>
              </table>
            </div>
            <div className="flex gap-4 p-4 md:p-6 relative z-20 pb-20 md:pb-6">
              <IconButton iconName='trash' color={ Color.ERROR } variant={ Variant.GHOST } size={ Size.LG } shape={ IconButtonShape.SQUARE } onClick={ () => clearOrder() } />
              <Button
                text='Continuar'
                color={ Color.ACCENT }
                size={ Size.LG }
                variant={ Variant.CONTAINED }
                onClick={ () => handleContinue() }
                full
              />
            </div>
          </div>
          </>
          )
        }
      </div>
      <div className={`${ activeOrderSummary ? "opacity-75 visible" : "opacity-0 invisible" } transition-all xl:hidden fixed top-0 left-0 w-full h-dvh bg-background z-10`} onClick={ closeOrderSummary }></div>
    </div>
  );
}