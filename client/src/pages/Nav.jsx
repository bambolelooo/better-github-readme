import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import { Switch, Button } from 'antd'
import { BsMoonFill } from 'react-icons/bs'
import { FaSun } from 'react-icons/fa'
import Auth from '../utils/auth'
const Nav = ({ darkTheme, handleClick }) => {
    const loginWithGithub = () => {
        const client_id = process.env.REACT_APP_GITHUB_CLIENT_ID
        window.location.assign(
            'https://github.com/login/oauth/authorize?client_id=' +
                client_id +
                '&scope=repo&user'
        )
    }

    return (
        <nav>
            <Link to="/">
                <img
                    alt="logo"
                    className="logo"
                    src={
                        darkTheme
                            ? require('../resources/logodark512.png')
                            : require('../resources/logolight512.png')
                    }
                />
            </Link>
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
                        <Link to="/repo">
                            <Button type={'primary'}>Get started</Button>
                        </Link>
                    </li>
                    <li>
                        <Link onClick={Auth.logout} to="/">
                            <Button>Log Out</Button>
                        </Link>
                    </li>
                </ul>
            ) : (
                <ul className="nav-ul nav-right">
                    <li>
                        <Link onClick={loginWithGithub} to="/auth/github">
                            <Button>Log In</Button>
                        </Link>
                    </li>
                </ul>
            )}
        </nav>
    )
}

export default Nav
