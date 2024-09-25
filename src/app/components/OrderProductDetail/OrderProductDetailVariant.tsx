import { ProductVariation } from '@/interfaces'
import { formatCurrency } from '@/utils'

interface Props {
  variation: ProductVariation
  onClick?: (option: string) => void
  selectedOption?: string
}

export const OrderProductDetailVariant = ({ variation, onClick, selectedOption } : Props ) => {
  return (
    <div>
      <h3 className="text-base font-semibold mb-2">{ variation.name }</h3>
      <div className="flex gap-2 flex-wrap">
        { variation.options.map((option, idx) => (
          <div
            onClick={() => onClick?.(option.name)}
            key={ idx }
            className={`${ option.name === selectedOption ? "border-accent" : "bg-gray50 hover:bg-gray100 active:scale-95 border-transparent" } rounded py-2 px-4 cursor-pointer border-2 transition-all`}
          >
            <div>{ option.name }</div>
            {
              option.price &&
              <div className="text-base font-bold">{ formatCurrency( option.price )}</div>
            }
          </div>
        ))}
      </div>
    </div>
  )
}
