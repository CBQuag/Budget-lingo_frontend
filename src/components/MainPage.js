import './MainPage.css'
import { useContext, useEffect, useState } from "react"
import BalanceData from "./BalanceData"
import Log from './Log'
import LineGraph from './LineGraph'

const MainPage = () => {

    const { logData, setLogs, getLogs, shorten, totalMoney, setTotalMoney, baseLink, setCurrUser, usrId, commaAmount, showData } = useContext(BalanceData)

    const [open, setOpen] = useState(['none', '+'])

    const[userid,setUserid]=useState(0)
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')
    const [time, setTime] = useState(Date.now())
    const [err, setError] = useState('')

    const [runTotals, setRunningTotals] = useState([])

    const clearData = () => {
        setName('');
        setAmount('');
        setTime(Date.now())
        setCategory('')
    }

    const postData = data => {
        const jsonData = JSON.stringify(data)
        fetch(`${baseLink}logs`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData,
            }
        )
    }

    const handleClick = () => {
        
        setUserid(usrId)
        if (!name && !amount)
            return setError('No Data!')
        if (!name) {
            clearData()
            return setError('Missing Name!')
        }

        if (!amount) {
            clearData()
            return setError('Missing Amount!')
        }
        if (!usrId)
            return setError('Not logged in!')
        const newLog = {
            userId: usrId,
            name: name,
            amount: amount,
            expenseCategory: category,
            time: time
        }
        setLogs([newLog, ...logData])

        postData(newLog)

        clearData()
    }


    


    const switchOpen = () => {
        setOpen(open[0] == 'flex' ? ['none', '+'] : ['flex', '-'])
    }

    const putData = data => {
        if (!usrId)
            return
        const jsonData = JSON.stringify(data)


        fetch(`${baseLink}users/${usrId}`,
            {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData,
            }
        )
    }
    const drawdata = (startFunds) => {
        let runningTotals = [startFunds ? startFunds : 0];
        let thistotal = 0;
        for (let i = logData.length; i >= 0; i--) {
            if (i < logData.length)
                thistotal = parseInt(runningTotals[0]) + parseInt(logData[i].amount);
            runningTotals.unshift(thistotal)
        }
        setRunningTotals(runningTotals)
        setTotalMoney(runningTotals[0])
        putData({totalMoney:runningTotals[0]})
    }

    const handleTime = (val) => {
        const dt = new Date(val)
        console.log(dt.getTime())
        setTime(dt.getTime())
    }


    useEffect(() => {
        showData()

    }, [])

    useEffect(() => {
        drawdata()
    }, [logData])

    const categoryOptions = [
        {
            label: "Select Category",
            value: "Select Category"
        },
        {
            label: "Food",
            value: "Food"
        },
        {
            label: "Rent",
            value: "Rent"
        },
        {
            label: "Groceries",
            value: "Groceries"
        },
        {
            label: "Transportation",
            value: "Transportation"
        },
        {
            label: "Bills",
            value: "Bills"
        },
        {
            label: "Entertainment",
            value: "Entertainment"
        },
        {
            label: "Miscellaneous",
            value: "Miscellaneous"
        }]

    const handleOptionChange = (e) => {
        setCategory(e.target.value);
    }

    const changeSpacing = () => {
        return logData[0]?'-400px':'0px'
    }

    return (
        <div className='main-page-content'>
            <div className='left-side' style={{marginLeft:changeSpacing()}}>

            
            <LineGraph />

                <h1>Total: ${commaAmount(totalMoney)}</h1>
                <div className="submission">
                    <div className='add-item' onClick={() => switchOpen()}>Add an item {open[1]}</div>
                    <div className='submit-area' style={{ display: open[0] }}>
                        <input type="text" placeholder="input name" value={name} onInput={(e) => setName(e.target.value)} />
                        <input type="number" placeholder="input amount" value={amount} onInput={(e) => setAmount(e.target.value)} />
                        <select className='category-select' value={category} onChange={(e) => handleOptionChange(e)}>
                            {categoryOptions.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <input type="date" onChange={e => handleTime(e.target.value)} />
                        <button className='submit-button' onClick={() => handleClick()}>Submit</button>
                        <p style={{ color: 'red' }}>{err}</p>
                    </div>
                </div>
                
            </div>

            <div id="log-area">
                {logData ? logData.map((log, index) => (
                    <Log className='single-log' key={index} name={log.name} amount={log.amount} time={log.time} total={runTotals[index]} />
                )) : null}
            </div>
        </div>
    )
}
export default MainPage