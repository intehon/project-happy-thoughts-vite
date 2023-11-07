import { useState, useEffect } from 'react'
import API_URL from '../utils/urls'
import moment from 'moment/moment'
import { Loading } from './Loading'

export const Thoughts = ({ thoughts }) => {
    const [thoughtsData, setThoughtsData] = useState([]) //State to store thoughts
    const [likedThoughts, setLikedThoughts] = useState([]) //State to store "likes" on thoughts
    const [likeCount, setLikeCount] = useState(0) //Initialize like count to 0
    const [loading, setLoading] = useState(false)

    
    //Fetch the thoughts array from the API
    useEffect(() => {
        setLoading(true) //Show loading spinner when fetching thoughts
        fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            //Update the state with the fetched data
            setThoughtsData(data)
            console.log(data) // Log data for debugging
        })
        .catch(error => console.log('error:', error))
        .finally(() => setLoading(false)) //Stop loading spinner

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
                <div className='thoughtWrapper'>
                    {likeCount > 0 ? (
                        <p className='likesText'>You've liked {likeCount} thoughts so far 💞</p>
                    ) : (
                        <p className='likesText'>You haven't liked any thoughts yet... go spread some love already 💗</p>
                    )}
                </div>
                {loading ? (
                    <Loading />
                ) : (
                    <>

                        {thoughtsData.map((thought, index) => (
                            <div className="thoughtWrapper" key={index}>
                                <p className='messageText'>{thought.message}</p>
                                <div className='likeContainer'>
                                    <div className='likeBtnContainer'>
                                        <button 
                                            className={thought.hearts > 0 ? "heartBtn heartBtnClicked" : "heartBtn"}
                                            onClick={() => handleLikeClick(thought._id)}
                                            disabled={likedThoughts.includes(thought._id)}
                                        >{' '}
                                            <span className="heartIcon" role="img" aria-label="like">❤️</span>
                                        </button>
                                        <p>x {thought.hearts}</p>
                                    </div>
                                    <p className='date'>{moment(thought.createdAt).fromNow()}</p>
                                </div>
                            </div>
                        ))}
                    </>
            )}
            </div>
    )
}