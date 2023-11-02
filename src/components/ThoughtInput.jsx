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

        setIsSubmitting(true) //Trigger animation for submit

        if (message.length < minCharacters) {
            setErrorMessage('Message is too short.')
            setIsVibrating(true)
            setIsSubmitting(false)
            return
        } else if (message.length > maxCharacters) {
            setErrorMessage('Message is too long.')
            setIsVibrating(true)
            setIsSubmitting(false)
            return
        } else {
            setErrorMessage('') //Clear error message
            setIsVibrating(false) //Stop vibrating
        }

        setIsSubmitting(false)

        if (message.length < minCharacters || message.length > maxCharacters) {
            setIsSubmitting(false) //Stop animation in case of error
            return //Don't proceed if message is too long or too short
        }

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
            setIsSubmitting(true) 
        })
        .catch(error => console.log('error: ', error))
        //setIsSubmitting(false) //Stop animation in case of error
    }


        const handleInputChange = (event) => {
            const inputText = event.target.value
            setMessage(inputText)

            //Clear error message and vibration when user starts typing
            setErrorMessage('')

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
                    className={isSubmitting ? 'bounce' : ''}
                    style={{
                        animation: isVibrating ? 'shake 0.5s' : 'none'
                      }}
                    />
                </div>
                <p>Characters remaining:{" "} 
                    <span style={{ color: isCloseToLimit ? 'orange' : isOverLimit ? 'red' : 'initial' }}>{characterCount}</span>
                </p>
                {errorMessage && <p style={{ fontStyle: 'italic', color: 'red' }}>{errorMessage}</p>}
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}