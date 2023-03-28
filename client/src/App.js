import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
// import { ConfigProvider } from 'antd'
import { ConfigProvider, theme, Switch, Card, Layout } from 'antd'
import * as darkThemeConfig from './dark_theme.json'
import * as lightThemeConfig from './light_theme.json'
import { useState } from 'react'
import Nav from './pages/Nav'
import Home from './pages/Home'
import EditorPage from './pages/EditorPage'

function App() {
    const { defaultAlgorithm, darkAlgorithm } = theme
    console.log(darkAlgorithm)
    const [darkTheme, setDarkTheme] = useState(false)

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
                    height: '100%',
                }}
            >
                <Layout style={{ height: '100%' }}>
                    <BrowserRouter>
                        <Nav darkTheme={darkTheme} handleClick={handleClick} />
                        <Routes>
                            <Route path="/" element={<Home />}></Route>
                            <Route
                                path="/editor"
                                element={<EditorPage darkTheme={darkTheme} />}
                            ></Route>
                        </Routes>
                    </BrowserRouter>
                </Layout>
            </div>
        </ConfigProvider>
    )
}

export default App
