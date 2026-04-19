import { GameCanvas } from './components/GameCanvas'
import { GameOverModal } from './components/GameOverModal'
import { HUD } from './components/HUD'
import { MainMenu } from './components/MainMenu'
import { PauseOverlay } from './components/PauseOverlay'
import { QuitConfirmModal } from './components/QuitConfirmModal'
import { useGameStore } from './store/gameStore'

// App 根据 phase / showQuitConfirm 在 Canvas 上叠加对应 UI 层。
function App() {
  const phase = useGameStore((s) => s.phase)
  const showQuitConfirm = useGameStore((s) => s.showQuitConfirm)

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#05060f]">
      <div className="relative">
        <GameCanvas />
        {phase !== 'menu' && <HUD />}
        {phase === 'menu' && <MainMenu />}
        {phase === 'paused' && !showQuitConfirm && <PauseOverlay />}
        {showQuitConfirm && <QuitConfirmModal />}
        {phase === 'gameover' && <GameOverModal />}
      </div>
    </div>
  )
}

export default App
