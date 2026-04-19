import { useGameStore } from '../store/gameStore'

// Esc 触发的退出确认。Quit 回到主菜单(当前对局丢弃),Resume 继续游戏。
export function QuitConfirmModal() {
  const cancel = useGameStore((s) => s.cancelQuitConfirm)
  const confirm = useGameStore((s) => s.confirmQuit)

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 font-mono">
      <div className="flex min-w-[260px] flex-col items-center gap-4 rounded border-2 border-cyan-400/60 bg-[#0a0e27] p-6 shadow-[0_0_24px_rgba(34,211,238,0.25)]">
        <h3 className="text-base font-bold uppercase tracking-widest text-cyan-200">
          Return to menu?
        </h3>
        <p className="text-xs text-slate-400">Current run will be lost.</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={confirm}
            className="rounded border border-red-400 bg-red-400/10 px-4 py-2 text-sm uppercase tracking-wider text-red-200 transition hover:bg-red-400/25"
          >
            Quit
          </button>
          <button
            type="button"
            onClick={cancel}
            className="rounded border border-slate-400 bg-slate-400/10 px-4 py-2 text-sm uppercase tracking-wider text-slate-200 transition hover:bg-slate-400/20"
          >
            Resume
          </button>
        </div>
      </div>
    </div>
  )
}
