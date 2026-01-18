// script.js - Versão Final com Envio por E-mail

// Função para atualizar a preview em tempo real
function updatePreview() {
    // Dados pessoais
    document.getElementById('outFullName').textContent = document.getElementById('inFullName').value || 'SEU NOME';
    document.getElementById('outTitle').textContent = document.getElementById('inTitle').value || 'Cargo Desejado';
    document.getElementById('outEmail').textContent = document.getElementById('inEmail').value || 'email@exemplo.com';
    document.getElementById('outPhone').textContent = document.getElementById('inPhone').value || '11 99999-9999';
    document.getElementById('outLocation').textContent = document.getElementById('inLocation').value || 'Cidade, UF';

    // Resumo
    document.getElementById('outSummary').textContent = document.getElementById('inSummary').value || 'Seu resumo profissional aparecerá aqui...';

    // Habilidades
    const skills = document.getElementById('inSkills').value.split(',').map(s => s.trim()).filter(s => s);
    document.getElementById('outSkills').innerHTML = skills.map(skill => 
        `<span class="bg-slate-800 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">${skill}</span>`
    ).join('');

    // Experiências e Educação
    updateExperiences();
    updateEducation();
}

// Função para adicionar campos de experiência
function addExperience() {
    const list = document.getElementById('experienceList');
    const expDiv = document.createElement('div');
    expDiv.className = 'border border-slate-200 rounded-md p-4 space-y-2 bg-slate-50 relative group';
    expDiv.innerHTML = `
        <button onclick="this.parentElement.remove(); updatePreview();" class="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors">
            <i class="fas fa-trash"></i>
        </button>
        <input type="text" placeholder="Cargo (Ex: Gerente de Vendas)" class="w-full p-2 border rounded text-sm">
        <input type="text" placeholder="Empresa" class="w-full p-2 border rounded text-sm">
        <input type="text" placeholder="Período (Ex: Jan 2020 - Presente)" class="w-full p-2 border rounded text-sm">
        <textarea placeholder="Descrição das atividades..." rows="3" class="w-full p-2 border rounded text-sm"></textarea>
    `;
    list.appendChild(expDiv);
    
    // Adiciona listeners aos novos inputs
    expDiv.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', updatePreview);
    });
}

function updateExperiences() {
    const out = document.getElementById('outExperience');
    out.innerHTML = '';
    const experiences = document.querySelectorAll('#experienceList > div');
    
    experiences.forEach(exp => {
        const inputs = exp.querySelectorAll('input, textarea');
        if (inputs[0].value || inputs[1].value) {
            out.innerHTML += `
                <div>
                    <h3 class="font-bold text-slate-900">${inputs[0].value || 'Cargo'}</h3>
                    <p class="text-blue-600 font-medium text-sm">${inputs[1].value || 'Empresa'} | ${inputs[2].value || 'Período'}</p>
                    <p class="text-sm text-slate-700 mt-1 whitespace-pre-line">${inputs[3].value || ''}</p>
                </div>
            `;
        }
    });
}

// Função para adicionar campos de educação
function addEducation() {
    const list = document.getElementById('educationList');
    const eduDiv = document.createElement('div');
    eduDiv.className = 'border border-slate-200 rounded-md p-4 space-y-2 bg-slate-50 relative';
    eduDiv.innerHTML = `
        <button onclick="this.parentElement.remove(); updatePreview();" class="absolute top-2 right-2 text-red-400 hover:text-red-600">
            <i class="fas fa-trash"></i>
        </button>
        <input type="text" placeholder="Curso (Ex: Graduação em RH)" class="w-full p-2 border rounded text-sm">
        <input type="text" placeholder="Instituição" class="w-full p-2 border rounded text-sm">
        <input type="text" placeholder="Ano de Conclusão" class="w-full p-2 border rounded text-sm">
    `;
    list.appendChild(eduDiv);
    
    eduDiv.querySelectorAll('input').forEach(el => {
        el.addEventListener('input', updatePreview);
    });
}

function updateEducation() {
    const out = document.getElementById('outEducation');
    out.innerHTML = '';
    const educations = document.querySelectorAll('#educationList > div');
    
    educations.forEach(edu => {
        const inputs = edu.querySelectorAll('input');
        if (inputs[0].value) {
            out.innerHTML += `
                <div>
                    <h3 class="font-bold text-slate-900">${inputs[0].value}</h3>
                    <p class="text-slate-700 text-sm">${inputs[1].value} | ${inputs[2].value}</p>
                </div>
            `;
        }
    });
}

// LÓGICA DE ENVIO POR E-MAIL
document.getElementById('btnSendEmail').addEventListener('click', () => {
    const recruiterEmail = prompt("Digite o e-mail do recrutador ou da empresa:");
    
    if (!recruiterEmail || recruiterEmail.trim() === "") {
        alert("É necessário informar um e-mail para prosseguir.");
        return;
    }

    const nome = document.getElementById('inFullName').value || 'Candidato';
    const cargo = document.getElementById('inTitle').value || 'Vaga de Emprego';
    const emailCandidato = document.getElementById('inEmail').value;
    const telefone = document.getElementById('inPhone').value;
    const resumo = document.getElementById('inSummary').value;

    const subject = encodeURIComponent(`Candidatura: ${nome} - ${cargo}`);
    
    let bodyText = `Olá,\n\n`;
    bodyText += `Estou a enviar o meu currículo para a posição de ${cargo}.\n\n`;
    bodyText += `--- RESUMO PROFISSIONAL ---\n`;
    bodyText += `Nome: ${nome}\n`;
    bodyText += `Contacto: ${emailCandidato} | ${telefone}\n`;
    bodyText += `Resumo: ${resumo}\n\n`;
    bodyText += `(Enviei este resumo via Gerador de Currículos Pro AI. Por favor, veja o PDF em anexo caso tenha sido enviado separadamente.)`;

    const mailtoLink = `mailto:${recruiterEmail}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;

    window.location.href = mailtoLink;
});

// Alternar abas mobile
function switchTab(tab) {
    const sideEdit = document.getElementById('sideEdit');
    const sidePreview = document.getElementById('sidePreview');
    const tabEdit = document.getElementById('tabEdit');
    const tabPreview = document.getElementById('tabPreview');

    if (tab === 'edit') {
        sideEdit.classList.remove('hidden');
        sidePreview.classList.add('hidden');
        tabEdit.classList.add('border-blue-600', 'text-blue-600');
        tabPreview.classList.remove('border-blue-600', 'text-blue-600');
    } else {
        sideEdit.classList.add('hidden');
        sidePreview.classList.remove('hidden', 'md:flex');
        sidePreview.classList.add('flex');
        tabPreview.classList.add('border-blue-600', 'text-blue-600');
        tabEdit.classList.remove('border-blue-600', 'text-blue-600');
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Adiciona uma linha inicial em cada seção
    addExperience();
    addEducation();

    // Listeners para os campos estáticos
    document.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', updatePreview);
    });

    updatePreview();
});