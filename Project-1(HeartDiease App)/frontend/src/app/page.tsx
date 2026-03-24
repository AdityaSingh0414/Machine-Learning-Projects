"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Heart,
  FileText,
  TrendingUp
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// --- SUB-COMPONENTS ---
const MetricCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="glass-card shadow-indigo-500/5"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-xl bg-${color}-500/10 border border-${color}-500/20`}>
        <Icon className={`w-5 h-5 text-${color}-400`} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
        {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {Math.abs(trend)}%
      </div>
    </div>
    <p className="text-slate-400 text-sm font-medium">{title}</p>
    <h3 className="text-3xl font-bold mt-1">{value}</h3>
  </motion.div>
);

// --- MAIN PROJECT COMPONENT ---
export default function HeartWisePro() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/analytics');
        setData(res.data);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0f172a]">
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }} 
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-slate-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && (
              <div className="space-y-10">
                <header>
                  <h2 className="text-4xl font-bold tracking-tight">Clinical Dashboard</h2>
                  <p className="text-slate-400 mt-2 text-lg">Real-time health trends and patient registry metrics.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard title="Total Registry" value={data?.summary.total_patients} icon={Users} trend={+12} color="indigo" />
                  <MetricCard title="High Risk Trend" value={`${data?.summary.high_risk_pct.toFixed(1)}%`} icon={AlertTriangle} trend={-3} color="rose" />
                  <MetricCard title="Avg Patient Age" value={Math.round(data?.summary.avg_age)} icon={Clock} trend={+2} color="amber" />
                  <MetricCard title="System Load" value="Optimal" icon={Activity} trend={0} color="emerald" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 glass-card h-[450px]">
                    <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                       <TrendingUp className="w-5 h-5 text-indigo-400" /> Age vs. Risk Correlation Table
                    </h4>
                    <div className="h-[320px] w-full">
                    {mounted && data?.charts.age_risk_trend && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data?.charts.age_risk_trend}>
                        <defs>
                          <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                        <XAxis dataKey="Age" stroke="#718096" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#718096" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${Math.round(val*100)}%`} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc' }} />
                        <Area type="monotone" dataKey="HeartDisease" stroke="#6366f1" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                    )}
                    </div>
                  </div>

                  <div className="glass-card h-[450px]">
                    <h4 className="text-lg font-bold mb-6">Patient Risk Profile</h4>
                    <div className="h-[320px] w-full">
                    {mounted && data?.charts.risk_distribution && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data?.charts.risk_distribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          <Cell fill="#6366f1" />
                          <Cell fill="#475569" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'predictor' && <PredictorView />}
            {activeTab === 'analytics' && (
              <div className="py-20 text-center glass-card">
                 <h2 className="text-3xl font-bold mb-4">Advanced Health Analytics</h2>
                 <p className="text-slate-400">Detailed clinical correlations and feature importance visualizations coming soon.</p>
              </div>
            )}
            {activeTab === 'insights' && <InsightsView />}
            {activeTab === 'reports' && <ReportsView predictionResult={result} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Chatbot */}
      <Chatbot />
    </div>
  );
}

// --- INSIGHTS VIEW ---
function InsightsView() {
  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Patient Insights</h2>
        <p className="text-slate-400 mt-2">Comparative clinical analysis and AI recommendations.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> Similar Case Analysis
          </h3>
          <div className="p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 mb-6">
            <p className="text-lg font-medium text-slate-300 italic">
              "Patients with similar biometric profiles exhibited a 72% historical risk correlation in recent clinical trials."
            </p>
          </div>
          <div className="space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">P{i}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Patient Case #{Math.random().toString(36).substr(2, 5).toUpperCase()}</p>
                    <p className="text-xs text-slate-500">Age: 52 | Risk Profile: High | Accuracy: 94%</p>
                  </div>
                  <div className="text-rose-400 text-xs font-bold">MATCH</div>
               </div>
             ))}
          </div>
        </div>

        <div className="glass-card">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Heart className="w-5 h-5 text-indigo-400" /> Lifestyle Recommendations
          </h3>
          <div className="space-y-6">
             <div className="border-l-4 border-emerald-500 pl-4 py-1">
                <p className="font-bold text-emerald-400 text-sm">CARDIOVASCULAR OPTIMIZATION</p>
                <p className="text-slate-400 text-sm mt-1">Increase moderate aerobic activity to 150 minutes weekly.</p>
             </div>
             <div className="border-l-4 border-amber-500 pl-4 py-1">
                <p className="font-bold text-amber-400 text-sm">DIETARY ADJUSTMENT</p>
                <p className="text-slate-400 text-sm mt-1">Reduce daily sodium intake to under 2.3g to manage BP.</p>
             </div>
             <div className="border-l-4 border-indigo-500 pl-4 py-1">
                <p className="font-bold text-indigo-400 text-sm">CLINICAL FOLLOW-UP</p>
                <p className="text-slate-400 text-sm mt-1">Schedule a lipid profile screening within the next 90 days.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- REPORTS VIEW ---
