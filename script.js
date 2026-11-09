/**
 * Lógica Completa do Protótipo Funcional - Educandário Espírita Mãe Zeferina
 */

// Base inicial de alunos para demonstração
const alunosIniciais = [
    { id: 1, matricula: "2026•001", nome: "Ana Clara Santos", nascimento: "14/03/2021", turma: "Pré II • A", responsavel: "Juliana Santos", status: "Ativo", notaMedia: "9,5", frequencia: "98%" },
    { id: 2, matricula: "2026•014", nome: "Miguel Oliveira", nascimento: "22/07/2023", turma: "Maternal • A", responsavel: "Carlos Oliveira", status: "Ativo", notaMedia: " Conceito A", frequencia: "95%" },
    { id: 3, matricula: "2026•028", nome: "Sofia Almeida", nascimento: "09/11/2022", turma: "Pré I • B", responsavel: "Fernanda Almeida", status: "Ativo", notaMedia: "Conceito A", frequencia: "96%" },
    { id: 4, matricula: "2026•042", nome: "Pedro Henrique Lima", nascimento: "02/05/2019", turma: "1º Ano • A", responsavel: "Roberto Lima", status: "Ativo", notaMedia: "8,8", frequencia: "92%" },
    { id: 5, matricula: "2026•057", nome: "Helena Ferreira", nascimento: "18/08/2018", turma: "2º Ano • A", responsavel: "Patrícia Ferreira", status: "Ativo", notaMedia: "9,2", frequencia: "97%" }
];

let turmaFiltroAtual = 'TODAS';

// Carrega alunos do localStorage ou inicia com a lista padrão
function obterAlunos() {
    const salvos = localStorage.getItem('alunosEducandario');
    if (salvos) {
        return JSON.parse(salvos);
    }
    localStorage.setItem('alunosEducandario', JSON.stringify(alunosIniciais));
    return alunosIniciais;
}

function salvarListaAlunos(lista) {
    localStorage.setItem('alunosEducandario', JSON.stringify(lista));
}

// ==========================================
// 1. AUTENTICAÇÃO E TELA DE LOGIN
// ==========================================
function selecionarPerfil(perfilEscolhido) {
    const botoesAbas = document.querySelectorAll('#perfilTabs button');
    botoesAbas.forEach(botao => {
        if (botao.innerText.includes(perfilEscolhido)) {
            botao.className = "py-2 bg-white rounded-lg shadow-sm text-blue-600 font-semibold text-center transition-all";
        } else {
            botao.className = "py-2 text-center text-slate-600 hover:text-slate-900 transition-all";
        }
    });
}

function realizarLogin(evento) {
    evento.preventDefault();
    const campoEmail = document.getElementById('emailInput');
    if (!campoEmail || !campoEmail.value.trim()) return;
    localStorage.setItem('usuarioLogado', campoEmail.value.trim());
    window.location.href = 'dashboard.html';
}

// ==========================================
// 2. NAVEGAÇÃO ENTRE ABAS (SPA)
// ==========================================
function navegarPara(abaId) {
    const secoes = ['visao-geral', 'alunos-turmas', 'documentos', 'chamada'];
    secoes.forEach(sec => {
        const elSec = document.getElementById(`sec-${sec}`);
        const elNav = document.getElementById(`nav-${sec}`);
        if (elSec) elSec.classList.add('hidden');
        if (elNav) elNav.className = "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 text-left transition-all";
    });

    const ativaSec = document.getElementById(`sec-${abaId}`);
    const ativaNav = document.getElementById(`nav-${abaId}`);
    if (ativaSec) ativaSec.classList.remove('hidden');
    if (ativaNav) ativaNav.className = "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-blue-50 text-blue-600 text-left font-semibold transition-all";

    if (abaId === 'documentos') atualizarPreviewDocumento();
}

