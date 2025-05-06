'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Efficiency = {
    id: number
    employee_name: string
    task_type: string
    project: string
    efficiency: number
    unit_type: string
    created_at: string
}

export default function Dashboard() {
    const [userEmail, setUserEmail] = useState('')
    const [data, setData] = useState<Efficiency[]>([])
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            const { data, error } = await supabase.auth.getUser()
            if (data?.user) {
                setUserEmail(data.user.email || '')
            } else {
                router.push('/login') // send tilbake hvis ikke logget inn
            }
            }
            getUser()
        }, [router])

        const handleLogout = async () => {
            await supabase.auth.signOut()
            router.push('/login')
        }

        useEffect(() => {
            const fetchData = async () => {
                const { data, error } = await supabase
                .from('work_efficiency')
                .select('*')
                .order('efficiency', { ascending: true })

                if (error) {
                    console.error('Feil ved henting', error)
                } else {
                    setData(data)
                }
            }

            fetchData()
        }, [])

        return (
            <div className="max-w-5xl mx-auto mt-10 px-4">
                <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-2">Velkommen, {userEmail}</h1>
                <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                >
                    Logg ut
                </button>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Effektivitet per ansatt</h2>
            <table className="w-full border text-sm">
                <thead className="bg-grey-100">
                <tr>
                <th className="border p-2">Navn</th>
                <th className="border p-2">Oppgave</th>
                <th className="border p-2">Prosjekt</th>
                <th className="border p-2">Timer per enhet</th>
                <th className="border p-2">Enhet</th>
                </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id}>
                            <td className="border p-2">{row.employee_name}</td>
                            <td className="border p-2">{row.task_type}</td>
                            <td className="border p-2">{row.project}</td>
                            <td className="border p-2">{row.efficiency.toFixed(2)}</td>
                            <td className="border p-2">{row.unit_type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        )
}