import { useEffect, useRef } from 'react'
import { CANVAS } from '../game/config'
import { GameEngine } from '../game/GameEngine'

// 挂载 Canvas 并启动 GameEngine。组件卸载时彻底清理 rAF 与键盘监听。
// 不再主动切换 phase——开始/重开通过 UI 按钮触发 store.resetRun(),引擎检测到转移自动复位。
export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const engine = new GameEngine(canvas)
    engine.start()
    return () => {
      engine.destroy()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS.width}
      height={CANVAS.height}
      className="block border border-slate-700 shadow-lg shadow-black/50"
    />
  )
}
