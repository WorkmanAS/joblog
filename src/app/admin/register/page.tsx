'use client'; // Forteller Next.js at dette er en klient-komponent (brukes med hooks)

import { useEffect, useState } from 'react'; // Importerer React-hooks for tilstand og sideeffekter
import { createClient } from '@supabase/supabase-js'; // Importer funksjonen for å koble til Supabas

// Lager en Supabase-klient med miljøvariablene dine (URL og anonym nøkkel)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // Supabase-prosjektets URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Supabase-prosjektets anonyme nøkkel
    );

    // Hovedfunksjon som returnerer siden (React-komponent)
    export default function RegisterPage() {
        // Tilstand for navn på ansatt som skal legges inn
        const [employeeName, setEmployeeName] = useState('');

        // Liste over ansatte som hentes fra databasen
        const [employees, setEmployees] = useState<any[]>([]);

        // Tilstand for ny arbeidstype som skal legges inn
        const [taskName, setTaskName] = useState('');

// Tilstand for enhet (m2, lm, stk)
const [unit, setUnit] = useState('');

// Liste over arbeidstyper fra databasen
const [taskTypes, setTaskTypes] = useState<any[]>([]);

// Funksjon som henter alle ansatte fra databasen
const fetchEmployees = async () => {
    const { data, error } = await supabase.from('employees').select('*'); // SELECT * FROM employees
    if (!error && data) {
        setEmployees(data); // Lagrer data i employees-tilstanded
    }
};

// Funksjon som henter alle arbeidstyper fra databasen
const fetchTasksTypes = async () => {
    const { data, error } = await supabase.from('task_types').select('*'); // SELECT * FROM task_types
    if (!error && data) {
        setTaskTypes(data); // Lagrer data i taskTypes-tilstanden
    }
};

// useEffect kjører en gang når siden lastes - henter ansatte og arbeidstyper
useEffect(() => {
    fetchEmployees(); // Henter ansatte
    fetchTasksTypes();
}, []); // Tom avhengighetsliste = kun ved første lasting

// Funksjon som kjøres når bruker sender inn skjema for å legge til ansatt
const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault(); // Hindrer at siden lastes på nytt
    if (!employeeName) return; // Gjør ingenting his feltet er tomt
    const { error } = await supabase.from('employees').insert([{ name: employeeName }]); // Legger til i databasen
    if (error) alert('Feil ved registrering'); // Viser feilmelding
    else {
        setEmployeeName(''); // Tømmer inputfelt
        fetchEmployees(); // Henter oppdatert liste
    }
};

// Funksjon for å legge til en ny arbeidstype
const handleAddTaskType = async (e: React.FormEvent) => {
    e.preventDefault(); // Stopper sideoppdatering
    if (!taskName || !unit) return; // Gjør ingenting hvis felt mangler
    const { error } = await supabase.from('task_types').insert([{ name: taskName, unit}]); // Legger til i databasen
    if (error) alert('Feil ved registrering'); // Feilmelding hvis noe går galt
    else {
        setTaskName(''); // Tømmer inputfelt
        setUnit(''); // Tømmer inputfelt
        fetchTasksTypes(); // Henter oppdatert liste
    }
};

// Dette er HTML-delen (JSX) som vises i nettleseren
return (
    <div className="p-8 max-w-xl mx-auto">
        {/* Hovedcontainer med padding og breddebegrensning */}
    
    <h1 className="text-2xl font-bold mb-6">Registrering</h1> {/* Tittel */}

    {/* Skjema for å registrere ny ansatt */}
    <form onSubmit={handleAddEmployee} className="mb-8">
        <h2 className="font-semibold mb-2">Ny ansatt</h2>
        <input
        type="text" // Teksfelt
        placeholder="Navn" // Hinttekst
        value={employeeName} // Verdien som vises i input-feltet
        onChange={(e) => setEmployeeName(e.target.value)} // Oppdaterer tilstand når skriver
        className="border p-2 w-full mb-2" // Tailwind styling
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Legg til ansatt
        </button>
        </form>

        {/* Viser liste over registrerte ansatte */}
        <div className="mb-8">
            <h2 className="font-semibold mb-2">Registrerte ansatte</h2>
            <ul className="list-disc pl-5">
                {employees.map((emp) => (
                    <li key={emp.id}>{emp.name}</li> // Viser navnet på hver ansett
                ))}
            </ul>
        </div>
        
        {/* Viser liste over registrerte arbeidstyper */}
        <div>
            <h2 className="font-semibold mb-2">Arbeidstyper</h2>
            <ul className="list-disc pl-5">
                {taskTypes.map((task) => (
                    <li key={task.id}>
                        {task.name} ({task.unit}) // Viser arbeidstype og enhet
                    </li>
                ))}
            </ul>
        </div>
        </div>
);
}