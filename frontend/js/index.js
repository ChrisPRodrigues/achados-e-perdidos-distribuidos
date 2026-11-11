/* ==========================================
   1. ELEMENTOS DO HTML
   ========================================== */

const listaObjetos = document.getElementById("listaObjetos");


/* ==========================================
   2. RECUPERAR OBJETOS
   ========================================== */

const objetos = JSON.parse(
    localStorage.getItem("objetos")
) || [];


/* ==========================================
   3. EXIBIR OBJETOS
   ========================================== */

function exibirObjetos() {

    // Limpa a listagem antes de adicionar os cartões
    listaObjetos.innerHTML = "";

    // Verifica se existem objetos cadastrados
    if (objetos.length === 0) {
        listaObjetos.textContent = "Nenhum objeto cadastrado.";
        return;
    }

    // Exibe os objetos mais recentes primeiro
    [...objetos].reverse().forEach((objeto) => {

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

            // Cria um contêiner para a foto
            const containerFoto = document.createElement("div");
            containerFoto.classList.add("containerFoto");

            // Cria a imagem
            const imagem = document.createElement("img");

            imagem.src = objeto.foto;
            imagem.alt = `Foto do objeto ${objeto.nome}`;
            imagem.loading = "lazy";

            // Caso a imagem não possa ser carregada
            imagem.onerror = () => {
                containerFoto.remove();
                console.error(
                    "Erro ao carregar a imagem:",
                    objeto.nome
                );
            };

            // Adiciona a imagem ao contêiner
            containerFoto.appendChild(imagem);

            // Adiciona o contêiner ao cartão
            card.appendChild(containerFoto);
        }

        /* ==================================
           INFORMAÇÕES DO OBJETO
           ================================== */

        // Nome
        const titulo = document.createElement("h3");
        titulo.textContent = objeto.nome;

        // Categoria
        const categoria = document.createElement("p");
        categoria.textContent =
            `Categoria: ${objeto.categoria}`;

        // Local
        const local = document.createElement("p");
        local.textContent =
            `Local: ${objeto.local}`;

        // Descrição
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
            `pages/detalhes.html?id=${encodeURIComponent(objeto.id)}`;

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

        // Adiciona o cartão à listagem
        listaObjetos.appendChild(card);
    });
}


/* ==========================================
   4. INICIALIZAÇÃO
   ========================================== */

exibirObjetos();