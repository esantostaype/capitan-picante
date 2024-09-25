interface Props {
  children: React.ReactNode
  withTabs?: boolean
}

export const ModalHeader = ({ children }: Props ) => {

  return (
    <div className="flex items-center md:h-auto p-4 md:p-6 md:py-4 lg:py-6 lg:p-8 xl:px-10 border-b border-b-gray50 bg-surface sticky top-0 z-20">
      { children }
    </div>
  )
}