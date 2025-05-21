import React from 'react'

function NavbarHome() {
  return (
    <div className='bg-white text-black grid grid-cols-2 py-3 px-5 shadow-black shadow-2xl'>
      <div>
        MINDARI
      </div>
      <div className='flex text-[16px] font-semibold justify-between'>
        <button>Beranda</button>
        <button>Chatbot</button>
        <button>Edukasi</button>
        <button>Kontak</button>
      </div>
    </div>
  )
}

export default NavbarHome
