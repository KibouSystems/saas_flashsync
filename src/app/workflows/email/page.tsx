'use client'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col g-4'>
        <h1>Email Workflow</h1>
        <label htmlFor="">Enter Email: </label>
        <input type="email" name="" id="" />
        <input type="file" name="excel" id="" />
        <button>
            Send Email
        </button>
    </div>
  )
}

export default page