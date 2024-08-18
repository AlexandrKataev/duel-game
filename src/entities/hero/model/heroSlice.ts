import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Hero {
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

export interface Spell {
  id: number
  x: number
  y: number
  radius: number
  color: string
  direction: number
  speed: number
}

type HeroSliceState = {
  heroes: Hero[]
}

const initialState: HeroSliceState = {
  heroes: [
    {
      id: 1,
      x: 50,
      y: 20,
      radius: 40,
      color: '#3795BD',
      direction: 1,
      speed: 2,
      colorAttack: '#91DDCF',
      speedAttack: 3,
      directionAttack: 1,
      spells: [],
    },
    {
      id: 2,
      x: 750,
      y: 20,
      radius: 40,
      color: '#FF7777',
      direction: 1,
      speed: 2,
      colorAttack: '#FFAAAA',
      speedAttack: 3,
      directionAttack: -1,
      spells: [],
    },
  ],
}

export const heroSlice = createSlice({
  name: 'hero',
  initialState,
  reducers: {
    setHeroSpeed: (
      state,
      action: PayloadAction<{ heroId: number; speed: number }>
    ) => {
      state.heroes = state.heroes.map((hero) => {
        if (hero.id === action.payload.heroId) {
          return { ...hero, speed: action.payload.speed }
        }
        return hero
      })
    },

    updateHero: (
      state,
      action: PayloadAction<{ heroId: number; updateHeroDto: Partial<Hero> }>
    ) => {
      state.heroes = state.heroes.map((hero) => {
        if (hero.id === action.payload.heroId) {
          return { ...hero, ...action.payload.updateHeroDto }
        }
        return hero
      })
    },

    updateSpell: (
      state,
      action: PayloadAction<{
        heroId: number
        spellId: number
        updateSpellDto: Partial<Spell>
      }>
    ) => {
      state.heroes = state.heroes.map((hero) => {
        if (hero.id === action.payload.heroId) {
          return {
            ...hero,
            spells: hero.spells
              .map((spell) => {
                if (spell.id === action.payload.spellId) {
                  return { ...spell, ...action.payload.updateSpellDto }
                }
                return spell
              })
              .filter((spell) => {
                return spell.x < 800 && spell.x > 0
              }),
          }
        }
        return hero
      })
    },

    attack: (state, action: PayloadAction<{ heroId: number }>) => {
      state.heroes = state.heroes.map((hero) => {
        if (action.payload.heroId === hero.id) {
          return {
            ...hero,
            spells: [
              ...hero.spells,
              {
                id: Math.random(),
                x: hero.x,
                y: hero.y,
                radius: 10,
                color: hero.colorAttack,
                direction: 1,
                speed: 10,
              },
            ],
          }
        }
        return hero
      })
    },
  },
})

export const { setHeroSpeed, updateHero, attack, updateSpell } =
  heroSlice.actions
