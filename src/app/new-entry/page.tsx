'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type FormFields = {
  employee_name: string
  task_type: string
  project: string
  efficiency: string
  unit_type: string
}

export default function NewEntryPage() {
  const [form, setForm] = useState<FormFields>({
  employee_name: '',
  task_type: '',
  project: '',
  efficiency: '',
  unit_type: '',
})

  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const insertIfNotExists = async (table: string, name: string) => {
    if (!name || name.trim() === '') {
      console.error(`Navn for ${table} er tomt – avbryter.`)
      return null
    }
  
    const { data: existing, error: fetchError } = await supabase
      .from(table)
      .select('id')
      .eq('name', name)
      .maybeSingle()
  
    if (fetchError) {
      console.error(`Feil ved henting fra ${table}:`, fetchError.message)
      return null
    }
  
    if (existing) return existing.id
  
    const { data: inserted, error: insertError } = await supabase
      .from(table)
      .insert(
        table === 'task_types' ? { name, unit: null } : { name }
      )
      .select('id')
      .single()
  
    if (insertError) {
      console.error(`Feil ved innsetting i ${table}:`, insertError.message)
      console.error('Insert error object:', insertError)
      return null
    }
  
    return inserted.id
  }
  

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    console.log('Skjema:', form) 
  
    const { employee_name, task_type, project, efficiency, unit_type } = form
  
    const employee_id = await insertIfNotExists('employees', employee_name)
    const task_type_id = await insertIfNotExists('task_types', task_type)
    const project_id = await insertIfNotExists('projects', project)
  
    // 👇 Legg inn sjekk her!
    if (!employee_id || !task_type_id || !project_id) {
      setMessage('Feil: Klarte ikke å lagre en av ID-ene. Sjekk dataene og prøv igjen.')
      return
    }
  
    const { error } = await supabase.from('work_efficiency').insert({
      employee_name,
      task_type,
      project,
      efficiency: parseFloat(efficiency),
      unit_type,
    })
  
    if (error) {
      setMessage('Feil under lagring: ' + error.message)
    } else {
      setMessage('Data lagret!')
      setForm({ employee_name: '', task_type: '', project: '', efficiency: '', unit_type: '' })
    }
  }
  

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">New Entry</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['employee_name', 'task_type', 'project', 'efficiency', 'unit_type'].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field as keyof FormFields]}
            onChange={handleChange}
            placeholder={field.replace('_', ' ')}
            className="w-full p-2 border rounded"
          />
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Lagre
        </button>
        {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
      </form>
    </div>
  )
}

console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

