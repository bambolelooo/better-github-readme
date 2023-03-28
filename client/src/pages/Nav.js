import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'

const Nav = () => {
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
                src={require('../resources/logodark512.png')}
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
                        <Link to="/login">Login</Link>
                    </li>
                </ul>
            )}
        </nav>
    )
}

export default Nav
