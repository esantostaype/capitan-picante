interface Props {
  label: string
  name: string
  checked: boolean
  onChange?: ( event: React.ChangeEvent<HTMLInputElement> ) => void
  className?: string
}

export const Checkbox = ({ label, name, checked, onChange, className = '', ...rest }: Props) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={ name }
        name={ name }
        checked={ checked }
        onChange={ onChange }
        className="hidden"
        { ...rest }
      />
      <label htmlFor={ name } className="flex items-center cursor-pointer relative w-full">
        <span className={`flex items-center justify-center rounded w-5 h-5 mr-2 border-2 relative ${ checked ? "border-accent bg-accent" : "border-gray200" }`}>
          { checked && <i className="fi fi-br-check text-xs"></i> }
        </span>
        { label }
      </label>
    </div>
  );
};
