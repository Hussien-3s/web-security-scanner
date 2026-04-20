"use client"

import axios from "axios"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation";
import { BadgePlus, Plus, Globe } from 'lucide-react';

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

        setTarget("");
        setDescription("");
        router.refresh()
    }

    return (
        <article className="flex items-center justify-between rounded-xl border w-full border-white/10 bg-white/[0.02] px-4 py-4 hover:bg-white/[0.04] transition-all group">
            <div className="flex items-center gap-4 w-full">
                <div className="p-3 rounded-lg bg-cyan-500/10 transition-colors">
                    <Globe size={20} className="text-cyan-400" />
                </div>
                <div className="flex flex-1 gap-4 items-center">
                    <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1" htmlFor="target">Target URL</label>
                        <input 
                            required 
                            type="text" 
                            value={target} 
                            onChange={(e) => setTarget(e.target.value)} 
                            className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/50 transition-colors" 
                            placeholder="example.com" 
                        />
                    </div>
                    <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1" htmlFor="description">Description</label>
                        <input 
                            required 
                            type="text" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500/50 transition-colors" 
                            placeholder="Production Server" 
                        />
                    </div>
                </div>
            </div>
            <div className="ml-4 pt-4">
                <button 
                    disabled={!target || !description} 
                    onClick={handleAdd} 
                    className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-lg font-bold text-xs h-9 px-4 flex items-center gap-2 transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                >
                    <Plus size={16} />
                    Add Target
                </button>
            </div>
        </article>
    )
}