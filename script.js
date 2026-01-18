// script.js - Versão Completa com Todas as Melhorias

// ========== DARK MODE ==========
function updateThemeVariables() {
    const isDark = document.body.classList.contains('dark');
    
    // Atualiza as CSS custom properties
    if (isDark) {
        document.documentElement.style.setProperty('--bg-primary', '#0f172a');
        document.documentElement.style.setProperty('--bg-secondary', '#1e293b');
        document.documentElement.style.setProperty('--text-primary', '#f8fafc');
        document.documentElement.style.setProperty('--text-secondary', '#94a3b8');
        document.documentElement.style.setProperty('--border-color', '#334155');
    } else {
        document.documentElement.style.setProperty('--bg-primary', '#f1f5f9');
        document.documentElement.style.setProperty('--bg-secondary', '#ffffff');
        document.documentElement.style.setProperty('--text-primary', '#0f172a');
        document.documentElement.style.setProperty('--text-secondary', '#475569');
        document.documentElement.style.setProperty('--border-color', '#e2e8f0');
    }
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    body.classList.toggle('dark');
    
    const isDark = body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Atualiza ícone e texto
    if (isDark) {
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Claro';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = 'Escuro';
    }
    
    // SINCRONIZA as variáveis CSS com a classe dark
    updateThemeVariables();
    
    showToast(isDark ? '🌙 Tema escuro ativado' : '☀️ Tema claro ativado', 'success');
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark');
        const themeIcon = document.getElementById('themeIcon');
        const themeText = document.getElementById('themeText');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        if (themeText) themeText.textContent = 'Claro';
    }
    
    // APLICAR variáveis CSS na inicialização
    updateThemeVariables();
}

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.getElementById('toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50 transition-all transform translate-y-2 opacity-0 ${
        type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'
    }`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    });
    
    // Auto remove
    setTimeout(() => {
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== LOCALSTORAGE ==========
function saveToLocalStorage() {
    const data = {
        fullName: document.getElementById('inFullName').value,
        title: document.getElementById('inTitle').value,
        location: document.getElementById('inLocation').value,
        email: document.getElementById('inEmail').value,
        phone: document.getElementById('inPhone').value,
        summary: document.getElementById('inSummary').value,
        skills: document.getElementById('inSkills').value,
        experiences: getSectionData('experienceList'),
        educations: getSectionData('educationList'),
        photo: localStorage.getItem('resumePhoto') || null
    };
    localStorage.setItem('curriculoProData', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('curriculoProData');
    if (!savedData) return false;
    
    try {
        const data = JSON.parse(savedData);
        
        if (data.fullName) document.getElementById('inFullName').value = data.fullName;
        if (data.title) document.getElementById('inTitle').value = data.title;
        if (data.location) document.getElementById('inLocation').value = data.location;
        if (data.email) document.getElementById('inEmail').value = data.email;
        if (data.phone) document.getElementById('inPhone').value = data.phone;
        if (data.summary) document.getElementById('inSummary').value = data.summary;
        if (data.skills) document.getElementById('inSkills').value = data.skills;
        
        // Load experiences
        if (data.experiences && data.experiences.length > 0) {
            const expList = document.getElementById('experienceList');
            expList.innerHTML = '';
            data.experiences.forEach(exp => addExperience(exp));
        }
        
        // Load educations
        if (data.educations && data.educations.length > 0) {
            const eduList = document.getElementById('educationList');
            eduList.innerHTML = '';
            data.educations.forEach(edu => addEducation(edu));
        }
        
        return true;
    } catch (e) {
        console.error('Erro ao carregar dados:', e);
        return false;
    }
}

function getSectionData(listId) {
    const items = [];
    document.querySelectorAll(`#${listId} > div`).forEach(div => {
        const inputs = div.querySelectorAll('input, textarea');
        const values = [];
        inputs.forEach(input => values.push(input.value));
        if (values.some(v => v)) items.push(values);
    });
    return items;
}

function clearLocalStorage() {
    if (confirm('Tem certeza que deseja limpar todos os dados salvos?')) {
        localStorage.removeItem('curriculoProData');
        localStorage.removeItem('resumePhoto');
        localStorage.removeItem('theme');
        showToast('Dados limpos com sucesso!', 'success');
        setTimeout(() => location.reload(), 1000);
    }
}

