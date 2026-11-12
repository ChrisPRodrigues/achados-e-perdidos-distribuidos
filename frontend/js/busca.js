
const API = "http://localhost:3000";

const formBusca = document.getElementById("formBusca");
const resultadosBusca = document.getElementById("resultadosBusca");

const campoNome = document.getElementById("buscaNome");
const campoCategoria = document.getElementById("buscaCategoria");
const campoLocal = document.getElementById("buscaLocal");

let objetos = [];
let categorias = [];
let locais = [];

// Carrega os dados do banco pela API.
async function carregarDados() {
    resultadosBusca.textContent = "Carregando dados...";

    try {
        const [respostaObjetos, respostaCategorias, respostaLocais] =
            await Promise.all([
                fetch(`${API}/objetos`),
                fetch(`${API}/categorias`),
                fetch(`${API}/locais`)
            ]);

        if (
            !respostaObjetos.ok ||
            !respostaCategorias.ok ||
            !respostaLocais.ok
        ) {
            throw new Error("Não foi possível carregar os dados.");
        }

        objetos = await respostaObjetos.json();
        categorias = await respostaCategorias.json();
        locais = await respostaLocais.json();

        // Preenche as categorias reais do banco.
        campoCategoria.replaceChildren(
            new Option("Todas as categorias", "")
        );

        categorias.forEach(categoria => {
            campoCategoria.add(
                new Option(categoria.nome, categoria.id)
            );
        });

        resultadosBusca.textContent =
            "Informe os filtros e clique em Buscar objeto.";

    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);

        resultadosBusca.textContent =
            "Erro ao carregar os objetos. Verifique se o backend está funcionando.";
    }
}

// Executa a busca.
formBusca.addEventListener("submit", evento => {
    evento.preventDefault();

    const nome = campoNome.value.trim().toLowerCase();
    const categoriaId = campoCategoria.value;
    const local = campoLocal.value.trim().toLowerCase();

    const mapaCategorias = new Map(
        categorias.map(item => [Number(item.id), item.nome])
    );

    const mapaLocais = new Map(
        locais.map(item => [Number(item.id), item.nome])
    );

    const encontrados = objetos.filter(objeto => {
        const nomeObjeto = (objeto.nome || "").toLowerCase();

        const nomeLocal =
            (mapaLocais.get(Number(objeto.localId)) || "").toLowerCase();

        const correspondeNome = nomeObjeto.includes(nome);

        const correspondeCategoria =
            !categoriaId ||
            Number(objeto.categoriaId) === Number(categoriaId);

        const correspondeLocal = nomeLocal.includes(local);

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

// Exibe os resultados.
function exibirResultados(encontrados, mapaCategorias, mapaLocais) {
    resultadosBusca.innerHTML = "";

    if (encontrados.length === 0) {
        resultadosBusca.textContent =
            "Nenhum objeto encontrado com esses critérios.";
        return;
    }

    [...encontrados].reverse().forEach(objeto => {
        const card = document.createElement("div");
        card.classList.add("card-objeto");

        if (
            typeof objeto.foto === "string" &&
            /^data:image\/(jpeg|png|webp);base64,/.test(objeto.foto)
        ) {
            const imagem = document.createElement("img");
            imagem.src = objeto.foto;
            imagem.alt = `Foto do objeto ${objeto.nome}`;
            imagem.loading = "lazy";

            imagem.onerror = () => imagem.remove();

            card.appendChild(imagem);
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
