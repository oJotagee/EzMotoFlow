'use client'

import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, useState, useEffect } from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import DatePicker, { DateObject, } from 'react-multi-date-picker';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { MdErrorOutline } from 'react-icons/md';
import { IMaskInput } from 'react-imask';
import clsx from 'clsx';
import { Title } from '../Title';

interface InputFieldProps {
  testID: string
  label?: string;
  input?: InputHTMLAttributes<HTMLInputElement>
  rightIcon?: React.ReactElement;
}

const ptBR = {
  name: "ptBR",
  weekDays: [
    ["Dom", "D"],
    ["Seg", "S"],
    ["Ter", "T"],
    ["Qua", "Q"],
    ["Qui", "Q"],
    ["Sex", "S"],
    ["Sáb", "S"]
  ],
  months: [
    ["Janeiro", "Jan"],
    ["Fevereiro", "Fev"],
    ["Março", "Mar"],
    ["Abril", "Abr"],
    ["Maio", "Mai"],
    ["Junho", "Jun"],
    ["Julho", "Jul"],
    ["Agosto", "Ago"],
    ["Setembro", "Set"],
    ["Outubro", "Out"],
    ["Novembro", "Nov"],
    ["Dezembro", "Dez"]
  ],
  today: "Hoje",
  clear: "Limpar",
  digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  meridiems: [
    ["AM", "AM"],
    ["PM", "PM"]
  ],
  rtl: false,
};

function InputField(props: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  // Determinar automaticamente se o input tem valor
  useEffect(() => {
    const inputValue = props.input?.value || props.input?.defaultValue || '';
    setHasValue(!!inputValue);
  }, [props.input?.value, props.input?.defaultValue]);

  // Detectar automaticamente os estados baseado no valor e props nativas
  const isDisabled = props.input?.disabled;
  const isReadOnly = props.input?.readOnly;

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = (event) => {
    setIsFocused(true);
    props.input?.onFocus && props.input.onFocus(event);
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
    setIsFocused(false);
    props.input?.onBlur && props.input.onBlur(event);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setHasValue(!!event.target.value);
    props.input?.onChange && props.input.onChange(event);
  };

  const getInputClasses = () => {
    // Estado Disabled (detectado automaticamente)
    if (isDisabled) {
      return "text-gray-400 opacity-40";
    }
    
    // Estado Read-Only (detectado automaticamente)
    if (isReadOnly) {
      return "text-gray-700 cursor-default";
    }

    // Estado Focused (detectado automaticamente)
    if (isFocused) {
      return "text-gray-900";
    }

    // Estado Filled (detectado automaticamente)
    if (hasValue) {
      return "text-gray-900";
    }

    // Estado Placeholder (padrão)
    return "text-gray-900";
  };

  return (
    <div className="relative w-full flex-1">
      <input
        {...props?.input}
        data-test-id={props.testID}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        className={clsx(
          "px-2 w-full text-sm bg-transparent border-0 appearance-none outline-none text-gray-900 transition-all duration-300",
          getInputClasses()
        )}
      />
      {props.rightIcon && (
        <div className={clsx(
          "absolute right-2 top-1/2 transform -translate-y-1/2",
          isDisabled ? "text-gray-300" : "text-gray-400"
        )}>
          {props.rightIcon}
        </div>
      )}
    </div>
  )
}

interface TextareaFieldProps {
  testID: string
  label?: string;
  textarea?: TextareaHTMLAttributes<HTMLTextAreaElement>
}

function TextareaField(props: TextareaFieldProps) {
  return (
    <div className="relative w-full flex-1">
      <textarea
        {...props?.textarea}
        data-test-id={props.testID}
        className="px-2 w-full text-sm text-gray-700 bg-transparent border-0 appearance-none outline-none disabled:text-gray-500 transition-all duration-300 resize-none"
      />
    </div>
  )
}

interface DecimalInputProps {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  input?: Partial<NumericFormatProps>;
  className?: string;
  errorMessage?: string;
  disabled?: boolean
}

