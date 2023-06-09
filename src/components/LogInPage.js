import { useContext, useEffect, useState } from 'react'
import BalanceData from './BalanceData'
import './LoginPage.css'

const LoginPage = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [seePw, setVisiblePassword]=useState(['password','visibility'])
    
    const [err, setErr] = useState('')
    

    const{getUsers, setUsers, userData, currUser, setCurrUser, baseLink, frontLink}=useContext(BalanceData)
    
    const checkCredentials = () => {
        let user = userData.find(user => user.userName == username)
        if (!user)
            return setErr('no such user!')
        if (user.passWord != password)
            return setErr('wrong password!')
        localStorage.setItem('currentUser', user.id)
        localStorage.setItem('currUsername', user.userName)
        
        setCurrUser(user.userName)

        setErr(`logged as ${username}!`)
    
    }

    const addUser = async (data) => {
        if (!username)
            return setErr('enter username!')
        if (!password)
            return setErr('enter password!')
        if (userData.find(user => user.userName == username))
            return setErr('username taken!')
        const jsonData = JSON.stringify(data)
        console.log(jsonData)
        const currentUser= await fetch(`${baseLink}users`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData,
            },
        ).then(res=>res.json())
        setCurrUser(currentUser.userName) 
        setErr('registered!')
        fetchUsers()
    }


    const fetchUsers = async () => {
        let data = await getUsers()
        setUsers(data)
    }

    const toggleVisibility = () => {
        if (seePw[0] == 'password')
            return setVisiblePassword(['text','visibility_off'])
        return setVisiblePassword(['password','visibility'])
    }

    useEffect(() => {
        fetchUsers();
    }, [])
    
    return (
        <div className="login-page">
            <h1>login or Register</h1>
            <div className="username-box">
                <div>
                    Username:
                </div>
                <input type="text" onChange={e=>setUsername(e.target.value)}/>
            </div>
            <div className="password-box">
                <div>
                    Password: 
                </div>
                <input type={seePw[0]} onChange={e => setPassword(e.target.value)} />
                <button className='visibility' onClick={() => toggleVisibility()}>
                <span className="material-symbols-outlined">
                    {seePw[1]}
                </span>
                </button>
            </div>
            <div className="login-register">
                <button onClick={() => checkCredentials()}>Log in</button>
                <button onClick={() => addUser({userName:username, passWord:password})}>Register</button>
            </div>
            {err}
        </div>
    )
}
export default LoginPage