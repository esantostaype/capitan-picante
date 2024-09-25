import { Color, IconButtonShape, Size, Variant } from '@/interfaces'
import Link from 'next/link'

interface Props {
  variant?: Variant
  color?: Color
  shape?: IconButtonShape
  iconName: string
  size?: Size
  full?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement | HTMLAnchorElement>
  disabled?: boolean
  submit?: boolean
  href?: string
  div?: boolean
  active?: boolean
}

export const IconButton = ({ variant, color, shape, size, iconName, full, onClick, disabled, submit, href, active }: Props) => {
  
  let colorTextClass = ""  
  let colorBgClass = ""

  switch ( color ) {
    case Color.ACCENT:
      colorTextClass = "text-accent"
      colorBgClass = "bg-accent"
      break
    case Color.SUCCESS:
      colorTextClass = "text-success"
      colorBgClass = "bg-success"
      break
    case Color.INFO:
      colorTextClass = "text-info"
      colorBgClass = "bg-info"
      break
    case Color.WARNING:
      colorTextClass = "text-warning"
      colorBgClass = "bg-warning"
      break
    case Color.ERROR:
      colorTextClass = "text-error"
      colorBgClass = "bg-error"
      break
    default:
      colorTextClass = ""
      colorBgClass = ""
      break
  }
  
  const sizeClass = size === Size.SM ? 'text-xs h-8 w-8 flex-[0_0_2rem]' : size === Size.LG ? 'text-lg h-12 w-12 flex-[0_0_3rem]' : 'h-10 w-10 flex-[0_0_2.5rem]'
  const variantContainedClass = variant === Variant.CONTAINED ? `${ color ? colorBgClass : "bg-gray200 hover:bg-gray200" } text-white` : ""
  const variantGhostClass = variant === Variant.GHOST ? `${ color ? colorBgClass : "bg-gray600" }` : ""
  const transparentClass = !variant ? "hover:bg-gray50" : ""
  const buttonType = submit ? 'submit' : 'button'
  const buttonShape = shape === IconButtonShape.SQUARE ? 'rounded' : 'rounded-full'
  const buttonClass = `${ full ? "w-full" : "" } ${ active ? "bg-gray50" : "" } ${ variantContainedClass } ${ colorTextClass } ${ sizeClass } ${ transparentClass }  ${ buttonShape } flex items-center justify-center gap-2 cursor-pointer transition-all relative overflow-hidden group/button`
  const contentButton = (
    <>
    {
      Variant.GHOST ?
      <>
      <span className="relative flex items-center z-20 gap-2">
        <i className={`fi fi-rr-${iconName}`}></i>
      </span>
      <span className={`${ variantGhostClass } absolute z-10 opacity-10 group-hover/button:opacity-20 w-full h-full top-0 left-0`}>
      </span>
      </> :
      <i className={`fi fi-rr-${iconName}`}></i>
    }
    </>
  )

	return (
    <>
    { href ? 
      <Link href={ href } className={ buttonClass } onClick={ onClick }>
        { contentButton }
      </Link>
    : 
      <button className={ buttonClass } onClick={ onClick } disabled={ disabled } type={ buttonType }>
        { contentButton }
      </button>
    }      
    </>
	)
}