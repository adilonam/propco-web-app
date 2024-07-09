// pages/index.tsx
"use client"

import React, { useEffect, useState } from "react";
import TaskCard from "@/components/TaskCard";
import { useParams } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RocketIcon } from "@radix-ui/react-icons"
import { User } from "@prisma/client";
import axios from "axios";

const Tasks = () => {

  const [user, setUser] = useState<User | null>(null);
    const params = useParams<{ id: string }>()
 
    const id: BigInt = BigInt( params?.id as string || "0")
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
    <div className="container  py-4">

      <Alert >
      <RocketIcon className="h-4 w-4" />
      <AlertTitle>{user?.invitedFriend} Friends Invited</AlertTitle>
      <AlertDescription>
      Invite your friends and earn commission! 💸
      </AlertDescription>
    </Alert>


  <TaskCard id={id} friends={1} reward={"100"}></TaskCard>

  <TaskCard id={id} friends={1} reward={"100"}></TaskCard>
  <TaskCard id={id} friends={5} reward={"500"}></TaskCard>
  <TaskCard id={id} friends={10} reward={"1 000"}></TaskCard>
  <TaskCard id={id} friends={20} reward={"2 000"}></TaskCard>
  <TaskCard id={id} friends={50} reward={"5 000"}></TaskCard>
  <TaskCard id={id} friends={100} reward={"10 000"}></TaskCard>
    </div>
  );
};

export default Tasks;
