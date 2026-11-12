
const API = "http://localhost:3000";

const listaObjetos = document.getElementById("listaObjetos");

async function carregarObjetos() {
    listaObjetos.textContent = "Carregando objetos...";

    try {
        const [objetosResposta, categoriasResposta, locaisResposta] =
            await Promise.all([
                fetch(`${API}/objetos`),
                fetch(`${API}/categorias`),
                fetch(`${API}/locais`)
            ]);

        if (
            !objetosResposta.ok ||
            !categoriasResposta.ok ||
            !locaisResposta.ok
        ) {
            throw new Error("Não foi possível carregar os dados.");
        }

        const objetos = await objetosResposta.json();
        const categorias = await categoriasResposta.json();
        const locais = await locaisResposta.json();

        const mapaCategorias = new Map(
            categorias.map(item => [Number(item.id), item.nome])
        );

        const mapaLocais = new Map(
            locais.map(item => [Number(item.id), item.nome])
        );

        exibirObjetos(objetos, mapaCategorias, mapaLocais);

    } catch (erro) {
        console.error("Erro ao carregar objetos:", erro);

        listaObjetos.textContent =
            "Erro ao carregar objetos. Verifique se o servidor está funcionando.";
    }
}

function exibirObjetos(objetos, mapaCategorias, mapaLocais) {
    listaObjetos.innerHTML = "";

    if (!objetos || objetos.length === 0) {
        listaObjetos.textContent = "Nenhum objeto cadastrado.";
        return;
    }

    [...objetos].reverse().forEach(objeto => {
        const card = document.createElement("div");
        card.classList.add("card-objeto");

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
            `pages/detalhes.html?id=${encodeURIComponent(objeto.id)}`;

        card.append(
            titulo,
            categoria,
            local,
            descricao,
            linkDetalhes
        );

        listaObjetos.appendChild(card);
    });
}

carregarObjetos();
