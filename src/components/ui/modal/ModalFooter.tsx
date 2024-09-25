type ModalFooterProps = {
  children: React.ReactNode
  isJustPage?: boolean
  withTabs?: boolean
}

export const ModalFooter = ({ children, isJustPage, withTabs }: ModalFooterProps ) => {

  return (
    <div className={`flex items-center justify-end gap-4 border-t border-t-gray50 sticky bg-surface z-[999] ${ withTabs ? "-mb-10 -bottom-10" : "bottom-0" } p-4 md:py-6 md:px-8 xl:py-8 xl:px-10`}>
      { children }
    </div>
  )
}