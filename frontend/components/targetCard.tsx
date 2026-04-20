"use client"

import { Trash2, Target } from "lucide-react"
import axios from "axios"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function TargetCard({ targets }: { targets: any[] }) {
    const user = useUser()
    const router = useRouter()


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
                <article key={index} className="flex items-center justify-between rounded-xl border w-full border-white/10 bg-white/[0.02] px-4 py-4 hover:bg-white/[0.04] transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-white/5 group-hover:bg-cyan-500/10 transition-colors">
                            <Target size={20} className="text-zinc-400 group-hover:text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">{item.target}</p>
                            <p className="text-xs text-zinc-500 mt-1">{item.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleDelete(item.target)}
                            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg font-bold text-xs h-9 px-4 transition-all duration-300"
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>
                    </div>
                </article>
            ))}
        </>
    )
}