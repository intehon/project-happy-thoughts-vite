import { useState } from 'react'
import API_URL from '../utils/urls'

export const ThoughtInput = ({ setThoughts }) => {
    const [message, setMessage] = useState('')

    const handleFormSubmit = (event) => {
        event.preventDefault()

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
                    onChange={(e) => setMessage(e.target.value)} 
                    />
                </div>
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}