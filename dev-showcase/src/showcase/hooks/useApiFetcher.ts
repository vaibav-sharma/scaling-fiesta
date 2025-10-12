import { useState } from 'react'
import { apiRequest } from '@/src/utils/apiClient'

export function useApiFetcher() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiRequest({
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        operation: 'FetchPost',
        payloadType: 'json',
      })
      if (result.success) setData(result.data)
      else setError('Something went wrong')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, fetchData }
}