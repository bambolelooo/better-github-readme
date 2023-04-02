import React, { useEffect, useState } from 'react'
import '../App.css'
import { AutoComplete, List, Spin } from 'antd'
import styles from '../css/repoPage.module.css'
import { LoadingOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Auth from '../utils/auth'

function RepoPage({ darkTheme }) {
    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 24,
                color: `${darkTheme ? '#F7EDCF' : '#484F58'}`,
            }}
            spin
        />
    )
    const navigate = useNavigate()
    Auth.login()
    const token = localStorage.getItem('user')
    const [loading, setLoading] = useState(true)
    const [repos, setRepos] = useState([])
    useEffect(() => {
        if (!token) {
            return
        }
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
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [])
    function onSelect(data) {
        localStorage.setItem('repo', JSON.stringify(data))
        localStorage.setItem('textareaValue', '')
        return navigate('/templates')
    }
    return (
        <div>
            {Auth.loggedIn() ? (
                <>
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
                                        .indexOf(inputValue.toUpperCase()) !==
                                    -1
                                )
                            }}
                            options={repos}
                            onSelect={onSelect}
                        />
                        {loading ? (
                            <Spin indicator={antIcon} />
                        ) : (
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
                        )}
                    </section>
                </>
            ) : (
                <h1>Please login to use this feature</h1>
            )}
        </div>
    )
}

export default RepoPage
