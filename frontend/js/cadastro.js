/* ==========================================
   1. ELEMENTOS DO HTML
   ========================================== */

const formCadastro = document.getElementById("formCadastro");

const inputFoto = document.getElementById("foto");
const previewFoto = document.getElementById("previewFoto");

// Guarda a URL temporária da prévia
let urlTemporaria = null;


/* ==========================================
   2. PRÉVIA DA IMAGEM
   ========================================== */

inputFoto.addEventListener("change", () => {
    const arquivo = inputFoto.files[0];

    // Libera a URL da imagem anterior
    if (urlTemporaria) {
        URL.revokeObjectURL(urlTemporaria);
        urlTemporaria = null;
    }

    // Esconde a prévia se nenhuma imagem foi selecionada
    if (!arquivo) {
        previewFoto.classList.add("oculto");
        previewFoto.removeAttribute("src");
        return;
    }

    // Verifica o formato da imagem
    const formatosPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!formatosPermitidos.includes(arquivo.type)) {
        alert("Selecione uma imagem JPG, PNG ou WebP.");

        inputFoto.value = "";
        previewFoto.classList.add("oculto");
        previewFoto.removeAttribute("src");
        return;
    }

    // Cria a URL temporária para exibir a imagem
    urlTemporaria = URL.createObjectURL(arquivo);

    previewFoto.src = urlTemporaria;
    previewFoto.classList.remove("oculto");
});


/* ==========================================
   3. PROCESSAMENTO DA IMAGEM
   ========================================== */

// Redimensiona e converte a imagem para Base64
function processarImagem(arquivo) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();

        leitor.onload = () => {
            const imagem = new Image();

            imagem.onload = () => {
                try {
                    const larguraMaxima = 800;
                    const alturaMaxima = 600;

                    // Calcula a escala sem deformar a imagem
                    const escala = Math.min(
                        larguraMaxima / imagem.width,
                        alturaMaxima / imagem.height,
                        1
                    );

                    const largura = Math.max(
                        1,
                        Math.round(imagem.width * escala)
                    );

                    const altura = Math.max(
                        1,
                        Math.round(imagem.height * escala)
                    );

                    // Cria o canvas
                    const canvas = document.createElement("canvas");

                    canvas.width = largura;
                    canvas.height = altura;

                    const contexto = canvas.getContext("2d");

                    if (!contexto) {
                        reject(new Error("Canvas indisponível."));
                        return;
                    }

                    // Fundo branco para imagens com transparência
                    contexto.fillStyle = "#ffffff";
                    contexto.fillRect(0, 0, largura, altura);

                    // Desenha a imagem redimensionada
                    contexto.drawImage(
                        imagem,
                        0,
                        0,
                        largura,
                        altura
                    );

                    // Converte para JPEG em Base64
                    const imagemReduzida = canvas.toDataURL(
                        "image/jpeg",
                        0.7
                    );

                    resolve(imagemReduzida);

                } catch (erro) {
                    reject(erro);
                }
            };

            imagem.onerror = () => {
                reject(new Error("Não foi possível abrir a imagem."));
            };

            imagem.src = leitor.result;
        };

        leitor.onerror = () => {
            reject(new Error("Não foi possível ler o arquivo."));
        };

        leitor.readAsDataURL(arquivo);
    });
}


/* ==========================================
   4. CADASTRO DO OBJETO
   ========================================== */

formCadastro.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const botaoSubmit = formCadastro.querySelector(
        'button[type="submit"]'
    );

    // Evita envios duplicados
    botaoSubmit.disabled = true;
    botaoSubmit.textContent = "Cadastrando...";

    try {
        // Recupera os objetos existentes
        const objetos = JSON.parse(
            localStorage.getItem("objetos")
        ) || [];

        // Obtém os dados do formulário
        const dados = new FormData(formCadastro);

        const objeto = {
            nome: dados.get("nome").trim(),
            categoria: dados.get("categoria"),
            local: dados.get("local").trim(),
            descricao: dados.get("descricao").trim(),

            // Identificador único
            id: crypto.randomUUID(),

            // Data do cadastro
            dataCadastro: new Date().toISOString(),

            // Foto inicialmente vazia
            foto: null
        };

        // Recupera a imagem selecionada
        const arquivo = inputFoto.files[0];

        // Processa a foto somente se uma foi selecionada
        if (arquivo) {
            objeto.foto = await processarImagem(arquivo);
        }

        // Adiciona o novo objeto à lista
        objetos.push(objeto);

        // Salva os objetos no navegador
        localStorage.setItem(
            "objetos",
            JSON.stringify(objetos)
        );

        alert("Objeto cadastrado com sucesso!");

        // Retorna à página inicial
        window.location.href = "../index.html";

    } catch (erro) {
        console.error("Erro ao cadastrar objeto:", erro);

        if (erro.name === "QuotaExceededError") {
            alert(
                "O armazenamento do navegador está cheio. " +
                "Tente utilizar uma imagem menor."
            );
        } else {
            alert(
                "Não foi possível cadastrar o objeto. " +
                "Verifique o console para mais detalhes."
            );
        }

    } finally {
        botaoSubmit.disabled = false;
        botaoSubmit.textContent = "Cadastrar objeto";
    }
});


/* ==========================================
   5. LIBERAÇÃO DE RECURSOS
   ========================================== */

// Libera a URL temporária quando a página é fechada
window.addEventListener("pagehide", () => {
    if (urlTemporaria) {
        URL.revokeObjectURL(urlTemporaria);
    }
});