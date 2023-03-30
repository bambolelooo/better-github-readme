import { React, useState } from 'react'
import repos from "./RepoData.json"

function requestUserRepos(username){
    fetch(`https://api.github.com/users/${username}/repos`);
}

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

function RepoList(props) {
    //create a new array by filtering the original array
    const filteredRepo = repos.filter((el) => {
        //if no input the return the original
        if (props.input === '') {
            return el;
        }
        //return the item which contains the user input
        else {
            return el.name.toLowerCase().includes(props.input)
        }
    })
    return (
        <ul>
            {filteredRepo.map((item) => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    )
}

export default RepoList;