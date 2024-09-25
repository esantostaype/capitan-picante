'use client'
import { useUiStore } from '@/store/ui-store'
import { IconButton, ModalBackground } from '@/components'
import { Color, Size, Variant } from '@/interfaces'
import { useEffect } from 'react'

interface Props {
  children: React.ReactNode
  title: string
  backText?: string
  path?: string
  withBackRoute?: boolean
  withTabs?: boolean
  isOpen?: boolean
  isEditMode?: boolean
}

export const ModalPage = ({ children, title, backText, withBackRoute, withTabs, isOpen }: Props ) => {
  
  const { activeClassModalPage, openModalPage, closeModalPage, activeOrderSummary } = useUiStore()  
  
  useEffect(() => {  
    if ( isOpen ) {
      openModalPage()
    }
  }, [ isOpen, openModalPage ])
  
  return (
    <>
    {
      ( isOpen ) && (
        <section className={ `${ activeClassModalPage ? "pointer-events-auto" : "pointer-events-none" } ${ activeOrderSummary ? "z-[9999]" : "z-[999999]" }` }>
          <div className={`${ activeClassModalPage ? "animate-enterModalPage" : "animate-leaveModalPage right-[-100%]" } z-[9999] bg-surface fixed overflow-hidden top-0 right-0 w-full md:w-1/2 md:min-w-[40rem] flex flex-col md:mt-6 h-dvh md:h-[calc(100dvh-1.5rem)] md:border-t md:border-l border-gray50 md:rounded-tl-2xl`}>
            <div className={`flex items-center gap-4 p-4 border-b border-gray50 ${ withTabs ? "md:p-6 md:pb-12 lg:p-8 lg:pb-14 xl:p-10 xl:pb-16" : "md:p-6 lg:p-8 xl:p-10" } `}>
              <IconButton iconName='arrow-left' color={ Color.ACCENT } size={ Size.LG } variant={ Variant.GHOST } onClick={ ()=> closeModalPage( withBackRoute ) }/>
              <div>
                <span className="text-xs md:text-sm text-gray600">{ backText }</span>                
                <h1 className="text-xl md:text-3xl font-semibold">{ title }</h1>
              </div>
            </div>
            { children }
          </div>
          <ModalBackground onClick={ ()=> closeModalPage( withBackRoute ) } active={ activeClassModalPage } />
        </section>
      )
    }
    </>
  )
}