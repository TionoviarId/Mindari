import React from 'react'

function CardHome() {
  return (
    <div className='h-screen'>

    <div className=' flex justify-between  gap-3 py-10 px-5'>
      <div className='flex flex-col items-center bg-[#E0F5FF] rounded-2xl p-3 w-32 h-32'>
        <p>🗄️</p>
<p>ChatBot AI</p>
<p>Curhat bersama AI</p>
      </div>
      <div className='flex flex-col items-center bg-[#E0F5FF] rounded-2xl  p-3 w-32 h-32'>
        <p>🙂</p>
<p>Mood Tracker</p>
<p>Curhat bersama AI</p>
      </div>
      <div className='flex flex-col items-center bg-[#E0F5FF] rounded-2xl p-3 w-32 h-32'>
        <p>📔</p>
<p>Edukasi</p>
<p>Curhat bersama AI</p>
      </div>
    </div>
    </div>
  )
}

export default CardHome
