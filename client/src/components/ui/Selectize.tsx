'use client'

import { useState, useRef, useEffect } from 'react'
import { Title } from './Title'
import { Subtitle } from './Subtitle'
import { X, ChevronDown, Search } from 'lucide-react'
import clsx from 'clsx'

export interface SelectizeItem {
  text: string
  value: string
}

interface SelectizeProps {
  allOptions: SelectizeItem[]
  selectedOptions: SelectizeItem[]
  setSelectedOptions: (items: SelectizeItem[]) => void
  
  active?: boolean
  query?: string
  setQuery?: (query: string) => void
  
  hiddenLabel?: boolean
  label?: string
  sublabel?: string
  multiple?: boolean
  placeholder?: string
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  search?: boolean
  
  className?: string
}

export function Selectize({
  active = false,
  multiple = false,
  placeholder = "Selecione uma opção",
  disabled = false,
  error = false,
  errorMessage,
  search = true,
  className,
  ...props
}: SelectizeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localQuery, setLocalQuery] = useState('')
  const [localActive, setLocalActive] = useState(active)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const query = props.query ?? localQuery
  const setQuery = props.setQuery ?? setLocalQuery
  const isActive = active

  const availableOptions = props.allOptions.filter(
    (option) => !props.selectedOptions.some((selected) => selected.value === option.value)
  )

  const filteredOptions = availableOptions.filter((option) =>
    option.text.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setLocalActive(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = () => {
    if (disabled) return
    setIsOpen(!isOpen)
    setLocalActive(!isOpen)
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const selectOption = (option: SelectizeItem) => {
    if (multiple) {
      props.setSelectedOptions([...props.selectedOptions, option])
    } else {
      props.setSelectedOptions([option])
      setIsOpen(false)
      setLocalActive(false)
    }
    setQuery('')
  }

  const removeOption = (valueToRemove: string) => {
    props.setSelectedOptions(
      props.selectedOptions.filter((option) => option.value !== valueToRemove)
    )
  }

  const clearAll = () => {
    props.setSelectedOptions([])
    setQuery('')
  }

  return (
    <div className={clsx("flex flex-col gap-2 w-full", className)}>
      {!props.hiddenLabel && props.label && (
        <div className="flex flex-col gap-0">
          <Title size="xs" bold="normal">{props.label}</Title>
          {props.sublabel && <Subtitle size="xs">{props.sublabel}</Subtitle>}
        </div>
      )}

      <div className="relative" ref={dropdownRef}>
        <div
          className={clsx(
            "flex rounded-lg h-12 w-full items-center border gap-2 px-3 bg-background transition-all duration-300 cursor-pointer",
            "focus-within:ring-2 shadow-elegant hover:shadow-lg",
            {
              'border-border focus-within:ring-primary focus-within:border-transparent': !error && !disabled,
              'border-destructive focus-within:ring-destructive bg-destructive/5': error,
              'border-muted bg-muted/50 cursor-not-allowed': disabled,
              'ring-2 ring-primary border-transparent': isActive
            }
          )}
          onClick={toggleDropdown}
        >
          <div className="flex flex-wrap items-center gap-1 flex-1 min-w-0">
            {props.selectedOptions.length > 0 ? (
              props.selectedOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
                >
                  <span className="w-fit">{option.text}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeOption(option.value)
                    }}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                    title="Remover opção"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">
                {placeholder}
              </span>
            )}
          </div>

          {multiple && props.selectedOptions.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                clearAll()
              }}
              className="p-1 hover:bg-muted rounded-md transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}

          <ChevronDown 
            className={clsx(
              "w-4 h-4 text-muted-foreground transition-transform duration-200",
              { "rotate-180": isOpen }
            )} 
          />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-hidden">
            {search && (
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar opções..."
                    className="w-full pl-10 pr-3 py-2 bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            )}

            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => selectOption(option)}
                    className="px-3 py-2 hover:bg-muted cursor-pointer transition-colors text-sm text-foreground"
                  >
                    {option.text}
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  {query ? 'Nenhuma opção encontrada' : 'Nenhuma opção disponível'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && errorMessage && (
        <span className="text-xs text-destructive">{errorMessage}</span>
      )}
    </div>
  )
}
