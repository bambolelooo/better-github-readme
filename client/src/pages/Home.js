import React from 'react';
import '../App.css';

function Home() {
    return (
            <section className='home-page'>
                
                <h1>Better GitHub ReadMe</h1>
                <h2>Welcome to Better Github ReadMe or BGR for short!</h2>

                <div className='home-container'>
                    
                    <h3>What we do?</h3>
                    <ul className='home-ul'>
                        <li>
                            BGR is an application that allows developers the ability to write and edit ReadMe files and push them directly to Github
                        </li>
                    </ul>

                    <h3>How does it work?</h3>
                    <ul className='home-ul'>
                        <li>
                            Simply click the Login button on the top right which will redirect you to login to your Github account
                        </li>
                        <li>
                            Select the Github repo your would like to add the ReadMe file to
                        </li>
                        <li>
                            Choose from any of our ReadMe template
                        </li>
                        <li>
                            Edit the content and push the ReadMe to your Github repo
                        </li>
                    </ul>
                </div>
            </section>
    );
}

export default Home;