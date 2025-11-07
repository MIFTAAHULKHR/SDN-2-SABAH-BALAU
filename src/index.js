import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import './index.css'; // Memasukkan file Tailwind/CSS global

// 1. Menemukan elemen 'root' dari public/index.html
const container = document.getElementById('root');

// 2. Membuat "root" untuk aplikasi React
const root = createRoot(container);

// 3. Merender (menyuntikkan) aplikasi Anda ke dalam root
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);