
const listaSolicitacoes = document.getElementById(
    "listaSolicitacoes"
);

// Formata a data.
function formatarData(data) {
    if (!data) {
        return "Data não informada";
    }

    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
        return "Data inválida";
    }

    return dataConvertida.toLocaleString("pt-BR");
}

// Carrega as solicitações diretamente da API.
async function carregarSolicitacoes() {
    listaSolicitacoes.textContent =
        "Carregando solicitações...";

    try {
        const [solicitacoes, objetos, usuarios] =
            await Promise.all([
                listarSolicitacoes(),
                listarObjetos(),
                listarUsuarios()
            ]);

        const mapaObjetos = new Map(
            objetos.map(objeto => [
                Number(objeto.id),
                objeto
            ])
        );

        const mapaUsuarios = new Map(
            usuarios.map(usuario => [
                Number(usuario.id),
                usuario
            ])
        );

        exibirSolicitacoes(
            solicitacoes,
            mapaObjetos,
            mapaUsuarios
        );

    } catch (erro) {
        console.error(
            "Erro ao carregar solicitações:",
            erro
        );

        listaSolicitacoes.textContent =
            `Erro ao carregar solicitações: ${erro.message}`;
    }
}

// Exibe os pedidos de devolução.
function exibirSolicitacoes(
    solicitacoes,
    mapaObjetos,
    mapaUsuarios
) {
    listaSolicitacoes.innerHTML = "";

    if (!solicitacoes || solicitacoes.length === 0) {
        listaSolicitacoes.textContent =
            "Nenhuma solicitação de devolução encontrada.";

        return;
    }

    [...solicitacoes].reverse().forEach(solicitacao => {

        const objeto = mapaObjetos.get(
            Number(solicitacao.objetoId)
        );

        const usuario = mapaUsuarios.get(
            Number(solicitacao.usuarioId)
        );

        const card = document.createElement("div");

        card.classList.add(
            "card-objeto",
            "card-solicitacao"
        );

        // Nome do objeto.
        const titulo = document.createElement("h3");

        titulo.textContent =
            objeto?.nome || "Objeto não encontrado";

        // Nome do solicitante.
        const solicitante = document.createElement("p");

        solicitante.textContent =
            `Solicitante: ${usuario?.nome || "Não informado"}`;

        // E-mail do solicitante.
        const email = document.createElement("p");

        email.textContent =
            `E-mail: ${usuario?.email || "Não informado"}`;

        // Justificativa da devolução.
        const justificativa = document.createElement("p");

        justificativa.textContent =
            `Comprovação: ${solicitacao.comprovacao || "Não informada."}`;

        // Data da solicitação.
        const data = document.createElement("p");

        data.textContent =
            `Data: ${formatarData(solicitacao.createdAt)}`;

        // Status da solicitação.
        const status = document.createElement("p");

        const valorStatus =
            solicitacao.status || "pendente";

        status.textContent = `Status: ${valorStatus}`;

        status.classList.add("status-solicitacao");

        if (valorStatus === "pendente") {
            status.classList.add("status-pendente");

        } else if (valorStatus === "aprovada") {
            status.classList.add("status-aprovado");

        } else if (valorStatus === "recusada") {
            status.classList.add("status-recusado");
        }

        card.append(
            titulo,
            solicitante,
            email,
            justificativa,
            data,
            status
        );

        // Link para os detalhes do objeto.
        if (objeto) {
            const linkDetalhes =
                document.createElement("a");

            linkDetalhes.classList.add("botao");

            linkDetalhes.textContent = "Ver objeto";

            linkDetalhes.href =
                `detalhes.html?id=${encodeURIComponent(objeto.id)}`;

            card.appendChild(linkDetalhes);
        }

        listaSolicitacoes.appendChild(card);
    });
}

carregarSolicitacoes();
