import { useState, type ChangeEvent, type FormEvent } from 'react'
import { validate, type Validator } from './validators'

type Rules<T> = { [K in keyof T]?: Validator<string>[] }

export function useForm<T extends Record<string, string>>(
  initialValues: T,
  rules: Rules<T>,
  onSubmit: (values: T) => void | Promise<void>,
) {
  const [values, setValues] = useState(initialValues)
  const [submitted, setSubmitted] = useState(false)

  const errors = validate(values, rules)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length === 0) return onSubmit(values)
  }

  const fieldError = (name: keyof T) => (submitted ? errors[name] : undefined)

  return { values, handleChange, handleSubmit, fieldError }
}
