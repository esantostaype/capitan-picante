'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useOrderStore } from '@/store/order-store'
import { Formik, Form } from 'formik'
import { Client, Color, OrderStatus, OrderType, Product, Size, Variant } from '@/interfaces'
import { toast } from 'react-toastify'
import { Button, ModalBody, ModalFooter, ModalPage, Spinner, TextField } from '@/components'
import { useUiStore } from '@/store/ui-store'
import OrderFormTypeItem from './OrderFormTypeItem'
import { OrderPrint } from './OrderPrint'
import { useReactToPrint } from 'react-to-print'
import { useGlobalStore } from '@/store/global-store'

interface FormValues {
  floor: string
  table: string
  total: number
  orderType: OrderType | undefined
  notes: string
  order: Product[]
  client?: Client | null
}

export const OrderForm = () => {

  const order = useOrderStore(( state ) => state.order )
  const setOrder = useOrderStore((state) => state.setOrder)
  const saveOrderToLocalStorage = useOrderStore((state) => state.saveOrderToLocalStorage)
  const clearOrder = useOrderStore(( state ) => state.clearOrder )
  const total = useMemo(() => order.reduce(( total, item ) => total + ( ( item.quantity || 0 ) * item.price ), 0), [ order ])
  const { activeModalPage, closeModalPage } = useUiStore()
  const { toggleUpdateTrigger } = useGlobalStore()
  const [ clientSelected, setClientSelected ] = useState<Client | undefined>( undefined )
  const [ isPrinted, setIsPrinted ] = useState(false)

  const {
    selectedFloorName,
    setSelectedFloorId,
    setSelectedFloorName,
    selectedTableId,
    selectedTableNumber,
    setSelectedTableId,
    setSelectedTableNumber
  } = useOrderStore()
  const [ selectedOrderType, setSelectedOrderType ] = useState<OrderType>( OrderType.DINE_IN )
  const [ notes, setNotes ] = useState<string>('')

  const componentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedOrder = localStorage.getItem('order')
    if ( storedOrder ) {
      const parsedOrder = JSON.parse( storedOrder )
      setOrder( parsedOrder )
    }
  }, [ setOrder ])

  useEffect(() => {
    if (!activeModalPage) {
      setSelectedOrderType( OrderType.DINE_IN )
      setClientSelected( undefined )
      setNotes('')
    }
  }, [ activeModalPage ])

  const initialValues: FormValues = {
    floor: '',
    table: '',
    total,
    orderType: OrderType.DINE_IN,
    notes: '',
    order,
    client: clientSelected
  }

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      setIsPrinted( true )
    },
    onBeforePrint: () => {
      setIsPrinted( false )
    }
  })
  
  const handleSubmit = async () => {

    if( !selectedTableId && selectedOrderType === OrderType.DINE_IN ) {
      toast.error('Por favor, selecciona una mesa')
      return
    }

    const newOrder = {
      id: `order_${Date.now()}`, // Genera un ID único
      total,
      floor: selectedFloorName || '',
      table: selectedTableNumber || '',
      tableId: selectedTableId || '',
      orderType: selectedOrderType,
      notes,
      status: OrderStatus.IN_PREPARATION, // Estado inicial
      date: new Date(),
      orderProducts: order,
      clientId: clientSelected?.id,
      client: clientSelected,
      orderNumber: `${Date.now()}` // Un número de orden único
    }

    saveOrderToLocalStorage(newOrder)
    handlePrint()
    toggleUpdateTrigger()
  }

  useEffect(() => {
    if ( isPrinted ) {
      clearOrder()
      setSelectedFloorName('')
      setSelectedFloorId('')
      setSelectedTableId('')
      setSelectedTableNumber('')
      closeModalPage()
      setIsPrinted( false )
    }
  }, [ isPrinted, clearOrder, setSelectedFloorName, setSelectedFloorId, setSelectedTableId, setSelectedTableNumber, closeModalPage ])
  
  return (
    <ModalPage title="Órden" isOpen={ activeModalPage } backText='Seguir agregando productos'>
      <Formik initialValues={ initialValues } onSubmit={ handleSubmit } enableReinitialize={ true }>
        {({ isSubmitting, setFieldValue }) => (   
        <>
        <Spinner isActive={ isSubmitting }/>
        <Form className="flex flex-col flex-1 overflow-y-auto">
          <ModalBody>
            <div className='flex flex-col gap-6 md:gap-8 lg:gap-10 xl:gap-12'>
              {/* <div>
                <h3 className="text-lg md:text-2xl text-gray500 font-bold mb-2 md:mb-4">Cliente</h3>                  
                <div className='flex flex-col md:grid md:grid-cols-2 gap-6'>
                  <div className="col-span-1">
                    <TextField placeholder='Nombre' type='text' name='client.fullName'/>
                  </div>
                  <div className="col-span-1">
                    <TextField placeholder='DNI' type='text' name='client.dni'/>
                  </div>
                  <div className="col-span-1">
                    <TextField placeholder='Teléfono' type='text' name='client.phone'/>
                  </div>
                  <div className="col-span-1">
                    <TextField placeholder='Correo Electrónico' type='text' name='client.email'/>
                  </div>
                </div>
              </div> */}

              <div>
                <h3 className="text-lg md:text-2xl text-gray500 font-bold mb-2 md:mb-4">Tipo de Órden</h3>
                <ul className="flex flex-wrap gap-4">
                  <OrderFormTypeItem
                    type={ OrderType.DINE_IN }
                    isSelected={ selectedOrderType === OrderType.DINE_IN }
                    onClick={() => setSelectedOrderType( OrderType.DINE_IN ) }
                  />
                  <OrderFormTypeItem
                    type={ OrderType.TAKE_AWAY }
                    isSelected={ selectedOrderType === OrderType.TAKE_AWAY }
                    onClick={() => setSelectedOrderType( OrderType.TAKE_AWAY ) }
                  />
                  <OrderFormTypeItem
                    type={ OrderType.DELIVERY }
                    isSelected={ selectedOrderType === OrderType.DELIVERY }
                    onClick={() => setSelectedOrderType( OrderType.DELIVERY ) }
                  />
                </ul>
              </div>
              <div>
                <h3 className="text-lg md:text-2xl text-gray500 font-bold mb-2 md:mb-4">Notas</h3>
                <TextField 
                  typeField='textarea' 
                  name='notes' 
                  onChange={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    setFieldValue('notes', target.value);
                    setNotes(target.value);
                  }}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="pb-16 md:pb-0 flex justify-end gap-4 w-full">
              <Button variant={ Variant.GHOST } text="Cancelar" size={ Size.LG } onClick={ ()=> closeModalPage() }/>
              <Button
                submit
                className="flex-1"
                text='Enviar'
                color={Color.ACCENT}
                size={Size.LG}
                variant={Variant.CONTAINED}
              />
            </div>
          </ModalFooter>
        </Form>
        </>
        )}
      </Formik>
      <div style={{ display: 'none' }}>
        <OrderPrint ref={ componentRef } orderData={{
          order,
          floor: selectedFloorName || '',
          table: selectedTableNumber || '',
          total,
          orderType: selectedOrderType,
          notes,
          client: clientSelected
        }} />
      </div>
    </ModalPage>
  )
}