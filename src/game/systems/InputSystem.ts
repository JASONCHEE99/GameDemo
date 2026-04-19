import type { InputState } from '../types'

// 键盘输入系统:维护方向键长按状态 + 暂停/退出的边沿触发标志。
// 长按状态由 GameEngine 每帧读取;边沿标志通过 consume 一次性消费。
export class InputSystem {
  private state: InputState = {
    left: false,
    right: false,
    up: false,
    down: false,
  }
  private pauseEdge = false
  private escapeEdge = false

  attach(): void {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  }

  detach(): void {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
    this.state.left = false
    this.state.right = false
    this.state.up = false
    this.state.down = false
    this.pauseEdge = false
    this.escapeEdge = false
  }

  getState(): InputState {
    return this.state
  }

  consumePauseToggle(): boolean {
    if (this.pauseEdge) {
      this.pauseEdge = false
      return true
    }
    return false
  }

  consumeEscape(): boolean {
    if (this.escapeEdge) {
      this.escapeEdge = false
      return true
    }
    return false
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.state.left = true
        break
      case 'ArrowRight':
      case 'KeyD':
        this.state.right = true
        break
      case 'ArrowUp':
      case 'KeyW':
        this.state.up = true
        break
      case 'ArrowDown':
      case 'KeyS':
        this.state.down = true
        break
      case 'Space':
        if (!e.repeat) this.pauseEdge = true
        e.preventDefault()
        break
      case 'Escape':
        if (!e.repeat) this.escapeEdge = true
        break
      default:
        return
    }
  }

  private onKeyUp = (e: KeyboardEvent): void => {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.state.left = false
        break
      case 'ArrowRight':
      case 'KeyD':
        this.state.right = false
        break
      case 'ArrowUp':
      case 'KeyW':
        this.state.up = false
        break
      case 'ArrowDown':
      case 'KeyS':
        this.state.down = false
        break
      default:
        return
    }
  }
}
