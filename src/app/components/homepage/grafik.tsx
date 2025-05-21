'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type MoodData = { bulan: string; mood: number };

interface GrafikProps {
  moodData: MoodData[];
}

function Grafik({ moodData }: GrafikProps) {
  return (
    <div className="py-10 px-4">
      <p className="text-2xl md:text-3xl font-bold mb-5 text-center">
        Tren Mood Kamu Minggu Ini
      </p>
      <div className="w-full flex justify-center items-center h-64 ">
        <ResponsiveContainer width="100%" height="100%" className="flex justify-center items-center">
          <LineChart data={moodData} className='right-6 flex justify-center items-center'>
            <CartesianGrid strokeDasharray="3 3" className='w-full'/>
            <XAxis dataKey="bulan" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Line type="monotone" dataKey="mood" stroke="#123C62" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-[#E0F5FF] rounded-2xl p-3 mt-5 text-center">
        <p>Moodmu lagi bagus nih minggu ini</p>
      </div>
    </div>
  );
}

export default Grafik;
