'use client'
import { useEffect } from 'react'

export default function TouchDebugger() {
  useEffect(() => {
    const log = (msg: string) => console.log(`[touch] ${msg}`)
    const el = document.body

    el.addEventListener('touchstart', () => log('start'))
    el.addEventListener('touchmove', () => log('move'))
    el.addEventListener('touchend', () => log('end'))

    return () => {
      el.removeEventListener('touchstart', () => log('start'))
      el.removeEventListener('touchmove', () => log('move'))
      el.removeEventListener('touchend', () => log('end'))
    }
  }, [])

  return null
}