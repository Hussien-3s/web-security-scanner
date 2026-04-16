"use client"

import axios from "axios"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation";
import { BadgePlus } from 'lucide-react';

export default function AddCard() {
    const router = useRouter();
    const [target, setTarget] = useState("")
    const [description, setDescription] = useState("")
    const user = useUser()
    const handleAdd = () => {
        axios.post('http://localhost:8080/addTargets', {
            target,
            description,
            email: user?.user?.emailAddresses[0].emailAddress
        })

        router.refresh()
    }

    return (
        <article className="flex items-center justify-between rounded-md border w-full border-white/10 bg-white/[0.02] px-3 py-2.5">
            <div className="flex items-center gap-2.5">
                <div>
                    <label className="text-[15px] p-3" htmlFor="target">Target</label>
                    <input required type="text" value={target} onChange={(e) => setTarget(e.target.value)} className="text-[15px] p-3" placeholder="example.com" />
                    <label className="text-[15px] p-3" htmlFor="description">Description</label>
                    <input required type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="text-[15px] p-3" placeholder="target description..." />
                </div>
            </div>
            <div>
                <button disabled={!target || !description} onClick={handleAdd} className="bg-cyan-300 hover:bg-cyan-600 text-black rounded-full font-bold text-sm h-10 w-10 flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)]"><BadgePlus /></button>
            </div>
        </article>
    )


}