export default function DecimalInput({
  label = 'Valor',
  value,
  onChange,
  placeholder = 'R$ 0,00',
  input = {},
  className = '',
  errorMessage,
  disabled
}: DecimalInputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={input?.id || ''}>
          <Title
            size='xs'
            bold='normal'
          >
            {label}
          </Title>
        </label>
      )}
      <NumericFormat
        value={value}
        onValueChange={(values) => onChange && onChange(values.value)}
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={20}
        allowNegative={false}
        allowLeadingZeros={false}
        placeholder={placeholder}
        className={` rounded w-full border border-gray-400 gap-2 p-2 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-none focus-within:!bg-white [&:has(textarea:disabled)]:!bg-gray-200 [&:has(textarea:disabled)]!ring-0 [&:has(textarea:disabled)]!border [&:has(textarea:disabled)]!border-gray-300 [&:has(textarea:disabled)]!text-gray-500 ${
          errorMessage
            ? 'border-red-500 focus:ring-red-400'
            : 'border-gray-300 focus:ring-blue-500'
        } ${
             input?.disabled ? 'opacity-60  pointer-events-none' : ''
        }`}
        {...input}
      />
      {errorMessage && (
        <span className="text-xs text-red-500">{errorMessage}</span>
      )}
    </div>
  );
}

interface MaskInputFieldProps {
  testID: string
  mask: string
  label?: string;
  input?: InputHTMLAttributes<HTMLInputElement>
}


function MaskInputField(props: MaskInputFieldProps) {
	const { mask, input, testID } = props;
	
	// Converte a máscara para o formato do react-imask
	const getIMaskPattern = (maskPattern: string) => {
		if (maskPattern === '99999-999') {
			return '00000-000';
		}
		return maskPattern;
	};
	
	return (
    <div className="relative w-full flex-1">
      {/* @ts-ignore */}
      <IMaskInput
        {...input}
        data-test-id={testID}
        mask={getIMaskPattern(mask)}
        unmask={false}
        className="px-2 w-full text-sm text-gray-700 bg-transparent border-0 appearance-none outline-none disabled:text-gray-500 transition-all duration-300"
      />
    </div>
	);
}


interface NumberInputFieldProps {
  testID: string
  label?: string;
  input?: NumericFormatProps
}

function NumberInputField(props: NumberInputFieldProps) {
  return (
    <div className="relative w-full flex-1">
      <NumericFormat
        {...props?.input}
        data-test-id={props.testID}
        className="px-2 w-full text-sm text-gray-700 bg-transparent border-0 appearance-none outline-none disabled:text-gray-500 transition-all duration-300"
      />
    </div>
  )
}

interface DateFieldProps {
  testID: string
  label?: string;
  value: any
  onChange: (e: any) => void
  placeholder: string
  disabled?: boolean
  multiple?: boolean
  format?: string;
}

function DateField(props: DateFieldProps) {
  return (
    <div className="relative w-full flex-1">
      <DatePicker
        id={props.testID}
        data-test-id={props.testID}
        value={props.value}
        onChange={(selectedDates: DateObject | null) => props.onChange(selectedDates as any)}
        editable={false}
        disabled={props.disabled}
        locale={ptBR}
        //multiple
        //disableMonthPicker
        //hideMonth
        //buttons={false}
        //weekDays={[]}
        //months={[]}
        placeholder={props.placeholder}
        //hideWeekDays
        currentDate={new DateObject('2023-1-1')}
        //numberOfMonths={0}
        //onMonthChange={() => ''}
        //hideYear
        //disableYearPicker
        format={props.format}
        inputClass='px-2 w-full text-sm text-gray-700 bg-transparent border-0 appearance-none outline-none disabled:text-gray-500 transition-all duration-300'
        className=""
        plugins={[
          <TimePicker position="bottom" hideSeconds />
        ]}
      />
    </div>
  )
}

interface NumberInputProps {
  inputFieldProps: NumberInputFieldProps
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  errorMessage?: React.ReactNode
  message?: React.ReactNode
  className?: string
}

export function NumberInput(props: NumberInputProps) {
  return (
    <div className={`w-full flex flex-col items-start gap-1 ${props.className || ''}`}>
      {props.inputFieldProps.label && (
        <label htmlFor={props.inputFieldProps.input?.id || ''}>
          <Title
            size='xs'
            bold='normal'
          >
            {props.inputFieldProps.label}
          </Title>
        </label>
      )}
      <InputRoot error={!!props.errorMessage}>
        {props.leftIcon && (props.leftIcon)}
        <NumberInputField {...props.inputFieldProps} />
        {props.rightIcon && (props.rightIcon)}
      </InputRoot>
      {props.errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-red-500">
          <MdErrorOutline className="w-4 h-4" />
          {props.errorMessage}
        </small>
      )}
      {props.message && (
        <small className="mt-2 w-full text-xs font-semibold text-gray-600">
          {props.message}
        </small>
      )}
    </div>
  )
}

