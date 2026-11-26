
const formCadastro = document.getElementById("formCadastro");
const inputFoto = document.getElementById("foto");
const previewFoto = document.getElementById("previewFoto");

const campoCategoria = document.getElementById("categoria");
const campoLocal = document.getElementById("local");
const campoUsuario = document.getElementById("usuarioId");

const botaoCadastro = formCadastro.querySelector(
    'button[type="submit"]'
);

let urlTemporaria = null;
let opcoesCarregadas = false;

// Carrega categorias, locais e docentes pela API.
async function carregarOpcoes() {
    botaoCadastro.disabled = true;
    opcoesCarregadas = false;

    try {
        const [categorias, locais, usuarios] =
            await Promise.all([
                listarCategorias(),
                listarLocais(),
                listarUsuarios()
            ]);

        campoCategoria.replaceChildren(
            new Option("Selecione uma categoria", "")
        );

        categorias.forEach(categoria => {
            campoCategoria.add(
                new Option(categoria.nome, categoria.id)
            );
        });

        campoLocal.replaceChildren(
            new Option("Selecione um local", "")
        );

        locais.forEach(local => {
            campoLocal.add(
                new Option(local.nome, local.id)
            );
        });

        const docentes = usuarios.filter(
            usuario => usuario.tipo === "docente"
        );

        campoUsuario.replaceChildren(
            new Option("Selecione um docente", "")
        );

        docentes.forEach(usuario => {
            campoUsuario.add(
                new Option(
                    `${usuario.nome} (${usuario.email})`,
                    usuario.id
                )
            );
        });

        if (categorias.length === 0) {
            throw new Error(
                "Não existem categorias cadastradas."
            );
        }

        if (locais.length === 0) {
            throw new Error(
                "Não existem locais cadastrados."
            );
        }

        if (docentes.length === 0) {
            throw new Error(
                "Não existem docentes cadastrados."
            );
        }

        opcoesCarregadas = true;
        botaoCadastro.disabled = false;

    } catch (erro) {
        console.error("Erro ao carregar opções:", erro);

        alert(
            `Não foi possível preparar o cadastro: ${erro.message}`
        );
    }
}

// Pré-visualização da imagem.
inputFoto.addEventListener("change", () => {
    const arquivo = inputFoto.files[0];

    if (urlTemporaria) {
        URL.revokeObjectURL(urlTemporaria);
        urlTemporaria = null;
    }

    if (!arquivo) {
        previewFoto.classList.add("oculto");
        previewFoto.removeAttribute("src");
        return;
    }

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

    urlTemporaria = URL.createObjectURL(arquivo);
    previewFoto.src = urlTemporaria;
    previewFoto.classList.remove("oculto");
});

// Redimensiona e converte a imagem para Base64.
function processarImagem(arquivo) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();

        leitor.onload = () => {
            const imagem = new Image();

            imagem.onload = () => {
                try {
                    const escala = Math.min(
                        800 / imagem.width,
                        600 / imagem.height,
                        1
                    );

                    const canvas = document.createElement("canvas");

                    canvas.width = Math.max(
                        1,
                        Math.round(imagem.width * escala)
                    );

                    canvas.height = Math.max(
                        1,
                        Math.round(imagem.height * escala)
                    );

                    const contexto = canvas.getContext("2d");

                    if (!contexto) {
                        throw new Error("Canvas indisponível.");
                    }

                    contexto.fillStyle = "#ffffff";

                    contexto.fillRect(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    contexto.drawImage(
                        imagem,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    resolve(
                        canvas.toDataURL("image/jpeg", 0.7)
                    );

                } catch (erro) {
                    reject(erro);
                }
            };

            imagem.onerror = () => {
                reject(new Error("Erro ao abrir imagem."));
            };

            imagem.src = leitor.result;
        };

        leitor.onerror = () => {
            reject(new Error("Erro ao ler imagem."));
        };

        leitor.readAsDataURL(arquivo);
    });
}

// Cadastro do objeto diretamente pela API.
formCadastro.addEventListener("submit", async evento => {
    evento.preventDefault();

    if (!opcoesCarregadas) {
        alert("Aguarde o carregamento das opções.");
        return;
    }

    botaoCadastro.disabled = true;
    botaoCadastro.textContent = "Cadastrando...";

    try {
        const dados = new FormData(formCadastro);

        const nome = dados.get("nome").trim();

        const descricao =
            dados.get("descricao").trim() || "Sem descrição.";

        const categoriaId = Number(dados.get("categoria"));
        const localId = Number(dados.get("local"));
        const usuarioId = Number(dados.get("usuarioId"));

        if (!nome || nome.length > 150) {
            throw new Error(
                "Informe um nome válido de até 150 caracteres."
            );
        }

        const ids = [categoriaId, localId, usuarioId];

        if (!ids.every(id => Number.isInteger(id) && id > 0)) {
            throw new Error(
                "Selecione uma categoria, um local e um docente."
            );
        }

        const arquivoFoto = inputFoto.files[0];

        const foto = arquivoFoto
            ? await processarImagem(arquivoFoto)
            : null;

        if (foto && foto.length > 2000000) {
            throw new Error(
                "A imagem ultrapassa o tamanho permitido."
            );
        }

        const novoObjeto = {
            nome,
            descricao,
            categoriaId,
            localId,
            usuarioId,
            dataEncontrado: new Date().toISOString()
        };

        if (foto) {
            novoObjeto.foto = foto;
        }

        // Utiliza a função centralizada do api.js.
        await cadastrarObjeto(novoObjeto);

        alert("Objeto cadastrado com sucesso no banco de dados!");

        window.location.href = "../index.html";

    } catch (erro) {
        console.error("Erro ao cadastrar:", erro);

        alert(
            erro.message || "Não foi possível cadastrar o objeto."
        );

    } finally {
        botaoCadastro.disabled = !opcoesCarregadas;
        botaoCadastro.textContent = "Cadastrar objeto";
    }
});

carregarOpcoes();

window.addEventListener("pagehide", () => {
    if (urlTemporaria) {
        URL.revokeObjectURL(urlTemporaria);
    }
});
