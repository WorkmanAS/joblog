'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    
    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
    })
        if (error) {
            setError(error.message)
        } else {
            router.push('/dashboard')
        } 
    }

    return (
        <div className="p-8 max-w-md mx-auto text-white">
            <h1 className="text-xl mb-4">Logg inn</h1>

            <input
            className="bg-white text-black border p-2 w-full mb-4"
            type="email"
            placeholder="Din e-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <input
            className="bg-white text-black border p-2 w-full mb-4"
            type="password"
            placeholder="Passord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">
                Logg inn
            </button>

            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        </div>
    )
}