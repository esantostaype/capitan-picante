type ModalBackgroundProps = {
  children: React.ReactNode
  withTabs?: boolean
  isJustPage?: boolean
}

export const ModalBody = ({ children, withTabs }: ModalBackgroundProps ) => {

  return (
    <div className={`overflow-y-auto relative flex flex-col flex-1 p-4 md:p-6 lg:p-8 xl:p-10 ${ withTabs ? "-mt-10" : "" } `}>
      { children }
    </div>
  )
}