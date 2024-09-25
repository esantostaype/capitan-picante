import { Color, Size, Variant } from '@/interfaces'
import Link from 'next/link'

interface Props {
  text?: string
  variant?: Variant
  color?: Color
  iconName?: string
  size?: Size
  full?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement | HTMLAnchorElement>
  disabled?: boolean
  submit?: boolean
  href?: string
  div?: boolean
  className?: string
}

export const Button = ({ text, variant, color, size, iconName, full, onClick, disabled, submit, href, div, className }: Props) => {
  
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
  
  const sizeClass = size === Size.SM ? 'text-xs px-3 py-2' : size === Size.LG ? 'text-sm md:text-base font-semibold px-4 md:px-6 py-3 md:py-3' : 'px-3 py-2'
  const variantContainedClass = variant === Variant.CONTAINED ? `${ color ? colorBgClass : "bg-gray200 hover:bg-gray300" } text-white` : ""
  const variantGhostClass = variant === Variant.GHOST ? `${ color ? colorBgClass : "bg-gray600" }` : ""
  const transparentClass = !variant ? "hover:bg-gray50" : ""
  const buttonType = submit ? 'submit' : 'button'
  const buttonClass = `${ full ? "w-full" : "" } ${ variantContainedClass } ${ colorTextClass } ${ sizeClass } ${ transparentClass } flex items-center justify-center gap-2 cursor-pointer transition-all relative overflow-hidden rounded group/button leading-tight ${ className }`
  const contentButton = (
    <>
    {
      variant === Variant.GHOST ?
      <>
      <span className="relative flex items-center z-20 gap-2">
        { iconName && <i className={`fi fi-rr-${iconName}`}></i> }
        { text }
      </span>
      <span className={`${ variantGhostClass } absolute z-10 opacity-10 group-hover/button:opacity-20 w-full h-full top-0 left-0`}>
      </span>
      </> :
      <>
        { iconName && <i className={`fi fi-rr-${iconName}`}></i>}
        { text }
      </>
    }
    </>
  )

	return (
    <>
    { href ? (
      <Link href={ href } className={ buttonClass } onClick={ onClick }>
        { contentButton }
      </Link>
    ): ( div ? (
      <div className={ buttonClass }>
        { contentButton }
      </div>
    ) : (
      <button className={ buttonClass } onClick={ onClick } disabled={ disabled } type={ buttonType }>
        { contentButton }
      </button>
    )      
    )}      
    </>
	)
}