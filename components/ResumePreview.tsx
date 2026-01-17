
import React from 'react';
import { ResumeData } from '../types';

interface Props {
  data: ResumeData;
}

const ResumePreview: React.FC<Props> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <div id="resume-preview" className="bg-white shadow-2xl min-h-[1122px] w-[794px] mx-auto p-12 text-slate-800 flex flex-col gap-8 print:shadow-none print:m-0 print:p-8">
      {/* Header */}
      <header className="border-b-2 border-slate-800 pb-6">
        <h1 className="text-4xl font-bold tracking-tight uppercase mb-2">{personalInfo.fullName || 'Seu Nome'}</h1>
        <p className="text-xl text-indigo-700 font-medium mb-4">{personalInfo.title || 'Seu Cargo/Título'}</p>
        
        <div className="grid grid-cols-2 gap-y-1 text-sm text-slate-600">
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <i className="fas fa-envelope w-4 text-slate-400"></i>
              {personalInfo.email}
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <i className="fas fa-phone w-4 text-slate-400"></i>
              {personalInfo.phone}
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <i className="fas fa-map-marker-alt w-4 text-slate-400"></i>
              {personalInfo.location}
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <i className="fab fa-linkedin w-4 text-slate-400"></i>
              {personalInfo.linkedin}
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section>
          <h2 className="text-lg font-bold uppercase tracking-widest text-slate-800 border-l-4 border-indigo-600 pl-3 mb-3">Resumo Profissional</h2>
          <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section>
          <h2 className="text-lg font-bold uppercase tracking-widest text-slate-800 border-l-4 border-indigo-600 pl-3 mb-4">Experiência Profissional</h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-slate-800 text-base">{exp.position} | {exp.company}</h3>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Skills Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Education Column */}
        <div className="col-span-7">
          {education.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-widest text-slate-800 border-l-4 border-indigo-600 pl-3 mb-4">Educação</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-slate-800 text-sm">{edu.degree}</h3>
                    <p className="text-sm text-slate-600">{edu.institution}</p>
                    <p className="text-xs text-slate-400">{edu.startDate} — {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Skills Column */}
        <div className="col-span-5">
          {skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-widest text-slate-800 border-l-4 border-indigo-600 pl-3 mb-4">Competências</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.id} className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded text-xs font-medium border border-indigo-100">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
