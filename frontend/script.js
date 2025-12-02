const BACKEND_URL = "https://healthcare-translator-backend.onrender.com"; 
let recognition;
let originalText = "";
let translatedText = "";

function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = document.getElementById("input-lang").value;
    recognition.continuous = true;

    recognition.onresult = async function(event) {
        let text = event.results[event.resultIndex][0].transcript;
        originalText = text;
        document.getElementById("original").innerText = text;

        translateText(text);
    };

    recognition.start();
    console.log("Recording started");
}

function stopRecording() {
    if (recognition) recognition.stop();
    console.log("Recording stopped");
}

async function translateText(text) {
    const outputLang = document.getElementById("output-lang").value;

    const res = await fetch(`${BACKEND_URL}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            text: text,
            target_language: outputLang
        })
    });

    const data = await res.json();
    translatedText = data.translated_text;

    document.getElementById("translated").innerText = translatedText;
}

function speakTranslated() {
    const synth = window.speechSynthesis;
    let utter = new SpeechSynthesisUtterance(translatedText);
    utter.lang = document.getElementById("output-lang").value;
    synth.speak(utter);
}
