import { useContext, useEffect } from "react"
import { NavLink } from "react-router-dom"
import BalanceData from "./BalanceData"
import './Header.css'

const Header = () => {

    const {currUser, setCurrUser, setTotalMoney, setLogs}=useContext(BalanceData)

    let link = {
        padding: '0px 10px',
        textDecoration:'none'
    }

    useEffect(() => {
        if(currUser)
            console.log(currUser.userName)
        const usrd = localStorage.getItem('currUserData')
        // console.log(usrd.userName)
        if (usrd)
            setCurrUser(usrd.userName)
    },[])
    
    return (
        <div className="header-area">
             <nav className='link-box'>
                <NavLink style={link} className={({isActive}) => isActive ? "active-link" : "inactive-link"} to='/splashscreen'>About</NavLink>
                <NavLink style={link} className={({ isActive }) => isActive ? "active-link" : "inactive-link"} to='/login'>{ currUser?currUser:'Log In'}</NavLink>
                <NavLink style={link} className={({isActive}) => isActive ? "active-link" : "inactive-link"} to='/mainpage'>Home</NavLink>
                <NavLink style={link} className={({isActive}) => isActive ? "active-link" : "inactive-link"} to='/overview'>Goals</NavLink>
                <NavLink style={link} className={({isActive}) => isActive ? "active-link" : "inactive-link"} to='/spending-report'>Spending Report</NavLink>

            </nav>
            <button onClick={() => {
                localStorage.clear();
                setCurrUser('')
                setTotalMoney(0)
                setLogs([])
            }
            }>Log Out</button>
        </div>
    )
}
export default Header