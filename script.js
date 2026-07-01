// ======================================
// TARANG Step 3
// Slider + Voice
// ======================================

let currentPage = 0;

const audioFiles = {
    welcome : "shubh_Welcome.mp3",

    enIntro : "Eng_1st.mp3",
    hiIntro : "Hindi_1st.mp3",
    paIntro : "shubh_tts_audio.mp3",

    enManual : "Eng_2nd.mp3",
    hiManual : "Hindi_2nd.mp3",
    paManual : "shubh_manual_audio.mp3"
};

const slider = document.getElementById("slider");
const dots = document.querySelectorAll(".dots span");

let appStarted = false;

function startApp() {

    if (appStarted) return;

    appStarted = true;

    showPage();
}

document.addEventListener("pointerdown", function () {

    startApp();

});

// ------------------------
// AUDIO PLAYER
// ------------------------

let player = new Audio();

function stopAllAudio() {

    // Stop browser TTS
    speechSynthesis.cancel();

    // Stop MP3 completely
    player.pause();
    player.removeAttribute("src");
    player.load();

}
function playAudio(file) {

    stopAllAudio();

    setTimeout(() => {

        player.src = file;

        player.load();

        player.play().catch(err => {
            console.log(err);
        });

    }, 150);

}

// ------------------------
// SPEAK FUNCTION
// ------------------------

function speak(text, language) {

    speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance(text);

    const voices = speechSynthesis.getVoices();

    let selectedVoice = null;

    if (language === "en") {
        selectedVoice = voices.find(v => v.lang.startsWith("en"));
    }

    if (language === "hi") {
        selectedVoice = voices.find(v => v.lang.startsWith("hi"));
    }

    if (language === "pa") {
        selectedVoice = voices.find(v => v.lang.startsWith("pa"));

        // Fallback to Hindi
        if (!selectedVoice)
            selectedVoice = voices.find(v => v.lang.startsWith("hi"));

        // Final fallback to English
        if (!selectedVoice)
            selectedVoice = voices.find(v => v.lang.startsWith("en"));
    }

    if (selectedVoice)
        msg.voice = selectedVoice;

    msg.volume = 1;
    msg.rate = 1.2;
    msg.pitch = 1;
stopAllAudio();
    speechSynthesis.speak(msg);

}

// ======================================
// OPEN MANUAL
// ======================================

function openManual(){

    stopAllAudio();

    let manual;
    let file;

    switch(currentPage){

        case 1:
            manual = manuals.en;
            file = audioFiles.enManual;
            break;

        case 2:
            manual = manuals.hi;
            file = audioFiles.hiManual;
            break;

        case 3:
            manual = manuals.pa;
            file = audioFiles.paManual;
            break;

        default:
            return;
    }

    document.getElementById("manualTitle").innerHTML = manual.title;
    document.getElementById("manualText").innerHTML = manual.text;

    document.getElementById("manualPage").style.display = "block";
    document.getElementById("viewport").style.display = "none";
    document.querySelector(".dots").style.display = "none";

    playAudio(file);

}
// ------------------------
// SHOW PAGE
// ------------------------

function showPage(){

    slider.style.transform = `translateX(-${currentPage*100}vw)`;

    dots.forEach((dot,index)=>{
        dot.classList.toggle("active", index===currentPage);
    });

    stopAllAudio();

    switch(currentPage){

        case 0:
            playAudio(audioFiles.welcome);
            break;

        case 1:
            playAudio(audioFiles.enIntro);
            break;

        case 2:
            playAudio(audioFiles.hiIntro);
            break;

        case 3:
            playAudio(audioFiles.paIntro);
            break;
    }

}
// ------------------------
// KEYBOARD
// ------------------------

document.addEventListener("keydown",function(e){

      if (e.key === "ArrowRight") {

        currentPage++;

        if (currentPage > 3)
            currentPage = 0;

        showPage();

    }

    if (e.key === "ArrowLeft") {

        currentPage--;

        if (currentPage < 0)
            currentPage = 3;

        showPage();

    }


});

// ------------------------
// START
// ------------------------

window.onload=function(){
       showPage();

    setTimeout(showPage,500);

};

document.getElementById("replayBtn").onclick=function(){

    switch(currentPage){

        case 1:
            playAudio(audioFiles.enManual);
            break;

        case 2:
            playAudio(audioFiles.hiManual);
            break;

        case 3:
            playAudio(audioFiles.paManual);
            break;
    }

};
// ======================================
// DOUBLE CLICK
// ======================================

document.addEventListener("dblclick",function(){
 const manualPage = document.getElementById("manualPage");

    // If manual is open, go back
    if (manualPage.style.display === "block") {

        stopAllAudio();

        manualPage.style.display = "none";

        document.getElementById("viewport").style.display = "block";

        document.querySelector(".dots").style.display = "block";

        showPage();      // Speak current language again

        return;
    }

    // Welcome page
    if (currentPage === 0)
        return;

    // Open manual
    openManual();


});

document.getElementById("backBtn").onclick = function () {

    stopAllAudio();

    document.getElementById("manualPage").style.display = "none";

    document.getElementById("viewport").style.display = "block";

    document.querySelector(".dots").style.display = "block";

    showPage();

};
