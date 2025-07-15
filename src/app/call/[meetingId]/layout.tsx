import React from 'react'

const Layout = ({ children }: {children: React.ReactNode}) => {
  return (
    <div className='bg-black h-screen '>
      {children}
    </div>
  )
}

export default Layout; 
