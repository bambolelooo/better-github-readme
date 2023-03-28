import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'
import { Switch } from 'antd'
import { BsMoonFill } from 'react-icons/bs'
import { FaSun } from 'react-icons/fa'
const client_id = process.env.REACT_APP_GITHUB_CLIENT_ID
const Nav = ({ darkTheme, handleClick }) => {
    const loginWithGithub = () => {
        window.location.assign(
            'https://github.com/login/oauth/authorize?client_id=' + client_id
        )
    }
    const auth = localStorage.getItem('user')
    const navigate = useNavigate()
    const logout = () => {
        localStorage.clear()
        navigate('/')
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
                defaultChecked={false}
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
            {auth ? (
                <ul className="nav-ul nav-right">
                    <li>
                        <Link to="/repo">Repo</Link>
                    </li>
                    <li>
                        <Link onClick={logout} to="/">
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
