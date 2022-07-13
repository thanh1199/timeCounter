
import { useEffect, useState } from "react";
import style from "./style.module.scss";


function App() {
  // const [second, setSecond] = useState(0)
  // const [miliSecond, setMiliSecond] = useState(0)
  // const [toCount, setToCount] = useState("stop")
  // const [mess_, setMess_] = useState("")

  // useEffect(() => {
  //   if (toCount === "start") {
  //     if (miliSecond === 95) {
  //       setMiliSecond(0)
  //       setSecond(second+1)
  //     } else {
  //       const timeOut = setTimeout(() => {
  //         setMiliSecond(miliSecond+5)
  //       }, 50)
  //       return () => clearTimeout(timeOut)
  //     }
  //   } else if (toCount === "delay") {
  //     setSecond(second)
  //     setMiliSecond(miliSecond)
  //   } else if (toCount === "stop") {
  //     setSecond(0)
  //     setMiliSecond(0)
  //   }
  // }, [toCount, miliSecond, second])
  
  // const handleStart_ = () => {
  //   setToCount("start")
  // }
  // const handleStop_ = () => {
  //   setToCount("stop")
  //   setMess_(name+": "+second+"."+miliSecond)
  // }
  // const handleDelay_ = () => {
  //   setToCount("delay")
  // }

  const [name, setName] = useState("")
  const [typeName, setTypeName] = useState(false)
  const [timeStart, setTimeStart] = useState(0)
  const [status, setStatus] = useState("init")
  const [timeSum, setTimeSum] = useState(0)
  const [mess, setMess] = useState("Welcome !!!")
  const [writeDB, setWriteDB] = useState("")
  const [log, setLog] = useState([])

  const reloadLog = () => {
    fetch("https://psychologytimer.herokuapp.com/index.php?type=read", {
      method: "get"
    })
    .then((response) => response.json())
    .then((array) => setLog(array))
  }
  
  const writeToDB = (logData) => {
    const data = new FormData()
    data.append("log", logData)
    fetch("https://psychologytimer.herokuapp.com/index.php?type=write", {
      method: "post",
      body: data
    })
    .then(() => reloadLog())
  }

  useEffect(() => {reloadLog()}, [])

  const handleName = (newName) => setName(newName)

  const handleStart = () => {
    var now = new Date()
    const initName = `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}*${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
    if (status === "init") {
      if (name === "") {
        setTypeName(false)
        setName(initName)
        setMess(initName+": START")
      } else {
        setMess(name+": START")
      }
      setTimeStart(now.getTime())
      setStatus("run")
    } else if (status === "delay") {
      if (name === "") {
        setName(initName)
        setMess(initName + ": " + writeDB + ", RUNNING")
      } else {
        setMess(name + ": " + writeDB + ", RUNNING")
      }
      setTimeStart(now.getTime())
      setStatus("run")
      setWriteDB(writeDB + ", ")
    }
  }
  const handleStop = () => {
    var now = new Date()
    const initName = `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}*${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
    var nameUse
    if (name === "") {
      setTypeName(false)
      setName(initName)
      nameUse = initName
    } else {
      nameUse = name
    }

    if (status === "run") {
      var timeStop = new Date()
      const result = timeSum + (timeStop.getTime() - timeStart)/1000
      const resultFixed = result.toFixed(3)
      const thisStop = (timeStop.getTime() - timeStart)/1000
      if (writeDB === "") {
        setMess(nameUse + "_ " + resultFixed + " seconds")
        writeToDB(nameUse + "_ " + resultFixed + " seconds")
      } else {
        setMess(nameUse + "_ " + writeDB + thisStop + "seconds → " + resultFixed + " seconds")
        writeToDB(nameUse + "_ " + writeDB + thisStop + "seconds → " + resultFixed + " seconds")
      }
    } else if (status === "delay") {
      const timeSumFixed = timeSum.toFixed(3)
      setMess(nameUse + "_ " + writeDB + " → " + timeSumFixed + " seconds")
      writeToDB(nameUse + "_ " + writeDB + " → " + timeSumFixed + " seconds")
    }
    typeName && name!=="" ? setName(name) : setName("")
    setStatus("init")
    setWriteDB("")
    setTimeSum(0)
  }
  const handleDelay = () => {
    var now = new Date()
    const initName = `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()}*${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
    var nameUse
    if (name === "") {
      setTypeName(false)
      setName(initName)
      nameUse = initName
    } else {
      nameUse = name
    }
    var timeDelay = new Date()
    const time_sum = timeSum + (timeDelay.getTime() - timeStart)/1000
    const thisDelay = (timeDelay.getTime() - timeStart)/1000
    setTimeSum(time_sum)
    setMess(nameUse + ": " + writeDB + thisDelay + " seconds, DELAY")
    setStatus("delay")
    setWriteDB(writeDB + thisDelay + " seconds")
  }

  log.sort((a,b) => b.index-a.index)

  var x = document.getElementById("point") ? document.getElementById("point").getBoundingClientRect().left : 0
  var y = document.getElementById("container") ? document.getElementById("container").getBoundingClientRect().left : 0
  var z = document.getElementById("fillBar") ? document.getElementById("fillBar").clientWidth : 0

  return (
    <div className={style.container}>
      <input 
        value={name} 
        onChange={(e) => handleName(e.target.value)} 
        onClick={() => setTypeName(true)}
        placeholder="Name is auto the START's time"
        className={style.name}
      />
      {/* <div>{second}.{miliSecond}</div>
      <div onClick={() => handleStart_()} >START</div>
      <div onClick={() => handleStop_()} >STOP</div>
      <div onClick={() => handleDelay_()} >DELAY</div>
      <div>{mess_}</div> */}
      <div className={style.animation} id="container" >
        <div id="point" style={{
          position: "absolute",
          top: "-12px",
          left: "-12px",
          width: "30px",
          height: "30px",
          backgroundColor: "rgb(108, 0, 130)",
          borderRadius: "30px",
          animation: status === "run" ? "move 5s  ease-in-out infinite" : "backPoint 1s linear"
        }} />
        <div id="fillBar" style={{
          position: "absolute",
          top: "0",
          left: "0",
          height: "100%",
          width: "0px",
          borderRadius: "inherit",
          backgroundColor: "rgb(108, 0, 130)",
          animation: status === "run" ? "grow 60s infinite ease-in-out" : "backFillBar 1s linear",
        }} />
      </div>
      <div className={style.func} >
        <div 
          className={style.start} 
          onClick={status === "run" ? () => {} : () => handleStart()}
          style={status === "run" ? {opacity: "0.2", cursor: "no-drop"} : {}}
        >START</div>
        <div 
          className={style.stop}
          onClick={status === "init" ? () => {} : () => handleStop()}
          style={status === "init" ? {opacity: "0.2", cursor: "no-drop"} : {}}
        >STOP</div>
        <div 
          className={style.delay}
          onClick={status !== "run" ? () => {} : () => handleDelay()}
          style={status !== "run" ? {opacity: "0.2", cursor: "no-drop"} : {}}
        >DELAY</div>
      </div>
      <div 
        className={style.mess}
      >{mess}</div>
      <div className="" />
      <div className={style.logContainer} >
        {log.map((l, i) => <p key={i} className={style.log}>({l.id})_ {l.log}</p>)}
      </div>
      <style>
        {`@keyframes backPoint {
          0% {
            left: ${-(y-x)}px;
          }
          100% {
            left: -12px;
          }
        }
        @keyframes move {
            0% {
                left: -12px;
            } 50% {
                left: 288px;
            } 100% {
                left: -12px;
            }
        }
        @keyframes backFillBar {
          0% {
            width: ${z}px;
          }
          100% {
            with: 0px;
          }
        }
        @keyframes grow {
            0% {
                width: 0px;
            }
            50% {
                width: 100%;
            }
            100% {
                width: 0px;
            }
        }`}
      </style>
    </div>
  );
}

export default App;
