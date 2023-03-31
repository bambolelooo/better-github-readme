import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import { Switch } from 'antd'
import { BsMoonFill } from 'react-icons/bs'
import { FaSun } from 'react-icons/fa'
import Auth from '../utils/auth'
const Nav = ({ darkTheme, handleClick }) => {
    const loginWithGithub = () => {
        const client_id = process.env.REACT_APP_GITHUB_CLIENT_ID
        console.log(process.env)
        window.location.assign(
            'https://github.com/login/oauth/authorize?client_id=' +
                client_id +
                '&scope=repo&user'
        )
    }

    return (
        <nav>
            <img
                alt="logo"
                className="logo"
                src={
                    darkTheme
                        ? require('../resources/logodark512.png')
                        : require('../resources/logolight512.png')
                }
            />
            <Switch
                defaultChecked={darkTheme}
                checkedChildren={
                    <div
                        style={{
                            marginTop: '2px',
                        }}
                    >
                        <BsMoonFill />
                    </div>
                }
                unCheckedChildren={<FaSun />}
                onClick={handleClick}
            />
            {Auth.loggedIn() ? (
                <ul className="nav-ul nav-right">
                    <li>
                        <Link to="/repo">Repo</Link>
                    </li>
                    <li>
                        <Link onClick={Auth.logout} to="/">
                            Logout
                        </Link>
                    </li>
                </ul>
            ) : (
                <ul className="nav-ul nav-right">
                    <li>
                        <Link onClick={loginWithGithub} to="/auth/github">
                            Login
                        </Link>
                    </li>
                </ul>
            )}
        </nav>
    )
}

export default Nav
