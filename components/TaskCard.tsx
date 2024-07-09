// pages/index.tsx
"use client"

import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card"

import { Button } from "./ui/button"

import Image from 'next/image';
import logo from '@/assets/logo.png'


type TaskParams = {
    id:BigInt,
    friends: number;
    reward: string;
  };
const TaskCard :React.FC<TaskParams> = ({id,  friends, reward }) => {

    const tgMsgUrl = `https://t.me/share/msg?text=https%3A%2F%2Ft.me%2FPropcoBot%3Fstart%3D${id}%0APropco%20tokens%20farming%20major%20upgrade%21%20Two%20is%20better%20than%20one%21%20Join%20my%20squad%2C%20and%20let%27s%20double%20the%20fun%20(and%20earnings%20%F0%9F%A4%91)!%20%F0%9F%9A%80`;

    const handleClick = () => {
        window.location.href = tgMsgUrl;
      };
    
    return (

        <Card className="my-3">
            <CardHeader>
                <CardTitle>Inivte {friends} Friend</CardTitle>
                <CardDescription>
                    <span className="flex">


                        <Image src={logo} alt="logo" width={20} height={20} className='me-2' />
                        <span>{reward} PROPCO.</span>
                    </span>


                </CardDescription>
            </CardHeader>

            <CardFooter className="flex justify-end">
                <Button onClick={handleClick}>Start</Button>
            </CardFooter>
        </Card>


    );
};

export default TaskCard;
