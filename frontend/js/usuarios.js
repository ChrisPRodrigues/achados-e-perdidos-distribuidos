const formUsuario = document.getElementById("formUsuario");
const botaoCadastrar = document.getElementById("botaoCadastrar");
const mensagemUsuario = document.getElementById("mensagemUsuario");

formUsuario.addEventListener("submit", async evento => {
    evento.preventDefault();

    botaoCadastrar.disabled = true;
    botaoCadastrar.textContent = "Cadastrando...";
    mensagemUsuario.textContent = "";

    try {
        const dados = {
            nome: document.getElementById("nome").value.trim(),
            email: document.getElementById("email").value.trim(),
            tipo: document.getElementById("tipo").value,
            senha: document.getElementById("senha").value
        };

        if (!dados.nome || !dados.email || !dados.tipo || !dados.senha) {
            throw new Error("Preencha todos os campos.");
        }

        if (dados.senha.length < 8) {
            throw new Error("A senha deve ter pelo menos 8 caracteres.");
        }

        await cadastrarUsuario(dados);

        mensagemUsuario.textContent =
            dados.tipo === "docente"
                ? "Cadastro realizado! Aguarde a aprovação do administrador."
                : "Usuário cadastrado com sucesso!";

        formUsuario.reset();

    } catch (erro) {
        console.error("Erro ao cadastrar usuário:", erro);
        mensagemUsuario.textContent =
            `Não foi possível cadastrar: ${erro.message}`;

    } finally {
        botaoCadastrar.disabled = false;
        botaoCadastrar.textContent = "Cadastrar usuário";
    }
});