function exportData() {
    const data = localStorage.getItem('curriculoProData');
    if (!data) {
        showToast('Nenhum dado salvo para exportar!', 'error');
        return;
    }
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'curriculo-pro-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Dados exportados com sucesso!', 'success');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.setItem('curriculoProData', JSON.stringify(data));
            showToast('Dados importados com sucesso!', 'success');
            setTimeout(() => location.reload(), 1000);
        } catch (err) {
            showToast('Erro ao importar arquivo!', 'error');
        }
    };
    reader.readAsText(file);
}

// ========== VALIDAÇÃO ==========
function validateForm() {
    const errors = [];
    
    const name = document.getElementById('inFullName').value.trim();
    const email = document.getElementById('inEmail').value.trim();
    
    if (!name) {
        errors.push('Nome é obrigatório');
        document.getElementById('inFullName').classList.add('border-red-500');
    } else {
        document.getElementById('inFullName').classList.remove('border-red-500');
    }
    
    if (email && !isValidEmail(email)) {
        errors.push('E-mail inválido');
        document.getElementById('inEmail').classList.add('border-red-500');
    } else {
        document.getElementById('inEmail').classList.remove('border-red-500');
    }
    
    if (errors.length > 0) {
        showToast(errors[0], 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ========== FOTO DE PERFIL ==========
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showToast('Por favor, selecione uma imagem válida!', 'error');
        return;
    }
    
    if (file.size > 4 * 1024) { // 2MB limit
        showToast('A imagem deve ter no máximo 2 * 1022MB!', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        localStorage.setItem('resumePhoto', base64);
        updatePhotoPreview(base64);
        showToast('Foto carregada com sucesso!', 'success');
    };
    reader.readAsDataURL(file);
}

function updatePhotoPreview(src) {
    let photoContainer = document.getElementById('photoPreviewContainer');
    let photoOutput = document.getElementById('photoOutput');
    
    if (!photoContainer) {
        // Add photo section to form
        const section = document.querySelector('#sideEdit section:first-child > div');
        const photoDiv = document.createElement('div');
        photoDiv.id = 'photoPreviewContainer';
        photoDiv.className = 'sm:col-span-2 mt-4';
        photoDiv.innerHTML = `
            <label class="text-[10px] font-black text-slate-400 uppercase">Foto de Perfil</label>
            <div class="flex items-center gap-4 mt-2">
                <img id="photoOutput" src="${src}" alt="Foto de perfil" class="w-20 h-20 rounded-full object-cover border-2 border-slate-200">
                <div class="flex gap-2">
                    <label class="cursor-pointer bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                        <i class="fas fa-upload mr-1"></i> Trocar Foto
                        <input type="file" accept="image/*" onchange="handlePhotoUpload(event)" class="hidden">
                    </label>
                    <button onclick="removePhoto()" class="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                        <i class="fas fa-trash mr-1"></i> Remover
                    </button>
                </div>
            </div>
        `;
        section.appendChild(photoDiv);
    } else {
        photoOutput.src = src;
    }
    
    // Update preview
    let previewPhoto = document.getElementById('previewPhoto');
    if (!previewPhoto) {
        const header = document.querySelector('#resume-preview header');
        previewPhoto = document.createElement('img');
        previewPhoto.id = 'previewPhoto';
        previewPhoto.className = 'w-24 h-24 rounded-full object-cover mb-4';
        header.insertBefore(previewPhoto, header.firstChild);
    }
    previewPhoto.src = src;
}

function removePhoto() {
    localStorage.removeItem('resumePhoto');
    const container = document.getElementById('photoPreviewContainer');
    const previewPhoto = document.getElementById('previewPhoto');
    if (container) container.remove();
    if (previewPhoto) previewPhoto.remove();
    showToast('Foto removida!', 'success');
}

// ========== PREVIEW UPDATE ==========
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
    
    // Save to localStorage
    saveToLocalStorage();
}

// ========== EXPERIÊNCIAS ==========
function addExperience(data = null) {
    const list = document.getElementById('experienceList');
    const expDiv = document.createElement('div');
    expDiv.className = 'border border-slate-200 rounded-md p-4 space-y-2 bg-slate-50 relative group';
    expDiv.innerHTML = `
        <button onclick="confirmRemoveExperience(this)" class="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors p-2" aria-label="Remover experiência">
            <i class="fas fa-trash"></i>
        </button>
        <input type="text" placeholder="Cargo (Ex: Gerente de Vendas)" class="w-full p-2 border rounded text-sm" value="${data ? data[0] : ''}">
        <input type="text" placeholder="Empresa" class="w-full p-2 border rounded text-sm" value="${data ? data[1] : ''}">
        <input type="text" placeholder="Período (Ex: Jan 2020 - Presente)" class="w-full p-2 border rounded text-sm" value="${data ? data[2] : ''}">
        <textarea placeholder="Descrição das atividades..." rows="3" class="w-full p-2 border rounded text-sm">${data ? data[3] : ''}</textarea>
    `;
    list.appendChild(expDiv);
    
    expDiv.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', updatePreview);
    });
    
    updatePreview();
}

