
import React from 'react';
import { Book, PlayCircle, HeartPulse, ShieldCheck } from 'lucide-react';

const Education: React.FC = () => {
  const articles = [
    { title: "Understanding the 'Fourth Trimester'", category: "Mental Health", readTime: "5 min" },
    { title: "C-Section Incision Care 101", category: "Physical Recovery", readTime: "8 min" },
    { title: "Nutrients for Iron Recovery", category: "Nutrition", readTime: "4 min" },
    { title: "Managing Sleep Deprivation", category: "Lifestyle", readTime: "6 min" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Recovery Resource Library</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Evidence-based guides, medically-reviewed articles, and recovery programs accessible to all mothers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <QuickLink icon={<Book className="text-pink-500" />} label="Guides" />
        <QuickLink icon={<PlayCircle className="text-blue-500" />} label="Videos" />
        <QuickLink icon={<HeartPulse className="text-red-500" />} label="Health Tips" />
        <QuickLink icon={<ShieldCheck className="text-emerald-500" />} label="Med Safety" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((art, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl border border-pink-50 flex gap-6 hover:shadow-lg transition-all cursor-pointer">
            <div className="w-24 h-24 bg-pink-100 rounded-2xl shrink-0">
               <img src={`https://picsum.photos/seed/${idx}/100/100`} className="w-full h-full object-cover rounded-2xl opacity-80" alt="Article" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-pink-500 uppercase tracking-widest">{art.category}</span>
              <h3 className="text-xl font-bold text-gray-800">{art.title}</h3>
              <p className="text-sm text-gray-400">Read time: {art.readTime}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuickLink = ({ icon, label }: any) => (
  <div className="bg-white p-6 rounded-3xl text-center shadow-sm border border-gray-100 hover:border-pink-300 transition-all cursor-pointer">
    <div className="flex justify-center mb-3">{icon}</div>
    <span className="font-bold text-gray-700">{label}</span>
  </div>
);

export default Education;
