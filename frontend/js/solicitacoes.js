
/* ==========================================
   1. ELEMENTOS DO HTML
   ========================================== */

const listaSolicitacoes = document.getElementById(
    "listaSolicitacoes"
);

/* ==========================================
   2. RECUPERAR DADOS
   ========================================== */

const solicitacoes = JSON.parse(
    localStorage.getItem("solicitacoes")
) || [];

const objetos = JSON.parse(
    localStorage.getItem("objetos")
) || [];

/* ==========================================
   3. FORMATAR DATA
   ========================================== */

function formatarData(data) {
    if (!data) return "Data não informada";

    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
        return "Data inválida";
    }

    return dataConvertida.toLocaleString("pt-BR");
}

/* ==========================================
   4. EXIBIR SOLICITAÇÕES
   ========================================== */

function exibirSolicitacoes() {

    listaSolicitacoes.innerHTML = "";

    if (solicitacoes.length === 0) {
        listaSolicitacoes.textContent =
            "Nenhuma solicitação de devolução encontrada.";
        return;
    }

    // Exibe as solicitações mais recentes primeiro
    [...solicitacoes].reverse().forEach((solicitacao) => {

        // Procura o objeto relacionado
        const objeto = objetos.find(
            (item) => item.id === solicitacao.objetoId
        );

        // Cria o cartão
        const card = document.createElement("div");
        card.classList.add("card-objeto", "card-solicitacao");

        // Título
        const titulo = document.createElement("h3");
        titulo.textContent = objeto
            ? objeto.nome
            : "Objeto não encontrado";

        // Solicitante
        const solicitante = document.createElement("p");
        solicitante.textContent =
            `Solicitante: ${solicitacao.nome || "Não informado"}`;

        // E-mail
        const email = document.createElement("p");
        email.textContent =
            `E-mail: ${solicitacao.email || "Não informado"}`;

        // Justificativa
        const justificativa = document.createElement("p");
        justificativa.textContent =
            `Justificativa: ${
                solicitacao.comprovacao || "Não informada"
            }`;

        // Data
        const data = document.createElement("p");
        data.textContent =
            `Data: ${formatarData(solicitacao.data)}`;

        // Status
        const status = document.createElement("p");

        const valorStatus = solicitacao.status || "pendente";

        status.textContent = `Status: ${valorStatus}`;
        status.classList.add("status-solicitacao");

        if (valorStatus === "pendente") {
            status.classList.add("status-pendente");
        } else if (valorStatus === "aprovado") {
            status.classList.add("status-aprovado");
        } else if (valorStatus === "recusado") {
            status.classList.add("status-recusado");
        }

        // Link para detalhes do objeto
        const linkDetalhes = document.createElement("a");
        linkDetalhes.classList.add("botao");
        linkDetalhes.textContent = "Ver objeto";

        if (objeto) {
            linkDetalhes.href =
                `detalhes.html?id=${encodeURIComponent(objeto.id)}`;
        } else {
            linkDetalhes.style.display = "none";
        }

        // Montagem do cartão
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

/* ==========================================
   5. INICIALIZAÇÃO
   ========================================== */

exibirSolicitacoes();
