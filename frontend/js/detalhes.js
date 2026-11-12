
const API = "http://localhost:3000";

const detalhesObjeto = document.getElementById("detalhesObjeto");
const secaoDevolucao = document.getElementById("secaoDevolucao");
const formDevolucao = document.getElementById("formDevolucao");

const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

let objetoAtual = null;

async function carregarDetalhes() {
    try {
        if (!id || !/^\d+$/.test(id)) {
            throw new Error("Identificador do objeto inválido.");
        }

        const [objetoResposta, categoriasResposta, locaisResposta] =
            await Promise.all([
                fetch(`${API}/objetos/${id}`),
                fetch(`${API}/categorias`),
                fetch(`${API}/locais`)
            ]);

        if (
            !objetoResposta.ok ||
            !categoriasResposta.ok ||
            !locaisResposta.ok
        ) {
            throw new Error("Não foi possível carregar os detalhes do objeto.");
        }

        objetoAtual = await objetoResposta.json();

        const categorias = await categoriasResposta.json();
        const locais = await locaisResposta.json();

        const mapaCategorias = new Map(
            categorias.map(item => [Number(item.id), item.nome])
        );

        const mapaLocais = new Map(
            locais.map(item => [Number(item.id), item.nome])
        );

        exibirDetalhes(objetoAtual, mapaCategorias, mapaLocais);

    } catch (erro) {
        console.error(erro);
        detalhesObjeto.textContent = erro.message;
    }
}

function exibirDetalhes(objeto, mapaCategorias, mapaLocais) {
    const titulo = document.createElement("h3");
    titulo.textContent = objeto.nome;

    const elementos = [titulo];

    if (objeto.foto) {
        const imagem = document.createElement("img");
        imagem.src = objeto.foto;
        imagem.alt = `Foto do objeto ${objeto.nome}`;
        imagem.classList.add("imagem-detalhes");

        elementos.push(imagem);
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
    status.textContent = `Status: ${objeto.status}`;

    const btnSolicitar = document.createElement("button");
    btnSolicitar.type = "button";
    btnSolicitar.textContent = "Solicitar devolução";

    btnSolicitar.addEventListener("click", () => {
        secaoDevolucao.classList.toggle("oculto");
    });

    elementos.push(
        categoria,
        local,
        descricao,
        status,
        btnSolicitar
    );

    detalhesObjeto.replaceChildren(...elementos);
}

formDevolucao.addEventListener("submit", async evento => {
    evento.preventDefault();

    if (!objetoAtual) {
        alert("Não foi possível identificar o objeto.");
        return;
    }

    const botao = formDevolucao.querySelector('button[type="submit"]');
    botao.disabled = true;
    botao.textContent = "Enviando...";

    try {
        const dados = new FormData(formDevolucao);

        const nome = dados.get("nome").trim();
        const email = dados.get("email").trim().toLowerCase();
        const comprovacao = dados.get("comprovacao").trim();

        const respostaUsuarios = await fetch(`${API}/usuarios`);

        if (!respostaUsuarios.ok) {
            throw new Error("Não foi possível consultar os usuários.");
        }

        const usuarios = await respostaUsuarios.json();

        const usuario = usuarios.find(
            item => item.email.toLowerCase() === email
        );

        if (!usuario) {
            throw new Error(
                "Este e-mail não está cadastrado. Procure o responsável pelo sistema para realizar seu cadastro."
            );
        }

        if (usuario.nome.trim().toLowerCase() !== nome.toLowerCase()) {
            throw new Error(
                "O nome informado não corresponde ao usuário cadastrado."
            );
        }

        const resposta = await fetch(`${API}/solicitacoes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuarioId: usuario.id,
                objetoId: objetoAtual.id,
                comprovacao,
                status: "pendente"
            })
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                resultado.message || "Não foi possível enviar a solicitação."
            );
        }

        alert("Solicitação registrada com sucesso!");

        formDevolucao.reset();
        secaoDevolucao.classList.add("oculto");

    } catch (erro) {
        console.error("Erro na solicitação:", erro);

        alert(
            erro.message || "Erro ao enviar solicitação."
        );

    } finally {
        botao.disabled = false;
        botao.textContent = "Enviar Solicitação";
    }
});

carregarDetalhes();
