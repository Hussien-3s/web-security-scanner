"use client"

import axios from "axios"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation";

export default function TargetCard({ targets }: { targets: any[] }) {
    const user = useUser()
    const router = useRouter()

    const handleScan = async (target: string) => {
        const response = await axios.post('http://localhost:8080/startScan', {
            target,
            email: user?.user?.emailAddresses[0].emailAddress,
            profileName: 'fuzzing' // Default profile
        })

        console.log(response.data)
        router.push('/home/scans')
    }

    const handleDelete = (target: string) => {
        axios.delete('http://localhost:8080/deleteTargets', {
            data: {
                target,
                email: user?.user?.emailAddresses[0].emailAddress
            }
        })

        router.refresh()
    }

    return (
        <>
            {targets.map((item: any, index: number) => (
                <article key={index} className="flex items-center justify-between rounded-md border w-full border-white/10 bg-white/[0.02] px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                        <div>
                            <p className="text-[15px] font-medium text-white">{item.target}</p>
                            <p className="text-[15px] text-zinc-500">{item.description}</p>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => handleScan(item.target)} className="bg-cyan-300 hover:bg-cyan-600 text-black rounded-sm font-bold text-sm h-10 px-6 transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)]">Scan</button>
                        <button onClick={() => handleDelete(item.target)} className="bg-red-600 hover:bg-red-300 text-black ml-3 rounded-sm font-bold text-sm h-10 px-6 transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)]">Delete</button>
                    </div>
                </article>
            ))}
        </>
    )
}