import { FC, useState, useRef, useEffect, KeyboardEvent } from 'react'
import Typography, { TypographyColor, TypographyType } from '../Typography/Typography'

interface InlineEditableTextProps {
  value: string
  onSave: (newValue: string) => Promise<void>
  className?: string
  placeholder?: string
  disabled?: boolean
  color?: TypographyColor
  type?: TypographyType
  showEditIcon?: boolean
}

const InlineEditableText: FC<InlineEditableTextProps> = ({
  value,
  onSave,
  className = '',
  placeholder = '',
  disabled = false,
  color = 'text-dark500',
  type = 'text-caption2',
  showEditIcon = false,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = () => {
    if (!disabled) {
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    const trimmedValue = editValue.trim()

    if (trimmedValue !== value) {
      setIsLoading(true)
      try {
        await onSave(trimmedValue)
        setIsEditing(false)
      } catch (error) {
        console.error('Failed to save:', error)
        setEditValue(value) // Reset on error
        setIsEditing(false)
      }
      setIsLoading(false)
    } else {
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  const handleBlur = () => {
    handleSave()
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={isLoading}
        className={`bg-transparent border-b border-primary100 dark:border-primary outline-none text-left text-dark900 dark:text-white ${className} ${isLoading ? 'opacity-50' : ''}`}
        style={{ minWidth: '80px', maxWidth: '120px' }}
      />
    )
  }

  return (
    <div
      className={`inline-flex items-center gap-2 cursor-pointer hover:text-primary transition-colors ${className}`}
      onClick={handleClick}
      title='Click to edit'
    >
      <Typography color={color} type={type}>
        {value || placeholder}
      </Typography>
      {showEditIcon && (
        <i className='bi bi-pencil text-xs text-dark400 hover:text-primary transition-colors' />
      )}
    </div>
  )
}

export default InlineEditableText
