'use client'
import { Button } from "@/components"
import { Color, Size, Variant } from "@/interfaces"
import { useUiStore } from "@/store/ui-store"

interface Props {
  link: string
  text?: string
}

export const OpenModalPageButton = ({ link, text }: Props ) => {
  const { openModalPage } = useUiStore()
  return (
    <Button href={ link } onClick={ () => openModalPage() } text={ text || "Crear Nuevo" } color={ Color.ACCENT } variant={ Variant.CONTAINED } size={ Size.SM } />
  )
}