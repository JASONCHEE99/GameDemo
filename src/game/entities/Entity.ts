// 实体基类:所有可见对象继承此类。坐标 (x,y) 表示左上角。
export abstract class Entity {
  x: number
  y: number
  vx = 0
  vy = 0
  width: number
  height: number
  alive = true

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
}
