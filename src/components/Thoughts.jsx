import { useState, useEffect } from 'react'
import API_URL from '../utils/urls'
import moment from 'moment/moment'

export const Thoughts = ({ thoughts }) => {
    const [thoughtsData, setThoughtsData] = useState([]) //State to store thoughts
    const [likedThoughts, setLikedThoughts] = useState([]) //State to store "likes" on thoughts
    const [likeCount, setLikeCount] = useState(0) //Initialize like count to 0

    
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

        //calculate the like count based on liked thoughts
        const likeCountFromStorage = parseInt(localStorage.getItem('likeCount', 10))
        if (!isNaN(likeCountFromStorage)) {
            setLikeCount(likeCountFromStorage)
        }
    }, [thoughts])


    const handleLikeClick = (thoughtId) => {
        if (!likedThoughts.includes(thoughtId)) {
            //Update liked thoughts array in local state
            setLikedThoughts([...likedThoughts, thoughtId])

            //Increment like count in local state
            const updatedLikeCount = likeCount + 1
            setLikeCount(updatedLikeCount)

            //Store updated liked thoughts in local storage
            localStorage.setItem('likedThoughts', JSON.stringify([...likedThoughts, thoughtId]))
            //Store updated like count in local storage
            localStorage.setItem('likeCount', updatedLikeCount.toString())

            //Update the thought's hearts immediately in the local state
            
            setThoughtsData((prevThoughtsData) =>
            prevThoughtsData.map((thought) => {
                if (thought._id === thoughtId) {
                    return {
                        ...thought,
                        hearts: thought.hearts + 1,
                    }
                }
                return thought
            })
        )
        

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
            {likeCount > 0 ? <p>You've liked {likeCount} thoughts 💞</p>
            :
            <p>You haven't liked any thoughts yet... go spread some love already 💗</p>}
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