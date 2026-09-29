// 1. IMPEDIR LETRAS E SÍMBOLOS NO CPF
document.getElementById('cpf').addEventListener('input', function (e) {
    e.target.value = e.target.value.replace(/\D/g, ''); // Remove letras, pontos e traços
});

// 2. LÓGICA DA FOTO: Mostra a pré-visualização assim que o usuário escolhe o arquivo
document.getElementById('img').addEventListener('change', function(event) {
    const preview = document.getElementById('preview');
    const arquivo = event.target.files[0]; // Correção para pegar o primeiro arquivo da lista

    if (arquivo) {
        const leitor = new FileReader();
        
        leitor.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block'; // Mostra a imagem na tela
        }
        
        leitor.readAsDataURL(arquivo);
    } else {
        preview.src = '#';
        preview.style.display = 'none'; // Esconde se não houver foto
    }
});

// 3. LÓGICA DO CADASTRO: Criptografa a senha, baixa o arquivo .txt e fecha a janela voltando à tela inicial
document.getElementById('formCadastro').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede a página de recarregar internamente

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senhaOriginal = document.getElementById('senha').value;
    const endereço = document.getElementById('endereço').value;
    const cpf = document.getElementById('cpf').value;

    // Criptografa a senha usando SHA-256
    const senhaCriptografada = await gerarHashSHA256(senhaOriginal);

    // Monta o texto do arquivo .txt
    const conteudoTxt = `Nome: ${nome}\n` +
                        `Email: ${email}\n` +
                        `Senha Criptografada (SHA-256): ${senhaCriptografada}\n` +
                        `Endereço: ${endereço}\n` +
                        `CPF: ${cpf}\n` +
                        `----------------------------------------\n`;

    // Baixa o arquivo .txt
    baixarArquivoTxt(conteudoTxt, `cadastro_${nome}.txt`);

    // Alerta o usuário
    alert("Cadastro realizado com sucesso! Retornando para a página inicial...");
    
    // Pequena pausa para garantir que o download inicie antes da página atualizar
    setTimeout(function() {
        // CORREÇÃO AQUI: Força a página pai (index.html) a recarregar completamente do zero,
        // limpando a janela flutuante da tela de forma limpa.
        window.parent.location.reload(); 
    }, 1000);
});

// FUNÇÃO AUXILIAR: Transforma a senha em texto criptografado
async function gerarHashSHA256(mensagem) {
    const encoder = new TextEncoder();
    const data = encoder.encode(mensagem);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// FUNÇÃO AUXILIAR: Força o download do arquivo .txt
function baixarArquivoTxt(conteudo, nomeDoArquivo) {
    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nomeDoArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
