import React, { forwardRef } from 'react'
import { Product, Client, OrderType } from '@/interfaces'
import { formatCurrency } from '@/utils'
import { format } from '@formkit/tempo'

interface Props {
  orderData: {
    orderNumber: string
    order: Product[]
    floor: string
    table: string
    total: number
    orderType: OrderType
    client?: Client | null
  }
}

export const InvoicePrint = forwardRef<HTMLDivElement, Props>(({ orderData }, ref) => {

  const date = new Date()

  return (
    <div ref={ref} className="font-roboto uppercase text-base w-[105mm] text-black">
      <div className="mb-3 text-center">        
        <div className="leading-none">Capitán Picante<br/>
        Av. Mateo Pumacahua, Mz. E Lt. 4<br/>Laderas de Villa, San Juan de Miraflores<br/>
        RUC: 10444597602</div>
        <h1 className="text-xl font-bold leading-none mt-2 mb-1">Nota de Venta Electrónica</h1>
        <div className="normal-case">
          { format( date, "DD-MM-YYYY", 'es' )} - { format( date, "H:mm:ss", 'es') }
        </div>
        <div className="text-left leading-none">
          Cliente: Varios<br/>
          Dirección: Lima
        </div>
      </div>
      <div className="my-2">
        <table className="w-full">
          <thead className="text-sm leading-3">
            <tr>
              <th className="py-2 pr-2"></th>
              <th className="py-2 pr-2 text-left">Producto</th>
              <th className="py-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="leading-[1.125em]">
            { orderData.order.map(item => (
              <tr key={ item.id }>
                <td className="align-text-top pr-2">
                    x{ item.quantity }                  
                </td>
                <td className="align-text-top pr-2">
                    <div className="mb-1">{ item.name }</div>
                </td>
                <td className="align-text-top text-right text-nowrap">
                    { formatCurrency( item.subtotal || 0 )}                  
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={ 4 } className="text-right py-3"><strong>Total: { formatCurrency( orderData.total )}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-center">Gracias por su visita.</div>
    </div>
  )
})

InvoicePrint.displayName = 'InvoicePrint'
