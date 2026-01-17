
import { GoogleGenAI } from "@google/genai";

// Configurações e Estado
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let resumeData = {
    personal: {},
    summary: "",
    experience: [],
    education: [],
    skills: ""
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadSavedData();
    setupEventListeners();
    updatePreview();
});

function setupEventListeners() {
    // Inputs básicos
    const basicInputs = ['FullName', 'Title', 'Location', 'Email', 'Phone', 'Summary', 'Skills'];
    basicInputs.forEach(id => {
        const el = document.getElementById('in' + id);
        el.addEventListener('input', (e) => {
            if (id === 'Summary') resumeData.summary = e.target.value;
            else if (id === 'Skills') resumeData.skills = e.target.value;
            else resumeData.personal[id.toLowerCase()] = e.target.value;
            
            updatePreview();
            saveData();
        });
    });

    // Botão de Email
    document.getElementById('btnEmail').addEventListener('click', () => {
        const subject = encodeURIComponent(`Currículo: ${resumeData.personal.fullname || 'Profissional'}`);
        const body = encodeURIComponent(`Olá,\n\nSegue em anexo meu currículo para análise.\n\nAtenciosamente,\n${resumeData.personal.fullname || ''}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    });
}

// Manipulação Dinâmica de Listas
window.addExperience = function() {
    const id = Date.now();
    resumeData.experience.push({ id, company: '', role: '', period: '', desc: '' });
    renderFormLists();
    updatePreview();
};

window.addEducation = function() {
    const id = Date.now();
    resumeData.education.push({ id, institution: '', degree: '', year: '' });
    renderFormLists();
    updatePreview();
};

window.removeList = function(list, id) {
    resumeData[list] = resumeData[list].filter(item => item.id !== id);
    renderFormLists();
    updatePreview();
    saveData();
};

window.updateListItem = function(list, id, field, value) {
    const item = resumeData[list].find(i => i.id === id);
    if (item) item[field] = value;
    updatePreview();
    saveData();
};

// Renderização do Formulário (Listas)
function renderFormLists() {
    const expContainer = document.getElementById('experienceList');
    expContainer.innerHTML = resumeData.experience.map(exp => `
        <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 relative group">
            <button onclick="removeList('experience', ${exp.id})" class="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors">
                <i class="fas fa-trash-alt"></i>
            </button>
            <div class="grid grid-cols-2 gap-3">
                <input type="text" value="${exp.company}" oninput="updateListItem('experience', ${exp.id}, 'company', this.value)" placeholder="Empresa" class="p-2 border rounded text-sm">
                <input type="text" value="${exp.role}" oninput="updateListItem('experience', ${exp.id}, 'role', this.value)" placeholder="Cargo" class="p-2 border rounded text-sm">
                <input type="text" value="${exp.period}" oninput="updateListItem('experience', ${exp.id}, 'period', this.value)" placeholder="Período (Ex: 2020 - Atual)" class="col-span-2 p-2 border rounded text-sm">
                <div class="col-span-2">
                    <div class="flex justify-between mb-1">
                        <label class="text-[10px] font-bold text-slate-400 uppercase">Descrição</label>
                        <button onclick="improveJobDesc(${exp.id})" class="text-[10px] text-blue-600 font-bold hover:underline">IA: Melhorar Descrição</button>
                    </div>
                    <textarea oninput="updateListItem('experience', ${exp.id}, 'desc', this.value)" class="w-full p-2 border rounded text-sm h-20">${exp.desc}</textarea>
                </div>
            </div>
        </div>
    `).join('');

    const eduContainer = document.getElementById('educationList');
    eduContainer.innerHTML = resumeData.education.map(edu => `
        <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 relative">
            <button onclick="removeList('education', ${edu.id})" class="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                <i class="fas fa-trash-alt"></i>
            </button>
            <div class="grid grid-cols-1 gap-3">
                <input type="text" value="${edu.institution}" oninput="updateListItem('education', ${edu.id}, 'institution', this.value)" placeholder="Instituição" class="p-2 border rounded text-sm">
                <div class="grid grid-cols-2 gap-2">
                    <input type="text" value="${edu.degree}" oninput="updateListItem('education', ${edu.id}, 'degree', this.value)" placeholder="Curso" class="p-2 border rounded text-sm">
                    <input type="text" value="${edu.year}" oninput="updateListItem('education', ${edu.id}, 'year', this.value)" placeholder="Ano de Conclusão" class="p-2 border rounded text-sm">
                </div>
            </div>
        </div>
    `).join('');
}

// Atualização do Preview (Visual)
function updatePreview() {
    // Info Básica
    document.getElementById('outFullName').innerText = resumeData.personal.fullname || 'SEU NOME COMPLETO';
    document.getElementById('outTitle').innerText = resumeData.personal.title || 'CARGO / TÍTULO';
    document.getElementById('outEmail').innerText = resumeData.personal.email || 'email@exemplo.com';
    document.getElementById('outPhone').innerText = resumeData.personal.phone || 'Telefone';
    document.getElementById('outLocation').innerText = resumeData.personal.location || 'Cidade, UF';
    document.getElementById('outSummary').innerText = resumeData.summary || 'Escreva seu resumo profissional no formulário...';

    // Experiência
    const expPreview = document.getElementById('outExperience');
    if (resumeData.experience.length > 0) {
        expPreview.innerHTML = resumeData.experience.map(exp => `
            <div>
                <div class="flex justify-between items-baseline mb-1">
                    <h3 class="font-bold text-slate-800 text-base">${exp.role || 'Cargo'} em ${exp.company || 'Empresa'}</h3>
                    <span class="text-xs font-semibold text-slate-500">${exp.period || ''}</span>
                </div>
                <p class="text-sm text-slate-700 whitespace-pre-line text-justify">${exp.desc || ''}</p>
            </div>
        `).join('');
    } else {
        expPreview.innerHTML = '<p class="text-xs text-slate-400 italic">Nenhuma experiência adicionada.</p>';
    }

    // Educação
    const eduPreview = document.getElementById('outEducation');
    eduPreview.innerHTML = resumeData.education.map(edu => `
        <div>
            <h4 class="font-bold text-slate-800 text-sm">${edu.degree || 'Curso'}</h4>
            <p class="text-xs text-slate-600">${edu.institution || 'Instituição'}</p>
            <p class="text-[10px] text-slate-400 uppercase font-bold mt-0.5">${edu.year || ''}</p>
        </div>
    `).join('');

    // Habilidades
    const skillsPreview = document.getElementById('outSkills');
    const skillsArray = resumeData.skills.split(',').filter(s => s.trim() !== '');
    skillsPreview.innerHTML = skillsArray.map(skill => `
        <span class="bg-slate-100 text-slate-700 px-3 py-1 rounded text-xs font-bold border border-slate-200">
            ${skill.trim()}
        </span>
    `).join('');
}

// Lógica de Inteligência Artificial (Gemini)
window.optimizeSummary = async function() {
    if (!resumeData.summary) return alert("Escreva algo no resumo primeiro!");
    
    const btn = document.querySelector('button[onclick="optimizeSummary()"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Otimizando...';
    btn.classList.add('ai-loading');

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Reescreva este resumo profissional para torná-lo atraente para recrutadores. Use um tom profissional, destaque competências e conquistas. Maximo 4 linhas. Texto: "${resumeData.summary}"`
        });
        
        const improved = response.text.trim();
        document.getElementById('inSummary').value = improved;
        resumeData.summary = improved;
        updatePreview();
        saveData();
    } catch (e) {
        console.error(e);
        alert("Erro ao conectar com a IA. Tente novamente mais tarde.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
        btn.classList.remove('ai-loading');
    }
};

window.improveJobDesc = async function(id) {
    const item = resumeData.experience.find(i => i.id === id);
    if (!item || !item.desc) return alert("Preencha a descrição do cargo!");

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Melhore esta descrição de cargo profissional. Use verbos de ação e bullet points. Cargo: ${item.role}. Texto original: "${item.desc}"`
    });

    item.desc = response.text.trim();
    renderFormLists();
    updatePreview();
    saveData();
};

// Funções Utilitárias
function saveData() {
    localStorage.setItem('curriculo_pro_ai_data', JSON.stringify(resumeData));
}

function loadSavedData() {
    const saved = localStorage.getItem('curriculo_pro_ai_data');
    if (saved) {
        resumeData = JSON.parse(saved);
        // Preencher inputs básicos
        document.getElementById('inFullName').value = resumeData.personal.fullname || '';
        document.getElementById('inTitle').value = resumeData.personal.title || '';
        document.getElementById('inLocation').value = resumeData.personal.location || '';
        document.getElementById('inEmail').value = resumeData.personal.email || '';
        document.getElementById('inPhone').value = resumeData.personal.phone || '';
        document.getElementById('inSummary').value = resumeData.summary || '';
        document.getElementById('inSkills').value = resumeData.skills || '';
        renderFormLists();
    }
}

window.switchTab = function(tab) {
    const editSide = document.getElementById('sideEdit');
    const previewSide = document.getElementById('sidePreview');
    const tabEdit = document.getElementById('tabEdit');
    const tabPreview = document.getElementById('tabPreview');

    if (tab === 'edit') {
        editSide.classList.remove('hidden');
        previewSide.classList.add('hidden');
        tabEdit.classList.add('border-blue-600', 'text-blue-600');
        tabEdit.classList.remove('text-slate-400');
        tabPreview.classList.remove('border-blue-600', 'text-blue-600');
        tabPreview.classList.add('text-slate-400');
    } else {
        editSide.classList.add('hidden');
        previewSide.classList.remove('hidden', 'md:hidden');
        previewSide.classList.add('flex');
        tabPreview.classList.add('border-blue-600', 'text-blue-600');
        tabPreview.classList.remove('text-slate-400');
        tabEdit.classList.remove('border-blue-600', 'text-blue-600');
        tabEdit.classList.add('text-slate-400');
    }
};
