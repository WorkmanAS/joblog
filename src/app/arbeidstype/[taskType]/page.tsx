'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { generateSlug } from '@/lib/utils'
import Link from 'next/link'

type EfficiencyEntry = {
  id: number
  employee_name: string
  task_type: string
  project: string
  efficiency: number
  unit_type: string
}

export default function TaskTypePage() {
  const params = useParams()
  const slug = params.taskType as string

  const [data, setData] = useState<EfficiencyEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [originalTaskName, setOriginalTaskName] = useState<string>('') // NEW

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('work_efficiency')
        .select('*')

      if (error) {
        console.error('Feil ved henting', error)
      } else {
        const taskTypes = [...new Set(data.map(entry => entry.task_type))].map(name => ({
          name,
          slug: generateSlug(name)
        }))

        const matched = taskTypes.find(t => t.slug === slug)

        if (matched) {
          const filteredData = data.filter(entry => entry.task_type === matched.name)
          setOriginalTaskName(matched.name)
          setData(filteredData)
        } else {
          console.error('Ingen arbeidstype matcher sluggen', slug)
        }
      }
      setLoading(false)
    }

    fetchData()
  }, [slug])

  // Sort data by efficiency descending (fastest first)
  const sortedData = [...data].sort((a, b) => a.efficiency - b.efficiency)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Arbeidstype: {originalTaskName}</h1>
      {!loading && sortedData.length > 0 && (
  <div className="mb-6">
    <p><strong>Gjennomsnittlig hastighet:</strong> {(
      sortedData.reduce((sum, entry) => sum + entry.efficiency, 0) / sortedData.length
    ).toFixed(2)} {sortedData[0].unit_type}</p>

    <p><strong>Raskeste:</strong> {sortedData[0].efficiency.toFixed(2)} {sortedData[0].unit_type}</p>

    <p><strong>Tregeste:</strong> {sortedData[sortedData.length - 1].efficiency.toFixed(2)} {sortedData[0].unit_type}</p>
  </div>
)}


      {loading ? (
        <p>Laster data...</p>
      ) : sortedData.length === 0 ? (
        <p>Ingen data funnet for denne arbeidstypen.</p>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="p-2">Arbeider</th>
              <th className="p-2">Prosjekt</th>
              <th className="p-2">Hastighet</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((entry) => (
              <tr key={entry.id} className="border-t">
                <td className="p-2 font-medium text-blue-600 underline">
                  <Link href={`/ansatte/${encodeURIComponent(entry.employee_name)}`}>
                  {entry.employee_name}
                  </Link>
                  </td>
                <td className="p-2">{entry.project}</td>
                <td className="p-2">{entry.efficiency.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
