'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import untuk menonaktifkan SSR di Grafik
const Grafik = dynamic(() => import('./components/homepage/grafik'), { ssr: false });

type Mood = '😔' | '🙂' | '😆' | '😍';

type MoodEntry = {
  mood: Mood;
  note: string;
  date: string; // yyyy-mm-dd
  savedAt: number;
};

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

const colorMapping: Record<Mood, { bg: string; text: string }> = {
  '😔': { bg: '#6B7280', text: 'white' },    // abu gelap (sedih)
  '🙂': { bg: '#3B82F6', text: 'white' },    // biru cerah (biasa aja)
  '😆': { bg: '#FBBF24', text: 'black' },    // kuning (senang)
  '😍': { bg: '#EF4444', text: 'white' },    // merah (senang sekali)
};

export default function Home() {
  const convertHistoryToMoodData = (history: MoodEntry[]): { bulan: string; mood: number }[] => {
    const hariMap = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  
    const moodMapping: Record<Mood, number> = {
      '😔': 1,
      '🙂': 3,
      '😆': 4,
      '😍': 5,
    };
    
    const result: { [key: string]: number } = {};
    
    history.forEach((entry) => {
      const date = new Date(entry.date);
      const day = hariMap[date.getDay()];
      result[day] = moodMapping[entry.mood];
    });
    
    return hariMap.slice(1).concat(hariMap[0]).map((hari) => ({
      bulan: hari,
      mood: result[hari] || 0,
    }));
  };
  
  const [isOpen, setIsOpen] = useState(false);
  
  const [note, setNote] = useState('');
  const [history, setHistory] = useState<MoodEntry[]>([]);

  
 

  

 
  const moodText: Record<Mood, string> = {
    '😔': 'Hari ini aku lagi sedih',
    '🙂': 'Hari ini aku biasa aja',
    '😆': 'Hari ini aku cukup senang',
    '😍': 'Hari ini aku senang sekali',
  };
 
  
  // Load dari localStorage dan bersihkan data > 7 hari
  useEffect(() => {
    const raw = localStorage.getItem('moodHistory');
    if (raw) {
      const parsed: MoodEntry[] = JSON.parse(raw);
      const validData = parsed.filter((entry) => Date.now() - entry.savedAt <= WEEK_IN_MS);
      if (validData.length !== parsed.length) {
        localStorage.setItem('moodHistory', JSON.stringify(validData));
      }
      setHistory(validData);
      setMoodData(convertHistoryToMoodData(validData)); // <- ini bagian pentingnya
    }
  }, []);
  

  // Simpan history ke localStorage tiap ada perubahan
  useEffect(() => {
    localStorage.setItem('moodHistory', JSON.stringify(history));
  }, [history]);

  // Simpan entry baru / update hari ini
  const saveEntry = () => {
    if (!selected) {
      alert('Pilih mood dulu ya!');
      return;
    }
    const today = new Date().toLocaleDateString('sv-SE'); // hasil: '2025-05-22'

    const existIndex = history.findIndex((h) => h.date === today);
    const newEntry: MoodEntry = {
      mood: selected,
      note,
      date: today,
      savedAt: Date.now(),
    };
    let newHistory;
    if (existIndex >= 0) {
      newHistory = [...history];
      newHistory[existIndex] = newEntry;
    } else {
      newHistory = [...history, newEntry];
    }
    setHistory(newHistory);
    setMoodData(convertHistoryToMoodData(newHistory)); // <- tambahan ini
    setNote('');
    alert('Data mood hari ini tersimpan!');
    
  };

  const [selected, setSelected] = useState<Mood | null>(null);
  const [moodData, setMoodData] = useState([
    { bulan: 'Sen', mood: 0 },
    { bulan: 'Sel', mood: 0 },
    { bulan: 'Rab', mood: 0 },
    { bulan: 'Kam', mood: 0 },
    { bulan: 'Jum', mood: 0 },
    { bulan: 'Sab', mood: 0 },
    { bulan: 'Min', mood: 0 },
  ]);

  const options: Mood[] = ['😔', '🙂', '😆', '😍'];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option: Mood) => {
    setSelected(option);
    setIsOpen(false);

    // Update moodData berdasarkan pilihan mood
    // Misal mapping mood ke angka 1-5
    const moodMapping: Record<Mood, number> = {
      '😔': 1,
      '🙂': 3,
      '😆': 4,
      '😍': 5,
    };

    setMoodData((prev) => {
      // Update mood Senin (index 0) dengan mood yang dipilih
      const newMoodData = [...prev];
      newMoodData[0] = { ...newMoodData[0], mood: moodMapping[option] };
      return newMoodData;
    });
  };

  const btnColor = selected ? colorMapping[selected] : colorMapping['😍'];

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center py-5 px-6 shadow-md bg-white sticky top-0 z-20">
        <h1 className="text-2xl font-extrabold text-[#123C62] tracking-wide">MINDARI</h1>
        <div className="hidden sm:flex gap-6 text-sm font-semibold text-gray-700">
          {['Beranda', 'Chatbot', 'Edukasi', 'Kontak'].map((item, idx) => (
            <button
              key={idx}
              className="hover:text-blue-600 transition-colors duration-200"
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#E0F5FF] flex flex-col-reverse sm:grid sm:grid-cols-2 gap-8 px-6 py-10 items-center">
        <div className="max-w-md text-center sm:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-[#123C62] mb-4 tracking-tight">
            Jaga Kesehatan Mentalmu, Mulai dari Sekarang
          </h2>
          <p className="text-base text-[#123C62] font-medium mb-6 leading-relaxed">
            Curhat sama AI, catat mood, dan temukan tips buat hari yang lebih baik
          </p>
          <button
            className="bg-[#FEF9A7] text-[#123C62] font-semibold px-8 py-3 rounded-full shadow-md hover:brightness-95 transition duration-300"
            type="button"
            aria-label="Coba Sekarang"
          >
            Coba Sekarang
          </button>
        </div>
        <img
          src="/assets/images/pp.png"
          alt="Ilustrasi perempuan"
          className="w-[180px] sm:w-[280px] object-contain"
          loading="lazy"
        />
      </section>

      {/* Fitur Ringkas */}
      <section className="flex justify-center flex-wrap gap-5 px-6 py-10 bg-white">
        {[
          { icon: '🗄️', title: 'ChatBot AI', desc: 'Curhat bersama AI' },
          { icon: '🙂', title: 'Mood Tracker', desc: 'Catat perasaanmu' },
          { icon: '📔', title: 'Edukasi', desc: 'Tips & info bermanfaat' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="w-28 bg-[#E0F5FF] rounded-3xl p-5 flex flex-col items-center shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
            <span className="text-3xl mb-3">{item.icon}</span>
            <h3 className="font-semibold text-sm mb-1 text-[#123C62]">{item.title}</h3>
            <p className="text-xs text-gray-600 text-center">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Chatbot AI & Mood Tracker */}
      <section className="px-6 mb-16">
        <h3 className="text-3xl font-bold mb-6 text-[#123C62]">Chatbot AI & Edukasi</h3>

        <div className="space-y-5 w-full border border-gray-300 rounded-3xl p-6 shadow-sm bg-white">
          {['ChatAI', 'Edukasi'].map((item, idx) => (
            <button
              key={idx}
              type="button"
              className="flex justify-between items-center bg-[#F0F8FF] rounded-xl px-5 py-3 shadow hover:bg-[#D0E8FF] transition-colors duration-200 w-full"
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#CDE7FF] rounded-xl w-12 h-12 flex items-center justify-center" />
                <span className="text-lg font-medium text-[#123C62]">{item}</span>
              </div>
              <span className="text-2xl text-[#123C62]">&rarr;</span>
            </button>
          ))}
        </div>

        {/* Mood Tracker */}
        <div className="mt-12">
          <h4 className="text-xl font-semibold mb-5 text-[#123C62]">
            Bagaimana perasaanmu hari ini?
          </h4>

          <div className="flex gap-3 items-center bg-gray-100 rounded-3xl p-3 shadow-inner">
            {/* Dropdown */}
            <div className="relative w-24">
              <button
                onClick={toggleDropdown}
                className="flex justify-between items-center w-full bg-white rounded-2xl shadow-md px-5 py-3 text-3xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label="Pilih mood"
                type="button"
              >
                {selected || '😍'}
                <svg
                  className={`w-5 h-5 ml-2 text-gray-600 transition-transform ${
                    isOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {isOpen && (
                <ul
                  className="absolute z-30 mt-1 w-full bg-white border border-gray-300 rounded-2xl shadow-lg max-h-52 overflow-auto"
                  role="listbox"
                  id="dropdown-list"
                  tabIndex={-1}
                >
                  {options.map((option, idx) => {
                    const optionId = `option-${idx}`;
                    return (
                      <li
                        key={idx}
                        id={optionId}
                        onClick={() => handleSelect(option)}
                        className="cursor-pointer select-none px-5 py-3 hover:bg-blue-100 transition"
                        role="option"
                        tabIndex={0}
                        aria-selected={selected === option}
                      >
                        {option}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <input
              type="text"
              disabled
              name=""
              placeholder={selected ? moodText[selected] : 'Pilih mood untuk melihat deskripsi'}
              className="flex-grow w-full bg-white rounded-2xl px-5 py-3 text-sm shadow-md border border-gray-300"
            />
          </div>

          <textarea
            placeholder="Ceritakan perasaanmu hari ini..."
            className="mt-6 w-full rounded-3xl px-5 py-4 text-sm border border-gray-300 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button
            onClick={saveEntry}
            style={{
              backgroundColor: btnColor.bg,
              color: btnColor.text,
            }} className="mt-4 w-full bg-[#1d5995] text-white rounded-3xl p-4 shadow-md font-semibold text-sm tracking-wide hover:bg-[#15417b] transition"
          >
            Simpan Mood Hari Ini
          </button>

          {history.length > 0 && (
            <>
              <h5 className="mt-10 mb-5 text-lg font-semibold text-[#123C62]">
                Riwayat Mood (7 hari terakhir)
              </h5>
              <ul className="space-y-3 max-h-64 overflow-y-auto">
                {[...history]
                  .sort((a, b) => (a.date < b.date ? 1 : -1))
                  .map(({ date, mood, note }) => (
                    <li
                      key={date}
                      className="flex items-center gap-3 border-b pb-2 last:border-none"
                    >
                      <div className="text-3xl">{mood}</div>
                      <div>
                        <div className="font-semibold">{date}</div>
                        <div className="text-gray-700">{note || '-'}</div>
                      </div>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>

        {/* Grafik Mood */}
        <div className="mt-12">
          <Grafik  moodData={moodData}  />
        </div>

        {/* Edukasi Section */}
        <h3 className="text-3xl font-bold mt-16 mb-8 text-[#123C62]">Edukasi</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {['Kecemasan', 'Pola Tidur', 'Stress', 'Kelola Emosi'].map((topic, idx) => (
            <div
              key={idx}
              className="bg-[#1d5995] rounded-3xl p-6 h-44 flex flex-col justify-end shadow-md hover:brightness-110 transition duration-300 cursor-pointer"
            >
              <h4 className="text-2xl font-extrabold text-white mb-2">{topic}</h4>
              <p className="text-sm text-white/90">
                Pelajari bagaimana mengelola {topic.toLowerCase()} dengan lebih baik.
              </p>
            </div>
          ))}
        </div>
        
      </section>
           {/* Footer */}
           <footer className="flex justify-center items-center py-10 bg-white shadow-inner mt-auto">
        <span className="text-xs font-semibold text-gray-400 select-none">
          &copy; 2025 Mindari. All rights reserved.
        </span>
      </footer>
      
    </div>
  );
}
