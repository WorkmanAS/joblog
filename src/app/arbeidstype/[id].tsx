// pages/arbeidstype/[id].tsx

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type EfficiencyEntry = {
    id: number
    employee_name: string
    task_type: string
    project: string
    efficiency: number // timer per enhet (f.eks. m2)
}

export default function ArbeidstypeSide() {
    const router = useRouter()
    const { id } = router.query // "id" er arbeidstypen, f.eks. "utlekting"

    const [data, setData] = useState<EfficiencyEntry[]>([])

    useEffect(() => {
        if (!id) return

        // Bruk dummy-data her - senere bytter vi ut med Supabase
        const dummy: EfficiencyEntry[] = [
            { id: 1, employee_name: 'Oleg Bulachi', task_type: 'Montering av fasadekledning med bordbredde på 120 mm', project: 'Høydebasseng Trippestad', efficiency: 1.0089 },
            { id: 2, employee_name: 'Anatolie Gancear', task_type: 'Montering av fasadekledning med bordbredde på 120 mm', project: 'Høydebasseng Trippestad', efficiency: 1.0089 },
            { id: 3, employee_name: 'Serghei Stadnitchi', task_type: 'Montering av fasadekledning med bordbredde på 120 mm', project: 'Høydebasseng Trippestad', efficiency: 1.0089 },
            { id: 4, employee_name: 'Olegs Fjodorovs', task_type: 'Montering av fasadekledning med bordbredde på 120 mm', project: 'Høydebasseng Trippestad', efficiency: 0.9538 },
            { id: 5, employee_name: 'Igors Fjodorovs', task_type: 'Montering av fasadekledning med bordbredde på 120 mm', project: 'Høydebasseng Trippestad', efficiency: 0.9538 },
            { id: 6, employee_name: 'Anatolie Gancear', task_type: 'Montering av fasadekledning med bordbredde på 120 mm', project: 'Høydebasseng Trippestad', efficiency: 0.7386 },
            { id: 7, employee_name: 'Evgenii Dudin', task_type: 'Montering av fasadekledning med bordbredde på 120 mm', project: 'Høydebasseng Trippestad', efficiency: 0.7386 },
            { id: 8, employee_name: 'Olegs Fjodorovs', task_type: 'Montering av fasadekledning med bordbredde på 120 mm', project: 'Høydebasseng Trippestad', efficiency: 0.8087 },
            { id: 9, employee_name: 'Igors Fjodorovs', task_type: 'Montering av fasadekledning med bordbredde på 120 mm', project: 'Høydebasseng Trippestad', efficiency: 0.8087 }
        ]

        // Filter etter arbeidstype (fra URL)
        const filtered = dummy.filter(log => log.task_type === id)
        setData(filtered)
    }, [id])

const sorted = [...data].sort((a, b) => a.efficiency - b.efficiency)
const fastest = sorted[0]
const slowest = sorted[sorted.length - 1]
const avg = data.reduce((sum, log) => sum + log.efficiency), 0) / data.length

return (
    <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Effektivitet - {id}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-100 p-4 rounded-xl shadow">
                <b> Raskest:</b> {fastest?.employee_name} - {fastest?.efficiency.toFixed(3)} t/m2
                </div>
            <div className="bg-yellow-100 p-4 rounded-xl shadow">
                <b>Gjennomsnitt:</b> {avg.toFixed(3)} t/m2
                </div>
            <div className="bg-red-100 p-4 rounded-xl shadow">
                <b>Tregest:</b> {slowest?.employee_name} - {(slowest?/efficiency.toFixed(3)} t/m2
                </div>
        </div>

        <table className="w-full text-left border">
            <thead className="bg-grey-100">
                <tr>
                    <th className="p-2">Navn</th>
                    <th className="p-2">Prosjekt</th>
                    <th className="p-2">Effektivitet (t/m2)</th>
                </tr>
            </thead>
            <tbody>
                {sorted.map(log => (
                    <tr key={log.id} className="border-t">
                        <td className="p-2">{log.employee_name}</td>
                        <td className="p-2">{log.project}</td>
                        <td className="p-2">{log.efficiency.toFixed(3)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)
}