interface InputRootProps {
  children: React.ReactNode | React.ReactNode[]
  error?: boolean
  withButton?: boolean
  variant?: 'default' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

function InputRoot(props: InputRootProps) {
  const sizeClasses = {
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-14',
  };

  const variantClasses = {
    default: 'border-gray-300 focus-within:ring-blue-500',
    success: 'border-green-500 focus-within:ring-blue-500',
    error: 'border-red-500 focus-within:ring-red-500',
  };

  return (
    <label className={clsx(
      `flex rounded w-full items-center border gap-2 px-2 bg-white focus-within:ring-2 focus-within:border-none focus-within:!bg-white transition-all duration-300`,
      sizeClasses[props.size || 'md'],
      variantClasses[props.variant || 'default'],
      {
        "ring-red-500 ring-2 border-0 text-red-500 !bg-red-50": props.error,
        "!pr-0": props.withButton
      }
    )}>
      {props.children}
    </label>
  )
}

interface InputProps {
  inputFieldProps: InputFieldProps
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  errorMessage?: React.ReactNode
  message?: React.ReactNode
  className?: string
  required?: boolean
  variant?: 'default' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

export function Input(props: InputProps) {
  const {
    inputFieldProps,
    leftIcon,
    rightIcon,
    errorMessage,
    message,
    className = '',
    required = false,
    variant = 'default',
    size = 'md',
  } = props;

  const finalVariant = errorMessage ? 'error' : variant;

  return (
    <div className={`w-full flex flex-col items-start gap-1 ${className}`}>
      {inputFieldProps.label && (
        <label htmlFor={inputFieldProps.input?.id || inputFieldProps.testID}>
          <Title
            size='xs'
            bold='normal'
          >
            {inputFieldProps.label} 
            {required && <span className="text-red-500"> *</span>}
          </Title>
        </label>
      )}
      <InputRoot error={!!errorMessage} variant={finalVariant} size={size}>
        {leftIcon && leftIcon}
        <InputField {...inputFieldProps} rightIcon={rightIcon} />
      </InputRoot>
      {errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-red-500">
          <MdErrorOutline className="w-4 h-4" />
          {errorMessage}
        </small>
      )}
      {message && (
        <small className="mt-2 w-full text-xs font-semibold text-gray-600">
          {message}
        </small>
      )}
    </div>
  )
}

interface TextareaProps {
  textareaFieldProps: TextareaFieldProps
  errorMessage?: React.ReactNode
  message?: React.ReactNode
  className?: string
}

export function Textarea(props: TextareaProps) {
  return (
    <div className={`w-full flex flex-col items-start gap-1 ${props.className || ''}`}>
      {props.textareaFieldProps.label && (
        <label htmlFor={props.textareaFieldProps.textarea?.id || ''}>
          <Title
            size='xs'
            bold='normal'
          >
            {props.textareaFieldProps.label}
          </Title>
        </label>
      )}
      <div className={clsx(`rounded w-full border border-gray-400 gap-2 p-2 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:!bg-white focus-within:text-gray-500 [&:has(textarea:disabled)]:!bg-gray-200 [&:has(textarea:disabled)]!ring-0 [&:has(textarea:disabled)]!border [&:has(textarea:disabled)]!border-gray-300 [&:has(textarea:disabled)]!text-gray-500`, {
        "ring-red-500 ring-2 border-0 text-red-500 !bg-red-50": !!props.errorMessage,
      })}>
        <TextareaField {...props.textareaFieldProps} />
      </div>
      {props.errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-red-500">
          <MdErrorOutline className="w-4 h-4" />
          {props.errorMessage}
        </small>
      )}
      {props.message && (
        <small className="mt-2 w-full text-xs font-semibold text-gray-600">
          {props.message}
        </small>
      )}
    </div>
  )
}

interface PasswordInputProps {
  inputFieldProps: InputFieldProps
  leftIcon?: React.ReactElement
  errorMessage?: React.ReactNode
  message?: React.ReactNode
  className?: string
}

export function PasswordInput(props: PasswordInputProps) {
  const [show, setShow] = useState(false)

  return (
    <div className={`w-full flex flex-col items-start gap-1 ${props.className || ''}`}>
      {props.inputFieldProps.label && (
        <label htmlFor={props.inputFieldProps.input?.id || ''}>
          <Title
            size='xs'
            bold='normal'
          >
            {props.inputFieldProps.label}
          </Title>
        </label>
      )}
      <InputRoot error={!!props.errorMessage}>
        {props.leftIcon && (props.leftIcon)}
        <InputField {...props.inputFieldProps} input={{
          ...props.inputFieldProps.input,
          type: show ? 'text' : 'password'
        }} />
        <span className='flex items-center justify-center cursor-pointer' onClick={() => setShow(!show)}>
          {show ? <LuEyeOff className='w-6 h-6' /> : <LuEye className='w-6 h-6' />}
        </span>
      </InputRoot>
      {props.errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-red-500">
          <MdErrorOutline className="w-4 h-4" />
          {props.errorMessage}
        </small>
      )}
      {props.message && (
        <small className="mt-2 w-full text-xs font-semibold text-gray-600">
          {props.message}
        </small>
      )}
    </div>
  )
}

