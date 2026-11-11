const formBusca = document.getElementById("formBusca");
const resultadosBusca = document.getElementById("resultadosBusca");

// Recupera os objetos cadastrados
const objetos = JSON.parse(
    localStorage.getItem("objetos")
) || [];

// Executa a busca quando o formulário é enviado
formBusca.addEventListener("submit", (evento) => {
    evento.preventDefault();

    // Recupera os filtros preenchidos
    const nome = document.getElementById("buscaNome")
        .value.trim().toLowerCase();

    const categoria = document.getElementById("buscaCategoria")
        .value;

    const local = document.getElementById("buscaLocal")
        .value.trim().toLowerCase();

    // Filtra os objetos cadastrados
    const encontrados = objetos.filter((objeto) => {
        const correspondeNome = objeto.nome
            .toLowerCase().includes(nome);

        const correspondeCategoria =
            !categoria || objeto.categoria === categoria;

        const correspondeLocal = objeto.local
            .toLowerCase().includes(local);

        return correspondeNome &&
               correspondeCategoria &&
               correspondeLocal;
    });

    exibirResultados(encontrados);
});

// Exibe os objetos encontrados na pesquisa
function exibirResultados(encontrados) {
    resultadosBusca.innerHTML = "";

    if (encontrados.length === 0) {
        resultadosBusca.textContent =
            "Nenhum objeto encontrado com esses critérios.";
        return;
    }

    encontrados.forEach((objeto) => {
        const card = document.createElement("div");
        card.classList.add("card-objeto");

        const titulo = document.createElement("h3");
        titulo.textContent = objeto.nome;

        const categoria = document.createElement("p");
        categoria.textContent = `Categoria: ${objeto.categoria}`;

        const local = document.createElement("p");
        local.textContent = `Local: ${objeto.local}`;

        const descricao = document.createElement("p");
        descricao.textContent = objeto.descricao || "Sem descrição.";

        card.append(titulo, categoria, local, descricao);
        resultadosBusca.appendChild(card);
    });
}