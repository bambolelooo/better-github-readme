import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { ConfigProvider, theme, Layout } from 'antd'
import * as darkThemeConfig from './dark_theme.json'
import * as lightThemeConfig from './light_theme.json'
import { useState } from 'react'
import Nav from './components/Nav'
import Home from './pages/Home'
import RepoPage from './pages/RepoPage'
import Templates from './pages/Templates'
import EditorPage from './pages/EditorPage'
import FooterSec from './components/Footer'

function App() {
    const { defaultAlgorithm, darkAlgorithm } = theme
    const [darkTheme, setDarkTheme] = useState(
        localStorage.getItem(darkTheme)
            ? JSON.parse(localStorage.getItem('darkTheme'))
            : window.matchMedia('(prefers-color-scheme: dark)').matches
    )
    useEffect(() => {
        localStorage.setItem('darkTheme', JSON.stringify(darkTheme))
    }, [darkTheme])

    const handleClick = () => {
        setDarkTheme(!darkTheme)
    }

    return (
        <ConfigProvider
            theme={
                darkTheme
                    ? {
                          ...darkThemeConfig,
                          algorithm: darkAlgorithm,
                      }
                    : {
                          ...lightThemeConfig,
                          algorithm: defaultAlgorithm,
                      }
            }
        >
            <div
                style={{
                    color: `${darkTheme ? '#F7EDCF' : '#484F58'}`,
                    minHeight: '100vh',
                }}
            >
                <Layout style={{ minHeight: '100vh' }}>
                    <BrowserRouter>
                        <Nav darkTheme={darkTheme} handleClick={handleClick} />
                        <Routes>
                            <Route path="/" element={<Home />}></Route>
                            <Route
                                path="/repo"
                                element={<RepoPage darkTheme={darkTheme} />}
                            ></Route>
                            <Route
                                path="/templates"
                                element={<Templates />}
                            ></Route>
                            <Route
                                path="/editor"
                                element={<EditorPage darkTheme={darkTheme} />}
                            ></Route>
                        </Routes>
                        <FooterSec />
                    </BrowserRouter>
                </Layout>
            </div>
        </ConfigProvider>
    )
}

export default App
