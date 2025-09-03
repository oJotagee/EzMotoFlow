'use client'

import { InputHTMLAttributes, TextareaHTMLAttributes, useState } from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import DatePicker, { DateObject, } from 'react-multi-date-picker';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { Button, ButtonProps } from './Button';
import { MdErrorOutline } from 'react-icons/md';
import InputMask from 'react-input-mask';
import { Title } from './Title';
import clsx from 'clsx';

interface InputFieldProps {
  testID: string
  label?: string;
  input?: InputHTMLAttributes<HTMLInputElement>
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
  return (
    <div className="relative w-full flex-1">
      <input
        {...props?.input}
        data-test-id={props.testID}
        className="px-3 w-full text-sm text-foreground bg-transparent border-0 appearance-none outline-none disabled:text-muted-foreground transition-all duration-300"
      />
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
        className="px-3 py-2 w-full text-sm text-foreground bg-transparent border-0 appearance-none outline-none disabled:text-muted-foreground transition-all duration-300 resize-none"
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
          <Title size='xs' bold='normal'>
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
        className={clsx(
          `rounded-lg w-full border gap-2 px-3 py-2.5 bg-background transition-all duration-300
           focus:ring-2 focus:ring-primary focus:border-transparent shadow-elegant
           disabled:opacity-50 disabled:cursor-not-allowed`,
          {
            'border-border text-foreground focus:ring-primary': !errorMessage,
            'border-destructive text-destructive focus:ring-destructive bg-destructive/5': errorMessage,
          }
        )}
        {...input}
        disabled={disabled}
      />
      {errorMessage && (
        <span className="text-xs text-destructive">{errorMessage}</span>
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
	return (
		<>
			<div className="relative w-full flex-1">
        {/* @ts-ignore */}
				<InputMask
					{...props?.input}
					data-test-id={props.testID}
					mask={props.mask}
					maskChar={null}
					className="px-3 w-full text-sm text-foreground bg-transparent border-0 appearance-none outline-none disabled:text-muted-foreground transition-all duration-300"
				/>
			</div>
		</>
	);
}

interface NumberInputFieldProps {
  testID: string
  label?: string;
  input?: NumericFormatProps
}

function NumberInputField(props: NumberInputFieldProps) {
  return (
    <>
      <div className="relative w-full flex-1">
        <NumericFormat
          {...props?.input}
          data-test-id={props.testID}
          className="px-3 w-full text-sm text-foreground bg-transparent border-0 appearance-none outline-none disabled:text-muted-foreground transition-all duration-300"
        />
      </div>
    </>
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
        placeholder={props.placeholder}
        currentDate={new DateObject('2023-1-1')}
        format={props.format}
        inputClass='px-3 py-2.5 w-full text-sm text-foreground bg-transparent border-0 appearance-none outline-none disabled:text-muted-foreground transition-all duration-300'
        className=""
        plugins={[
          <TimePicker position="bottom" hideSeconds />
        ]}
      />
    </div>
  )
}

interface InputRootProps {
  children: React.ReactNode | React.ReactNode[]
  error?: boolean
  withButton?: boolean
}

function InputRoot(props: InputRootProps) {
  return (
    <label className={clsx(
      `flex rounded-lg h-12 w-full items-center border gap-2 px-2 bg-background transition-all duration-300
       focus-within:ring-2 shadow-elegant hover:shadow-lg
       disabled:opacity-50 disabled:cursor-not-allowed`,
      {
        'border-border focus-within:ring-primary focus-within:border-transparent': !props.error,
        'border-destructive focus-within:ring-destructive bg-destructive/5': props.error,
        '!pr-0': props.withButton
      }
    )}>
      {props.children}
    </label>
  )
}

// Export components
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
    <div className={`w-full flex flex-col items-start gap-2 ${props.className || ''}`}>
      {props.inputFieldProps.label && (
        <label htmlFor={props.inputFieldProps.input?.id || ''}>
          <Title size='xs' bold='normal'>
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
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-destructive">
          <MdErrorOutline className="w-4 h-4" />
          {props.errorMessage}
        </small>
      )}
      {props.message && (
        <small className="mt-2 w-full text-xs font-semibold text-muted-foreground">
          {props.message}
        </small>
      )}
    </div>
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
}

export function Input(props: InputProps) {
  return (
    <div className={`w-full flex flex-col items-start gap-2 ${props.className || ''}`}>
      {props.inputFieldProps.label && (
        <label htmlFor={props.inputFieldProps.input?.id || ''}>
          <Title size='xs' bold='normal'>
            {props.inputFieldProps.label} 
            {props.required && <span className="text-destructive"> *</span>}
          </Title>
        </label>
      )}
      <InputRoot error={!!props.errorMessage}>
        {props.leftIcon && (props.leftIcon)}
        <InputField {...props.inputFieldProps} />
        {props.rightIcon && (props.rightIcon)}
      </InputRoot>
      {props.errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-destructive">
          <MdErrorOutline className="w-4 h-4" />
          {props.errorMessage}
        </small>
      )}
      {props.message && (
        <small className="mt-2 w-full text-xs font-semibold text-muted-foreground">
          {props.message}
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
    <div className={`w-full flex flex-col items-start gap-2 ${props.className || ''}`}>
      {props.textareaFieldProps.label && (
        <label htmlFor={props.textareaFieldProps.textarea?.id || ''}>
          <Title size='xs' bold='normal'>
            {props.textareaFieldProps.label}
          </Title>
        </label>
      )}
      <div className={clsx(
        `rounded-lg w-full border gap-2 p-2 bg-background transition-all duration-300
         focus-within:ring-2 shadow-elegant hover:shadow-lg min-h-24`,
        {
          'border-border focus-within:ring-primary focus-within:border-transparent': !props.errorMessage,
          'border-destructive focus-within:ring-destructive bg-destructive/5': !!props.errorMessage,
        }
      )}>
        <TextareaField {...props.textareaFieldProps} />
      </div>
      {props.errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-destructive">
          <MdErrorOutline className="w-4 h-4" />
          {props.errorMessage}
        </small>
      )}
      {props.message && (
        <small className="mt-2 w-full text-xs font-semibold text-muted-foreground">
          {props.message}
        </small>
      )}
    </div>
  )
}

interface InputWithButtonProps {
  inputFieldProps: InputFieldProps
  button: ButtonProps
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  errorMessage?: React.ReactNode
  message?: React.ReactNode
  className?: string
}

export function InputWithButton(props: InputWithButtonProps) {
  return (
    <div className={`w-full flex flex-col items-start gap-2 ${props.className || ''}`}>
      {props.inputFieldProps.label && (
        <label htmlFor={props.inputFieldProps.input?.id || ''}>
          <Title size='xs' bold='normal'>
            {props.inputFieldProps.label}
          </Title>
        </label>
      )}
      <InputRoot withButton error={!!props.errorMessage}>
        {props.leftIcon && (props.leftIcon)}
        <InputField {...props.inputFieldProps} />
        <Button
          {...props.button}
          className="rounded-none rounded-e-lg !h-full border-l border-border"
        />
      </InputRoot>
      {props.errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-destructive">
          <MdErrorOutline className="w-4 h-4" />
          {props.errorMessage}
        </small>
      )}
      {props.message && (
        <small className="mt-2 w-full text-xs font-semibold text-muted-foreground">
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
    <div className={`w-full flex flex-col items-start gap-2 ${props.className || ''}`}>
      {props.inputFieldProps.label && (
        <label htmlFor={props.inputFieldProps.input?.id || ''}>
          <Title size='xs' bold='normal'>
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
        <span className='flex items-center justify-center cursor-pointer p-2 hover:text-primary transition-colors' onClick={() => setShow(!show)}>
          {show ? <LuEyeOff className='w-5 h-5' /> : <LuEye className='w-5 h-5' />}
        </span>
      </InputRoot>
      {props.errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-destructive">
          <MdErrorOutline className="w-4 h-4" />
          {props.errorMessage}
        </small>
      )}
      {props.message && (
        <small className="mt-2 w-full text-xs font-semibold text-muted-foreground">
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
    <div className={`w-full flex flex-col items-start gap-2 ${props.className || ''}`}>
      {props.inputFieldProps.label && (
        <label htmlFor={props.inputFieldProps.input?.id || ''}>
          <Title size='xs' bold='normal'>
            {props.inputFieldProps.label}
            {props.required && <span className="text-destructive"> *</span>}
          </Title>
        </label>
      )}
      <InputRoot error={!!props.errorMessage}>
        {props.leftIcon && (props.leftIcon)}
        <MaskInputField {...props.inputFieldProps} />
        {props.rightIcon && (props.rightIcon)}
      </InputRoot>
      {props.errorMessage && (
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-destructive">
          <MdErrorOutline className="w-4 h-4" />
          {props.errorMessage}
        </small>
      )}
      {props.message && (
        <small className="mt-2 w-full text-xs font-semibold text-muted-foreground">
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
    <div className={`w-full flex flex-col items-start gap-2 ${props.className || ''}`}>
      {props.inputFieldProps.label && (
        <label htmlFor={props.inputFieldProps.testID || ''}>
          <Title size='xs' bold='normal'>
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
        <small className="mt-1 w-full text-xs flex gap-2 items-center font-semibold text-destructive">
          <MdErrorOutline className="w-4 h-4" />
          {props.errorMessage}
        </small>
      )}
      {props.message && (
        <small className="mt-2 w-full text-xs font-semibold text-muted-foreground">
          {props.message}
        </small>
      )}
    </div>
  )
}