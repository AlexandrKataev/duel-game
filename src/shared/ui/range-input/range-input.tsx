import { InputHTMLAttributes } from 'react'
import styles from './range-input.module.scss'

export const RangeInput = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return <input type="range" max={10} min={1} {...props} />
}
