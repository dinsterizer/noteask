import { useSearchParams } from 'react-router-dom'

export function useSearchParam(key: string): [string | null, (value: string | null) => void] {
  const [searchParams, setSearchParams] = useSearchParams()
  const value = searchParams.get(key)

  const setValue = (value: string | null) => {
    if (value === null) {
      searchParams.delete(key)
    } else {
      searchParams.set(key, value)
    }

    setSearchParams(searchParams)
  }

  return [value, setValue]
}
