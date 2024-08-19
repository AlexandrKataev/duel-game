import { RangeInput } from '@ui'
import styles from './duel-page.module.css'
import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@app/store'
import {
  attack,
  Hero,
  selectHeroes,
  setHeroSpeed,
  updateHero,
  updateSpell,
} from '@entities/hero'

export const DuelPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const dispatch = useAppDispatch()

  const heroes = useAppSelector(selectHeroes)

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

  const updateHeroes = (heroes: Hero[]) => {
    heroes.forEach((hero) => {
      if (hero.y) {
        hero.y += hero.direction * hero.speed
        dispatch(
          updateHero({
            heroId: hero.id,
            updateHeroDto: { y: hero.y },
          })
        )

        // Проверка на столкновение со стенками
        if (hero.y + hero.radius > Number(canvasRef.current?.height)) {
          hero.direction = -1 // Изменение направления
          dispatch(
            updateHero({
              heroId: hero.id,
              updateHeroDto: { direction: hero.direction },
            })
          )
        }
        if (hero.y < hero.radius) {
          hero.direction = 1 // Изменение направления
          dispatch(
            updateHero({
              heroId: hero.id,
              updateHeroDto: { direction: hero.direction },
            })
          )
        }

        // обновление атак
        hero.spells.forEach((spell) => {
          spell.x += hero.directionAttack * hero.speedAttack
          dispatch(
            updateSpell({
              heroId: hero.id,
              spellId: spell.id,
              updateSpellDto: { x: spell.x },
            })
          )
        })
      }
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    const circles = JSON.parse(JSON.stringify(heroes))

    let animationFrameId: number | null = null

    const animate = () => {
      updateHeroes(circles)

      drawHero(circles, ctx)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(Number(animationFrameId))
  }, [
    heroes[0].speed,
    heroes[1].speed,
    heroes[1].spells.length,
    heroes[0].spells.length,
  ])

  useEffect(() => {
    const heroOneAttackInterval = setInterval(() => {
      dispatch(attack({ heroId: 1 }))
    }, 1700)
    const heroTwoAttackInterval = setInterval(() => {
      dispatch(attack({ heroId: 2 }))
    }, 2500)
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
            value={hero.speed}
            onChange={(e) =>
              dispatch(
                setHeroSpeed({ heroId: hero.id, speed: +e.target.value })
              )
            }
          />
        )
      })}
    </div>
  )
}
