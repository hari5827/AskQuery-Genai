import React,{useEffect} from 'react'
import { useSelector } from 'react-redux'
import {useChat} from '../hook/useChat'


const Dashboard = () => {



    const user = useSelector(state => state.auth.user)
 console.log(user)
 const { initializeSocketConnection } = useChat();

useEffect(() => {
    initializeSocketConnection();
}, []);
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard