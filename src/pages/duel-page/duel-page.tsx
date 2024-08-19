import { RangeInput } from '@ui'
import styles from './duel-page.module.css'
import { ChangeEvent, useEffect, useRef, useState } from 'react'

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

const onChangeOneSpeed = (e: ChangeEvent<HTMLInputElement>) => {
  heroes[0].setSpeed(Number(e.target.value))
}

const onChangeTwoSpeed = (e: ChangeEvent<HTMLInputElement>) => {
  heroes[1].setSpeed(Number(e.target.value))
}

export const DuelPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [heroCoordinates, setHeroCoordinates] = useState<{
    x: number
    y: number
  } | null>(null)
  const [cursorCoordinates, setCursorCoordinates] = useState<{
    x: number
    y: number
  } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    let animationFrameId: number | null = null

    const animate = () => {
      updateHeroes(heroes, Number(canvas?.height))
      drawHero(heroes, ctx)
      setHeroCoordinates({ x: heroes[0].x, y: heroes[0].y })
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

  useEffect(() => {
    const canvas = canvasRef.current
    const handleMouseMove = (e: MouseEvent) => {
      if (canvas) {
        const rect = canvas.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / canvas?.offsetWidth) * 800
        const y = ((e.clientY - rect.top) / canvas?.offsetHeight) * 600
        setCursorCoordinates({ x, y })
        if (heroes[0].isPointInside(x, y)) {
          heroes[0].changeDirection()
        }
      }
    }
    canvas?.addEventListener('mousemove', handleMouseMove)
    return () => {
      canvas?.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    console.log(heroCoordinates?.x, cursorCoordinates?.x)
    if (
      cursorCoordinates?.y - heroCoordinates?.y < 30 &&
      cursorCoordinates?.y - heroCoordinates?.y > 0 &&
      cursorCoordinates?.x > 10 &&
      cursorCoordinates?.x < 90 &&
      heroOne.direction === 1
    ) {
      heroOne.changeDirection()
    }

    if (
      heroCoordinates?.y - cursorCoordinates?.y < 30 &&
      heroCoordinates?.y - cursorCoordinates?.y > 0 &&
      cursorCoordinates?.x > 10 &&
      cursorCoordinates?.x < 90 &&
      heroOne.direction === -1
    ) {
      heroOne.changeDirection()
    }
  }, [heroCoordinates, cursorCoordinates])

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <h2 className={styles.title}>Speed</h2>
        <RangeInput onChange={(e) => onChangeOneSpeed(e)} />
        <div className={styles.score} style={{ color: heroOne.color }}>
          4
        </div>
        <h2 className={styles.title}>Attack Speed</h2>
        <RangeInput onChange={(e) => onChangeOneSpeed(e)} />
      </div>
      <div className={styles['canvas-wrapper']}>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className={styles.container}
        />
      </div>

      <div className={styles.panel}>
        <h2 className={styles.title}>Speed</h2>
        <RangeInput onChange={(e) => onChangeTwoSpeed(e)} />
        <div className={styles.score} style={{ color: heroTwo.color }}>
          10
        </div>
        <h2 className={styles.title}>Attack Speed</h2>
        <RangeInput onChange={(e) => onChangeOneSpeed(e)} />
      </div>
    </div>
  )
}
