import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { ConfigProvider } from 'antd'
import * as darkThemeConfig from './dark_theme.json'
import * as lightThemeConfig from './light_theme.json'
import { useState } from 'react'
import Nav from './pages/Nav'
import Home from './pages/Home'
import Footer from './pages/Footer'
import EditorPage from './pages/EditorPage'

function App() {
    const [darkTheme, setDarkTheme] = useState(false)
    return (
        <ConfigProvider theme={darkTheme ? darkThemeConfig : lightThemeConfig}>
            <BrowserRouter>
                <Nav />
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route
                        path="/editor"
                        element={<EditorPage darkTheme={darkTheme} />}
                    ></Route>
                </Routes>
            </BrowserRouter>
            <Footer />
        </ConfigProvider>
    )
}

export default App
