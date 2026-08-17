'use client';

import { useState } from 'react';
import { registerUser } from '../actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);

    try {
      await registerUser(formData);
      router.push('/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue.");
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/fondregister.jpg')" }}>
      <form onSubmit={handleSubmit} className="p-8 bg-gray-800 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Inscription à Suffler</h1>
        
        {error && <div className="mb-4 p-2 bg-red-600 text-sm rounded text-center">{error}</div>}

        <label className="block text-sm mb-2">Créez un pseudo :</label>
        <input
          type="text"
          name="username"
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 mb-4 focus:outline-none focus:border-blue-500"
          required
        />

        <label className="block text-sm mb-2">Créez un mot de passe :</label>
        <input
          type="password"
          name="password"
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 mb-6 focus:outline-none focus:border-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full py-2 bg-green-600 hover:bg-green-700 rounded font-semibold transition mb-4"
        >
          Valider
        </button>

        <p className="text-sm text-center text-gray-400">
          Déjà un compte ? <Link href="/login" className="text-blue-400 hover:underline">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}