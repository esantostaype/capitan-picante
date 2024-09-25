interface Props {
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement | HTMLAnchorElement>
  active?: boolean
}

export const ModalBackground = ({ onClick, active }: Props ) => {

  return (
    <div className={`fixed w-full h-dvh top-0 left-0 z-[999] ${ active ? "animate-enterBackgroundModal" : "animate-leaveBackgroundModal opacity-0" }`} onClick={ onClick }>
      <div className="bg-background opacity-80 absolute top-0 left-0 w-full h-dvh"></div>
    </div>
  )
}