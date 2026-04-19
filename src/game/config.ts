// 所有可调参数集中于此,严禁在其他文件出现 magic number

// ===== 画布 =====
export const CANVAS = {
  width: 480,
  height: 720,
  bgColor: '#0a0e27',
} as const

// ===== 玩家 =====
export const PLAYER = {
  width: 32,
  height: 36,
  speed: 320,
  color: '#3ab0ff',
  minYRatio: 0.75,
  maxYRatio: 0.95,
  initialLives: 3,
  invincibleTime: 1.5,
  fireInterval: 0.2,
} as const

// ===== 玩家子弹 =====
export const PLAYER_BULLET = {
  width: 4,
  height: 12,
  color: '#ffff66',
  speed: 600,
  damage: 1,
} as const

// ===== 子弹分级 =====
// threshold: 触发该档所需分数。spreadDeg=0 时按 parallelGap 横向并排;>0 时按角度散射。
export const BULLET_TIERS = [
  { threshold: 0,    color: '#ffff66', count: 1, spreadDeg: 0,  parallelGap: 0,  glow: 0,  width: 4, height: 12, label: 'T1' },
  { threshold: 500,  color: '#3ad6ff', count: 2, spreadDeg: 0,  parallelGap: 12, glow: 6,  width: 4, height: 12, label: 'T2' },
  { threshold: 1500, color: '#5cff7a', count: 3, spreadDeg: 15, parallelGap: 0,  glow: 8,  width: 5, height: 14, label: 'T3' },
  { threshold: 3000, color: '#ff5cd6', count: 5, spreadDeg: 22, parallelGap: 0,  glow: 12, width: 5, height: 16, label: 'T4' },
] as const

// ===== 难度曲线(按存活时间)=====
export const DIFFICULTY = {
  stepSeconds: 30,        // 每 30 秒进一档
  spawnMulPerStep: 0.92,  // 间隔逐档收缩(出怪更密)
  spawnMulMin: 0.4,       // 间隔下限,防止变态
  speedMulPerStep: 1.05,  // 敌速逐档加快
  speedMulMax: 1.6,       // 敌速上限
} as const

// ===== 敌机:小型 =====
export const ENEMY_SMALL = {
  width: 28,
  height: 28,
  hp: 1,
  speed: 140,
  color: '#ff4d4d',
  score: 100,
  spawnInterval: 1.5,
  perWaveMin: 2,
  perWaveMax: 4,
} as const

// ===== 敌机:中型(之字形)=====
export const ENEMY_MEDIUM = {
  width: 40,
  height: 40,
  hp: 3,
  speed: 100,
  amplitude: 120,
  frequency: 1.2,
  color: '#a050ff',
  score: 300,
  spawnInterval: 8,
} as const

// ===== 敌机:Boss =====
export const ENEMY_BOSS = {
  width: 96,
  height: 72,
  hp: 20,
  enterSpeed: 80,
  hoverY: 100,
  patrolSpeed: 120,
  color: '#ffd24d',
  score: 2000,
  spawnInterval: 60,
  fireInterval: 1.2,
  bulletSpeed: 240,
  bulletSpread: 25,
} as const

// ===== 敌方子弹 =====
export const ENEMY_BULLET = {
  width: 6,
  height: 6,
  color: '#ff8a3d',
  damage: 1,
} as const

// ===== 视觉特效 =====
export const FX = {
  particleCountOnKill: 10,
  particleSpeedMin: 80,
  particleSpeedMax: 220,
  particleLife: 0.6,
  shakeDuration: 0.05,
  shakeMagnitude: 4,
  starCount: 25,
  starSpeedMin: 30,
  starSpeedMax: 100,
} as const

// ===== 持久化 =====
export const STORAGE = {
  highScoreKey: 'sky-striker:highscore',
} as const
