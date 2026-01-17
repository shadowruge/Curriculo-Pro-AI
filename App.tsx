
import React, { useState, useEffect } from 'react';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import { ResumeData, initialData } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<ResumeData>(initialData);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Persistence in LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('curriculo_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar dados salvos", e);
      }
    }
  }, []);

  const handleDataChange = (newData: ResumeData) => {
    setData(newData);
    localStorage.setItem('curriculo_data', JSON.stringify(newData));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Currículo: ${data.personalInfo.fullName}`);
    const body = encodeURIComponent(
      `Olá,\n\nEstou enviando meu currículo para sua apreciação.\n\nAtenciosamente,\n${data.personalInfo.fullName}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <nav className="no-print bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <i className="fas fa-file-alt text-xl"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Curriculo Pro AI</h1>
            <p className="text-xs text-slate-500 font-medium">Otimizado por Gemini</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
          >
            <i className="fas fa-download"></i>
            <span className="hidden sm:inline">Baixar PDF</span>
          </button>
          <button 
            onClick={handleEmail}
            className="flex items-center gap-2 bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            <i className="fas fa-paper-plane"></i>
            <span className="hidden sm:inline">Enviar por E-mail</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Mobile Tab Switcher */}
        <div className="lg:hidden flex border-b bg-white no-print">
          <button 
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-3 font-medium text-sm transition-colors ${activeTab === 'form' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}
          >
            Editar Dados
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-3 font-medium text-sm transition-colors ${activeTab === 'preview' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500'}`}
          >
            Visualizar
          </button>
        </div>

        {/* Left Side: Form */}
        <div className={`flex-1 overflow-y-auto p-4 lg:p-8 no-print ${activeTab === 'form' ? 'block' : 'hidden lg:block'} border-r`}>
          <div className="max-w-3xl mx-auto">
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Crie seu Futuro</h2>
              <p className="text-slate-500">Preencha suas informações. Use a IA para destacar suas melhores qualidades.</p>
            </header>
            <ResumeForm data={data} onChange={handleDataChange} />
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className={`flex-1 overflow-y-auto bg-slate-200 p-0 sm:p-4 lg:p-12 ${activeTab === 'preview' ? 'block' : 'hidden lg:block'} print:bg-white print:p-0`}>
          <div className="transform origin-top scale-[0.6] sm:scale-[0.8] md:scale-90 lg:scale-100 transition-transform flex justify-center">
            <ResumePreview data={data} />
          </div>
        </div>
      </main>

      {/* Floating Info */}
      <footer className="no-print bg-slate-800 text-slate-400 py-3 text-center text-xs">
        <p>&copy; 2024 Curriculo Pro AI - Construído para o GitHub Pages</p>
      </footer>
    </div>
  );
};

export default App;
