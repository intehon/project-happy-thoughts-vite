import { useState } from 'react'

export const ThoughtInput = ({ setThoughts }) => {
    const [message, setMessage] = useState('')

    const handleFormSubmit = (event) => {
        event.preventDefault()

        //Make the POST request to the API when form is submitted
        fetch('https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        })
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