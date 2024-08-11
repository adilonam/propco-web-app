'use client'
import Image from 'next/image';
import logo from '@/assets/logo.png'
import telegramLogo from '@/assets/telegram.png'
import bitmartLogo from '@/assets/bitmart.png'
import uniswapLogo from '@/assets/uniswap.jpeg'
import { useEffect, useState } from 'react';
import axios from 'axios';
import BalanceCard from '@/components/BalanceCard';
import { useParams } from 'next/navigation'
import "./styleHome.css";
import { useToast } from "@/components/ui/use-toast"
import { User } from '@prisma/client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Wrench, RocketIcon } from 'lucide-react';
import TaskCard from '@/components/TaskCard';
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"




export default function Home() {
    const [user, setUser] = useState<User | null>(null);

    const router = useRouter()
    const params = useParams<{ id: string }>()

    const id: BigInt = BigInt(params?.id as string || "0")




    const handleClickTelegram = () => {
        window.location.href = 'https://t.me/propco';
    };

    const handleClickBitmart = () => {
        window.open('https://www.bitmart.com/trade/en-US?symbol=PROPCO_USDT', '_blank');
    };


    const handleClickUniswap = () => {
        window.open('https://app.uniswap.org/explore/pools/polygon/0xd3ed7dF705e8399BE84838861173dDFC8124c251', '_blank');
    };





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
                    <Alert hidden={!user?.admin} className='mt-2'>
                        <Wrench className="h-4 w-4" />
                        <AlertTitle>Admin panel </AlertTitle>
                        <AlertDescription>
                            <Button className='mt-3' onClick={()=> {router.push(`/${user?.id}/claim-request`)}} >Claim Request</Button>
                        </AlertDescription>
                    </Alert>


                    <BalanceCard balance={user?.balance || 0} logoSrc={logo} currency="PROPCO" />

                    <div className='mt-6'>
                        <h1 className='text-2xl text-center font-bold tracking-tight  sm:text-6xl dark:text-white text-black mt-3'>
                            Refer Friends and Earn ! 🚀
                        </h1>
                        <Alert className='mt-2'>
                            <RocketIcon className="h-4 w-4" />
                            <AlertTitle>{user?.invitedFriend} Friends Invited</AlertTitle>
                            <AlertDescription>
                                Invite your friends and earn commission! 💸
                            </AlertDescription>
                        </Alert>


                        <TaskCard id={id} friends={1} reward={process.env.NEXT_PUBLIC_INVITATION_REWARD as string}></TaskCard>
                    </div>


                    <div className='mt-6'>
                        <h1 className='text-2xl text-center font-bold tracking-tight  sm:text-6xl dark:text-white text-black mt-3'>
                            Come Join Us! 🎉
                        </h1>
                        <Image src={telegramLogo} alt="telegramLogo" width={200} height={200} className='mx-auto mt-10' onClick={handleClickTelegram} />
                    </div>

                    <div className='mt-6'>
                        <h1 className='text-2xl text-center font-bold tracking-tight  sm:text-6xl dark:text-white text-black mt-3'>
                            Buy PropCo on Bitmart🛒
                        </h1>
                        <Image src={bitmartLogo} alt="telegramLogo" width={100} height={100} className='mx-auto mt-10' onClick={handleClickBitmart} />
                        <p className='text-center mt-2'>click logo to buy</p>
                    </div>

                    <div className='mt-6'>
                        <h1 className='text-2xl text-center font-bold tracking-tight  sm:text-6xl dark:text-white text-black mt-3'>
                            Buy PropCo on Uniswap🛒
                        </h1>
                        <Image src={uniswapLogo} alt="telegramLogo" width={150} height={150} className='mx-auto mt-10' onClick={handleClickUniswap} />
                        <p className='text-center mt-2'>click logo to buy</p>
                    </div>


                    <div>
                        <p className='mt-6 text-lg leading-8 text-black dark:text-white text-center'>
                            Earn rewards by referring friends with our bot! Generate a unique referral link, share it, and receive tokens based on your friends purchases. Start now and watch your tokens grow!
                        </p>
                        <div className='mt-10 flex items-center justify-center gap-x-6'>

                        </div>
                    </div>


                </div>




            </div>




        </>

    )
}
