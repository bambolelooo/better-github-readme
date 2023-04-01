import React, { useEffect, useState } from 'react'
import '../App.css'
import { AutoComplete, List } from 'antd'
import styles from '../css/repoPage.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Auth from '../utils/auth'

function RepoPage() {
    const navigate = useNavigate()
    Auth.login()
    const token = localStorage.getItem('user')
    const [repos, setRepos] = useState([])
    console.log(repos)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios({
                    method: 'post',
                    url: '/graphql',
                    data: {
                        query: `
                      query {
                        getRepositories
                      }
                    `,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setRepos(
                    response.data.data.getRepositories.map((repoName) => {
                        return { value: repoName }
                    })
                )
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [])
    function onSelect(data) {
        console.log(data)
        localStorage.setItem('repo', JSON.stringify(data))
        localStorage.setItem('textareaValue', '')
        return navigate('/templates')
    }
    return (
        <section className={styles.main}>
            <h1>Choose a Repo</h1>

            <AutoComplete
                placeholder="Search for repo"
                style={{
                    width: 304,
                }}
                filterOption={(inputValue, option) => {
                    return (
                        option.value
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                    )
                }}
                options={repos}
                onSelect={onSelect}
            />
            <List
                bordered
                dataSource={repos.map((repo) => repo.value)}
                renderItem={(item) => (
                    <List.Item
                        className={styles.listItem}
                        onClick={() => {
                            onSelect(item)
                        }}
                    >
                        {item}
                    </List.Item>
                )}
                className={styles.list}
            />
        </section>
    )
}

export default RepoPage
