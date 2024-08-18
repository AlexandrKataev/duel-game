import { Route, Routes } from 'react-router-dom'
import './app.css'
import { DuelPage } from '@pages'

export const App = () => {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<DuelPage />}></Route>
      </Routes>
    </div>
  )
}
