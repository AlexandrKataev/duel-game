import { RootState } from 'src/app/store'

export const selectHeroes = (state: RootState) => state.hero.heroes
