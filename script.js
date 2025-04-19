
async function responder() {
    const comando = document.getElementById('comando').value.toLowerCase().trim();
    let resposta = await analisarComando(comando);
    document.getElementById('resposta').innerText = resposta;

    const fala = new SpeechSynthesisUtterance(resposta);
    fala.lang = 'pt-BR';
    fala.rate = 1;
    speechSynthesis.speak(fala);
}

async function analisarComando(comando) {
    const agora = new Date();

    if (comando.includes("clima") || comando.includes("tempo")) {
        try {
            const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-8.8383&longitude=13.2344&current_weather=true");
            const data = await response.json();
            const temp = data.current_weather.temperature;
            const vento = data.current_weather.windspeed;
            return `O clima em Luanda está com ${temp}°C e ventos de ${vento} km/h.`;
        } catch (e) {
            return "Não consegui obter o clima agora, senhor.";
        }
    }

    if (comando.includes("notícia")) {
        try {
            const news = await fetch("https://gnews.io/api/v4/top-headlines?lang=pt&country=ao&token=5fdd0f5e0f43dc6e1613fd15f6f182f6");
            const data = await news.json();
            return data.articles.length ? `Última notícia: ${data.articles[0].title}` : "Nenhuma notícia no momento, senhor.";
        } catch (e) {
            return "Não consegui acessar as notícias agora.";
        }
    }

    if (comando.includes("dólar") || comando.includes("euro")) {
        try {
            const moeda = comando.includes("euro") ? "EUR" : "USD";
            const res = await fetch(`https://economia.awesomeapi.com.br/json/last/${moeda}-BRL`);
            const data = await res.json();
            const valor = data[moeda + "BRL"].bid;
            return `O ${moeda === "USD" ? "dólar" : "euro"} está valendo R$ ${parseFloat(valor).toFixed(2)}.`;
        } catch (e) {
            return "Não consegui verificar a cotação agora.";
        }
    }

    if (comando.includes("pesquise por") || comando.includes("procure por")) {
        const termo = comando.replace("pesquise por", "").replace("procure por", "").trim();
        if (termo.length > 0) {
            window.open("https://www.google.com/search?q=" + encodeURIComponent(termo), "_blank");
            return `Pesquisando por "${termo}" no Google.`;
        } else {
            return "Por favor, diga o que deseja pesquisar.";
        }
    }

    if (comando.includes("abrir google")) {
        window.open("https://www.google.com", "_blank");
        return "Abrindo o Google, senhor.";
    }

    if (comando.includes("tocar música") || comando.includes("música")) {
        window.open("https://www.youtube.com", "_blank");
        return "Abrindo YouTube para música.";
    }

    if (comando.includes("horas") || comando.includes("relógio")) {
        return `Agora são ${agora.toLocaleTimeString('pt-BR')}.`;
    }

    if (comando.includes("data") || comando.includes("dia")) {
        return `Hoje é ${agora.toLocaleDateString('pt-BR')}.`;
    }

    if (comando.includes("olá") || comando.includes("oi")) {
        return "Olá, senhor. Pronto para ajudá-lo.";
    }

    if (comando.includes("quem é você")) {
        return "Eu sou o SEMIDEUS, sua inteligência artificial pessoal.";
    }

    return "Desculpe, senhor. Ainda não reconheço esse comando.";
}

function ouvirComando() {
    const reconhecimento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    reconhecimento.lang = "pt-BR";
    reconhecimento.start();

    reconhecimento.onresult = function(event) {
        const comandoFalado = event.results[0][0].transcript;
        document.getElementById("comando").value = comandoFalado;
        responder();
    };
}
