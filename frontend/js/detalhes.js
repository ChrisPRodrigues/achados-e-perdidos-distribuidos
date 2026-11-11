
const detalhesObjeto = document.getElementById("detalhesObjeto");
const secaoDevolucao = document.getElementById("secaoDevolucao");
const formDevolucao = document.getElementById("formDevolucao");

// Recupera o ID enviado pela URL
const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

// Recupera os objetos cadastrados
const objetos = JSON.parse(
    localStorage.getItem("objetos")
) || [];

// Procura o objeto correspondente
const objeto = objetos.find((item) => item.id === id);

if (!objeto) {
    detalhesObjeto.textContent = "Objeto não encontrado.";
} else {

    /* ==================================
       FOTO DO OBJETO
       ================================== */

    const containerFoto = document.createElement("div");
    containerFoto.classList.add("foto-detalhes");

    if (
        typeof objeto.foto === "string" &&
        /^data:image\/(jpeg|png|webp);base64,/.test(objeto.foto)
    ) {
        const imagem = document.createElement("img");

        imagem.src = objeto.foto;
        imagem.alt = `Foto do objeto ${objeto.nome}`;

        imagem.onerror = () => {
            containerFoto.remove();
            console.error("Erro ao carregar a imagem.");
        };

        containerFoto.appendChild(imagem);
    }

    /* ==================================
       INFORMAÇÕES DO OBJETO
       ================================== */

    const titulo = document.createElement("h3");
    titulo.textContent = objeto.nome;

    const categoria = document.createElement("p");
    categoria.textContent = `Categoria: ${objeto.categoria}`;

    const local = document.createElement("p");
    local.textContent = `Local: ${objeto.local}`;

    const descricao = document.createElement("p");
    descricao.textContent =
        `Descrição: ${objeto.descricao || "Sem descrição."}`;

    /* ==================================
       SOLICITAÇÃO DE DEVOLUÇÃO
       ================================== */

    const btnSolicitar = document.createElement("button");
    btnSolicitar.textContent = "Solicitar devolução";

    btnSolicitar.addEventListener("click", () => {
        secaoDevolucao.classList.toggle("oculto");
    });

    formDevolucao.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const dados = new FormData(formDevolucao);
        const solicitacao = Object.fromEntries(dados.entries());

        solicitacao.id = crypto.randomUUID();
        solicitacao.objetoId = objeto.id;
        solicitacao.status = "pendente";
        solicitacao.data = new Date().toISOString();

        const solicitacoes = JSON.parse(
            localStorage.getItem("solicitacoes")
        ) || [];

        solicitacoes.push(solicitacao);

        localStorage.setItem(
            "solicitacoes",
            JSON.stringify(solicitacoes)
        );

        alert("Solicitação enviada com sucesso!");

        formDevolucao.reset();
        secaoDevolucao.classList.add("oculto");
    });

    /* ==================================
       MONTAGEM DOS DETALHES
       ================================== */

    detalhesObjeto.replaceChildren(
        titulo,
        containerFoto,
        categoria,
        local,
        descricao,
        btnSolicitar
    );
}
