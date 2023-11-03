import { useState } from 'react'
import API_URL from '../utils/urls'
import '../index.css'


export const ThoughtInput = ({ setThoughts }) => {
    const maxCharacters = 140
    const minCharacters = 5
    const [message, setMessage] = useState('')
    const [characterCount, setCharacterCount] = useState(maxCharacters)
    const [isOverLimit, setIsOverLimit] = useState(false)
    const [isCloseToLimit, setIsCloseToLimit] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isVibrating, setIsVibrating] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleFormSubmit = (event) => {
        event.preventDefault()


        if (message.length < minCharacters || message.length > maxCharacters) {
            setErrorMessage(message.length < minCharacters ? 'Message is too short.' : 'Message is too long.')
            setIsVibrating(true) //Start error animation
            setIsSubmitting(false) //Stop submitting animation
            return
        } else {
            setErrorMessage('') //Clear error message
            setIsVibrating(false) //Stop vibrating
        }

        if (message.length < minCharacters || message.length > maxCharacters) {
            setIsSubmitting(false) //Stop animation in case of error
            return //Don't proceed if message is too long or too short
        }

        setIsSubmitting(true) //Start animation

        //Store POST options in variable
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        }

        //Make the POST request to the API when form is submitted
        fetch(API_URL, options)
        .then((res) => res.json())
        .then((newThought) => {
            //Handle response if needed
            console.log(newThought)
            //Add new thought to array of thoughts
            setThoughts((prevThoughts) => [newThought, ...prevThoughts])
            //Clear message input
            setMessage('')
        })
        .catch(error => console.log('error: ', error))
    }


        const handleInputChange = (event) => {
            const inputText = event.target.value
            setMessage(inputText)

            //Clear error message and vibration when user starts typing
            setErrorMessage('')
            setIsVibrating(false) //Stop vibrating

            //Calculate remaining characters 
            const remainingCharacters = maxCharacters - inputText.length
            const isCloseToLimit = remainingCharacters < 20 && remainingCharacters > 0
            const isOverLimit = remainingCharacters < 0

            //Update state 
            setCharacterCount(remainingCharacters)
            setIsOverLimit(isOverLimit)
            setIsCloseToLimit(isCloseToLimit)
        }

    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <label htmlFor='message'>Share your happy thought:</label>
                <div>
                    <textarea
                    id="message"
                    name="message"
                    rows={3}
                    cols={30} 
                    placeholder='My happy thought...'
                    value={message} 
                    onChange={handleInputChange}
                    style={{
                        animation: isVibrating ? 'shake 0.5s' : 'none'
                      }}
                    />
                </div>
                <p>Characters remaining:{" "} 
                    <span style={{ color: isCloseToLimit ? 'orange' : isOverLimit ? 'red' : 'initial' }}>{characterCount}</span>
                </p>
                {errorMessage && <p style={{ fontStyle: 'italic', color: 'red' }}>{errorMessage}</p>}
                <button 
                type='submit'
                style={{
                    animation: isSubmitting ? 'shake 0.5s' : 'none'
                  }}>Submit</button>
            </form>
        </div>
    )
}