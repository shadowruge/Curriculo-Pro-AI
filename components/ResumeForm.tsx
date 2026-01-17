
import React from 'react';
import { ResumeData, Experience, Education, Skill } from '../types';
import { optimizeSummary, improveExperience } from '../services/geminiService';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const ResumeForm: React.FC<Props> = ({ data, onChange }) => {
  const [loadingAI, setLoadingAI] = React.useState<{ [key: string]: boolean }>({});

  const handlePersonalInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [name]: value },
    });
  };

  const handleAIImproveSummary = async () => {
    setLoadingAI(prev => ({ ...prev, summary: true }));
    const improved = await optimizeSummary(data.summary, data.personalInfo.title);
    onChange({ ...data, summary: improved });
    setLoadingAI(prev => ({ ...prev, summary: false }));
  };

  const addItem = (listKey: keyof ResumeData) => {
    const newItem = { id: Math.random().toString(36).substr(2, 9) };
    onChange({
      ...data,
      [listKey]: [...(data[listKey] as any[]), newItem],
    });
  };

  const removeItem = (listKey: keyof ResumeData, id: string) => {
    onChange({
      ...data,
      [listKey]: (data[listKey] as any[]).filter(item => item.id !== id),
    });
  };

  const updateItem = (listKey: keyof ResumeData, id: string, field: string, value: any) => {
    onChange({
      ...data,
      [listKey]: (data[listKey] as any[]).map(item => 
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const handleAIImproveExp = async (id: string, description: string, pos: string) => {
    setLoadingAI(prev => ({ ...prev, [id]: true }));
    const improved = await improveExperience(description, pos);
    updateItem('experience', id, 'description', improved);
    setLoadingAI(prev => ({ ...prev, [id]: false }));
  };

  return (
    <div className="space-y-8 pb-10">
      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Informações Pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Nome Completo</label>
            <input type="text" name="fullName" value={data.personalInfo.fullName} onChange={handlePersonalInfo} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Título Profissional</label>
            <input type="text" name="title" placeholder="Ex: Desenvolvedor Full Stack Senior" value={data.personalInfo.title} onChange={handlePersonalInfo} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Localização</label>
            <input type="text" name="location" placeholder="Ex: São Paulo, SP" value={data.personalInfo.location} onChange={handlePersonalInfo} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">E-mail</label>
            <input type="email" name="email" value={data.personalInfo.email} onChange={handlePersonalInfo} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Telefone</label>
            <input type="text" name="phone" value={data.personalInfo.phone} onChange={handlePersonalInfo} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">LinkedIn</label>
            <input type="text" name="linkedin" value={data.personalInfo.linkedin} onChange={handlePersonalInfo} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Portfólio / GitHub</label>
            <input type="text" name="portfolio" value={data.personalInfo.portfolio} onChange={handlePersonalInfo} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white border p-2" />
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-xl font-bold text-slate-800">Resumo Profissional</h3>
          <button 
            onClick={handleAIImproveSummary}
            disabled={loadingAI['summary'] || !data.summary}
            className="text-xs flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            <i className={`fas ${loadingAI['summary'] ? 'fa-spinner fa-spin' : 'fa-magic'}`}></i>
            {loadingAI['summary'] ? 'Melhorando...' : 'Melhorar com IA'}
          </button>
        </div>
        <textarea 
          rows={4} 
          value={data.summary} 
          onChange={(e) => onChange({...data, summary: e.target.value})} 
          placeholder="Conte um pouco sobre sua trajetória e principais competências..."
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white border p-2 text-sm"
        ></textarea>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-xl font-bold text-slate-800">Experiência Profissional</h3>
          <button onClick={() => addItem('experience')} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">+ Adicionar</button>
        </div>
        {data.experience.map((exp) => (
          <div key={exp.id} className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Empresa</label>
                <input type="text" value={exp.company} onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)} className="w-full border p-2 rounded text-sm mb-2" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Cargo</label>
                <input type="text" value={exp.position} onChange={(e) => updateItem('experience', exp.id, 'position', e.target.value)} className="w-full border p-2 rounded text-sm mb-2" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Data de Início</label>
                <input type="text" value={exp.startDate} placeholder="MM/AAAA" onChange={(e) => updateItem('experience', exp.id, 'startDate', e.target.value)} className="w-full border p-2 rounded text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Data de Término</label>
                <input type="text" value={exp.endDate} placeholder="MM/AAAA ou Atualmente" onChange={(e) => updateItem('experience', exp.id, 'endDate', e.target.value)} className="w-full border p-2 rounded text-sm" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <label className="text-xs font-bold uppercase text-slate-500">Principais Responsabilidades</label>
                <button 
                  onClick={() => handleAIImproveExp(exp.id, exp.description, exp.position)}
                  disabled={loadingAI[exp.id] || !exp.description}
                  className="text-[10px] flex items-center gap-1 text-indigo-600 disabled:opacity-50"
                >
                   <i className={`fas ${loadingAI[exp.id] ? 'fa-spinner fa-spin' : 'fa-magic'}`}></i>
                   Otimizar com IA
                </button>
              </div>
              <textarea rows={3} value={exp.description} onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)} className="w-full border p-2 rounded text-sm"></textarea>
            </div>
            <button onClick={() => removeItem('experience', exp.id)} className="mt-2 text-red-500 text-xs hover:underline">Remover</button>
          </div>
        ))}
      </section>

      <section>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-xl font-bold text-slate-800">Educação</h3>
          <button onClick={() => addItem('education')} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">+ Adicionar</button>
        </div>
        {data.education.map((edu) => (
          <div key={edu.id} className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-bold uppercase text-slate-500">Instituição</label>
                <input type="text" value={edu.institution} onChange={(e) => updateItem('education', edu.id, 'institution', e.target.value)} className="w-full border p-2 rounded text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Grau / Curso</label>
                <input type="text" value={edu.degree} onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)} className="w-full border p-2 rounded text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                   <label className="text-xs font-bold uppercase text-slate-500">Início</label>
                   <input type="text" value={edu.startDate} placeholder="AAAA" onChange={(e) => updateItem('education', edu.id, 'startDate', e.target.value)} className="w-full border p-2 rounded text-sm" />
                </div>
                <div>
                   <label className="text-xs font-bold uppercase text-slate-500">Fim</label>
                   <input type="text" value={edu.endDate} placeholder="AAAA" onChange={(e) => updateItem('education', edu.id, 'endDate', e.target.value)} className="w-full border p-2 rounded text-sm" />
                </div>
              </div>
            </div>
            <button onClick={() => removeItem('education', edu.id)} className="mt-2 text-red-500 text-xs hover:underline">Remover</button>
          </div>
        ))}
      </section>

      <section>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-xl font-bold text-slate-800">Competências</h3>
          <button onClick={() => addItem('skills')} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">+ Adicionar</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.skills.map((skill) => (
            <div key={skill.id} className="flex gap-2 items-center bg-slate-50 p-2 rounded border border-slate-200">
              <input type="text" value={skill.name} placeholder="Habilidade" onChange={(e) => updateItem('skills', skill.id, 'name', e.target.value)} className="flex-1 border p-1 rounded text-sm" />
              <select value={skill.level} onChange={(e) => updateItem('skills', skill.id, 'level', e.target.value)} className="border p-1 rounded text-sm bg-white">
                <option value="Básico">Básico</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
                <option value="Fluente">Fluente</option>
              </select>
              <button onClick={() => removeItem('skills', skill.id)} className="text-red-500 px-2 hover:bg-red-50 rounded">&times;</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResumeForm;
