'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

type Project = {
  id: string
  name: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .order('name', { ascending: true })

      if (error) {
        console.error('Feil ved henting av prosjekter:', error.message)
      } else {
        setProjects(data)
      }

      setLoading(false)
    }

    fetchProjects()
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Prosjekter</h1>

      {loading ? (
        <p>Laster prosjekter...</p>
      ) : projects.length === 0 ? (
        <p>Ingen prosjekter funnet.</p>
      ) : (
        <ul className="space-y-2">
          {projects.map((project) => (
            <li key={project.id}>
                <Link
                href={`/prosjekt/${project.id}`}
                className="block p-3 border rounded bg-white text-gray-900 hover:bg-gray-100 transition"
                >
              {project.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
