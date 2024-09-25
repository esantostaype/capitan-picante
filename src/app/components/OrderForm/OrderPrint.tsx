import React, { forwardRef, useMemo } from 'react'
import { Product, Client, OrderType, orderTypeTranslations } from '@/interfaces'
import { format } from '@formkit/tempo'

interface Props {
  orderData: {
    order: Product[]
    floor: string
    table: string
    total: number
    orderType: OrderType
    notes: string
    client?: Client | null
  }
}

export const OrderPrint = forwardRef<HTMLDivElement, Props>(({ orderData }, ref) => {

  const date = new Date()

  const groupedOrder = useMemo(() => {
    const grouped = orderData.order.reduce((acc, item) => {
      if (!acc[item.category.name]) {
        acc[item.category.name] = {
          category: item.category,
          items: []
        };
      }
      acc[item.category.name].items.push(item);
      return acc;
    }, {} as Record<string, { category: { name: string, orderNumber?: number }, items: Product[] }>)
  
    return Object.values(grouped).sort((a, b) => {
      return ( a.category.orderNumber || 0) - ( b.category.orderNumber || 0 )
    });
  }, [ orderData.order ])

  return (
    <div ref={ref} className="uppercase leading-[1.125em] text-lg w-[105mm] text-black">
      <div className="mb-3 text-center">
        <div className="normal-case">
          { format( date, "DD-MM-YYYY", 'es' )} - { format( date, "H:mm:ss", 'es') }
        </div>
        <h1 className="text-2xl font-bold leading-none mt-2 mb-1 flex gap-2 items-center">
          <span className="flex-1 font-normal text-base overflow-hidden w-1 text-nowrap"> - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - </span>
          <span>N° 2</span>
          <span className="flex-1 font-normal text-base overflow-hidden w-1 text-nowrap"> - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - </span>
        </h1>
      </div>
      <div>
        <div className="pb-2 flex justify-between gap-4 leading-tight">
          <div>
            <div>Meser@: <span className="font-semibold">Vanessa</span></div>
            <div>Tipo: <span className="font-semibold">{ orderTypeTranslations[ orderData.orderType ] }</span></div>            
            { orderData.client && (
              <div>
                Cliente: <span>orderData.client</span>
              </div>
            )}
          </div>
          <div className="text-right font-semibold">
            <div>Mesa: { orderData.table }</div>
            <div>{ orderData.floor || 'Salón' }</div>
          </div>
        </div>
      </div>
      <div>
        <table className="w-full">
          <tbody className="leading-[1.125em]">
            { groupedOrder.map(({ category, items }) => (
              <>
                <tr>
                  <td colSpan={ 2 }>
                    <div className="font-semibold flex gap-2 items-center mt-8 text-base overflow-hidden max-w-full flex-wrap">
                      <span>{category.name}</span>
                      <span className="flex-1 overflow-hidden w-1 text-nowrap text-base"> - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - </span>
                    </div>
                  </td>
                </tr>
                { items.map(item => (
                  <tr key={ item.id }>
                    <td className="text-2xl font-bold align-text-top pr-4">
                      <div className="leading-[1.1em] mt-3">{ item.quantity }x</div>         
                    </td>
                    <td className="align-text-top text-xl">
                      <div className="leading-[1.1em] text-2xl font-bold mt-3">{ item.name }</div>
                      { item.selectedVariations && (
                        <div>
                          { Object.entries( item.selectedVariations ).map(([ variation, option ]) => (
                            <div key={ variation } className="my-1">{ variation }: <span className="font-bold">{ option }</span></div>
                          ))}
                        </div>
                      )}
                      {
                        item.notes &&
                        <div className="mb-2">
                          Nota: <span className="font-semibold">{ item.notes }</span>
                        </div>
                      }
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
        {
          orderData.notes &&
          <div className="py-3">
            <span className="overflow-hidden w-1 text-nowrap text-base">  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  </span>
            <div className="mt-2">Nota: <span className="font-semibold">{ orderData.notes }</span></div>
          </div>
        }
      </div>
    </div>
  )
})

OrderPrint.displayName = 'OrderPrint'
