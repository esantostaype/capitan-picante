import { OrderType, orderTypeTranslations } from '@/interfaces'

interface Props {
  type: OrderType
  isSelected: boolean
  onClick: () => void
}

const OrderFormTypeItem = ({ type, isSelected, onClick }: Props) => {
  return (
    <li
      className={`flex items-center flex-1 gap-4 leading-4 rounded-md p-6 cursor-pointer border-2 transition-all ${ isSelected ? 'border-accent' : 'bg-gray50 border-gray50' }`}
      onClick={ onClick }
    >
      <i className={`fi ${type === OrderType.DINE_IN ? 'fi-tr-utensils' : type === OrderType.TAKE_AWAY ? 'fi-tr-moped' : 'fi-tr-grocery-bag'} text-2xl`}></i>
      <p className="whitespace-nowrap">{ orderTypeTranslations[ type ] }</p>
    </li>
  )
}

export default OrderFormTypeItem