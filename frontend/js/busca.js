
const formBusca = document.getElementById("formBusca");
const resultadosBusca = document.getElementById("resultadosBusca");

const campoNome = document.getElementById("buscaNome");
const campoCategoria = document.getElementById("buscaCategoria");
const campoLocal = document.getElementById("buscaLocal");

const botaoBusca = formBusca.querySelector(
    'button[type="submit"]'
);

let objetos = [];
let categorias = [];
let locais = [];
let dadosCarregados = false;

// Carrega os dados diretamente da API.
async function carregarDados() {
    resultadosBusca.textContent = "Carregando dados...";
    botaoBusca.disabled = true;
    dadosCarregados = false;

    try {
        [objetos, categorias, locais] = await Promise.all([
            listarObjetos(),
            listarCategorias(),
            listarLocais()
        ]);

        // Preenche as categorias do banco.
        campoCategoria.replaceChildren(
            new Option("Todas as categorias", "")
        );

        categorias.forEach(categoria => {
            campoCategoria.add(
                new Option(categoria.nome, categoria.id)
            );
        });

        // Preenche os locais do banco.
        campoLocal.replaceChildren(
            new Option("Todos os locais", "")
        );

        locais.forEach(local => {
            campoLocal.add(
                new Option(local.nome, local.id)
            );
        });

        dadosCarregados = true;
        botaoBusca.disabled = false;

        resultadosBusca.textContent =
            "Informe os filtros e clique em Buscar objeto.";

    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);

        resultadosBusca.textContent =
            `Erro ao carregar os dados: ${erro.message}`;
    }
}

// Executa a busca utilizando os filtros.
formBusca.addEventListener("submit", evento => {
    evento.preventDefault();

    if (!dadosCarregados) {
        resultadosBusca.textContent =
            "Os dados ainda não foram carregados.";
        return;
    }

    const nome = campoNome.value.trim().toLowerCase();
    const categoriaId = campoCategoria.value;
    const localId = campoLocal.value;

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

    const encontrados = objetos.filter(objeto => {
        const nomeObjeto =
            (objeto.nome || "").toLowerCase();

        const correspondeNome =
            nomeObjeto.includes(nome);

        const correspondeCategoria =
            !categoriaId ||
            Number(objeto.categoriaId) === Number(categoriaId);

        const correspondeLocal =
            !localId ||
            Number(objeto.localId) === Number(localId);

        return (
            correspondeNome &&
            correspondeCategoria &&
            correspondeLocal
        );
    });

    exibirResultados(
        encontrados,
        mapaCategorias,
        mapaLocais
    );
});

// Exibe os resultados da busca.
function exibirResultados(
    encontrados,
    mapaCategorias,
    mapaLocais
) {
    resultadosBusca.innerHTML = "";

    if (encontrados.length === 0) {
        resultadosBusca.textContent =
            "Nenhum objeto encontrado com esses critérios.";

        return;
    }

    [...encontrados].reverse().forEach(objeto => {
        const card = document.createElement("div");
        card.classList.add("card-objeto");

        // Exibe a foto, caso exista.
        if (
            typeof objeto.foto === "string" &&
            /^data:image\/(jpeg|png|webp);base64,/.test(objeto.foto)
        ) {
            const containerFoto =
                document.createElement("div");

            containerFoto.classList.add("containerFoto");

            const imagem = document.createElement("img");

            imagem.src = objeto.foto;
            imagem.alt = `Foto do objeto ${objeto.nome}`;
            imagem.loading = "lazy";

            imagem.onerror = () => containerFoto.remove();

            containerFoto.appendChild(imagem);
            card.appendChild(containerFoto);
        }

        const titulo = document.createElement("h3");
        titulo.textContent = objeto.nome;

        const categoria = document.createElement("p");

        categoria.textContent =
            `Categoria: ${mapaCategorias.get(Number(objeto.categoriaId)) || "Não informada"}`;

        const local = document.createElement("p");

        local.textContent =
            `Local: ${mapaLocais.get(Number(objeto.localId)) || "Não informado"}`;

        const descricao = document.createElement("p");

        descricao.textContent =
            objeto.descricao || "Sem descrição.";

        const linkDetalhes = document.createElement("a");

        linkDetalhes.classList.add("botao");
        linkDetalhes.textContent = "Ver detalhes";

        linkDetalhes.href =
            `detalhes.html?id=${encodeURIComponent(objeto.id)}`;

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

carregarDados();
