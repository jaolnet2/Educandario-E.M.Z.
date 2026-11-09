/**
 * Lógica de Interatividade do Sistema - Educandário Espírita Mãe Zeferina
 * Autor: Equipe de Desenvolvimento / Projeto Escolar
 */

// 1. Função para gerenciar a troca visual das abas de perfil na tela de login
function selecionarPerfil(perfilEscolhido) {
    // Seleciona todos os botões dentro da barra de abas de perfil
    const botoesAbas = document.querySelectorAll('#perfilTabs button');

    botoesAbas.forEach(botao => {
        // Verifica se o texto do botão corresponde ao perfil clicado
        if (botao.innerText.includes(perfilEscolhido)) {
            // Aplica o estilo de aba ativa (fundo branco, sombra leve, texto azul destacado)
            botao.className = "py-2 bg-white rounded-lg shadow-sm text-blue-600 font-semibold text-center transition-all";
        } else {
            // Remove o destaque das outras abas inativas
            botao.className = "py-2 text-center text-slate-600 hover:text-slate-900 transition-all";
        }
    });

    // Opcional: Console log para rastreamento interno de qual painel foi focado
    console.log(`Perfil selecionado para acesso: ${perfilEscolhido}`);
}

// 2. Função de autenticação simulada no envio do formulário de login
function realizarLogin(evento) {
    // Evita o comportamento padrão do formulário (recarregar a página)
    evento.preventDefault();

    // Captura o valor digitado no input de e-mail
    const campoEmail = document.getElementById('emailInput');
    const emailDigitado = campoEmail.value.trim();

    // Validação básica de segurança contra campos vazios
    if (!emailDigitado) {
        alert('Por favor, insira um e-mail válido para continuar.');
        return;
    }

    // Armazena temporariamente no navegador o e-mail do colaborador logado
    // (Útil caso queiramos exibir o nome ou o e-mail na barra superior do dashboard depois)
    localStorage.setItem('usuarioLogado', emailDigitado);

    // Feedback visual rápido antes da transição (opcional)
    console.log(`Autenticando usuário: ${emailDigitado}... Redirecionando para o painel.`);

    // Redireciona o navegador para o painel principal da escola
    window.location.href = 'dashboard.html';
}

// 3. Executado automaticamente assim que o DOM (HTML) for totalmente carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema do Educandário Mãe Zeferina inicializado com sucesso.");

    // Se estivermos na página do Dashboard, podemos recuperar o usuário logado do localStorage
    const elementoSaudacao = document.querySelector('header h1');
    const usuarioSalvo = localStorage.getItem('usuarioLogado');

    if (elementoSaudacao && usuarioSalvo) {
        console.log(`Sessão ativa para: ${usuarioSalvo}`);
    }
});