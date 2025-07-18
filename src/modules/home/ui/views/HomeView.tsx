'use client';

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";


const HomeView = () => {

  const trpc = useTRPC();
  const {data} = useQuery(trpc.hello.queryOptions({text: "Sathyam"})); 
  return (
    <div className='flex flex-col p-4 gap-y-4'>
      {data?.greeting }
    </div>
  )
}

export default HomeView; 