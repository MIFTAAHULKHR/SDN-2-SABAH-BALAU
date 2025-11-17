"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Hook untuk navigasi
import Image from 'next/image'; // Komponen Next.js untuk gambar
import { BiArrowBack } from 'react-icons/bi';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Inisialisasi router

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Hentikan form agar tidak me-reload halaman
    setError(''); // Bersihkan error sebelumnya
    setLoading(true);

    try {
      // Kirim data ke backend API (/api/login)
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: username.trim(),
          password: password.trim()
        }),
      });

      const data = await response.json();
      console.log("LOGIN_FRONT_RESULT", data);

      if (!data.success) {
        setError(data.message || "Gagal login");
        setLoading(false);
        return;
      }

      // simpan ke localStorage jika login sukses
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "admin_users",
          JSON.stringify({
            id: data.user.id,
            username: data.user.username,
          })
        );
        console.log("SET_LOCALSTORAGE_ADMIN_USERS");
      }

      // Redirect ke halaman admin
      router.push("/admin");
      console.log("Redirecting to /admin");
    } catch (err) {
      console.error("LOGIN_FRONT_ERROR", err);
      setError("Tidak dapat terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <Image
            src="/Dokumentasi/logo.png" 
            alt="Logo SDN 2 Sabah Balau"
            width={80}
            height={80}
            className="mx-auto"
          />
          <h2 className="mt-3 text-3xl font-bold text-slate-800">Login Admin</h2>
          <p className="text-slate-500">Gunakan akun admin untuk masuk</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-800"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-800"
              required
            />
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full justify-center rounded-md border border-transparent bg-blue-600 py-3 px-4 text-lg font-medium text-white shadow-sm transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
             {loading ? "Memproses..." : "Log In"}
          </button>
        </form>
    
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-sm text-slate-500 hover:text-blue-600 transition-colors no-underline"
          >
            <BiArrowBack className="inline -mt-1 mr-1" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
