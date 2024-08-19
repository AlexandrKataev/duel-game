interface HeroCreateDto {
  id: number
  x: number
  y: number
  radius: number
  color: string
  direction: number
  speed: number
  colorAttack: string
  speedAttack: number
  directionAttack: number
  spells: Spell[]
}

type HeroUpdateDto = Partial<HeroCreateDto>

export interface Spell {
  id: number
  x: number
  y: number
  radius: number
  color: string
  direction: number
  speed: number
}

type SpellUpdateDto = Partial<Spell>

export class Hero {
  public id: number
  public x: number
  public y: number
  public radius: number
  public color: string
  public direction: number
  public speed: number
  public colorAttack: string
  public speedAttack: number
  public directionAttack: number
  public spells: Spell[] = []

  constructor({
    id,
    x,
    y,
    radius,
    color,
    direction,
    speed,
    colorAttack,
    speedAttack,
    directionAttack,
    spells = [],
  }: HeroCreateDto) {
    this.id = id
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.direction = direction
    this.speed = speed
    this.colorAttack = colorAttack
    this.speedAttack = speedAttack
    this.directionAttack = directionAttack
    this.spells = spells
  }

  setSpeed(speed: number) {
    this.speed = speed
  }

  

  moveHero() {
    this.y += this.direction * this.speed

    if (this.y + this.radius > Number(canvasRef.current?.height)) {
      thi.direction = -1 // Изменение направления
      dispatch(
        updateHero({
          heroId: hero.id,
          updateHeroDto: { direction: hero.direction },
        })
      )
    }
  }

  update({
    id,
    x,
    y,
    radius,
    color,
    direction,
    speed,
    colorAttack,
    speedAttack,
    directionAttack,
    spells,
  }: HeroUpdateDto) {
    Object.assign(this, {
      id,
      x,
      y,
      radius,
      color,
      direction,
      speed,
      colorAttack,
      speedAttack,
      directionAttack,
      spells,
    })
  }

  attack() {
    this.spells.push({
      id: Math.random(),
      color: this.colorAttack,
      direction: this.directionAttack,
      radius: 10,
      speed: this.speedAttack,
      x: this.x,
      y: this.y,
    })
  }

  updateSpells() {
    this.spells.filter((spell) => {
      return spell.x < 800 && spell.x > 0
    })
  }
}
