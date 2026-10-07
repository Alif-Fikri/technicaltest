export type Validator<T> = (value: T) => string | undefined

export const required =
  (label: string): Validator<string> =>
  (value) =>
    value.trim() ? undefined : `${label} wajib diisi`

export function validate<T extends Record<string, string>>(
  values: T,
  rules: { [K in keyof T]?: Validator<string>[] },
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {}
  for (const key of Object.keys(rules) as (keyof T)[]) {
    for (const rule of rules[key] ?? []) {
      const message = rule(values[key])
      if (message) {
        errors[key] = message
        break
      }
    }
  }
  return errors
}
