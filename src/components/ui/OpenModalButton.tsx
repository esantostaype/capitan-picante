'use client'
import { Button } from "@/components"
import { Color, Size, Variant } from "@/interfaces"
import { useUiStore } from "@/store/ui-store"

interface Props {
  link: string
  text?: string
}

export const OpenModalButton = ({ link, text }: Props ) => {
  const { openModal } = useUiStore()
  return (
    <Button href={ link } onClick={ () => openModal() } text={ text || "Crear Nuevo" } color={ Color.ACCENT } variant={Variant.CONTAINED } size={ Size.SM } />
  )
}