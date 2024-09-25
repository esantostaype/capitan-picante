'use client'
import Image from 'next/image'
import { useOrderStore } from '@/store/order-store'
import { Color, Variant, OrderItemFull, Size } from '@/interfaces'
import { Button, Counter, IconButton, Modal, ModalBody, ModalFooter, ModalHeader, SimpleSpinner, TextField } from '@/components'
import { toast } from 'react-toastify'
import { fetchData, formatCurrency, generateUniqueId, getMinVariantPrice, getVariantPrice } from '@/utils'
import { useUiStore } from '@/store/ui-store'
import { useEffect, useState } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import { OrderProductDetailVariantSelector } from './OrderProductDetailVariantSelector'
import { Formik, Form } from 'formik'
import { useOrderProduct } from '@/hooks'
import { OrderProductDetailHeaderSkeleton } from './OrderProductDetailHeaderSkeleton'

interface Props {
  token?: string
}

export const OrderProductDetail = ({ token }: Props) => {

  const searchParams = useSearchParams()
  const pathName = usePathname()
  const productId = searchParams.get('p')

  const { data: product } = useOrderProduct({ productId: productId, token })

  const addToOrder = useOrderStore(( state ) => state.addToOrder )
  const { activeModal, openModal, closeModal } = useUiStore()
  const [ quantity, setQuantity ] = useState<number>(1)

  interface FormValues {
    selectedVariantWithPrice: { [key: string]: string }
    selectedVariants: { [key: string]: string }
    selectedAdditionals: { [key: string]: number }
    notes: string
  }
  
  const initialValues: FormValues = {
    selectedVariantWithPrice: {},
    selectedVariants: {},
    selectedAdditionals: {},
    notes: ''
  }

  useEffect(() => {
    setQuantity(1)
  }, [ activeModal ])

  useEffect(() => {
    if ( product?.id === productId ) {
      openModal()
    }
  }, [ productId, openModal, product?.id ])

  const handleAddToOrder = ( values : FormValues ) => {

    const allVariations = { ...values.selectedVariantWithPrice, ...values.selectedVariants }
    const additionalPrice = Object.entries( values.selectedAdditionals )
      .reduce(( total, [ additionalName, additionalQuantity ] ) => {
        const additional = product?.additionals.find( add => add.name === additionalName )
        return total + ( additional ? additional.price * ( additionalQuantity as number ) : 0 )
      }, 0)

    const price = getVariantPrice( product!, values.selectedVariantWithPrice ) + additionalPrice
    const uniqueId = generateUniqueId( product!.id, allVariations, values.selectedAdditionals, values.notes )
    if( product ){
      addToOrder({
        ...product,
        price,
        variationPrice: price,
        selectedVariations: allVariations,
        selectedAdditionals: values.selectedAdditionals,
        notes: values.notes,
        uniqueId
      }, quantity )
    }

    closeModal(true)
    toast.success(`¡${ product?.name } Agregad@!`)
  }

  const areAllVariantsSelected = ( values : any ) => {
    return product?.variations.every( variation => 
      variation.hasPrice 
        ? values.selectedVariantWithPrice[ variation.name ] 
        : values.selectedVariants[ variation.name ]
    )
  }

  const displayedPrice = product && getMinVariantPrice( product )
  const hasVariationPrices = displayedPrice !== product?.price

  const hasVariations = product?.variations.length !== 0
  const hasAdditionals = product?.additionals.length !== 0

  return (
    <Modal withBackRoute isOpen={ activeModal } size={ Size._5XL }>
      <ModalHeader>
        <div>
        {
          product &&
          <>
          <div className="w-full flex gap-4 items-center">
            <div className="flex w-full md:w-auto items-center gap-2">
              <div className="block xl:hidden">
                <IconButton iconName='arrow-left' size={ Size.SM } onClick={ ()=>closeModal( true ) }/>
              </div>
              <h1 className="w-full flex-1 text-base md:text-xl leading-tight font-semibold text-ellipsis text-nowrap overflow-hidden">{ product.name }</h1>
            </div>
            <div className="hidden md:flex items-center gap-1 leading-tight">
              { hasVariationPrices && <span className="text-gray500">Desde:</span> }
              <span className="text-base md:text-xl font-bold text-accent opacity-60 leading-tight">{ formatCurrency( product.price ) }</span>
            </div>
          </div>
          {
            product.description &&
            <div className="hidden md:block text-gray500 mt-1">{ product.description }</div>
          }
          </>
        }
        </div>
      </ModalHeader>
        <Formik
          initialValues={ initialValues }
          onSubmit={ handleAddToOrder }
        >
          {({ values, setFieldValue }) => (
            <Form className="overflow-y-auto flex flex-col flex-1">
              <ModalBody>
                <div className={`w-full flex flex-1 flex-col md:grid grid-cols-6 gap-6 xl:gap-8 relative ${ !product ? "" : "items-start" } `}>
                  <div className='hidden md:block col-span-2 sticky top-4 md:top-8 xl:top-10'>
                    <div className="relative z-20 bg-gray50 flex items-center justify-center rounded-lg w-full aspect-square overflow-hidden">
                    { product?.image ? (
                      <Image src={ product.image } alt={ product.name } width={ 512 } height={ 512 } className="object-cover aspect-square" />
                    ) : (
                      <i className="fi fi-tr-image-slash text-3xl text-gray500"></i>
                    )}
                    </div>
                  </div>
                  { !product
                    ? <div className='w-full col-span-4 flex flex-1 items-center justify-center'><SimpleSpinner/></div>
                    : <div className='w-full col-span-4 flex flex-1 flex-col gap-8'> 
                      <div className="flex md:hidden flex-col gap-4">
                        <div className="flex items-center gap-1 leading-tight">
                          Precio: 
                          { hasVariationPrices && <span className="text-gray500">Desde:</span> }
                          <span className="text-base md:text-xl font-bold text-accent opacity-60 leading-tight">{ formatCurrency( product.price ) }</span>
                        </div>                     
                        {
                          product.description &&
                          <div className="text-gray500">{ product.description }</div>
                        }
                      </div>
                      { product && 
                        <>
                        <OrderProductDetailVariantSelector
                          variations={ product?.variations.filter( variation => variation.hasPrice )}
                          selectedVariants={ values.selectedVariantWithPrice }
                          handleVariantChange={( variationName, option ) => {
                            setFieldValue(`selectedVariantWithPrice.${variationName}`, option)
                          }}
                        />
                        <OrderProductDetailVariantSelector
                          variations={ product?.variations.filter( variation => !variation.hasPrice )}
                          selectedVariants={ values.selectedVariants }
                          handleVariantChange={( variationName, option ) => {
                            setFieldValue(`selectedVariants.${variationName}`, option)
                          }}
                        />
                        </>
                      }

                      { product && 
                        <>
                        {
                          hasAdditionals &&
                          <div>
                            <h3 className="text-base font-semibold mb-2">Adicionales:</h3>
                            {
                              product?.additionals.map(( additional, index ) => (
                                <div key={ index } className={`${ values.selectedAdditionals[ additional.name ] > 0 ? "border-accent" : "border-transparent" } mb-2 flex items-center bg-gray50 rounded border-2`}>
                                  <div className="flex-1 px-4 py-2">
                                    <div>{ additional.name }</div>
                                    <div className="text-base font-bold">{ formatCurrency( additional.price ) }</div>
                                  </div>
                                  <Counter
                                    value={ values.selectedAdditionals[ additional.name ] || 0 }
                                    onQuantityChange={( count ) => setFieldValue(`selectedAdditionals.${additional.name}`, count)}
                                    acceptZero
                                  />
                                </div>
                              ))
                            }
                          </div>
                        }
                        </>
                      }
                      <div>
                        <h3 className="text-base font-semibold mb-2">Notas:</h3>
                        <TextField
                          name='notes'
                          typeField='textarea'
                          placeholder='Puedes ingresar indicaciones finales para este producto'
                        />
                      </div>
                    </div>
                  }
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="pb-16 md:pb-0 flex justify-between md:justify-end items-center gap-4 w-full">
                  <Counter value={ quantity } onQuantityChange={ setQuantity } />
                  <Button
                    text="Agregar"
                    size={ Size.LG }
                    color={ Color.ACCENT }
                    variant={ Variant.CONTAINED }
                    disabled={
                      !product ||
                      ( product?.variations || product?.additionals ) && 
                      ( !product || ( hasVariations && !areAllVariantsSelected( values )))
                    }
                    className="w-full md:w-auto"
                    submit
                  />
                </div>
              </ModalFooter>
            </Form>
          )}
        </Formik>
    </Modal>
  )
}
