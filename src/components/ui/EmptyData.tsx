interface Props {
  text?: string
}

export const EmptyData = ({ text }: Props ) => {
  return (
    <div className="flex-1 flex items-center justify-center text-xl text-gray300">
      <div className="text-center">
        <i className="fi fi-rr-empty-set text-4xl"></i>
        <h3>Aun no hay { text || "Nada" }</h3>
      </div>
    </div>
  )
}