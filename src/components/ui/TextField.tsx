'use client'

import { useState, type FC, type ChangeEvent, useEffect, Ref } from 'react'
import { ErrorMessage, Field } from 'formik'

export interface Props {
	label?: string
	type?: string
	typeField?: string
	name: string
	placeholder?: string
	asSelect?: boolean
	options?: { label: string; value: string }[]
	errors?: string
	touched?: boolean
	value?: unknown
	defaultValue?: string
	innerRef?: Ref<unknown>
	disabled?: boolean
	onChange?: (e: ChangeEvent<unknown>) => void
}

export const TextField: FC<Props> = ({
	type,
	typeField,
	label,
	touched,
	name,
	placeholder,
	asSelect,
	options = [],
	errors,
	value,
	innerRef,
	disabled,
	onChange,
}) => {
	const [ isActive, setIsActive ] = useState( false )
	const [ isFilled, setIsFilled ] = useState( false )

	useEffect(() => {
		setIsFilled(!!value)
	}, [value])

	const handleFieldFocus = () => setIsActive( true )
	const handleFieldBlur = () => setIsActive( false )
	const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
		setIsFilled(!!e.target.value)
		if ( onChange ) onChange(e)
	}

	const hasError = errors && touched
	const labelClasses = `
		absolute pointer-events-none px-2 left-[10px] z-20 leading-4 transition-all bg-surface
		${ isActive && !hasError ? 'text-accent text-xs top-[-6px]' : ''}
		${ isFilled && !isActive || ( asSelect && !isActive && !hasError ) ? 'text-gray600 bg-surface text-xs top-[-6px]' : ''}
		${ hasError && !isActive && !asSelect ? 'text-error top-4' : ''}
		${ hasError && ( isActive || asSelect ) ? 'text-error text-xs top-[-6px]' : isFilled || asSelect ? 'group-hover:text-accent' : ""}
		${ !isActive && !isFilled && !hasError && 'top-4 text-gray600'}
	`

	const inputClasses = `
		transition-all border-2 px-4 py-3 outline-none w-full placeholder:text-gray400
		${ isActive && !hasError ? 'placeholder:opacity-100 border-accent' : !hasError ? 'border-gray100' : ''}
		${ hasError && !isActive && label ? 'placeholder:opacity-0 border-error' : hasError && isActive ? 'placeholder:opacity-100 border-error' : isActive ? 'placeholder:opacity-100 group-hover:border-accent' : !label ? 'placeholder:opacity-100 group-hover:border-accent' : 'placeholder:opacity-0 group-hover:border-accent'}
	`

	return (
		<div
			className={`relative transition-all w-full ${ disabled ? 'disabled' : '' } group `}
			onFocus={ handleFieldFocus }
			onBlur={ handleFieldBlur }
			onChange={ handleFieldChange }
		>
			<label htmlFor={ name } className={ labelClasses }>
				{ label }
			</label>
			{ asSelect ? (
				<Field
					as="select"
					name={ name }
					className={`${ inputClasses } px-3`}
					autoComplete="off"
					innerRef={ innerRef }
					disabled={ disabled }
				>
					{ options.map( option => (
						<option key={option.value} value={option.value}>
							{ option.label }
						</option>
					))}
				</Field>
			) : (
				<Field
					as={ typeField }
					type={ type }
					name={ name }
					placeholder={ placeholder }
					className={ inputClasses }
					autoComplete="off"
					innerRef={ innerRef }
					disabled={ disabled }
					value={ value }
				/>
			)}
			<div>
				<ErrorMessage name={ name } component="span" className="text-xs text-error mt-2 block text-left" />
			</div>
		</div>
	)
}