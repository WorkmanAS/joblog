// pages/log-time.tsx
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LogTime() {
    const [formData, setFormData] = useState({
        employee_name: '',
        task_name: '',
        hours: '',
        date: ''
    })
    const [message, setMessage] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const user = await supabase.auth.getUser()
        const { data, error } = await supabase
        .from('TimeEntry')
        .insert([{ ...formData, created_by: user.data.user?.id }])
        if (error) {
            setMessage(`Feil: ${error.message}`)
        } else {
            setMessage('Timer registrert!')
            setFormData({ employee_name: '', task_name: '', hours: '', date: ''})
        }
    }

    return (
        <div className="max-w-xl mx-auto mt-10 p-4 border rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-4">Registrer arbeidstid</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                name="employee_name"
                placeholder="Ansattnavn"
                value={formData.employee_name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                />
                <input
                name="task_name"
                placeholder="Oppgavenavn"
                value={formData.task_name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                />
                <input
                name="hours"
                type="number"
                placeholder="Timer"
                value={formData.hours}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                />
                <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                />
                <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Lagre
                </button>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    )
}