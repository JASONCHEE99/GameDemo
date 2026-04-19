import { useGameStore } from '../store/gameStore'

// 游戏结束弹窗:显示当局分数与最高分,提供重开 / 回菜单。
// 当前 score 与 highScore 相等且非 0 视为新纪录(loseLife 已写入 highScore)。
export function GameOverModal() {
  const score = useGameStore((s) => s.score)
  const highScore = useGameStore((s) => s.highScore)
  const resetRun = useGameStore((s) => s.resetRun)
  const setPhase = useGameStore((s) => s.setPhase)
  const newRecord = score > 0 && score === highScore

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/75 font-mono">
      <div className="flex min-w-[280px] flex-col items-center gap-4 rounded border-2 border-red-400/70 bg-[#0a0e27] p-6 shadow-[0_0_24px_rgba(248,113,113,0.25)]">
        <h2 className="text-3xl font-black tracking-[0.3em] text-red-300 drop-shadow-[0_0_10px_rgba(248,113,113,0.4)]">
          GAME OVER
        </h2>
        <div className="space-y-1 text-center text-sm">
          <p className="text-slate-300">
            SCORE{' '}
            <span className="text-cyan-300">
              {score.toString().padStart(6, '0')}
            </span>
          </p>
          <p className="text-slate-300">
            BEST{' '}
            <span className="text-yellow-300">
              {highScore.toString().padStart(6, '0')}
            </span>
          </p>
          {newRecord && (
            <p className="animate-pulse text-xs uppercase tracking-widest text-yellow-300">
              ★ New Record ★
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={resetRun}
            className="rounded border border-cyan-400 bg-cyan-400/10 px-4 py-2 text-sm uppercase tracking-wider text-cyan-100 transition hover:bg-cyan-400/25"
          >
            Play Again
          </button>
          <button
            type="button"
            onClick={() => setPhase('menu')}
            className="rounded border border-slate-400 bg-slate-400/10 px-4 py-2 text-sm uppercase tracking-wider text-slate-200 transition hover:bg-slate-400/20"
          >
            Menu
          </button>
        </div>
      </div>
    </div>
  )
}