function confirmRemoveExperience(button) {
    if (confirm('Tem certeza que deseja remover esta experiência?')) {
        button.parentElement.remove();
        updatePreview();
        showToast('Experiência removida!', 'success');
    }
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

// ========== EDUCAÇÃO ==========
function addEducation(data = null) {
    const list = document.getElementById('educationList');
    const eduDiv = document.createElement('div');
    eduDiv.className = 'border border-slate-200 rounded-md p-4 space-y-2 bg-slate-50 relative';
    eduDiv.innerHTML = `
        <button onclick="confirmRemoveEducation(this)" class="absolute top-2 right-2 text-red-400 hover:text-red-600 p-2" aria-label="Remover educação">
            <i class="fas fa-trash"></i>
        </button>
        <input type="text" placeholder="Curso (Ex: Graduação em RH)" class="w-full p-2 border rounded text-sm" value="${data ? data[0] : ''}">
        <input type="text" placeholder="Instituição" class="w-full p-2 border rounded text-sm" value="${data ? data[1] : ''}">
        <input type="text" placeholder="Ano de Conclusão" class="w-full p-2 border rounded text-sm" value="${data ? data[2] : ''}">
    `;
    list.appendChild(eduDiv);
    
    eduDiv.querySelectorAll('input').forEach(el => {
        el.addEventListener('input', updatePreview);
    });
    
    updatePreview();
}

function confirmRemoveEducation(button) {
    if (confirm('Tem certeza que deseja remover esta formação?')) {
        button.parentElement.remove();
        updatePreview();
        showToast('Formação removida!', 'success');
    }
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

// ========== ENVIO DE E-MAIL ==========
function isValidRecruiterEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
}

function generateEmailContent(recruiterEmail) {
    const nome = document.getElementById('inFullName').value;
    const cargo = document.getElementById('inTitle').value || 'Vaga de Emprego';
    const emailCandidato = document.getElementById('inEmail').value;
    const telefone = document.getElementById('inPhone').value;
    const resumo = document.getElementById('inSummary').value;

    const subject = `Candidatura: ${nome} - ${cargo}`;
    
    let bodyText = `Olá,\n\n`;
    bodyText += `Espero que esteja bem! Estou entrando em contato para expressar meu interesse na posição de ${cargo}.\n\n`;
    bodyText += `📋 RESUMO DO CURRÍCULO\n`;
    bodyText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    bodyText += `👤 Nome: ${nome}\n`;
    bodyText += `📧 E-mail: ${emailCandidato}\n`;
    if (telefone) bodyText += `📞 Telefone: ${telefone}\n\n`;
    
    if (resumo) {
        bodyText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        bodyText += `📝 SOBRE MIM\n`;
        bodyText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        bodyText += `${resumo}\n\n`;
    }
    
    bodyText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    bodyText += `💡 INFORMAÇÕES ADICIONAIS\n`;
    bodyText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    bodyText += `• Currículo gerado com Currículo Pro AI\n`;
    bodyText += `• Por favor, consulte o arquivo PDF em anexo para ver o currículo completo\n\n`;
    bodyText += `Agradeço desde já a oportunidade e fico à disposição para uma conversa!\n\n`;
    bodyText += `Atenciosamente,\n`;
    bodyText += `${nome}\n\n`;
    bodyText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    bodyText += `💻 INFORMAÇÕES DO DESENVOLVEDOR\n`;
    bodyText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    bodyText += `Software desenvolvido por Dev junior izaias de oliveira elias\n`;
    bodyText += `By linux | Debian 11/ vscode IDE`;

    return { subject, bodyText, recruiterEmail: recruiterEmail.trim() };
}

function copyEmailToClipboard(recruiterEmail) {
    const { subject, bodyText } = generateEmailContent(recruiterEmail);
    const fullEmail = `Para: ${recruiterEmail}\nAssunto: ${subject}\n\n${bodyText}`;
    
    navigator.clipboard.writeText(fullEmail).then(() => {
        showToast('✅ E-mail copiado! Cole no Gmail, Outlook ou outro cliente.', 'success');
    }).catch(() => {
        showToast('❌ Erro ao copiar. Tente novamente.', 'error');
    });
}

function openInGmail(recruiterEmail) {
    const { subject, bodyText } = generateEmailContent(recruiterEmail);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recruiterEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    window.open(gmailUrl, '_blank');
    showToast('✅ Abrindo Gmail...', 'success');
}

function openInOutlook(recruiterEmail) {
    const { subject, bodyText } = generateEmailContent(recruiterEmail);
    
    // Tenta protocolo outlook: primeiro (abre Outlook Desktop no Windows)
    const outlookProtocol = `outlook:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    
    // Testa se o protocolo funciona
    const testWindow = window.open(outlookProtocol, '_blank');
    
    // Se abrir, mostra sucesso. Se não, abre web
    setTimeout(() => {
        if (testWindow && !testWindow.closed) {
            testWindow.close();
            showToast('✅ Abrindo Outlook Desktop...', 'success');
        } else {
            // Fallback para Outlook Web
            const outlookWeb = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(recruiterEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
            window.open(outlookWeb, '_blank');
            showToast('✅ Abrindo Outlook Web...', 'success');
        }
    }, 500);
}



function openInOtherClient(recruiterEmail) {
    const { subject, bodyText } = generateEmailContent(recruiterEmail);
    const mailtoLink = `mailto:${encodeURIComponent(recruiterEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    
    // Tenta abrir com mailto
    window.location.href = mailtoLink;
    
    // Se não abrir em 2 segundos, copia o link
    setTimeout(() => {
        copyMailtoLink(mailtoLink);
    }, 2000);
}

function copyMailtoLink(link) {
    navigator.clipboard.writeText(link).then(() => {
        showToast('✅ Link copiado! Cole no seu cliente de e-mail.', 'success');
    }).catch(() => {
        showToast('❌ Não foi possível abrir o cliente.', 'error');
    });
}

function chooseEmailMethod(recruiterEmail) {
    const modal = document.createElement('div');
    modal.id = 'emailModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-4">Como deseja enviar?</h3>
            <div class="space-y-3">
                <button onclick="copyEmailToClipboard('${recruiterEmail}')" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                    <i class="fas fa-copy"></i> Copiar e Colar
                </button>
                <button onclick="openInGmail('${recruiterEmail}')" class="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                    <i class="fab fa-google"></i> Gmail Web
                </button>
                <button onclick="openInOutlook('${recruiterEmail}')" class="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                    <i class="fab fa-microsoft"></i> Outlook
                </button>
                <button onclick="closeEmailModal()" class="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white py-3 px-4 rounded-lg font-medium transition-colors">
                    Cancelar
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeEmailModal() {
    const modal = document.getElementById('emailModal');
    if (modal) modal.remove();
}

document.getElementById('btnSendEmail').addEventListener('click', () => {
    if (!validateForm()) return;

    const recruiterEmail = prompt("Digite o e-mail do recrutador ou da empresa:");

    if (!recruiterEmail || recruiterEmail.trim() === "") {
        showToast('❌ É necessário informar um e-mail para prosseguir.', 'error');
        return;
    }

    if (!isValidRecruiterEmail(recruiterEmail)) {
        showToast('❌ E-mail do recrutador inválido. Verifique e tente novamente.', 'error');
        return;
    }

    chooseEmailMethod(recruiterEmail);
});

// ========== TROCAR ABAS MOBILE ==========
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

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    const hasData = loadFromLocalStorage();
    
    if (!hasData) {
        addExperience();
        addEducation();
    }
    
    const savedPhoto = localStorage.getItem('resumePhoto');
    if (savedPhoto) {
        updatePhotoPreview(savedPhoto);
    }
    
    document.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', updatePreview);
    });
    
    updatePreview();
    
    showToast('✏️ Currículo Pro AI Carregado!', 'success');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveToLocalStorage();
        showToast('💾 Dados salvos manualmente!', 'success');
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        // Let default print behavior work
    }
});

