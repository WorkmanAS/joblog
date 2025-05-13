'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

type Employee = {
  id: string;
  name: string;
};

export default function EmployeesPage() {
  const [uniqueEmployees, setUniqueEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    async function fetchEmployees() {
      const { data, error } = await supabase
        .from('employees')
        .select('*')

      if (error) {
        console.error('Feil ved henting av ansatte:', error)
      } else {
        const seenNames = new Set()
        const unique: Employee[] = []

        for (const emp of data) {
          // Rens navnet: trim, gjør til små bokstaver, fjern ekstra mellomrom
          const cleanName = emp.name?.trim().toLowerCase().replace(/\s+/g, ' ')

          if (cleanName && !seenNames.has(cleanName)) {
            seenNames.add(cleanName)
            unique.push(emp)
          }
        }

        setUniqueEmployees(unique)
      }
    }

    fetchEmployees()
  }, [])

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Ansatte:</h1>
      <ul className="list-disc pl-4">
        {uniqueEmployees.length === 0 ? (
          <li>Ingen ansatte funnet</li>
        ) : (
          uniqueEmployees.map((employee, index) => (
            <li key={index}>
              <Link href={`/ansatte/${encodeURIComponent(employee.name)}`} className="text-blue-600 hover:underline">
            {employee.name || 'Uten navn'}
          </Link>
            </li>
          ))
        )}
      </ul>
    </main>
  )
}
