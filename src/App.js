// Contoh isi App.js
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Import semua halaman Anda
import Beranda from './pages/home/Beranda';
import Fasilitas from './pages/fasilitas/Fasilitas';
import AkademikLanding from './pages/akademik/AkademikLanding';
import DetailKelas from './pages/akademik/DetailKelas';
import DetailMapel from './pages/akademik/DetailMapel';
import DetailBab from './pages/akademik/DetailBab';
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
// ... dll

function App() {
  return (
    <Routes>
      {/* Rute untuk Pengguna Umum (dengan Navbar & Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/fasilitas" element={<Fasilitas />} />
        <Route path="/akademik" element={<AkademikLanding />} />
        <Route path="/akademik/:idKelas" element={<DetailKelas />} />
        <Route path="/akademik/:idKelas/:idMapel" element={<DetailMapel />} />
        <Route path="/akademik/:idKelas/:idMapel/:idBab" element={<DetailBab />} />
      </Route>

      {/* Rute untuk Admin */}
      <Route path="/admin/login" element={<Login />} />
      <Route element={<AdminLayout />}>
        {/* Tambahkan "ProtectedRoute" di sini nanti */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

    </Routes>
  );
}