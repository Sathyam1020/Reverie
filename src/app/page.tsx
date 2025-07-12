import { auth } from '@/lib/auth';
import HomeView from '@/modules/home/ui/views/HomeView';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'

const Page = async () => {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if(!session) {
    redirect('/sign-in'); 
  }
  
  return (
    <div>
      <HomeView />
    </div>
  )
}

export default Page; 
