// pages/index.tsx
"use client"

import React from "react";
import TaskCard from "@/components/TaskCard";
import { useParams } from 'next/navigation'


const Tasks = () => {
    const params = useParams<{ id: string }>()
 
    const id: BigInt = BigInt( params?.id as string || "0")

    
  return (
    <div className="container">
  
  <TaskCard id={id} friends={1} reward={"100"}></TaskCard>

    </div>
  );
};

export default Tasks;
