'use client'
import Image from 'next/image';
import logo from '@/assets/logo.png'

import { useRouter } from 'next/navigation'
import BalanceCard from '@/components/BalanceCard';

export default function Home() {

  const router = useRouter()

  return (
    <div className='flex items-center'>
      <div className='mx-auto max-w-2xl '>
        <BalanceCard balance={1234.56} logoSrc={logo} currency="PROPCO" />
        <div className="text-center">
        <h1 className='text-4xl font-bold tracking-tight  sm:text-6xl dark:text-white text-black mt-3'>
            Welcome to Propco Token App
          </h1>
          <Image src={logo} alt="logo" width={200} height={200} className='mx-auto mt-10'/>
          <p className='mt-6 text-lg leading-8 text-black dark:text-white'>
          Earn rewards by referring friends with our bot! Generate a unique referral link, share it, and receive tokens based on your friends purchases. Start now and watch your tokens grow!
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <button
       
              className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Get started
            </button>
          </div>
        </div>
         

      </div>
    </div>
  )
}
