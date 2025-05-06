'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { generateSlug } from '@/lib/utils'

type Entry = {
  id: number
  employee_name: string
  task_type: string
  project: string
  efficiency: number
  unit_type: string
}

export default function EmployeePage() {
  const { name } = useParams()
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('work_efficiency')
        .select('*')

      if (error) {
        console.error('Feil ved henting av data:', error)
        setLoading(false)
        return
      }

      const decodedName = decodeURIComponent(name as string).trim().toLowerCase()

      const filtered = data.filter(entry =>
        entry.employee_name?.trim().toLowerCase() === decodedName
      )

      setEntries(filtered)
      setLoading(false)
    }

    fetchData()
  }, [name])

  const getStats = (taskType: string) => {
    const filtered = entries.filter(e => e.task_type === taskType)
    const speeds = filtered.map(e => e.efficiency)
    const avg = speeds.reduce((a, b) => a + b, 0) / speeds.length
    const max = Math.min(...speeds)
    const min = Math.max(...speeds)
    return {
      avg: avg.toFixed(2),
      max: max.toFixed(2),
      min: min.toFixed(2),
      unit: filtered[0]?.unit_type || '',
      project: filtered[0]?.project || ''
    }
  }

  const taskTypes = [...new Set(entries.map(e => e.task_type))]

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Here are the tasks {decodeURIComponent(name as string)} completed:
      </h1>

      {loading ? (
        <p>Loading data...</p>
      ) : entries.length === 0 ? (
        <p>No data found for this employee.</p>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="p-2">Task type</th>
              <th className="p-2">Project</th>
              <th className="p-2">Unit</th>
              <th className="p-2">Avg</th>
              <th className="p-2">Fastest</th>
              <th className="p-2">Slowest</th>
            </tr>
          </thead>
          <tbody>
            {taskTypes.map((task, i) => {
              const stats = getStats(task)
              return (
                <tr key={i} className="border-t">
                  <td className="p-2 text-blue-600 font-medium">
                    <Link href={`/arbeidstype/${generateSlug(task)}`}>{task}</Link>
                  </td>
                  <td className="p-2">{stats.project}</td>
                  <td className="p-2">{stats.unit}</td>
                  <td className="p-2">{stats.avg}</td>
                  <td className="p-2 text-green-700">{stats.max}</td>
                  <td className="p-2 text-red-700">{stats.min}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </main>
  )
}
