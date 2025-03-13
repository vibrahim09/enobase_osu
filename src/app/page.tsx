"use client"
import { Canvas } from '@/components/Canvas'

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden canvas-background">
      <div className="p-8 min-h-full min-w-full overflow-auto no-scrollbar">
        <Canvas />
      </div>
    </main>
  )
}

declare global {
  interface Window {
    __canvas: any
  }
}
