
const API = "http://localhost:3000";

const listaSolicitacoes = document.getElementById(
    "listaSolicitacoes"
);

// Formata a data.
function formatarData(data) {
    if (!data) return "Data não informada";

    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
        return "Data inválida";
    }

    return dataConvertida.toLocaleString("pt-BR");
}

// Busca os dados na API.
async function carregarSolicitacoes() {
    listaSolicitacoes.textContent = "Carregando solicitações...";

    try {
        const [
            solicitacoesResposta,
            objetosResposta,
            usuariosResposta
        ] = await Promise.all([
            fetch(`${API}/solicitacoes`),
            fetch(`${API}/objetos`),
            fetch(`${API}/usuarios`)
        ]);

        if (
            !solicitacoesResposta.ok ||
            !objetosResposta.ok ||
            !usuariosResposta.ok
        ) {
            throw new Error("Não foi possível carregar as solicitações.");
        }

        const solicitacoes = await solicitacoesResposta.json();
        const objetos = await objetosResposta.json();
        const usuarios = await usuariosResposta.json();

        exibirSolicitacoes(solicitacoes, objetos, usuarios);

    } catch (erro) {
        console.error("Erro ao carregar solicitações:", erro);

        listaSolicitacoes.textContent =
            "Erro ao carregar solicitações. Verifique se o servidor está funcionando.";
    }
}

// Exibe as solicitações.
function exibirSolicitacoes(solicitacoes, objetos, usuarios) {
    listaSolicitacoes.innerHTML = "";

    if (!solicitacoes || solicitacoes.length === 0) {
        listaSolicitacoes.textContent =
            "Nenhuma solicitação de devolução encontrada.";
        return;
    }

    [...solicitacoes].reverse().forEach(solicitacao => {

        const objeto = objetos.find(
            item => Number(item.id) === Number(solicitacao.objetoId)
        );

        const usuario = usuarios.find(
            item => Number(item.id) === Number(solicitacao.usuarioId)
        );

        const card = document.createElement("div");
        card.classList.add("card-objeto", "card-solicitacao");

        const titulo = document.createElement("h3");
        titulo.textContent = objeto
            ? objeto.nome
            : "Objeto não encontrado";

        const solicitante = document.createElement("p");
        solicitante.textContent =
            `Solicitante: ${usuario?.nome || "Não informado"}`;

        const email = document.createElement("p");
        email.textContent =
            `E-mail: ${usuario?.email || "Não informado"}`;

        const justificativa = document.createElement("p");
        justificativa.textContent =
            `Comprovação: ${solicitacao.comprovacao || "Não informada."}`;

        const data = document.createElement("p");
        data.textContent = `Data: ${formatarData(solicitacao.createdAt)}`;

        const status = document.createElement("p");
        const valorStatus = solicitacao.status || "pendente";

        status.textContent = `Status: ${valorStatus}`;
        status.classList.add("status-solicitacao");

        if (valorStatus === "pendente") {
            status.classList.add("status-pendente");
        } else if (valorStatus === "aprovada") {
            status.classList.add("status-aprovado");
        } else if (valorStatus === "recusada") {
            status.classList.add("status-recusado");
        }

        const linkDetalhes = document.createElement("a");
        linkDetalhes.classList.add("botao");
        linkDetalhes.textContent = "Ver objeto";

        if (objeto) {
            linkDetalhes.href =
                `detalhes.html?id=${encodeURIComponent(objeto.id)}`;
        } else {
            linkDetalhes.style.display = "none";
        }

        card.append(
            titulo,
            solicitante,
            email,
            justificativa,
            data,
            status,
            linkDetalhes
        );

        listaSolicitacoes.appendChild(card);
    });
}

carregarSolicitacoes();
