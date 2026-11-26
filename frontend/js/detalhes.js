
const detalhesObjeto = document.getElementById("detalhesObjeto");
const secaoDevolucao = document.getElementById("secaoDevolucao");
const formDevolucao = document.getElementById("formDevolucao");

const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

let objetoAtual = null;

// Carrega os detalhes diretamente da API.
async function carregarDetalhes() {
    detalhesObjeto.textContent = "Carregando informações...";
    secaoDevolucao.classList.add("oculto");

    objetoAtual = null;

    try {
        if (
            !id ||
            !/^\d+$/.test(id) ||
            !Number.isSafeInteger(Number(id)) ||
            Number(id) <= 0
        ) {
            throw new Error(
                "Identificador do objeto inválido."
            );
        }

        const [objeto, categorias, locais] =
            await Promise.all([
                buscarObjetoPorId(id),
                listarCategorias(),
                listarLocais()
            ]);

        const mapaCategorias = new Map(
            categorias.map(item => [
                Number(item.id),
                item.nome
            ])
        );

        const mapaLocais = new Map(
            locais.map(item => [
                Number(item.id),
                item.nome
            ])
        );

        objetoAtual = objeto;

        exibirDetalhes(
            objetoAtual,
            mapaCategorias,
            mapaLocais
        );

    } catch (erro) {
        objetoAtual = null;

        console.error("Erro ao carregar detalhes:", erro);

        detalhesObjeto.textContent =
            `Erro ao carregar o objeto: ${erro.message}`;
    }
}

// Exibe as informações do objeto.
function exibirDetalhes(
    objeto,
    mapaCategorias,
    mapaLocais
) {
    const titulo = document.createElement("h3");
    titulo.textContent = objeto.nome;

    const elementos = [titulo];

    // Exibe a foto ampliada, caso exista.
    if (
        typeof objeto.foto === "string" &&
        /^data:image\/(jpeg|png|webp);base64,/.test(objeto.foto)
    ) {
        const containerFoto =
            document.createElement("div");

        containerFoto.classList.add("foto-detalhes");

        const imagem = document.createElement("img");

        imagem.src = objeto.foto;
        imagem.alt = `Foto do objeto ${objeto.nome}`;
        imagem.classList.add("imagem-detalhes");

        imagem.onerror = () => containerFoto.remove();

        containerFoto.appendChild(imagem);
        elementos.push(containerFoto);
    }

    const categoria = document.createElement("p");

    categoria.textContent =
        `Categoria: ${mapaCategorias.get(Number(objeto.categoriaId)) || "Não informada"}`;

    const local = document.createElement("p");

    local.textContent =
        `Local: ${mapaLocais.get(Number(objeto.localId)) || "Não informado"}`;

    const descricao = document.createElement("p");

    descricao.textContent =
        `Descrição: ${objeto.descricao || "Sem descrição."}`;

    const status = document.createElement("p");

    status.textContent =
        `Status: ${objeto.status || "Não informado"}`;

    elementos.push(
        categoria,
        local,
        descricao,
        status
    );

    // Exibe a data em que o objeto foi encontrado.
    if (objeto.dataEncontrado) {
        const data = new Date(objeto.dataEncontrado);

        if (!Number.isNaN(data.getTime())) {
            const campoData = document.createElement("p");

            campoData.textContent =
                `Data encontrado: ${data.toLocaleDateString("pt-BR")}`;

            elementos.push(campoData);
        }
    }

    // Impede solicitações para objetos já devolvidos.
    if (objeto.status === "devolvido") {
        const aviso = document.createElement("p");

        aviso.textContent =
            "Este objeto já foi devolvido.";

        elementos.push(aviso);

    } else {
        const btnSolicitar =
            document.createElement("button");

        btnSolicitar.type = "button";
        btnSolicitar.textContent = "Solicitar devolução";

        btnSolicitar.addEventListener("click", () => {
            secaoDevolucao.classList.toggle("oculto");
        });

        elementos.push(btnSolicitar);
    }

    detalhesObjeto.replaceChildren(...elementos);
}

// Envia a solicitação de devolução pela API.
formDevolucao.addEventListener("submit", async evento => {
    evento.preventDefault();

    if (!objetoAtual) {
        alert("Não foi possível identificar o objeto.");
        return;
    }

    if (objetoAtual.status === "devolvido") {
        alert("Este objeto já foi devolvido.");
        return;
    }

    const botao = formDevolucao.querySelector(
        'button[type="submit"]'
    );

    botao.disabled = true;
    botao.textContent = "Enviando...";

    try {
        const dados = new FormData(formDevolucao);

        const nome = dados.get("nome").trim();

        const email = dados
            .get("email")
            .trim()
            .toLowerCase();

        const comprovacao =
            dados.get("comprovacao").trim();

        if (!nome || !email || !comprovacao) {
            throw new Error(
                "Preencha todos os campos obrigatórios."
            );
        }

        // Consulta os usuários pela função do api.js.
        const usuarios = await listarUsuarios();

        const usuario = usuarios.find(
            item =>
                item.email.trim().toLowerCase() === email
        );

        if (!usuario) {
            throw new Error(
                "Este e-mail não está cadastrado. Procure o responsável pelo sistema para realizar seu cadastro."
            );
        }

        if (
            usuario.nome.trim().toLowerCase() !==
            nome.toLowerCase()
        ) {
            throw new Error(
                "O nome informado não corresponde ao usuário cadastrado."
            );
        }

        const novaSolicitacao = {
            usuarioId: Number(usuario.id),
            objetoId: Number(objetoAtual.id),
            comprovacao,
            status: "pendente"
        };

        // Envia a solicitação pela função do api.js.
        await cadastrarSolicitacao(novaSolicitacao);

        alert("Solicitação registrada com sucesso!");

        formDevolucao.reset();

        secaoDevolucao.classList.add("oculto");

    } catch (erro) {
        console.error("Erro na solicitação:", erro);

        alert(
            erro.message ||
            "Erro ao enviar solicitação."
        );

    } finally {
        botao.disabled = false;
        botao.textContent = "Enviar Solicitação";
    }
});

carregarDetalhes();
