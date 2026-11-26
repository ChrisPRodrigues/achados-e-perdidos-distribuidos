
const listaUsuarios = document.getElementById("listaUsuarios");
const mensagemAdmin = document.getElementById("mensagemAdmin");
const botaoSair = document.getElementById("botaoSair");

function verificarAdministrador() {
    const usuario = obterUsuarioLogado();
    const token = obterToken();

    if (!token || !usuario || usuario.tipo !== "admin") {
        window.location.href = "login.html";
        return false;
    }

    return true;
}

function criarCelula(texto) {
    const celula = document.createElement("td");
    celula.textContent = texto ?? "-";
    return celula;
}

function criarBotao(texto, acao, classe = "") {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.textContent = texto;

    if (classe) {
        botao.className = classe;
    }

    botao.addEventListener("click", acao);

    return botao;
}

function formatarTipo(tipo) {
    const tipos = {
        admin: "Administrador",
        aluno: "Aluno",
        docente: "Docente"
    };

    return tipos[tipo] || tipo;
}

function formatarStatus(status) {
    const statusFormatados = {
        ativo: "Ativo",
        pendente: "Pendente",
        aguardando_senha: "Aguardando senha",
        rejeitado: "Rejeitado"
    };

    return statusFormatados[status] || status;
}

async function atualizarStatus(id, status) {
    const confirmacao = confirm(
        status === "ativo"
            ? "Deseja aprovar este docente?"
            : "Deseja rejeitar este cadastro?"
    );

    if (!confirmacao) return;

    try {
        await requisicaoAPI(
            `/usuarios/${id}/status`,
            "PATCH",
            { status }
        );

        mensagemAdmin.textContent =
            status === "ativo"
                ? "Docente aprovado com sucesso!"
                : "Cadastro rejeitado com sucesso!";

        await carregarUsuarios();

    } catch (erro) {
        mensagemAdmin.textContent =
            `Não foi possível atualizar: ${erro.message}`;
    }
}

async function carregarUsuarios() {
    listaUsuarios.replaceChildren();

    const carregando = document.createElement("tr");
    const mensagemCarregando = document.createElement("td");

    mensagemCarregando.colSpan = 5;
    mensagemCarregando.textContent = "Carregando usuários...";
    mensagemCarregando.className = "admin-tabela-vazia";

    carregando.appendChild(mensagemCarregando);
    listaUsuarios.appendChild(carregando);

    try {
        const usuarios = await listarUsuarios();

        listaUsuarios.replaceChildren();

        if (!usuarios || usuarios.length === 0) {
            const linha = document.createElement("tr");
            const celula = document.createElement("td");

            celula.colSpan = 5;
            celula.textContent = "Nenhum usuário cadastrado.";
            celula.className = "admin-tabela-vazia";

            linha.appendChild(celula);
            listaUsuarios.appendChild(linha);

            return;
        }

        usuarios.forEach(usuario => {
            const linha = document.createElement("tr");

            linha.appendChild(criarCelula(usuario.nome));
            linha.appendChild(criarCelula(usuario.email));
            linha.appendChild(criarCelula(formatarTipo(usuario.tipo)));
            linha.appendChild(criarCelula(formatarStatus(usuario.status)));

            const acoes = document.createElement("td");

            if (
                usuario.tipo === "docente" &&
                usuario.status === "pendente"
            ) {
                acoes.appendChild(
                    criarBotao(
                        "Aprovar",
                        () => atualizarStatus(usuario.id, "ativo")
                    )
                );

                acoes.appendChild(
                    criarBotao(
                        "Rejeitar",
                        () => atualizarStatus(usuario.id, "rejeitado"),
                        "botao-rejeitar"
                    )
                );
            } else {
                acoes.textContent = "Sem ações pendentes";
            }

            linha.appendChild(acoes);
            listaUsuarios.appendChild(linha);
        });

    } catch (erro) {
        listaUsuarios.replaceChildren();

        const linha = document.createElement("tr");
        const celula = document.createElement("td");

        celula.colSpan = 5;
        celula.textContent =
            `Erro ao carregar usuários: ${erro.message}`;
        celula.className = "admin-tabela-vazia";

        linha.appendChild(celula);
        listaUsuarios.appendChild(linha);
    }
}

botaoSair.addEventListener("click", () => {
    encerrarSessao();
    window.location.href = "login.html";
});

if (verificarAdministrador()) {
    carregarUsuarios();
}
