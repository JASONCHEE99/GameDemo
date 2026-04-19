import { useGameStore } from '../store/gameStore'

// 主菜单:标题 + 开始按钮 + 最高分 + 控制提示。点击 START 调用 resetRun() 进入 playing。
export function MainMenu() {
  const highScore = useGameStore((s) => s.highScore)
  const resetRun = useGameStore((s) => s.resetRun)

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-[#05060f]/95 font-mono text-slate-100">
      <div className="text-center">
        <h1 className="text-5xl font-black tracking-[0.3em] text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
          SKY
        </h1>
        <h1 className="text-5xl font-black tracking-[0.3em] text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
          STRIKER
        </h1>
      </div>

      <p className="text-sm text-slate-400">
        HIGH SCORE{' '}
        <span className="text-yellow-300">
          {highScore.toString().padStart(6, '0')}
        </span>
      </p>

      <button
        type="button"
        onClick={resetRun}
        className="rounded border-2 border-cyan-400 bg-cyan-400/10 px-10 py-3 text-lg font-bold uppercase tracking-[0.4em] text-cyan-100 transition hover:bg-cyan-400/25 hover:shadow-[0_0_18px_rgba(34,211,238,0.4)]"
      >
        Start
      </button>

      <div className="mt-4 space-y-1 text-center text-xs text-slate-500">
        <p>↑ ↓ ← → / WASD — MOVE</p>
        <p>SPACE — PAUSE</p>
        <p>ESC — RETURN TO MENU</p>
      </div>
    </div>
  )
}
