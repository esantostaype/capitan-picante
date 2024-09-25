import React, { forwardRef } from 'react'
import { Product, Client, OrderType, orderTypeTranslations } from '@/interfaces'
import { useRestaurantStore } from '@/store/global-store'
import { formatCurrency } from '@/utils';

interface Props {
  orderData: {
    orderNumber: string
    order: Product[]
    floor: string
    table: string
    total: number
    orderType: OrderType
    notes: string
    client?: Client | null
  }
}

export const InvoicePrint = forwardRef<HTMLDivElement, Props>(({ orderData }, ref) => {
  
  const { restaurant } = useRestaurantStore()

  return (
    <div ref={ref} className="uppercase font-jetbrains text-base w-[105mm] text-black">
      <div className="mb-3 text-center">        
        <h2 className="leading-none text-gray600">Restify/@{ restaurant?.name }</h2>
        <h1 className="text-2xl font-bold leading-none mt-2 mb-1">Comanda #{ parseInt( orderData.orderNumber ) }</h1>
        <h2 className="leading-none">Mesero: Pedro Ramirez</h2>
      </div>
      <div className="py-2 border-t border-t-black border-dashed">
        <div className="flex justify-between items-center pb-2">
          <div className="leading-5">
            <p>Fecha: 03/09/2024</p>
            <p>Hora: 11:06:32</p>
          </div>
          <div className="text-right">
            <div className="font-bold text-2xl leading-6">Mesa: { orderData.table }</div>
            <div>{ orderData.floor }</div>
          </div>
        </div>
        <div className="leading-5">
          Tipo de Pedido: <strong>{ orderTypeTranslations[ orderData.orderType ] }</strong>
        </div>
        { orderData.client && (
          <div className="leading-5">
            Cliente: <strong>{ orderData.client.fullName }</strong>
          </div>
        )}
      </div>
      <div className="mt-2">
        <table className="w-full">
          <thead className="text-sm leading-3">
            <tr>
              <th className="py-2 pr-2 border-y text-left border-dashed border-black"></th>
              <th className="py-2 pr-2 border-y text-left border-dashed border-black">Producto</th>
              <th className="py-2 pr-4 border-y text-right border-dashed border-black">Precio</th>
              <th className="py-2 border-y text-right border-dashed border-black">Subtotal</th>
            </tr>
          </thead>
          <tbody className="leading-[1.125em]">
            { orderData.order.map(item => (
              <tr key={ item.id }>
                <td className="align-text-top pr-2 py-2 border-b border-b-black border-dashed">
                    x{ item.quantity }                  
                </td>
                <td className="align-text-top pr-2 py-2 border-b border-b-black border-dashed">
                    <div className="mb-1">{ item.name }</div>
                    { item.selectedVariations && (
                      <div className="mt-1 text-sm leading-4">
                        { Object.entries( item.selectedVariations ).map(([ variation, option ]) => (
                          <div key={ variation }>{ variation }:<br/><strong>{ option }</strong></div>
                        ))}
                      </div>
                    )}
                    {
                      item.notes &&
                      <div className="mt-1 text-sm leading-4">
                        Nota: <strong>{ item.notes }</strong>
                      </div>
                    }
                </td>
                <td className="align-text-top pr-4 py-2 text-right text-nowrap border-b border-b-black border-dashed">
                    { formatCurrency( item.price )}                  
                </td>
                <td className="align-text-top text-right py-2 text-nowrap border-b border-b-black border-dashed">
                    { formatCurrency( item.subtotal || 0 )}                  
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={ 4 } className="text-right py-3"><strong>Total: <span className="text-xl">{ formatCurrency( orderData.total )}</span></strong></td>
            </tr>
          </tbody>
        </table>
        {
          orderData.notes &&
          <div className="border-t border-t-black border-dashed py-3">
            Nota: <strong>{ orderData.notes }</strong>
          </div>
        }
      </div>
    </div>
  )
})

InvoicePrint.displayName = 'InvoicePrint'
