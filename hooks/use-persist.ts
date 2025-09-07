import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react'

type POptions<T> = { key: string; def: T }
type PReturn<T> = [T, Dispatch<SetStateAction<T>>]

export function usePersist<T>({ key, def }: POptions<T>): PReturn<T> {
  const [value, setValue] = useState<T>(def)

  useEffect(() => {
    try {
      const strValue = localStorage.getItem(key)
      if (!strValue) return
      setValue(JSON.parse(strValue))
    } catch {}
  }, [key])

  const syncValue = useCallback(
    (value: SetStateAction<T>) => {
      setValue((prev) => {
        if (typeof value == 'function') {
          const newVal = (value as (val: T) => T)(prev)
          localStorage.setItem(key, JSON.stringify(newVal))
          return newVal
        }
        localStorage.setItem(key, JSON.stringify(value))
        return value as T
      })
    },
    [key]
  )

  return [value, syncValue]
}
