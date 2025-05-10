'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { generateSlug } from '@/lib/utils'

type Entry = {
  task_type: string
  efficiency: number
  unit_type: string
}

export default function ProsjektDetalj() {
  const { id } = useParams()
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [projectName, setProjectName] = useState('')

  useEffect(() => {
    const fetch = async () => {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('name')
        .eq('id', id)
        .single()

      if (projectError || !projectData) {
        console.error('Kunne ikke hente prosjektnavn:', projectError?.message)
      setLoading(false)
      return
    }

    const projectName = projectData.name
    setProjectName(projectName)

    // 2. Hent relevante work_efficiency-rader
    const { data, error } = await supabase
    .from('work_efficiency')
    .select('task_type, efficiency, unit_type, project')
    .eq('project', projectName)

    if (error) console.error('Feil ved henting:', error.message)
        else setEntries(data)

    setLoading(false)
}

    fetch()
  }, [id])

  const taskTypes = [...new Set(entries.map(e => e.task_type))]

  const getStats = (type: string) => {
    const filtered = entries.filter(e => e.task_type === type)
    const speeds = filtered.map(e => e.efficiency)
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tasks for project: {projectName}</h1>

      {loading ? (
        <p>Laster...</p>
      ) : taskTypes.length === 0 ? (
        <p>Ingen registrerte oppgaver for dette prosjektet.</p>
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
              const stats = getStats(type)
              return (
                <tr key={i} className="border-t">
                  <td className="p-2 font-medium text-blue-600 underline">
                    <Link href={`/arbeidstype/${generateSlug(type)}`}>
                    {type}
                    </Link>
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
