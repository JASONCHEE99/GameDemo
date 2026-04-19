import { useGameStore } from '../store/gameStore'

// 顶部 HUD:分数(左)| 命数(中,▲)| 最高分(右)。pointer-events-none 不阻挡画布。
export function HUD() {
  const score = useGameStore((s) => s.score)
  const lives = useGameStore((s) => s.lives)
  const highScore = useGameStore((s) => s.highScore)

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 font-mono text-xs text-slate-200">
      <div>
        SCORE{' '}
        <span className="text-cyan-300">
          {score.toString().padStart(6, '0')}
        </span>
      </div>
      <div className="flex items-center gap-1 text-cyan-300 drop-shadow-[0_0_4px_rgba(34,211,238,0.7)]">
        {Array.from({ length: lives }).map((_, i) => (
          <span key={i}>▲</span>
        ))}
      </div>
      <div>
        HI{' '}
        <span className="text-yellow-300">
          {highScore.toString().padStart(6, '0')}
        </span>
      </div>
    </div>
  )
}
