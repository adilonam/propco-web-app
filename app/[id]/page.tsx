'use client'
import Image from 'next/image';
import logo from '@/assets/logo.png'
import { useEffect, useState } from 'react';
import axios from 'axios';
import BalanceCard from '@/components/BalanceCard';
import { useParams } from 'next/navigation'
import "./styleHome.css";
import { useToast } from "@/components/ui/use-toast"
interface User {
  id: string;
  firstname: string;
  lastname: string;
  username: string;
  balance: string;
}
export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const { toast } = useToast()
  const params = useParams<{ id: string }>()
 
  const id: BigInt = BigInt( params?.id as string)
 


  const [isVibrating, setIsVibrating] = useState(false);

  const handleClick = () => {
    setClickCount(prevCount => prevCount + 1);
    setIsVibrating(true);

    setTimeout(() => {
      setIsVibrating(false);
    }, 200); // Vibration duration
  };


const handleClaimClick = (userId: BigInt , addAmount :number)=>{
  if(addAmount <= 0) return
 let  userIdNum = Number(userId)
  axios.put('/api/user/update-balance', {
    userId: userIdNum,
    addAmount
  })
  .then(response => {
    setUser(prevUser => {
      if (prevUser) {
        return {
          ...prevUser,
          balance: response.data.balance
        };
      }
      return prevUser;
    });

    setClickCount(0)
    toast({
      description: "Tokens claimed successfully.",
    })
    console.log('User updated:', response.data);
  })
  .catch(error => {
    console.error('Error updating user balance:', error.response?.data || error.message);
  });
}



  useEffect(() => {
    if (id) {
      axios.get(`/api/user/${id}`)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error.response?.data?.error || 'User not found');
          setUser(null);
        });
    }
  }, [id]);

  
  return (
    <>
       <div className='container mx-auto py-3'>
      <div className='flex flex-col justify-center '>
      <BalanceCard balance={parseFloat(user?.balance || '0') } logoSrc={logo} currency="PROPCO" />
    
    <h1 className='text-4xl text-center font-bold tracking-tight  sm:text-6xl dark:text-white text-black mt-3'>
        Welcome to Propco Token App
      </h1>
      <div 
    onClick={handleClick} 
    className={`mx-auto mt-10 inline-block ${isVibrating ? 'vibrate' : ''}`}
    style={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }}>
    <Image src={logo} alt="logo" width={300} height={300} className='mx-auto mt-10'/>
  </div>
  <div className="max-w-sm mx-auto text-center mt-5 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-lg ">
   <p>⚡ Logo clicked {clickCount} times ⚡</p> 
    <button
onClick={()=>handleClaimClick(id, clickCount)}
    className="mt-5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition duration-300 ease-in-out">
    Claim
  </button>
  </div>
  
<div>
<p className='mt-6 text-lg leading-8 text-black dark:text-white text-center'>
      Earn rewards by referring friends with our bot! Generate a unique referral link, share it, and receive tokens based on your friends purchases. Start now and watch your tokens grow!
      </p>
      <div className='mt-10 flex items-center justify-center gap-x-6'>
        <button
   
          className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mb-3'
        >
          Get started
        </button>
</div>
      </div>
      
        
          </div>
  
         


    </div>

  
    
    
    </>
  
  )
}
