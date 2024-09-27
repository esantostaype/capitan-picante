'use client'
import { Button, Modal, ModalBody, RestaurantTable } from '@/components'
import { useEffect, useRef, useState } from 'react'
import { TabPanel, Tabs } from 'react-tabs'
import { useOrderStore } from '@/store/order-store'
import { Color, Floor, Order, Size, Variant } from '@/interfaces'
import { InvoicePrint } from './OrderForm/InvoicePrint'
import { useReactToPrint } from 'react-to-print'
import { useGlobalStore } from '@/store/global-store'
import { useUiStore } from '@/store/ui-store'
import { formatCurrency } from '@/utils'

interface Props {
  floors: Floor[]
}

export const OrderTables = ({ floors }: Props) => {
  const [tabFloorIndex, setTabFloorIndex] = useState(0)
  const [orders, setOrders] = useState<Order[]>([]) // Estado para almacenar las órdenes
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null) // Orden seleccionada para imprimir
  const { updateTrigger } = useGlobalStore()
  const { activeModal, openModal } = useUiStore() // Destructurar funciones del UI store

  const {
    setSelectedFloorId,
    setSelectedFloorName,
    selectedTableId,
    setSelectedTableId,
    setSelectedTableNumber,
  } = useOrderStore()

  const componentRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Invoice',
    onAfterPrint: () => {
      if (selectedOrder) {
        releaseTable(selectedOrder.tableId)
      }
    }
  })

  // Recuperar órdenes de localStorage al cargar el componente
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    setOrders(storedOrders)
  }, [updateTrigger])

  // Seleccionar la planta al inicio
  useEffect(() => {
    if (floors.length > 0) {
      setSelectedFloorId(floors[0].id || null)
      setSelectedFloorName(floors[0].name || null)
    }
  }, [floors, setSelectedFloorId, setSelectedFloorName])

  const releaseTable = ( tableId: string ) => {
    const updatedOrders = orders.filter(order => order.tableId !== tableId)
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders)) // Actualizar localStorage
    setSelectedOrder(null) // Limpiar la orden seleccionada
  }

  return (
    <div>
      <Tabs
        selectedIndex={tabFloorIndex}
        onSelect={(index) => {
          setTabFloorIndex(index)
          setSelectedFloorId(floors[index].id || null)
        }}
      >
        {floors.map((floor) => (
          <TabPanel key={floor.id}>
            <div className="flex flex-1 flex-col p-4 md:p-6">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] md:grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-4 md:gap-6">
                {floor.tables.map((table) => {
                  const isTableOccupied = orders.some(order => order.tableId === table.id)
                  const orderForTable = orders.find(order => order.tableId === table.id)

                  return (
                    <div
                      key={table.id}
                      className="flex items-center justify-center aspect-square cursor-pointer"
                      onClick={() => {
                        if (isTableOccupied && orderForTable) {
                          setSelectedOrder(orderForTable) // Establecer la orden seleccionada
                          openModal() // Abre el modal desde el UiStore
                          setSelectedTableId('')
                          setSelectedTableNumber('')
                        } else {
                          setSelectedTableId(table.id || '')
                          setSelectedTableNumber(table.number || '')
                        }
                      }}
                    >
                      <div className="relative flex items-center justify-center w-16 h-16 md:h-24 md:w-24">
                        <span
                          className={`relative z-20 text-lg font-bold ${
                            selectedTableId === table.id
                              ? 'text-white'
                              : isTableOccupied
                              ? 'text-white'
                              : 'text-gray600'
                          }`}
                        >
                          {table.number}
                        </span>
                        <RestaurantTable
                          className={`w-20 h-20 md:w-24 md:h-24 absolute z-10 transition-all ${
                            selectedTableId === table.id
                              ? 'fill-accent'
                              : isTableOccupied
                              ? 'fill-error'
                              : 'fill-gray100'
                          }`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              {selectedOrder && activeModal && ( // Renderiza el modal si hay una orden seleccionada y el modal está activo
                <Modal isOpen size={Size._2XL} title={`Órden #${ selectedOrder.orderNumber }`}>
                  <ModalBody>
                    <div className="rounded border border-gray100 mb-4">
                      <table className="w-full">
                        <thead className="text-sm leading-3">
                          <tr>
                            <th className="p-4 border-b text-left border-gray50"></th>
                            <th className="p-4 border-b text-left border-gray50">Producto</th>
                            <th className="p-4 border-b text-right border-gray50">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="leading-[1.125em]">
                          { selectedOrder.orderProducts.map(item => (
                            <tr key={ item.id }>
                              <td className="align-text-top px-4 py-2">
                                x{ item.quantity }                  
                              </td>
                              <td className="align-text-top px-4 py-2">
                                <div className="mb-1">{ item.name }</div>
                              </td>
                              <td className="align-text-top text-right px-4 py-2 text-nowrap">
                                { formatCurrency( item.subtotal || 0 )}                  
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={ 4 } className="text-right p-4 border-t border-t-gray100 text-accent text-xl">
                              <strong>Total: { formatCurrency( selectedOrder.total )}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        text="Liberar"
                        variant={ Variant.CONTAINED }
                        color={ Color.SUCCESS }
                        size={ Size.LG }
                        onClick={ () => releaseTable( selectedOrder.tableId ) }
                        full
                      />
                      <Button
                        text="Cobrar"
                        variant={Variant.CONTAINED}
                        color={Color.ACCENT}
                        size={ Size.LG }
                        onClick={handlePrint}
                        full
                      />
                    </div>
                  </ModalBody>
                </Modal>
              )}
              <div style={{ display: 'none' }}>
                {selectedOrder && (
                  <InvoicePrint
                    ref={componentRef}
                    orderData={{
                      orderNumber: selectedOrder.orderNumber,
                      order: selectedOrder.orderProducts,
                      floor: selectedOrder.floor,
                      table: selectedOrder.table,
                      total: selectedOrder.total,
                      orderType: selectedOrder.orderType,
                      client: selectedOrder.client,
                    }}
                  />
                )}
              </div>
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  )
}
