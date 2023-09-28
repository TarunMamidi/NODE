const convertBtn = document.getElementById("convert-btn");
const textInput = document.getElementById("text-input");

let voices = [];

let voiceSelect = document.querySelector("select");

window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    speechSynthesis.voice = voices[0];

    voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
};

voiceSelect.addEventListener("change", () => {
    speech.voice = voices[voiceSelect.value];
});

convertBtn.addEventListener("click", () => {
    const text = textInput.value;
    if (text !== "") {
        convertToSpeech(text);
    }
});

function convertToSpeech(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}
