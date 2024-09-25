'use client'
import { Size } from '@/interfaces'
import { ChangeEvent } from 'react'

interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
  yesno?: boolean
  label?: string
  size?: Size
  disabled?: boolean
}

const getSizeClasses = ( size?: Size ) => {
  switch (size) {
    case Size.SM:
      return {
        container: 'text-xs gap-2',
        switchButton: 'w-10 h-5',
        switchButtonAfter: 'top-[3px] ml-[3px] w-[14px] h-[14px] rounded-full',
        switchButtonCheckedAfter: 'left-[calc(100%-34px)] transform translate-x-full'
      }
    case Size.LG:
      return {
        container: 'text-base gap-2',
        switchButton: 'w-14 h-7',
        switchButtonAfter: 'top-1 ml-1 w-5 h-5 rounded-full',
        switchButtonCheckedAfter: 'left-[calc(100%-48px)] transform translate-x-full'
      }
    default:
      return {
        container: 'text-sm gap-2',
        switchButton: 'w-12 h-6',
        switchButtonAfter: 'top-[3px] ml-[3px] w-[18px] h-[18px] rounded-full',
        switchButtonCheckedAfter: 'left-[calc(100%-42px)] transform translate-x-full'
      }
  }
}

export const Switch = ({ checked, onChange, label, size, disabled }: Props) => {

  const handleToggleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked)
  }

  const sizeClasses = getSizeClasses(size)

  return (
    <div className={`flex items-center ${sizeClasses.container}`}>
      <input
        type="checkbox"
        id="switch"
        name="switch"
        checked={checked}
        onChange={handleToggleChange}
        disabled={disabled}
        className="hidden"
      />
      <label
        htmlFor="switch"
        className={`cursor-pointer relative block rounded-full transition-colors duration-300 ${ sizeClasses.switchButton } 
        ${ checked ? 'bg-accent' : 'bg-gray200 hover:bg-gray300'}` }
      >
        <span
          className={`absolute bg-foreground rounded-full transition-all duration-300
            ${ checked ? sizeClasses.switchButtonCheckedAfter : ''}
            ${ sizeClasses.switchButtonAfter }`
          }
        ></span>
      </label>
      { label && (
        <label htmlFor="switch" className="ml-1">
          { label }
        </label>
      )}
    </div>
  )
}
