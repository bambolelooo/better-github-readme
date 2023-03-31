import React from 'react'
import '../App.css'
import { AutoComplete } from 'antd'

function Repo() {
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
