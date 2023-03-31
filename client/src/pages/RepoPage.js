import React, { useEffect, useState } from 'react'
import '../App.css'
import { AutoComplete } from 'antd'
import axios from 'axios'

function Repo() {
    const token = localStorage.getItem('user')
    const [repos, setRepos] = useState(null)
    console.log(repos)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios({
                    method: 'post',
                    url: 'http://localhost:3001/graphql',
                    data: {
                        query: `
                      query {
                        getRepositories {
                          name
                          url
                        }
                      }
                    `,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setRepos(response.data)
                console.log(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [])
    return (
        <section className="home-page">
            <h1>Choose a Repo</h1>

            <AutoComplete
                placeholder="input search text"
                style={{
                    width: 304,
                }}
            />
        </section>
    )
}

export default Repo
