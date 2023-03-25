import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import {ConfigProvider} from "antd";
import * as darkThemeConfig from "./dark_theme.json"
import * as lightThemeConfig from "./light_theme.json"
import {useState} from "react";

import Home from './pages/Home';

function App() {
    const [darkTheme, setDarkTheme] = useState(true)
  return (
      <ConfigProvider theme={darkTheme ? darkThemeConfig : lightThemeConfig}>

        <BrowserRouter>
          <Routes>
          <Route path='/' element={<Home />}></Route>
          </Routes>
        
        </BrowserRouter>

      </ConfigProvider>

  );
}

export default App;
