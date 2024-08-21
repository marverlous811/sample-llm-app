'use client'

import { invoke } from '@tauri-apps/api'
import { useEffect, useState } from 'react'

export default function Greet() {
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    invoke<string>('greet', { name: 'Nextjs' })
      .then((res) => setGreeting(res))
      .catch(console.error)
  }, [])

  return (
    <>
      <div>{greeting}</div>
    </>
  )
}
