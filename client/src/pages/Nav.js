import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'
const client_id = process.env.REACT_APP_GITHUB_CLIENT_ID

const Nav = () => {
    const auth = localStorage.getItem('user')
    const navigate = useNavigate()
    const loginWithGithub = () => {
        window.location.assign(
            'https://github.com/login/oauth/authorize?client_id=' + client_id
        )
    }
    const logout = () => {
        localStorage.clear()
        navigate('/')
    }
    return (
        <div>

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

            <img alt='logo' className='logo' src={require('../resources/logodark512.png')} />
            {
                auth ?

                <ul className='nav-ul nav-right'>
                    <li><Link to='/repo'>Repo</Link></li>
                    <li><Link onClick={logout} to='/'>Logout</Link></li>

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
        </div>
    )
}

export default Nav
