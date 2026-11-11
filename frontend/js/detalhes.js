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
    const titulo = document.createElement("h3");
    titulo.textContent = objeto.nome;

    const categoria = document.createElement("p");
    categoria.textContent = `Categoria: ${objeto.categoria}`;

    const local = document.createElement("p");
    local.textContent = `Local: ${objeto.local}`;

    const descricao = document.createElement("p");
    descricao.textContent =
        `Descrição: ${objeto.descricao || "Sem descrição."}`;

    const btnSolicitar = document.createElement("button");
    btnSolicitar.textContent = "Solicitar devolução";

    btnSolicitar.addEventListener("click", () => {
        secaoDevolucao.classList.toggle("oculto");
    });

    formDevolucao.addEventListener("submit", (evento) => {
        evento.preventDefault();

        if (!objeto) {
            alert("Objeto não encontrado.")
            return;
        }

        const dados = new FormData(formDevolucao);
        const solicitacao = Object.fromEntries(dados.entries());

        solicitacao.id = crypto.randomUUID();
        solicitacao.objetoId = objeto.id;
        solicitacao.statua = "pendente";
        solicitacao.data = new Date().toISOString();

        const solicitacoes = JSON.parse(
            localStorage.getItem("solicitações")
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

    detalhesObjeto.replaceChildren(
        titulo,
        categoria,
        local,
        descricao,
        btnSolicitar
    );
}