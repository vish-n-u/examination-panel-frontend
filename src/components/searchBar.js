import React, { useState } from 'react'

const SearchBar = ({setUsers,allUsers,userType}) => {
    console.log("user type: " + userType)
    const [text,setText] = useState("")
    const handleChange = (e)=>{
        let arr =[]
        console.log("listening",setUsers,allUsers)
        setText(e.target.value)
        allUsers.map((user)=>{
            console.log(user.userName.includes(e.target.value))
            if(user.userName.toLowerCase().includes(e.target.value.toLowerCase())&&user.userType==userType&&user.authorized){
                arr.push(user)
            }
        })
        setUsers(arr)

    }
  return (
    <div>
        <input className='w-[50%] p-4 py-2 border-purple-300 border-1' type='text' value={text} placeholder='search' onChange={handleChange}></input>
    </div>
  )
}

function checkForUpperCase(arr,str){

}

export default SearchBar