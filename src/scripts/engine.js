const estado = {
    pontuacao:{
        pontuacaooDoJogador:0,
        pontuacaoDoComputador:0,
        caixaDepontuacao: document.getElementById("marcar_pontos"),
    },
    cartaSprites:{
        avatar: document.getElementById("imagem_da_carta"),
        nome: document.getElementById("nome_da_carta"),
        tipo: document.getElementById("tipo_da_carta"),
    },
    ladoDoJogador: {
        jogador1: "cartas_do_jogador",
        jogador1BOX: document.querySelector("#cartas_do_jogador"),
        computador:"cartas_do_computador",
        computadorBOX: document.querySelector("#cartas_do_computador"),
    },
    campoDaCarta: {
        jogador: document.getElementById("carta_de_campo_do_jogador"),
        computador: document.getElementById("carta_de_campo_do_computador"),
    },
    acoes:{
        botao: document.getElementById("proximo_duelo"),
    }
}

const foto = "./src/assets/icons/";

const dadosDaCarta = [
    {
        id: 0,
        nome: "Blue Eyes White Dragon",
        tipo: "Papel",
        img: `${foto}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        nome: "Dark Magician",
        tipo: "Pedra",
        img: `${foto}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        nome: "Exodia",
        tipo: "Tesoura",
        img: `${foto}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
]

async function pegarIdDaCartaAleatorio() {
    const indiceAleatorio = Math.floor(Math.random() * dadosDaCarta.length);
    return dadosDaCarta[indiceAleatorio].id;
}

async function criarImagemDaCarta(cartaId, ladoDoCampo) {
    const imagem_da_carta = document.createElement("img");
    imagem_da_carta.setAttribute("height", "100px");
    imagem_da_carta.setAttribute("src", "./src/assets/icons/card-back.png");
    imagem_da_carta.setAttribute("data-id", cartaId);
    imagem_da_carta.classList.add("carta");

    if (ladoDoCampo === estado.ladoDoJogador.jogador1) {

        
    imagem_da_carta.addEventListener("mouseover", () => {
        sacarCartaSelecionada(cartaId)
    })

    imagem_da_carta.addEventListener("click", () => {
        definirCampoDaCarta(imagem_da_carta.getAttribute("data-id"));
    })
    }

    return imagem_da_carta;
}

async function definirCampoDaCarta(cartaId) {
    
    await removerTodasAsCartas();

    let idDaCartaDoComputador = await pegarIdDaCartaAleatorio();

    await exibirImagemCamposCartasOcultas(true);
    

    await detalhesOcultosDaCarta();

    await desenharCartasEmCampo(cartaId, idDaCartaDoComputador);


    let resultadoDoDuelo = await verificarResultadoDoDuelo(cartaId, idDaCartaDoComputador);

    await atualizarPontuacao();
    await desenharBotao(resultadoDoDuelo);
}

async function desenharCartasEmCampo(cartaId, idDaCartaDoComputador) {
    estado.campoDaCarta.jogador.src = dadosDaCarta[cartaId].img;
    estado.campoDaCarta.computador.src = dadosDaCarta[idDaCartaDoComputador].img;
}

async function exibirImagemCamposCartasOcultas(value) {
    if (value === true) {
        estado.campoDaCarta.jogador.style.display = "block";
        estado.campoDaCarta.computador.style.display = "block";
    }

    if (value === false) {
        estado.campoDaCarta.jogador.style.display = "none ";
        estado.campoDaCarta.computador.style.display = "none";
    }
}

async function detalhesOcultosDaCarta() {
    
    estado.cartaSprites.avatar.src = "";
    estado.cartaSprites.nome.innerText = "";
    estado.cartaSprites.tipo.innerText = "";
}

async function desenharBotao(text) {
    estado.acoes.botao.innerText = text;
    estado.acoes.botao.style.display = "block";
    
}

async function atualizarPontuacao()  {
    estado.pontuacao.caixaDepontuacao.innerText = `Win: ${estado.pontuacao.pontuacaooDoJogador} | Lose: ${estado.pontuacao.pontuacaoDoComputador}`
}

async function verificarResultadoDoDuelo(idDaCartaDoJogador, idDaCartaDoComputador) {
    let resultadoDoDuelo = "Empate";
    let cartaDoJogador = dadosDaCarta[idDaCartaDoJogador];

    if(cartaDoJogador.WinOf.includes(idDaCartaDoComputador)){
        resultadoDoDuelo = "Ganhou";
        await tocarAudio(resultadoDoDuelo);
        estado.pontuacao.pontuacaooDoJogador++;
        }

    if (cartaDoJogador.LoseOf.includes(idDaCartaDoComputador)) {
        resultadoDoDuelo = "Perdeu";
        await tocarAudio(resultadoDoDuelo);
        estado.pontuacao.pontuacaoDoComputador++;
        }

    return resultadoDoDuelo
}


async function removerTodasAsCartas() {
    let {computadorBOX, jogador1BOX} = estado.ladoDoJogador;

    let elementosDeImagem = computadorBOX.querySelectorAll("img");
    elementosDeImagem.forEach((img) => img.remove());

    elementosDeImagem = jogador1BOX.querySelectorAll("img");
    
    elementosDeImagem.forEach((img) => img.remove());
    
}

async function sacarCartaSelecionada(indice) {
    estado.cartaSprites.avatar.src = dadosDaCarta[indice].img;
    estado.cartaSprites.nome.innerText = dadosDaCarta[indice].nome;
    estado.cartaSprites.tipo.innerText = "Atributo : " + dadosDaCarta[indice].tipo;
}

async function cartasSorteadas(numerosDaCarta, ladoDoCampo) {
    for(let i = 0; i < numerosDaCarta; i++) {
        const cartaIdAleatorio = await pegarIdDaCartaAleatorio();
        const imagemDaCarta = await criarImagemDaCarta(cartaIdAleatorio, ladoDoCampo);

        document.getElementById(ladoDoCampo).appendChild(imagemDaCarta);
    }
}

async function resetDuel() {
    estado.cartaSprites.avatar.src = "";
    estado.acoes.botao.style.display = "none";
    
    estado.campoDaCarta.jogador.style.display = "none ";
    estado.campoDaCarta.computador.style.display = "none";

    iniciar()
}

async function tocarAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function iniciar() {
    
    exibirImagemCamposCartasOcultas(false)

    cartasSorteadas(5, estado.ladoDoJogador.jogador1);
    cartasSorteadas(5, estado.ladoDoJogador.computador);

    const bgm =document.getElementById("bgm");
    bgm.play()
}

iniciar()