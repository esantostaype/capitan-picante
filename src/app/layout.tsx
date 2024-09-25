import type { Metadata } from 'next'
import '@fontsource-variable/inter'
import { ToastNotification } from '@/components'
import './globals.css'
import { OrderForm, OrderHeader, OrderSummary } from './components'

export const metadata: Metadata = {
  title: 'Restify',
  description: 'Restify es una innovadora aplicación de gestión de restaurantes diseñada para simplificar y optimizar cada aspecto de la administración de tu negocio. Con una interfaz intuitiva y herramientas potentes, Restify te ayuda a gestionar reservas, inventarios, personal y mucho más desde un solo lugar. Ideal para restauranteros modernos, Restify transforma la gestión diaria en una experiencia fluida y eficiente, permitiéndote concentrarte en lo que realmente importa: ofrecer una experiencia gastronómica excepcional a tus clientes. Simplifica, mejora y disfruta de una gestión sin complicaciones con Restify.'
}

export default function RootLayout({  children }: Readonly<{ children: React.ReactNode; }>) {
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
        </main>
      </body>
    </html>
  )
}