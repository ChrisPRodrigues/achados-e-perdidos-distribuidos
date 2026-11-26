
const listaSolicitacoes = document.getElementById(
    "listaSolicitacoes"
);

const mensagemGerenciamento = document.getElementById(
    "mensagemGerenciamento"
);

const usuarioLogado = obterUsuarioLogado();
const podeGerenciar = usuarioLogado?.tipo === "docente";

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

// Carrega as solicitações.
async function carregarSolicitacoes() {
    listaSolicitacoes.textContent =
        "Carregando solicitações...";

    try {
        const [solicitacoes, objetos, usuarios] =
            await Promise.all([
                listarSolicitacoes(),
                listarObjetos(),
                listarUsuarios().catch(erro => {
                    console.warn(
                        "Não foi possível carregar os usuários:",
                        erro
                    );

                    return [];
                })
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

// Altera o status de uma solicitação.
async function alterarStatusSolicitacao(
    id,
    status,
    botoes
) {
    if (!podeGerenciar) {
        mensagemGerenciamento.textContent =
            "Somente docentes podem gerenciar solicitações.";

        return;
    }

    const acao = status === "aprovada"
        ? "aprovar"
        : "recusar";

    const confirmado = confirm(
        `Tem certeza de que deseja ${acao} esta solicitação?`
    );

    if (!confirmado) {
        return;
    }

    botoes.forEach(botao => {
        botao.disabled = true;
    });

    mensagemGerenciamento.textContent =
        "Atualizando solicitação...";

    try {
        await atualizarSolicitacao(id, { status });

        mensagemGerenciamento.textContent =
            status === "aprovada"
                ? "Solicitação aprovada com sucesso!"
                : "Solicitação recusada com sucesso!";

        await carregarSolicitacoes();

    } catch (erro) {
        console.error(
            "Erro ao atualizar solicitação:",
            erro
        );

        mensagemGerenciamento.textContent =
            `Não foi possível atualizar: ${erro.message}`;

        botoes.forEach(botao => {
            botao.disabled = false;
        });
    }
}

// Exibe as solicitações.
function exibirSolicitacoes(
    solicitacoes,
    mapaObjetos,
    mapaUsuarios
) {
    listaSolicitacoes.innerHTML = "";

    if (
        !Array.isArray(solicitacoes) ||
        solicitacoes.length === 0
    ) {
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

        const titulo = document.createElement("h3");

        titulo.textContent =
            objeto?.nome || "Objeto não encontrado";

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

        data.textContent =
            `Data: ${formatarData(solicitacao.createdAt)}`;

        const valorStatus =
            solicitacao.status || "pendente";

        const status = document.createElement("p");

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

        if (objeto) {
            const linkDetalhes =
                document.createElement("a");

            linkDetalhes.classList.add("botao");

            linkDetalhes.textContent = "Ver objeto";

            linkDetalhes.href =
                `detalhes.html?id=${encodeURIComponent(objeto.id)}`;

            card.appendChild(linkDetalhes);
        }

        // Somente docentes podem aprovar ou recusar.
        if (
            podeGerenciar &&
            valorStatus === "pendente"
        ) {
            const acoes = document.createElement("div");

            acoes.classList.add("acoes-solicitacao");

            const botaoAprovar =
                document.createElement("button");

            botaoAprovar.type = "button";
            botaoAprovar.textContent = "Aprovar";

            const botaoRecusar =
                document.createElement("button");

            botaoRecusar.type = "button";
            botaoRecusar.textContent = "Recusar";

            botaoRecusar.classList.add("botao-recusar");

            const botoes = [
                botaoAprovar,
                botaoRecusar
            ];

            botaoAprovar.addEventListener("click", () => {
                alterarStatusSolicitacao(
                    solicitacao.id,
                    "aprovada",
                    botoes
                );
            });

            botaoRecusar.addEventListener("click", () => {
                alterarStatusSolicitacao(
                    solicitacao.id,
                    "recusada",
                    botoes
                );
            });

            acoes.append(
                botaoAprovar,
                botaoRecusar
            );

            card.appendChild(acoes);
        }

        listaSolicitacoes.appendChild(card);
    });
}

carregarSolicitacoes();