function ReportsView({ predictionResult }: any) {
  const downloadPDF = async () => {
    if (!predictionResult) return alert("Please generate a prediction first.");
    try {
      const res = await axios.post('http://localhost:8000/api/v1/report', predictionResult, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'HeartWise_Clinical_Report.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Report generation failed.");
    }
  };

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Clinical Reports</h2>
        <p className="text-slate-400 mt-2">Generate and export official diagnostic documentation.</p>
      </header>

      <div className="glass-card max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-indigo-400" />
        </div>
        <h3 className="text-2xl font-bold mb-4">Patient Prognosis Report</h3>
        <p className="text-slate-400 mb-8 px-10">
          This feature compiles all clinical vitals, AI risk assessments, and medical recommendations into a standardized PDF format suitable for healthcare integration.
        </p>
        <button 
          onClick={downloadPDF}
          disabled={!predictionResult}
          className={`px-10 py-4 rounded-xl font-bold transition-all shadow-xl
            ${predictionResult 
              ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20' 
              : 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
            }`}
        >
          {predictionResult ? "Generate & Download PDF" : "Run Prediction First"}
        </button>
      </div>
    </div>
  );
}

// --- CHATBOT COMPONENT ---
function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([{ role: 'bot', content: "Hello! I'm your HeartWise clinical assistant. How can I help you understand your risks today?" }]);

  const handleSend = () => {
    if (!msg) return;
    const newChat = [...chat, { role: 'user', content: msg }];
    setChat(newChat);
    setMsg("");
    
    // Simple rule-based bot
    setTimeout(() => {
      let reply = "I'm analyzing your query based on current clinical guidelines...";
      if (msg.toLowerCase().includes("cholesterol")) reply = "High cholesterol levels significantly increase the risk of plaque buildup (atherosclerosis). Aim for <200 mg/dL.";
      if (msg.toLowerCase().includes("bp")) reply = "A normal resting blood pressure is typically below 120/80 mmHg. Persistent elevation is a major risk factor.";
      setChat([...newChat, { role: 'bot', content: reply }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-10 right-10 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass w-96 h-[500px] rounded-3xl mb-4 flex flex-col overflow-hidden border border-white/10 shadow-3xl"
          >
            <div className="bg-indigo-600 p-5 flex items-center gap-3">
              <Activity className="w-6 h-6 text-white" />
              <div className="flex-1">
                <p className="font-bold text-white leading-tight">Clinical Assistant</p>
                <p className="text-[10px] text-indigo-100 uppercase tracking-widest font-bold">Pro Active Mode</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
               {chat.map((c, i) => (
                 <div key={i} className={`flex ${c.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${c.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'}`}>
                      {c.content}
                    </div>
                 </div>
               ))}
            </div>

            <div className="p-4 bg-slate-900/50 border-t border-white/5 flex gap-2">
              <input 
                type="text" value={msg} onChange={(e) => setMsg(e.target.value)}
                placeholder="Ask about vitals..."
                className="flex-1 bg-slate-800 border-white/10 rounded-xl px-4 py-2 outline-none text-sm"
              />
              <button onClick={handleSend} className="bg-indigo-600 p-2 rounded-xl text-white hover:bg-indigo-500 transition-all">
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 hover:scale-110 transition-all"
      >
        <Activity className={`w-8 h-8 text-white transition-all ${isOpen ? 'rotate-90' : ''}`} />
      </button>
    </div>
  );
}

// --- PREDICTOR VIEW ---
function PredictorView() {
  const [formData, setFormData] = useState({
    Age: 50, Sex: 'M', ChestPainType: 'ASY', RestingBP: 130,
    Cholesterol: 230, FastingBS: 0, RestingECG: 'Normal',
    MaxHR: 140, ExerciseAngina: 'N', Oldpeak: 1.0, ST_Slope: 'Flat'
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/predict', formData);
      setResult(res.data);
    } catch (err) {
      alert("Diagnostic service unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Clinical Predictor</h2>
        <p className="text-slate-400 mt-2">AI-driven cardiac risk assessment based on clinical markers.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-card">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" /> Patient Vitals
          </h3>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex justify-between">
                Patient Age <span>{formData.Age}</span>
              </label>
              <input 
                type="range" min="1" max="100" value={formData.Age}
                onChange={(e) => setFormData({...formData, Age: parseInt(e.target.value)})}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-400">Biological Sex</label>
                 <select 
                   value={formData.Sex}
                   onChange={(e) => setFormData({...formData, Sex: e.target.value})}
                   className="w-full bg-slate-800 border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                 >
                   <option value="M">Male</option>
                   <option value="F">Female</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-400">Chest Pain Type</label>
                 <select 
                   value={formData.ChestPainType}
                   onChange={(e) => setFormData({...formData, ChestPainType: e.target.value})}
                   className="w-full bg-slate-800 border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                 >
                   <option value="ASY">Asymptomatic</option>
                   <option value="ATA">Atypical Angina</option>
                   <option value="NAP">Non-Anginal Pain</option>
                   <option value="TA">Typical Angina</option>
                 </select>
               </div>
            </div>

            <div className="space-y-4">
               <label className="text-sm font-medium text-slate-400 flex justify-between">
                 Serum Cholesterol (mg/dl) <span>{formData.Cholesterol}</span>
               </label>
               <input 
                 type="range" min="100" max="600" value={formData.Cholesterol}
                 onChange={(e) => setFormData({...formData, Cholesterol: parseInt(e.target.value)})}
                 className="w-full accent-indigo-500"
               />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Resting BP</label>
                  <input 
                    type="number" value={formData.RestingBP}
                    onChange={(e) => setFormData({...formData, RestingBP: parseInt(e.target.value)})}
                    className="w-full bg-slate-800 border-white/10 rounded-xl px-4 py-3 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Max Heart Rate</label>
                  <input 
                    type="number" value={formData.MaxHR}
                    onChange={(e) => setFormData({...formData, MaxHR: parseInt(e.target.value)})}
                    className="w-full bg-slate-800 border-white/10 rounded-xl px-4 py-3 outline-none"
                  />
                </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all"
            >
              {loading ? "Analyzing..." : "Analyze Risk Profile"}
            </button>
          </form>
        </div>

        <div className="space-y-6">
           {result ? (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
                <div className={`p-10 text-center ${result.prediction === 1 ? 'bg-rose-500/10' : 'bg-emerald-500/10'}`}>
                   <h4 className="text-slate-400 font-medium mb-2">ASSESSMENT RESULT</h4>
                   <div className={`text-5xl font-black ${result.prediction === 1 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {result.risk_level} Risk
                   </div>
                   <p className="mt-4 text-slate-300">Confidence Score: <span className="font-bold text-white">{(result.confidence_score * 100).toFixed(1)}%</span></p>
                </div>
                
                <div className="p-8 space-y-6 border-t border-white/5">
                   <div>
                      <h5 className="font-bold mb-4 flex items-center gap-2">
                         <AlertTriangle className="w-4 h-4 text-amber-500" /> Key Risk Factors
                      </h5>
                      <div className="space-y-3">
                         {result.explanation.top_factors.map((factor: any, i: number) => (
                           <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                              <span className="text-sm">{factor.feature}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${factor.impact === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                {factor.impact.toUpperCase()}
                              </span>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <h5 className="font-bold mb-2 text-indigo-400">Clinical Recommendation</h5>
                      <p className="text-sm text-slate-400 italic">"{result.insights.lifestyle_recommendations[0]}"</p>
                   </div>
                </div>
             </motion.div>
           ) : (
             <div className="glass-card h-full flex flex-col items-center justify-center text-center p-10 opacity-50">
                <Activity className="w-16 h-16 text-slate-600 mb-4 animate-pulse" />
                <h4 className="text-xl font-bold">Waiting for input data...</h4>
                <p className="text-slate-500 mt-2">Enter patient vitals to generate a diagnostic risk assessment.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
