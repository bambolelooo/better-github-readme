import React, { useState } from 'react'
import repoChoices from './repos'
import './RepoSearch.css'

const getFilteredRepos = (query, items) => {
    if (!query) {
        return items
    }
    return items.filter((repo) => repo.name.includes(query))
}

// store the JWT from the URL to the local storage
const getJwtFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    if (token) {
        localStorage.setItem('user', token)
    } else {
        localStorage.removeItem('user')
    }
}
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
    getJwtFromUrl()
    const [query, setQuery] = useState('')

    const { repos } = repoChoices
    const { repoItems } = repos
    const filteredRepos = getFilteredRepos(query, repoItems)

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
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">Search</button>

                <ul>
                    {filteredRepos.map((repo) => (
                        <h6 key={repo.username}> {repo.name} </h6>
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default RepoSearch
