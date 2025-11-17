"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Heroicons
import {
  HiViewGrid,
  HiExternalLink,
  HiLogout,
  HiUserCircle,
  HiAcademicCap,
  HiCalculator,
  HiGlobe,
  HiSave,
  HiArrowLeft,
} from "react-icons/hi";

// 🔗 Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ====== SIDEBAR ======
const Sidebar = () => (
  <aside className="flex h-screen w-64 flex-col overflow-y-auto bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-8 text-white">
    <Link href="/" className="flex items-center space-x-2">
      {/* Pastikan file ini ada di public/Dokumentasi/logo.png */}
      <Image
        src="/Dokumentasi/logo.png"
        alt="Logo Sekolah"
        width={40}
        height={40}
      />
      <span className="text-xl font-bold">Admin Panel</span>
    </Link>
    <div className="mt-8 flex flex-1 flex-col justify-between">
      <ul className="flex flex-col space-y-2">
        <li>
          <Link
            href="/admin"
            className="flex items-center rounded-lg bg-white px-4 py-3 text-blue-600 font-semibold shadow"
          >
            <HiViewGrid className="mr-3" size={20} /> Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/akademik"
            className="flex items-center rounded-lg px-4 py-3 text-white/80 transition-all hover:bg-white/10 hover:text-white"
          >
            <HiExternalLink className="mr-3" size={20} /> Lihat Situs
          </Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link
            href="/"
            className="flex items-center rounded-lg px-4 py-3 text-red-300 transition-all hover:bg-red-500 hover:text-white"
          >
            <HiLogout className="mr-3" size={20} /> Logout
          </Link>
        </li>
      </ul>
    </div>
  </aside>
);

