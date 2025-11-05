const ARQUIVO_FILMES = 'filmes_data';
const MAX_REGISTROS = 50;

class Filme {
    constructor(titulo, genero, duracao) {
        this.titulo = titulo;
        this.genero = genero;
        this.duracao = duracao;
    }
}

function incluirFilme() {
    const titulo = document.getElementById('titulo').value.trim();
    const genero = document.getElementById('genero').value.trim();
    const duracao = document.getElementById('duracao').value.trim();

    if (!titulo || !genero || !duracao) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const filmes = obterFilmes();

    if (filmes.length >= MAX_REGISTROS) {
        alert(`Limite de ${MAX_REGISTROS} filmes atingido!`);
        return;
    }

    const duracaoFormatada = formatarDuracao(duracao);
    const novoFilme = new Filme(titulo, genero, duracaoFormatada);

    filmes.push(novoFilme);
    salvarFilmes(filmes);

    document.getElementById('titulo').value = '';
    document.getElementById('genero').value = '';
    document.getElementById('duracao').value = '';

    alert('Filme cadastrado com sucesso!');
    listarFilmes();
}

function listarFilmes() {
    const filmes = obterFilmes();
    const conteudo = document.getElementById('conteudos');

    if (filmes.length === 0) {
        conteudo.innerHTML = '<p>Nenhum filme cadastrado.</p>';
        return;
    }

    let html = `<h2>📋 Lista de Filmes (${filmes.length}/${MAX_REGISTROS})</h2>`;
    
    filmes.forEach((filme, index) => {
        html += `
            <div class="filme-item">
                <h3>🎬 ${filme.titulo}</h3>
                <p><strong>Gênero:</strong> ${filme.genero}</p>
                <p><strong>Duração:</strong> ${filme.duracao}</p>
                <p><strong>ID:</strong> ${index + 1}</p>
            </div>
        `;
    });

    conteudo.innerHTML = html;
}

function removerArquivo() {
    if (confirm('Tem certeza que deseja excluir TODOS os filmes? Esta ação não pode ser desfeita!')) {
        localStorage.removeItem(ARQUIVO_FILMES);
        document.getElementById('conteudos').innerHTML = '<p>✅ Todos os filmes foram removidos!</p>';
    }
}

function obterFilmes() {
    const dados = localStorage.getItem(ARQUIVO_FILMES);
    return dados ? JSON.parse(dados) : [];
}

function salvarFilmes(filmes) {
    localStorage.setItem(ARQUIVO_FILMES, JSON.stringify(filmes));
}

function mostrarIncluir() {
    const conteudo = document.getElementById('conteudos');
    conteudo.innerHTML = `
        <h2>📝 Cadastrar Novo Filme</h2>
        <div class="form-group">
            <label>Título:</label><br>
            <input type="text" id="titulo" placeholder="Ex: O Poderoso Chefão">
        </div>
        <div class="form-group">
            <label>Gênero:</label><br>
            <input type="text" id="genero" placeholder="Ex: Drama, Ação, Comédia" oninput="validarGenero(this)">
        </div>
        <div class="form-group">
            <label>Duração:</label><br>
            <input type="text" id="duracao" placeholder="Ex: 1:49 ou 120">
        </div>
        <button onclick="incluirFilme()">💾 Salvar Filme</button>
        <button onclick="listarFilmes()">↩️ Voltar</button>
    `;
}

function validarGenero(input) {
    input.value = input.value.replace(/[^a-zA-ZÀ-ÿ\s,]/g, '');
}

function formatarDuracao(duracao) {
    if (duracao.includes(':')) {
        const [h, m] = duracao.split(':').map(Number);
        return `${h} hora${h !== 1 ? 's' : ''} e ${m} minuto${m !== 1 ? 's' : ''}`;
    } else {
        const minutos = parseInt(duracao);
        if (isNaN(minutos)) return 'Duração inválida';
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        return `${horas} hora${horas !== 1 ? 's' : ''} e ${mins} minuto${mins !== 1 ? 's' : ''}`;
    }
}

window.onload = function() {
    listarFilmes();
};
