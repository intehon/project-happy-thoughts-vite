import { Thoughts } from './components/Thoughts'
import { ThoughtInput } from './components/ThoughtInput'
import { useState } from 'react'
import { Header } from './components/Header'

export const App = () => {
  const [thoughts, setThoughts] = useState([]) //State to store thoughts

  return (
    <main>
      <div className='contentWrapper'>
        <Header text={'Happy Thoughts!'}/>
        <ThoughtInput setThoughts={setThoughts} /> 
        <Thoughts thoughts={thoughts}/>
      </div>
  </main>
  )
}