// ====== HALAMAN ADMIN UTAMA ======
export default function AdminPage() {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [view, setView] = useState<"pilih-kelas" | "pilih-pelajaran" | "pilih-bab" | "form-materi">("pilih-kelas");
  
  // Data Selection State
  const [kelas, setKelas] = useState("");
  const [pelajaran, setPelajaran] = useState("");
  const [babList, setBabList] = useState<any[]>([]);
  const [selectedBab, setSelectedBab] = useState<any>(null);
  
  // Form State
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [error, setError] = useState("");

  // --- 1. CHECK AUTH (useEffect) ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("admin_users");
      if (!userData) {
        router.push("/login"); // Redirect jika tidak ada sesi
      } else {
        setIsCheckingAuth(false); // Selesai loading auth
      }
    }
  }, [router]);

  // --- 2. FETCH VIDEOS (Function & useEffect) ---
  const fetchVideos = async () => {
    // Reset list jika data belum lengkap
    if (!kelas || !pelajaran) return;

    // Ambil data dari Supabase
    const { data, error } = await supabase
      .from("videos")
      .select("id, kelas, pelajaran, bab, youtube_url, title")
      .eq("kelas", kelas)
      .eq("pelajaran", pelajaran)
      .order("id", { ascending: true });

    if (error) {
      setError("Gagal mengambil data video.");
      console.error("Error fetching videos", error);
    } else {
      setBabList(data || []);
      console.log("Data fetched:", data);
    }
  };

  // Panggil fetchVideos setiap kali kelas atau pelajaran berubah
  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kelas, pelajaran]);

  // --- 3. HANDLE UPDATE VIDEO ---
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error

    // Validasi
    if (!selectedBab) {
      setError("Pilih bab terlebih dahulu.");
      return;
    }
    if (!youtubeUrl.trim()) {
      setError("Isi link YouTube.");
      return;
    }

    // Proses Update ke Supabase
    const { error: updateError } = await supabase
      .from("videos")
      .update({ youtube_url: youtubeUrl.trim() })
      .eq("id", selectedBab.id);

    if (updateError) {
      setError("Gagal update! " + (updateError.message || "Terjadi kesalahan"));
      return;
    }

    // Berhasil
    alert("Video berhasil diperbarui!");
    setView("pilih-bab"); // Kembali ke daftar bab
    fetchVideos(); // Refresh data agar tampilan sesuai database terbaru
  };

  // Tampilan Loading saat cek Auth
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 text-slate-600">
        Memeriksa sesi login...
      </div>
    );
  }

  // --- RENDER UTAMA ---
  return (
    <div className="flex bg-gray-50 text-slate-800 h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-4xl font-bold text-slate-800">Dashboard Admin</h1>
        <p className="text-slate-500 mt-1">
          Selamat datang, admin. Kelola konten pembelajaran dari sini.
        </p>
        <hr className="my-6" />

        <div className="rounded-xl bg-white p-6 shadow-xl min-h-[400px]">
          {/* Tampilkan Error Global jika ada */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
              {error}
            </div>
          )}

          {/* === STEP 1: Pilih Kelas === */}
          {view === "pilih-kelas" && (
            <>
              <h2 className="text-2xl font-semibold mb-4">Langkah 1: Pilih Kelas</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div
                  className="cursor-pointer text-center p-6 border rounded-lg shadow hover:bg-blue-50 transition-colors"
                  onClick={() => {
                    setKelas("5");
                    setView("pilih-pelajaran");
                  }}
                >
                  <HiUserCircle size={48} className="text-blue-600 mb-2 mx-auto" />
                  <h3 className="text-2xl font-semibold">Kelas 5</h3>
                </div>
                <div
                  className="cursor-pointer text-center p-6 border rounded-lg shadow hover:bg-blue-50 transition-colors"
                  onClick={() => {
                    setKelas("6");
                    setView("pilih-pelajaran");
                  }}
                >
                  <HiAcademicCap size={48} className="text-blue-600 mb-2 mx-auto" />
                  <h3 className="text-2xl font-semibold">Kelas 6</h3>
                </div>
              </div>
            </>
          )}

          {/* === STEP 2: Pilih Pelajaran === */}
          {view === "pilih-pelajaran" && (
            <>
              <h2 className="text-2xl font-semibold mb-4">
                Langkah 2: Pilih Mata Pelajaran (Kelas {kelas})
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div
                  className="flex items-center p-4 border rounded-lg shadow cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => {
                    setPelajaran("Matematika");
                    setView("pilih-bab");
                  }}
                >
                  <HiCalculator size={24} className="text-blue-600 mr-3" />
                  <span>Matematika</span>
                </div>
                <div
                  className="flex items-center p-4 border rounded-lg shadow cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => {
                    setPelajaran("Bahasa Inggris");
                    setView("pilih-bab");
                  }}
                >
                  <HiGlobe size={24} className="text-blue-600 mr-3" />
                  <span>Bahasa Inggris</span>
                </div>
              </div>
              <button
                onClick={() => setView("pilih-kelas")}
                className="mt-6 flex items-center text-slate-600 border px-4 py-2 rounded hover:bg-slate-50 transition-colors"
              >
                <HiArrowLeft className="mr-2" /> Kembali
              </button>
            </>
          )}

          {/* === STEP 3: Pilih Bab === */}
          {view === "pilih-bab" && (
            <>
              <h2 className="text-2xl font-semibold mb-4">
                Langkah 3: Pilih Bab ({pelajaran}, Kelas {kelas})
              </h2>
              
              {babList.length === 0 ? (
                <div className="text-center py-10 text-slate-500 bg-slate-50 rounded border border-dashed">
                  <p>Belum ada data video atau sedang memuat...</p>
                </div>
              ) : (
                <div className="flex flex-col border rounded-lg overflow-hidden shadow">
                  {babList.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between p-4 border-b last:border-b-0 cursor-pointer hover:bg-blue-50 transition-colors"
                      onClick={() => {
                        setSelectedBab(b);
                        setYoutubeUrl(b.youtube_url || "");
                        setView("form-materi");
                      }}
                    >
                      <div>
                        <strong className="block text-lg">{b.bab}</strong>
                        <p className="text-slate-500 text-sm">{b.title}</p>
                      </div>
                      <span className={`text-sm font-medium ${b.youtube_url ? 'text-green-600' : 'text-red-500'}`}>
                        {b.youtube_url ? "🎬 Video Tersedia" : "❌ Belum ada Video"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              <button
                onClick={() => setView("pilih-pelajaran")}
                className="mt-6 flex items-center text-slate-600 border px-4 py-2 rounded hover:bg-slate-50 transition-colors"
              >
                <HiArrowLeft className="mr-2" /> Kembali
              </button>
            </>
          )}

          {/* === STEP 4: Form Update === */}
          {view === "form-materi" && selectedBab && (
            <>
              <h2 className="text-2xl font-semibold mb-4">
                Langkah 4: Ubah Link Video
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                 <p className="font-bold text-blue-800">{selectedBab.bab}</p>
                 <p className="text-blue-600">{selectedBab.title}</p>
              </div>

              <form onSubmit={handleUpdate} className="max-w-2xl">
                <div className="mb-4">
                  <label className="block mb-2 font-medium text-slate-700">
                    Link YouTube (Format Embed)
                  </label>
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="https://www.youtube.com/embed/xxxxx"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Contoh format: <code>https://www.youtube.com/embed/dQw4w9WgXcQ</code>
                  </p>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg flex items-center font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                  >
                    <HiSave className="mr-2" size={18} /> Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("pilih-bab")}
                    className="border border-slate-300 px-6 py-2.5 rounded-lg flex items-center text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    <HiArrowLeft className="mr-2" size={18} /> Batal
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}