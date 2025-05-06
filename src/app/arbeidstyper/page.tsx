'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { generateSlug } from '@/lib/utils'

type EfficiencyEntry = {
  id: number
  employee_name: string
  task_type: string
  project: string
  efficiency: number
  unit_type: string
}

export default function ArbeidstyperPage() {
  const [data, setData] = useState<EfficiencyEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('work_efficiency')
        .select('*')

      if (error) {
        console.error('Feil ved henting', error)
      } else {
        setData(data)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  const taskTypes = [...new Set(data.map(entry => entry.task_type))].map(type => ({
    name: type,
    slug: generateSlug(type)
  }))

  const getStats = (type: string) => {
    const filtered = data.filter(entry => entry.task_type === type)
    const speeds = filtered.map(entry => entry.efficiency)
    const avg = speeds.reduce((a, b) => a + b, 0) / speeds.length
    const max = Math.min(...speeds)
    const min = Math.max(...speeds)
    return {
      avg: avg.toFixed(2),
      max: max.toFixed(2),
      min: min.toFixed(2),
      unit: filtered[0]?.unit_type || ''
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Effektivitet per arbeidstype</h1>

      {loading ? (
        <p>Laster data...</p>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="p-2">Arbeidstype</th>
              <th className="p-2">Enhet</th>
              <th className="p-2">Gj.snitt</th>
              <th className="p-2">Raskest</th>
              <th className="p-2">Tregest</th>
            </tr>
          </thead>
          <tbody>
            {taskTypes.map((type, i) => {
              const stats = getStats(type.name)
              return (
                <tr key={i} className="border-t">
                  <td className="p-2 font-medium text-blue-600">
                    <Link href={`/arbeidstype/${type.slug}`}>{type.name}</Link>
                  </td>
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
    </div>
  )
}
