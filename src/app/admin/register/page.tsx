'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Supabase-klient
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RegisterPage() {
  const router = useRouter();

  type Employee = { id: string; name: string };
  type TaskType = { id: string; name: string; unit: string };

  // Hooks skal alltid være på toppen
  const [loading, setLoading] = useState(true);
  const [employeeName, setEmployeeName] = useState('');
  const [taskName, setTaskName] = useState('');
  const [unit, setUnit] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);

  // Må defineres før bruk
  const fetchEmployees = async () => {
    const { data, error } = await supabase.from('employees').select('*');
    if (!error && data) setEmployees(data);
  };

  const fetchTasksTypes = async () => {
    const { data, error } = await supabase.from('task_types').select('*');
    if (!error && data) setTaskTypes(data);
  };

  // Sjekk auth
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      const role = user?.user_metadata?.role;

      if (!user || role !== 'admin') {
        router.push('/login');
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Hent ansatte og arbeidstyper når siden er klar
  useEffect(() => {
    fetchEmployees();
    fetchTasksTypes();
  }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName) return;
    const { error } = await supabase.from('employees').insert([{ name: employeeName }]);
    if (error) alert('Feil ved registrering');
    else {
      setEmployeeName('');
      fetchEmployees();
    }
  };

  const handleAddTaskType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName || !unit) return;
    const { error } = await supabase.from('task_types').insert([{ name: taskName, unit }]);
    if (error) alert('Feil ved registrering');
    else {
      setTaskName('');
      setUnit('');
      fetchTasksTypes();
    }
  };

  if (loading) {
    return <p className="p-8 text-center">Laster inn...</p>;
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Registrering</h1>

      {/* Skjema for ny ansatt */}
      <form onSubmit={handleAddEmployee} className="mb-8">
        <h2 className="font-semibold mb-2">Ny ansatt</h2>
        <input
          type="text"
          placeholder="Navn"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Legg til ansatt
        </button>
      </form>

      {/* Liste over ansatte */}
      <div className="mb-8">
        <h2 className="font-semibold mb-2">Registrerte ansatte</h2>
        <ul className="list-disc pl-5">
          {employees.map((emp) => (
            <li key={emp.id}>{emp.name}</li>
          ))}
        </ul>
      </div>

      {/* Skjema for ny arbeidstype */}
      <form onSubmit={handleAddTaskType} className="mb-8">
        <h2 className="font-semibold mb-2">Ny arbeidstype</h2>
        <input
          type="text"
          placeholder="Arbeidstype"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Enhet (f.eks. m2, lm, stk)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Legg til arbeidstype
        </button>
      </form>

      {/* Liste over arbeidstyper */}
      <div>
        <h2 className="font-semibold mb-2">Arbeidstyper</h2>
        <ul className="list-disc pl-5">
          {taskTypes.map((task) => (
            <li key={task.id}>
              {task.name} ({task.unit})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
