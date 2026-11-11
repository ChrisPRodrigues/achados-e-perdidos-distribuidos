
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

    // Exibe os objetos mais recentes primeiro
    [...encontrados].reverse().forEach((objeto) => {

        // Cria o cartão do objeto
        const card = document.createElement("div");
        card.classList.add("card-objeto");

        /* ==================================
           FOTO DO OBJETO
           ================================== */

        if (
            typeof objeto.foto === "string" &&
            /^data:image\/(jpeg|png|webp);base64,/.test(objeto.foto)
        ) {
            const containerFoto = document.createElement("div");
            containerFoto.classList.add("containerFoto");

            const imagem = document.createElement("img");

            imagem.src = objeto.foto;
            imagem.alt = `Foto do objeto ${objeto.nome}`;
            imagem.loading = "lazy";

            // Remove a imagem caso ocorra algum erro
            imagem.onerror = () => {
                containerFoto.remove();
                console.error(
                    "Erro ao carregar a imagem:",
                    objeto.nome
                );
            };

            containerFoto.appendChild(imagem);
            card.appendChild(containerFoto);
        }

        /* ==================================
           INFORMAÇÕES DO OBJETO
           ================================== */

        const titulo = document.createElement("h3");
        titulo.textContent = objeto.nome;

        const categoria = document.createElement("p");
        categoria.textContent =
            `Categoria: ${objeto.categoria}`;

        const local = document.createElement("p");
        local.textContent =
            `Local: ${objeto.local}`;

        const descricao = document.createElement("p");
        descricao.textContent =
            objeto.descricao || "Sem descrição.";

        /* ==================================
           LINK PARA OS DETALHES
           ================================== */

        const linkDetalhes = document.createElement("a");

        linkDetalhes.classList.add("botao");
        linkDetalhes.textContent = "Ver detalhes";

        linkDetalhes.href =
            `detalhes.html?id=${encodeURIComponent(objeto.id)}`;

        /* ==================================
           MONTAGEM DO CARTÃO
           ================================== */

        card.append(
            titulo,
            categoria,
            local,
            descricao,
            linkDetalhes
        );

        resultadosBusca.appendChild(card);
    });
}
