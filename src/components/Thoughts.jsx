import { useState, useEffect } from 'react'
import API_URL from '../utils/urls'
import moment from 'moment/moment'

export const Thoughts = ({ thoughts }) => {
    const [thoughtsData, setThoughtsData] = useState([]) //State to store thoughts
    const [likedThoughts, setLikedThoughts] = useState([]) // State to store "likes" on thoughts
    
    //Fetch the thoughts array from the API
    useEffect(() => {
        fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            //Update the state with the fetched data
            setThoughtsData(data)
            console.log(data) // Log data for debugging
        })
        .catch(error => console.log('error:', error))

        //Retrieve liked thought ID from local storage
        const storedLikedThoughts = localStorage.getItem('likedThoughts')
        if (storedLikedThoughts) {
            setLikedThoughts(JSON.parse(storedLikedThoughts))
        }

    }, [thoughts]) //Include thoughts in the dependency array

    const handleLikeClick = (thoughtId) => {
        if (!likedThoughts.includes(thoughtId)) {
            //Add thought ID to the likedThoughts array
            setLikedThoughts([...likedThoughts, thoughtId])

            //Store liked thought ID in local storage
            localStorage.setItem('likedThoughts', JSON.stringify(likedThoughts.concat(thoughtId)))
        
        //Find the thought to update in the local state
        const updatedThoughtsData = thoughtsData.map((thought) => {
            if (thought._id === thoughtId) {
                return {
                    ...thought,
                    hearts: thought.hearts + 1, //Increase the hearts count
                }
            }
            return thought
        })

        //Update the local state with the new data
        setThoughtsData(updatedThoughtsData)

        //Send updated likes count to the API
        fetch(`${API_URL}/${thoughtId}/like`, {
            method: 'POST',
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data) //Log data for debugging
            })
            .catch((error) => console.log('error:', error))
    }
}

    return (
        <div>
            {thoughtsData.map((thought, index) => (
                <div key={index}>
                    <p>{thought.message}</p>
                    <button onClick={() => handleLikeClick(thought._id)}
                    disabled={likedThoughts.includes(thought._id)}
                    > 
                    &hearts; {thought.hearts}
                    </button>
                    <p>{moment(thought.createdAt).fromNow()}</p>
                </div>
            ))}
        </div>
    )
}