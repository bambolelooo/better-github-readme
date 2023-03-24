import logo from './logo.svg';
import './App.css';
import {ConfigProvider} from "antd";
import * as darkThemeConfig from "./dark_theme.json"
import * as lightThemeConfig from "./light_theme.json"
import {useState} from "react";

function App() {
    const [darkTheme, setDarkTheme] = useState(true)
  return (
      <ConfigProvider theme={darkTheme ? darkThemeConfig : lightThemeConfig}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </ConfigProvider>

  );
}

export default App;
