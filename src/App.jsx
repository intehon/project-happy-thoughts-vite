import { Thoughts } from './components/Thoughts'
import { ThoughtInput } from './components/ThoughtInput'
import { useState } from 'react'

export const App = () => {
  const [thoughts, setThoughts] = useState([]) //State to store thoughts

  return (
  <div>
    {/* <Header />*/}
    <ThoughtInput setThoughts={setThoughts} /> 
     <Thoughts thoughts={thoughts}/>
  </div>
  )
}
