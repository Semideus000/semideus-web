
function responder() {
    const comando = document.getElementById('comando').value.toLowerCase();
    let resposta = '';

    if (comando.includes("horas")) {
        const agora = new Date();
        resposta = "Agora são " + agora.toLocaleTimeString('pt-BR');
    } else if (comando.includes("olá") || comando.includes("oi")) {
        resposta = "Olá, senhor. Em que posso ajudar?";
    } else {
        resposta = "Comando não reconhecido.";
    }

    document.getElementById('resposta').innerText = resposta;
    const utterance = new SpeechSynthesisUtterance(resposta);
    utterance.lang = 'pt-BR';
    speechSynthesis.speak(utterance);
}
