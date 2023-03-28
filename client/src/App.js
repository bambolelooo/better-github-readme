import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
// import { ConfigProvider } from 'antd'
import { ConfigProvider, theme, Switch, Card } from "antd";
import * as darkThemeConfig from './dark_theme.json'
import * as lightThemeConfig from './light_theme.json'
import { useState } from 'react'
import Nav from './pages/Nav'
import Home from './pages/Home'
import Footer from './pages/Footer'
import EditorPage from './pages/EditorPage'

function App() {
    // const [darkTheme, setDarkTheme] = useState(false)
    const { defaultAlgorithm, darkAlgorithm } = theme;
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [darkTheme, setDarkTheme] = useState(false);

    const handleClick = () => {
      setIsDarkMode((previousValue) => !previousValue);
    };

    return (
        // <ConfigProvider theme={darkTheme ? darkThemeConfig : lightThemeConfig}>
        <ConfigProvider theme={{ algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,}}>
        <Card >
          <Switch defaultChecked={false} checkedChildren='Dark' unCheckedChildren='Light' onClick={handleClick} >
          </Switch>
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
        </Card>
        </ConfigProvider>
    )
}

export default App
