import Link from 'next/link'

interface Props {
  text: string
  href: string
}
export const LinkComponent = ({ text, href }: Props) => {

  return (
    <Link href={ href } className="text-accent">{ text }</Link>
  )
}