"use client"

import { Trash2 } from "lucide-react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function DeleteSessionButton({ groupId }: { groupId: string }) {
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm("Are you sure you want to delete this entire scan session? All profile results for this audit will be permanently removed.")) return

    try {
      await axios.delete(`http://localhost:8080/deleteScanGroup/${groupId}`)
      router.refresh()
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete scan session.")
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="p-2 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
      title="Delete Session"
    >
      <Trash2 size={18} />
    </button>
  )
}