// ==========================================
// 3. RENDERIZAÇÃO DE TABELAS E FILTROS
// ==========================================
function renderizarSistema() {
    const alunos = obterAlunos();
    const termoBusca = (document.getElementById('buscaGlobalInput')?.value || '').toLowerCase();

    // Atualiza contador total (base 101 + os cadastrados na lista de demonstração)
    const kpiTotal = document.getElementById('kpiTotalAlunos');
    if (kpiTotal) kpiTotal.innerText = 101 + alunos.length;

    // 1. Tabela Resumo (Visão Geral)
    const tbodyResumo = document.getElementById('tabelaResumoAlunos');
    if (tbodyResumo) {
        tbodyResumo.innerHTML = alunos.slice(0, 5).map(a => `
            <tr class="hover:bg-slate-50/80">
                <td class="py-3 font-medium text-slate-900">${a.nome} <span class="block text-[10px] text-slate-400 font-normal">Matrícula ${a.matricula}</span></td>
                <td class="py-3">${a.turma}</td>
                <td class="py-3"><span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium text-[10px]">${a.status}</span></td>
                <td class="py-3 text-right space-x-1">
                    <button onclick="abrirDocDireto(${a.id}, 'historico')" class="px-2.5 py-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100">Histórico</button>
                    <button onclick="abrirDocDireto(${a.id}, 'escolaridade')" class="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100">Emitir Atestado</button>
                </td>
            </tr>
        `).join('');
    }

    // 2. Tabela Completa Unificada (Alunos & Turmas)
    const tbodyCompleta = document.getElementById('tabelaCompletaAlunos');
    if (tbodyCompleta) {
        const filtrados = alunos.filter(a => {
            const bateTurma = turmaFiltroAtual === 'TODAS' || a.turma === turmaFiltroAtual;
            const bateBusca = a.nome.toLowerCase().includes(termoBusca) || a.matricula.toLowerCase().includes(termoBusca);
            return bateTurma && bateBusca;
        });

        tbodyCompleta.innerHTML = filtrados.map(a => `
            <tr class="hover:bg-slate-50/80">
                <td class="py-3.5 font-semibold text-slate-900">${a.nome} <span class="block text-[10px] text-slate-400 font-normal">Matrícula ${a.matricula}</span></td>
                <td class="py-3.5">${a.nascimento}</td>
                <td class="py-3.5"><span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">${a.turma}</span></td>
                <td class="py-3.5">${a.responsavel}</td>
                <td class="py-3.5"><span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium text-[10px]">${a.status}</span></td>
                <td class="py-3.5 text-right space-x-1">
                    <button onclick="abrirDocDireto(${a.id}, 'escolaridade')" class="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100">Atestado</button>
                    <button onclick="abrirDocDireto(${a.id}, 'transferencia')" class="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg font-medium hover:bg-amber-100">Transferência</button>
                    <button onclick="abrirDocDireto(${a.id}, 'historico')" class="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100">Histórico</button>
                </td>
            </tr>
        `).join('');
    }

    // 3. Atualiza Selects de Alunos
    const selectRapido = document.getElementById('selectAlunoRapido');
    const selectDoc = document.getElementById('docSelectAluno');
    const opcoesHtml = alunos.map(a => `<option value="${a.id}">${a.nome} (${a.turma})</option>`).join('');
    if (selectRapido) selectRapido.innerHTML = opcoesHtml;
    if (selectDoc) selectDoc.innerHTML = opcoesHtml;

    // 4. Renderiza Lista de Chamada
    const containerChamada = document.getElementById('listaChamadaContainer');
    if (containerChamada) {
        containerChamada.innerHTML = alunos.map(a => `
            <div class="py-3 flex items-center justify-between">
                <div>
                    <span class="font-semibold text-slate-900">${a.nome}</span>
                    <span class="ml-2 text-[11px] text-slate-400">${a.turma}</span>
                </div>
                <div class="flex space-x-2">
                    <label class="inline-flex items-center space-x-1 cursor-pointer bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg font-semibold">
                        <input type="radio" name="presenca_${a.id}" checked> <span>Presente</span>
                    </label>
                    <label class="inline-flex items-center space-x-1 cursor-pointer bg-red-50 text-red-600 px-3 py-1 rounded-lg font-semibold">
                        <input type="radio" name="presenca_${a.id}"> <span>Falta</span>
                    </label>
                </div>
            </div>
        `).join('');
    }
}

function selecionarFiltroTurma(turma) {
    turmaFiltroAtual = turma;
    const botoes = document.querySelectorAll('#filtrosTurma button');
    botoes.forEach(btn => {
        if ((turma === 'TODAS' && btn.innerText === 'Todas') || btn.innerText === turma) {
            btn.className = "px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white";
        } else {
            btn.className = "px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200";
        }
    });
    renderizarSistema();
}

function filtrarTabelaAlunos() {
    navegarPara('alunos-turmas');
    renderizarSistema();
}