interface MaskInputProps {
  inputFieldProps: MaskInputFieldProps
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  errorMessage?: React.ReactNode
  message?: React.ReactNode
  className?: string
  required?: boolean
}

export function MaskInput(props: MaskInputProps) {
  return (
    <div className={`w-full flex flex-col items-start gap-1 ${props.className || ''}`}>
      {props.inputFieldProps.label && (
        <label htmlFor={props.inputFieldProps.input?.id || ''}>
          <Title
            size='xs'
            bold='normal'
          >
            {props.inputFieldProps.label}
            {props.required && <span className="text-red-500"> *</span>}
          </Title>
        </label>
      )}
      <InputRoot error={!!props.errorMessage}>
        {props.leftIcon && (props.leftIcon)}
        <MaskInputField {...props.inputFieldProps} />
        {props.rightIcon && (props.rightIcon)}
      </InputRoot>
      {props.errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-red-500">
          <MdErrorOutline className="w-4 h-4" />
          {props.errorMessage}
        </small>
      )}
      {props.message && (
        <small className="mt-2 w-full text-xs font-semibold text-gray-600">
          {props.message}
        </small>
      )}
    </div>
  )
}

interface DateInputProps {
  inputFieldProps: DateFieldProps
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  errorMessage?: React.ReactNode
  message?: React.ReactNode
  className?: string
}

export function DateInput(props: DateInputProps) {
  return (
    <div className={`w-full flex flex-col items-start gap-1 ${props.className || ''}`}>
      {props.inputFieldProps.label && (
        <label htmlFor={props.inputFieldProps.testID || ''}>
          <Title
            size='xs'
            bold='normal'
          >
            {props.inputFieldProps.label}
          </Title>
        </label>
      )}
      <InputRoot error={!!props.errorMessage}>
        {props.leftIcon && (props.leftIcon)}
        <DateField {...props.inputFieldProps} />
        {props.rightIcon && (props.rightIcon)}
      </InputRoot>
      {props.errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-red-500">
          <MdErrorOutline className="w-4 h-4" />
          {props.errorMessage}
        </small>
      )}
      {props.message && (
        <small className="mt-2 w-full text-xs font-semibold text-gray-600">
          {props.message}
        </small>
      )}
    </div>
  )
}

interface SelectFieldProps {
  testID: string
  label?: string;
  options: { value: string; label: string }[];
  select?: SelectHTMLAttributes<HTMLSelectElement>
}

function SelectField(props: SelectFieldProps) {
  return (
    <div className="relative w-full flex-1">
      <select
        {...props?.select}
        data-test-id={props.testID}
        className="px-2 w-full text-sm text-gray-700 bg-transparent border-0 appearance-none outline-none disabled:text-gray-500 transition-all duration-300"
      >
        <option value="">Selecione uma opção</option>
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface SelectProps {
  inputFieldProps: SelectFieldProps
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  errorMessage?: React.ReactNode
  message?: React.ReactNode
  className?: string
  required?: boolean
  variant?: 'default' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

export function Select(props: SelectProps) {
  const {
    inputFieldProps,
    leftIcon,
    rightIcon,
    errorMessage,
    message,
    className = '',
    required = false,
    variant = 'default',
    size = 'md',
  } = props;

  const finalVariant = errorMessage ? 'error' : variant;

  return (
    <div className={`w-full flex flex-col items-start gap-1 ${className}`}>
      {inputFieldProps.label && (
        <label htmlFor={inputFieldProps.select?.id || inputFieldProps.testID}>
          <Title
            size='xs'
            bold='normal'
          >
            {inputFieldProps.label} 
            {required && <span className="text-red-500"> *</span>}
          </Title>
        </label>
      )}
      <InputRoot error={!!errorMessage} variant={finalVariant} size={size}>
        {leftIcon && leftIcon}
        <SelectField {...inputFieldProps} />
        {rightIcon && rightIcon}
      </InputRoot>
      {errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-red-500">
          <MdErrorOutline className="w-4 h-4" />
          {errorMessage}
        </small>
      )}
      {message && (
        <small className="mt-2 w-full text-xs font-semibold text-gray-600">
          {message}
        </small>
      )}
    </div>
  )
}