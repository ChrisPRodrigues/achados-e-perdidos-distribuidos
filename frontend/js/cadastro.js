
const API = "http://localhost:3000";

const formCadastro = document.getElementById("formCadastro");
const inputFoto = document.getElementById("foto");
const previewFoto = document.getElementById("previewFoto");

const campoCategoria = document.getElementById("categoria");
const campoLocal = document.getElementById("local");

let urlTemporaria = null;

// Carrega categorias, locais e docentes da API.
async function carregarOpcoes() {
    try {
        const [categoriasResposta, locaisResposta, usuariosResposta] =
            await Promise.all([
                fetch(`${API}/categorias`),
                fetch(`${API}/locais`),
                fetch(`${API}/usuarios`)
            ]);

        if (
            !categoriasResposta.ok ||
            !locaisResposta.ok ||
            !usuariosResposta.ok
        ) {
            throw new Error("Não foi possível carregar os dados da API.");
        }

        const categorias = await categoriasResposta.json();
        const locais = await locaisResposta.json();
        const usuarios = await usuariosResposta.json();

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

        let campoUsuario = document.getElementById("usuarioId");

        if (!campoUsuario) {
            const label = document.createElement("label");
            label.htmlFor = "usuarioId";
            label.textContent = "Docente responsável:";

            campoUsuario = document.createElement("select");
            campoUsuario.id = "usuarioId";
            campoUsuario.name = "usuarioId";
            campoUsuario.required = true;

            campoUsuario.add(
                new Option("Selecione um docente", "")
            );

            const botao = formCadastro.querySelector(
                'button[type="submit"]'
            );

            formCadastro.insertBefore(label, botao);
            formCadastro.insertBefore(campoUsuario, botao);
        }

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

        if (docentes.length === 0) {
            alert(
                "Não há docentes cadastrados. Cadastre um docente na API antes de cadastrar objetos."
            );
        }

    } catch (erro) {
        console.error(erro);

        alert(
            "Erro ao carregar categorias, locais e docentes. Verifique se o backend está funcionando."
        );
    }
}

// Prévia da imagem.
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
                    reject(new Error("Canvas indisponível."));
                    return;
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

// Cadastro do objeto diretamente na API.
formCadastro.addEventListener("submit", async evento => {
    evento.preventDefault();

    const botao = formCadastro.querySelector(
        'button[type="submit"]'
    );

    botao.disabled = true;
    botao.textContent = "Cadastrando...";

    try {
        const dados = new FormData(formCadastro);

        const arquivoFoto = inputFoto.files[0];

        const foto = arquivoFoto
            ? await processarImagem(arquivoFoto)
            : null;

        const resposta = await fetch(`${API}/objetos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: dados.get("nome").trim(),
                descricao:
                    dados.get("descricao").trim() || "Sem descrição.",
                foto,
                categoriaId: Number(dados.get("categoria")),
                localId: Number(dados.get("local")),
                usuarioId: Number(dados.get("usuarioId")),
                dataEncontrado: new Date().toISOString()
            })
        });

        if (!resposta.ok) {
            const erro = await resposta.json();

            throw new Error(
                erro.message || "Erro ao cadastrar objeto."
            );
        }

        alert("Objeto cadastrado com sucesso no banco de dados!");

        window.location.href = "../index.html";

    } catch (erro) {
        console.error("Erro ao cadastrar:", erro);

        alert(
            erro.message || "Não foi possível cadastrar o objeto."
        );

    } finally {
        botao.disabled = false;
        botao.textContent = "Cadastrar objeto";
    }
});

carregarOpcoes();

window.addEventListener("pagehide", () => {
    if (urlTemporaria) {
        URL.revokeObjectURL(urlTemporaria);
    }
});
