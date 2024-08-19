import { RangeInput } from '@ui'
import styles from './duel-page.module.css'
import { ChangeEvent, useEffect, useRef } from 'react'

import { Hero, heroOne, heroTwo } from '@entities/hero/model/hero'

const heroes = [heroOne, heroTwo]

const drawHero = (heroes: Hero[], ctx?: CanvasRenderingContext2D | null) => {
  if (ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    heroes.forEach((hero) => {
      ctx.beginPath()
      ctx.arc(hero.x, hero.y, hero.radius, 0, Math.PI * 2)
      ctx.fillStyle = hero.color
      ctx.fill()
      ctx.closePath()
      hero.spells.forEach((spell) => {
        ctx.beginPath()
        ctx.arc(spell.x, spell.y, spell.radius, 0, Math.PI * 2)
        ctx.fillStyle = spell.color
        ctx.fill()
      })
    })

    ctx.closePath()
  }
}

const updateHeroes = (heroes: Hero[], canvasHeight: number) => {
  heroes.forEach((hero) => {
    hero.move(canvasHeight)
    hero.updateSpells()
  })
}

const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
  heroes[0].setSpeed(Number(e.target.value))
}

export const DuelPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    let animationFrameId: number | null = null

    const animate = () => {
      updateHeroes(heroes, Number(canvas?.height))
      drawHero(heroes, ctx)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(Number(animationFrameId))
  }, [])

  // атаки
  useEffect(() => {
    const heroOneAttackInterval = setInterval(() => {
      heroOne.attack()
    }, heroOne.speedAttack)
    const heroTwoAttackInterval = setInterval(() => {
      heroTwo.attack()
    }, heroTwo.speedAttack)
    return () => {
      clearInterval(heroOneAttackInterval)
      clearInterval(heroTwoAttackInterval)
    }
  }, [])

  return (
    <div className="container">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className={styles.container}
      />
      {heroes.map((hero) => {
        return (
          <RangeInput
            key={hero.id + hero.color}
            onChange={(e) => onChangeInput(e)}
          />
        )
      })}
    </div>
  )
}
