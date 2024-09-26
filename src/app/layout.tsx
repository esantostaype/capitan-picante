import type { Metadata } from 'next'
import '@fontsource-variable/inter'
import '@fontsource-variable/roboto-condensed'
import { ToastNotification } from '@/components'
import './globals.css'
import { OrderForm, OrderHeader, OrderSummary } from './components'

export const metadata: Metadata = {
  title: 'Capitán Picante'
}

export default function RootLayout({
  children,
  modal
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html lang="es">
      <body suppressHydrationWarning={ true } className="bg-background text-foreground">
        <main className="app">
          <section className="flex flex-col md:flex-row min-h-dvh">
            <section className="flex flex-1 flex-col pb-16 md:pb-0">
              <OrderHeader/>
              <div className='flex flex-1 flex-col'>
                { children }
              </div>
            </section>
            <OrderSummary/>
          </section>
          <OrderForm/>
          <ToastNotification/>
          { modal }
        </main>
      </body>
    </html>
  )
}