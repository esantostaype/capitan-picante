'use client'
import Image from 'next/image'
import { useOrderStore } from '@/store/order-store'
import { Color, Variant, Product, Size } from '@/interfaces'
import { Button, Counter, IconButton, SimpleSpinner, TextField } from '@/components'
import { toast } from 'react-toastify'
import { formatCurrency, generateUniqueId, getMinVariantPrice, getVariantPrice } from '@/utils'
import { useUiStore } from '@/store/ui-store'
import { useEffect, useState } from 'react'
import { OrderProductDetailVariantSelector } from './OrderProductDetailVariantSelector'
import { Formik, Form } from 'formik'

interface Props {
  product?: Product
}

export const OrderProductDetail = ({ product }: Props) => {

  const addToOrder = useOrderStore(( state ) => state.addToOrder )
  const { activeModal, closeModal } = useUiStore()
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

  const handleAddToOrder = ( values : FormValues ) => {

    const allVariations = { ...values.selectedVariantWithPrice, ...values.selectedVariants }

    const price = getVariantPrice( product!, values.selectedVariantWithPrice )
    const uniqueId = generateUniqueId( product!.id, allVariations, values.selectedAdditionals, values.notes )
    if( product ){
      addToOrder({
        ...product,
        price,
        selectedVariations: allVariations,
        notes: values.notes,
        uniqueId
      }, quantity )
    }

    closeModal(true)
    toast.success(`¡${ product?.name } Agregad@!`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const areAllVariantsSelected = ( values : any ) => {
    return product?.variations.every( variation => 
      values.selectedVariants[ variation.name ]
    )
  }

  const displayedPrice = product && getMinVariantPrice( product )
  const hasVariationPrices = displayedPrice !== product?.price

  const hasVariations = product?.variations.length !== 0

  return (
    <>
    <div className="w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] -ml-4 -mt-4 md:-ml-6 md:-mt-6 flex items-center md:h-auto p-4 md:p-6 md:py-4 lg:py-6 lg:p-8 xl:px-10 border-b border-b-gray50 bg-surface sticky top-0 z-20">
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
    </div>
    <Formik
      initialValues={ initialValues }
      onSubmit={ handleAddToOrder }
    >
      {({ values, setFieldValue }) => (
        <Form className="flex flex-col flex-1">
          <div className="relative flex flex-col flex-1 py-4 md:py-6 lg:py-8 xl:py-10">
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
                      variations={ product?.variations }
                      selectedVariants={ values.selectedVariants }
                      handleVariantChange={( variationName, option ) => {
                        setFieldValue(`selectedVariants.${variationName}`, option)
                      }}
                    />
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
          </div>
          <div className="w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] -ml-4 -mb-4 md:-ml-6 md:-mb-6 flex items-center justify-end gap-4 border-t border-t-gray50 sticky bottom-16 md:bottom-0 bg-surface z-[999] p-4 md:py-6 md:px-8 xl:py-8 xl:px-10">
            <div className="flex justify-between md:justify-end items-center gap-4 w-full">
              <Counter value={ quantity } onQuantityChange={ setQuantity } />
              <Button
                text="Agregar"
                size={ Size.LG }
                color={ Color.ACCENT }
                variant={ Variant.CONTAINED }
                disabled={
                  !product ||
                  ( product?.variations ) && 
                  ( !product || ( hasVariations && !areAllVariantsSelected( values )))
                }
                className="w-full md:w-auto"
                submit
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
    </>
  )
}