// ==========================================
// 4. MODAL DE NOVA MATRÍCULA
// ==========================================
function abrirModalMatricula() {
    const modal = document.getElementById('modalNovaMatricula');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function fecharModalMatricula() {
    const modal = document.getElementById('modalNovaMatricula');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function salvarNovoAluno(event) {
    event.preventDefault();
    const alunos = obterAlunos();

    const nome = document.getElementById('novoNome').value.trim();
    const nascBruto = document.getElementById('novoNascimento').value;
    const partesData = nascBruto.split('-');
    const nascimento = partesData.length === 3 ? `${partesData[2]}/${partesData[1]}/${partesData[0]}` : nascBruto;
    const turma = document.getElementById('novaTurma').value;
    const responsavel = document.getElementById('novoResponsavel').value.trim();

    const novoId = alunos.length + 1;
    const novaMatricula = `2026•0${60 + novoId}`;

    const novoAluno = {
        id: Date.now(),
        matricula: novaMatricula,
        nome,
        nascimento,
        turma,
        responsavel,
        status: "Ativo",
        notaMedia: "9,0",
        frequencia: "100%"
    };

    alunos.unshift(novoAluno); // Coloca no topo da tabela
    salvarListaAlunos(alunos);
    fecharModalMatricula();
    document.getElementById('formNovaMatricula').reset();
    renderizarSistema();
    navegarPara('alunos-turmas');
}

// ==========================================
// 5. EMISSÃO DE DOCUMENTOS (3 MODELOS A4)
// ==========================================
function abrirDocDireto(alunoId, tipoDoc) {
    navegarPara('documentos');
    document.getElementById('docSelectAluno').value = alunoId;
    document.getElementById('docSelectTipo').value = tipoDoc;
    atualizarPreviewDocumento();
}

function atalhoEmitirDoc(tipoDoc) {
    const alunoId = document.getElementById('selectAlunoRapido').value;
    abrirDocDireto(alunoId, tipoDoc);
}

function atualizarPreviewDocumento() {
    const alunos = obterAlunos();
    const alunoId = document.getElementById('docSelectAluno')?.value;
    const tipo = document.getElementById('docSelectTipo')?.value || 'escolaridade';
    const aluno = alunos.find(a => String(a.id) === String(alunoId)) || alunos[0];

    const containerParecer = document.getElementById('campoParecerContainer');
    if (containerParecer) {
        if (tipo === 'historico') containerParecer.classList.remove('hidden');
        else containerParecer.classList.add('hidden');
    }

    const parecerTexto = document.getElementById('docInputParecer')?.value || '';
    const dataHoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

    let tituloDoc = "";
    let corpoHtml = "";

    if (tipo === 'escolaridade') {
        tituloDoc = "ATESTADO DE ESCOLARIDADE";
        corpoHtml = `
            <p class="leading-relaxed text-sm text-justify mb-6">
                Atestamos, para os devidos fins de direito, que o(a) aluno(a) <strong>${aluno.nome.toUpperCase()}</strong>, 
                nascido(a) em <strong>${aluno.nascimento}</strong>, filho(a) ou sob responsabilidade legal de 
                <strong>${aluno.responsavel}</strong>, encontra-se regularmente matriculado(a) e frequentando as aulas 
                nesta instituição de ensino no ano letivo vigente, cursando a série/turma <strong>${aluno.turma}</strong>, 
                com frequência acumulada de <strong>${aluno.frequencia}</strong> até a presente data.
            </p>
            <p class="leading-relaxed text-sm text-justify">
                Por ser expressão da verdade, firmamos o presente documento para que produza seus efeitos legais.
            </p>
        `;
    } else if (tipo === 'transferencia') {
        tituloDoc = "ATESTADO DE TRANSFERÊNCIA ESCOLAR";
        corpoHtml = `
            <p class="leading-relaxed text-sm text-justify mb-6">
                Declaramos, para fins de transferência entre instituições de ensino, que o(a) aluno(a) 
                <strong>${aluno.nome.toUpperCase()}</strong>, nascido(a) em <strong>${aluno.nascimento}</strong>, 
                sob responsabilidade de <strong>${aluno.responsavel}</strong>, esteve regularmente matriculado(a) 
                neste Educandário na turma <strong>${aluno.turma}</strong>, solicitando seu desligamento nesta data.
            </p>
            <p class="leading-relaxed text-sm text-justify">
                Informamos que o(a) referido(a) estudante encontra-se apto(a) a prosseguir seus estudos na série correspondente, 
                não havendo pendências documentais junto à secretaria desta unidade escolar.
            </p>
        `;
    } else if (tipo === 'historico') {
        tituloDoc = "HISTÓRICO ESCOLAR E RELATÓRIO DE DESENVOLVIMENTO";
        corpoHtml = `
            <div class="mb-4 text-xs border border-slate-300 rounded-lg p-3 bg-slate-50 space-y-1">
                <div><strong>ALUNO(A):</strong> ${aluno.nome.toUpperCase()} | <strong>MATRÍCULA:</strong> ${aluno.matricula}</div>
                <div><strong>DATA DE NASCIMENTO:</strong> ${aluno.nascimento} | <strong>SÉRIE/TURMA ATUAL:</strong> ${aluno.turma}</div>
                <div><strong>RESPONSÁVEL LEGAL:</strong> ${aluno.responsavel}</div>
            </div>

            <h4 class="text-xs font-bold uppercase text-slate-700 mb-2">1. Quadro de Aproveitamento e Frequência</h4>
            <table class="w-full text-xs border-collapse border border-slate-300 mb-5">
                <thead class="bg-slate-100">
                    <tr>
                        <th class="border border-slate-300 p-2 text-left">Série / Etapa</th>
                        <th class="border border-slate-300 p-2 text-center">Avaliação / Conceito</th>
                        <th class="border border-slate-300 p-2 text-center">Frequência</th>
                        <th class="border border-slate-300 p-2 text-center">Situação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="border border-slate-300 p-2">${aluno.turma}</td>
                        <td class="border border-slate-300 p-2 text-center font-semibold">${aluno.notaMedia}</td>
                        <td class="border border-slate-300 p-2 text-center">${aluno.frequencia}</td>
                        <td class="border border-slate-300 p-2 text-center text-emerald-700 font-semibold">Regular / Cursando</td>
                    </tr>
                </tbody>
            </table>

            <h4 class="text-xs font-bold uppercase text-slate-700 mb-1">2. Parecer Descritivo (Pedagogia & Psicologia)</h4>
            <div class="border border-slate-300 rounded-lg p-3 text-xs leading-relaxed text-justify bg-white">
                ${parecerTexto}
            </div>
        `;
    }

    const folha = document.getElementById('areaImpressaoDocumento');
    if (folha) {
        folha.innerHTML = `
            <div>
                <!-- Timbre Oficial -->
                <div class="flex items-center space-x-4 border-b-2 border-blue-800 pb-4 mb-8">
                    <img src="logo-maezeferina.jpg" onerror="this.src='logoeducandarioEMZ.jpg'" class="w-16 h-16 object-contain">
                    <div>
                        <h2 class="text-base font-bold text-blue-900 uppercase">Educandário Espírita Mãe Zeferina</h2>
                        <p class="text-[11px] text-slate-600">Instituição Filantrópica • Educação Infantil ao Ensino Fundamental I</p>
                        <p class="text-[10px] text-slate-500">Rua Cabriúva, nº 14, Bairro Parque Geórgia • Cuiabá - MT • Tel: (65) 3044-4557</p>
                    </div>
                </div>

                <!-- Título do Documento -->
                <h3 class="text-center text-sm font-bold tracking-wide text-slate-900 underline mb-8">${tituloDoc}</h3>

                <!-- Corpo Dinâmico -->
                ${corpoHtml}
            </div>

            <!-- Rodapé e Assinatura -->
            <div class="mt-12 pt-6 text-center text-xs">
                <p class="text-right mb-12">Cuiabá - MT, ${dataHoje}.</p>
                <div class="w-64 mx-auto border-t border-slate-400 pt-2">
                    <p class="font-bold text-slate-900">Neide</p>
                    <p class="text-[11px] text-slate-500">Diretoria / Secretaria Escolar</p>
                    <p class="text-[10px] text-slate-400">Educandário Espírita Mãe Zeferina</p>
                </div>
            </div>
        `;
    }
}

function imprimirDocumento() {
    const kpiDocs = document.getElementById('kpiDocsEmitidos');
    if (kpiDocs) kpiDocs.innerText = parseInt(kpiDocs.innerText) + 1;
    window.print();
}

function salvarChamadaSimulada() {
    alert("Chamada diária registrada com sucesso no sistema!");
}

// Inicializa tudo ao abrir o Dashboard
document.addEventListener('DOMContentLoaded', () => {
    renderizarSistema();
});