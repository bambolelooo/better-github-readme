import React, { useEffect, useState } from 'react'
import RepoList from './RepoList'
import './RepoSearch.css'
import Auth from '../utils/auth'
import axios from 'axios'

// fetch the JWT token from header
// const getJwtFromHeader = () => {
//     fetch('/github/callback', {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//     })
//         .then((response) => {
//             // extract the JWT from the Authorization header
//             const header = response.headers.get('Authorization')
//             const token = header.split(' ')[1]
//             // store the JWT in localStorage or some other client-side storage
//             localStorage.setItem('token', token)
//         })
//         .catch((error) => {
//             console.error(error)
//         })
// }

function RepoSearch() {
    Auth.login()

    const [inputText, setInputText] = useState('')

    let inputHandler = (e) => {
        //convert input text to lower case
        var lowerCase = e.target.value.toLowerCase()
        setInputText(lowerCase)
    }

    return (
        <section className="repo-section">
            <h1>Choose a Github Repo</h1>

            <div className="repo-search">
                <label>
                    <span className="visually-hidden">Search your repos</span>
                </label>
                <input
                    type="text"
                    placeholder="Search your repos"
                    onChange={inputHandler}
                />

                <ul>
                    <RepoList input={inputText} />
                </ul>
            </div>
        </section>
    )
}

export default RepoSearch
