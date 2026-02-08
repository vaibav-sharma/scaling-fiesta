'use client'

import { useAPIKeyStore } from '@/src/store/apiKeyStore'

export function useGoogleApiKey() {
  const { googleApiKey } = useAPIKeyStore()

  const callLLM = async (prompt: string, model = 'gemini-pro') => {
    if (!googleApiKey) {
      throw new Error('API key not configured. Please set it up from settings.')
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${googleApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    } catch (error) {
      console.error('LLM call error:', error)
      throw error
    }
  }

  return {
    googleApiKey,
    callLLM,
    isConfigured: !!googleApiKey,
  }
}
