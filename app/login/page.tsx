"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BiArrowBack } from "react-icons/bi";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    console.log("HANDLE_LOGIN_CLICK");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const json = await res.json();
      console.log("LOGIN_FRONT_RESULT", json);

      if (!json.success) {
        setError(json.message || "Gagal login");
        setLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "admin_users",
          JSON.stringify({
            id: json.user.id,
            username: json.user.username,
          })
        );
        console.log("SET_LOCALSTORAGE_ADMIN_USERS", json.user);
      }

      console.log("AKAN_ROUTER_PUSH_ADMIN");
      router.push("/admin");
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
          <h2 className="mt-3 text-3xl font-bold text-slate-800">
            Login Admin
          </h2>
          <p className="text-slate-500">Khusus akun admin</p>
        </div>

        {/* TANPA <form>, supaya tidak ke-submit default */}
        <div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700"
            >
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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
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
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full justify-center rounded-md border border-transparent bg-blue-600 py-3 px-4 text-lg font-medium text-white shadow-sm transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Log In"}
          </button>
        </div>

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
