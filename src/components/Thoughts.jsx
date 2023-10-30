import { useState, useEffect } from 'react'

export const Thoughts = ({ thoughts }) => {
    const [thoughtsData, setThoughtsData] = useState([]) //State to store thoughts
    
    //Fetch the thoughts array from the API
    useEffect(() => {
        fetch('https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts')
        .then(res => res.json())
        .then(data => {
            //Update the state with the fetched data
            setThoughtsData(data)
            console.log(data) // Log data for debugging
        })
        .catch(error => console.log('error:', error))
    }, [thoughts]) //Include thoughts in the dependency array

    return (
        <div>
            {thoughtsData.map((thought, index) => (
                <div key={index}>
                    <p>{thought.message}</p>
                    <p>{thought.hearts}</p>
                    <p>{thought.createdAt}</p>
                </div>
            ))}
        </div>
    )
}