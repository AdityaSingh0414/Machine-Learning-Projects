"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  LineChart, 
  Stethoscope, 
  UserRound, 
  FileText, 
  Settings,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analytics', label: 'Health Analytics', icon: LineChart },
  { id: 'predictor', label: 'Clinical Predictor', icon: Stethoscope },
  { id: 'insights', label: 'Patient Insights', icon: UserRound },
  { id: 'reports', label: 'Reports', icon: FileText },
];

export default function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (id: string) => void }) {
  return (
    <aside className="w-72 h-screen flex flex-col glass border-r border-white/10 p-6 sticky top-0">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/30">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">
          HeartWise <span className="text-indigo-500">PRO</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}
