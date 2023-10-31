import { useState, useEffect } from 'react'
import API_URL from '../utils/urls'
import moment from 'moment/moment'

export const Thoughts = ({ thoughts }) => {
    const [thoughtsData, setThoughtsData] = useState([]) //State to store thoughts
    
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
    }, [thoughts]) //Include thoughts in the dependency array

    return (
        <div>
            {thoughtsData.map((thought, index) => (
                <div key={index}>
                    <p>{thought.message}</p>
                    <button> &hearts; {thought.hearts}</button>
                    <p>{moment(thought.createdAt).fromNow()}</p>
                </div>
            ))}
        </div>
    )
}