
const API_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000"
        : "https://achados-e-perdidos-distribuidos.onrender.com";

/* ==========================================
   AUTENTICAÇÃO
   ========================================== */

function salvarSessao(dados) {
    sessionStorage.setItem("access_token", dados.access_token);
    sessionStorage.setItem("usuario", JSON.stringify(dados.usuario));
}

function obterToken() {
    return sessionStorage.getItem("access_token");
}

function obterUsuarioLogado() {
    const usuario = sessionStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
}

function encerrarSessao() {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("usuario");
}

async function fazerLogin(email, senha) {
    const resultado = await requisicaoAPI(
        "/auth/login",
        "POST",
        { email, senha }
    );

    salvarSessao(resultado);
    return resultado;
}

/* ==========================================
   REQUISIÇÃO GENÉRICA
   ========================================== */

async function requisicaoAPI(
    endpoint,
    metodo = "GET",
    dados = null
) {
    const configuracao = {
        method: metodo,
        headers: {
            "Accept": "application/json"
        }
    };

    const token = obterToken();

    if (token) {
        configuracao.headers["Authorization"] = `Bearer ${token}`;
    }

    if (dados !== null) {
        configuracao.headers["Content-Type"] = "application/json";
        configuracao.body = JSON.stringify(dados);
    }

    let resposta;

    try {
        resposta = await fetch(
            `${API_URL}${endpoint}`,
            configuracao
        );
    } catch (erro) {
        console.error("Erro de conexão:", erro);

        throw new Error(
            "Não foi possível conectar ao servidor."
        );
    }

    const texto = await resposta.text();

    let resultado = null;

    if (texto) {
        try {
            resultado = JSON.parse(texto);
        } catch {
            resultado = texto;
        }
    }

    if (!resposta.ok) {
        let mensagem =
            resultado?.message ||
            `Erro na requisição (${resposta.status}).`;

        if (Array.isArray(mensagem)) {
            mensagem = mensagem.join("\n");
        }

        throw new Error(mensagem);
    }

    return resultado;
}

/* ==========================================
   OBJETOS
   ========================================== */

function listarObjetos() {
    return requisicaoAPI("/objetos");
}

function buscarObjetoPorId(id) {
    return requisicaoAPI(`/objetos/${encodeURIComponent(id)}`);
}

function cadastrarObjeto(dados) {
    return requisicaoAPI("/objetos", "POST", dados);
}

/* ==========================================
   CATEGORIAS
   ========================================== */

function listarCategorias() {
    return requisicaoAPI("/categorias");
}

/* ==========================================
   LOCAIS
   ========================================== */

function listarLocais() {
    return requisicaoAPI("/locais");
}

/* ==========================================
   USUÁRIOS
   ========================================== */

function listarUsuarios() {
    return requisicaoAPI("/usuarios");
}

function cadastrarUsuario(dados) {
    return requisicaoAPI("/usuarios", "POST", dados);
}

/* ==========================================
   SOLICITAÇÕES
   ========================================== */

function listarSolicitacoes() {
    return requisicaoAPI("/solicitacoes");
}

function cadastrarSolicitacao(dados) {
    return requisicaoAPI("/solicitacoes", "POST", dados);
}

function atualizarSolicitacao(id, dados) {
    return requisicaoAPI(
        `/solicitacoes/${encodeURIComponent(id)}`,
        "PATCH",
        dados
    );
}
