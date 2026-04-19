// 暂停遮罩:Space 继续 / Esc 打开退出确认。无需自身处理键盘,引擎已读取 Space。
export function PauseOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55 font-mono">
      <h2 className="text-4xl font-black tracking-[0.3em] text-cyan-200 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
        PAUSED
      </h2>
      <p className="text-xs text-slate-400">
        SPACE TO RESUME · ESC TO QUIT
      </p>
    </div>
  )
}
