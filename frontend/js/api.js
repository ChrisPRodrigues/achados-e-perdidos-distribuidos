
// Endereço centralizado do back-end
const API_URL =
    "https://achados-e-perdidos-distribuidos.onrender.com";

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

    if (dados !== null) {
        configuracao.headers["Content-Type"] =
            "application/json";

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
    return requisicaoAPI(
        `/objetos/${encodeURIComponent(id)}`
    );
}

function cadastrarObjeto(dados) {
    return requisicaoAPI(
        "/objetos",
        "POST",
        dados
    );
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

/* ==========================================
   SOLICITAÇÕES
   ========================================== */

function listarSolicitacoes() {
    return requisicaoAPI("/solicitacoes");
}

function cadastrarSolicitacao(dados) {
    return requisicaoAPI(
        "/solicitacoes",
        "POST",
        dados
    );
}
