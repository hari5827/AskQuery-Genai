import React from 'react'
import { useSelector } from 'react-redux'



const Dashboard = () => {



    const user = useSelector(state => state.auth.user)
 console.log(user)
  if(!user){
    return <h1>Loading...</h1>
  }
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard