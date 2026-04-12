const msgInput = document.getElementById('msgInput');
const btnSend = document.getElementById('btnSend');
const btnMic = document.getElementById('btnMic');
const chatBody = document.getElementById('chatBody');
const btnVoice = document.getElementById('btnVoice');
const btnVideo = document.getElementById('btnVideo');
const callOverlay = document.getElementById('callOverlay');
const videoOverlay = document.getElementById('videoOverlay');
const btnEndCall = document.getElementById('btnEndCall');
const btnEndVideo = document.getElementById('btnEndVideo');
const callStatus = document.getElementById('callStatus');
const btnBack = document.getElementById('btnBack');

let callTimer = null;
let secondsElapsed = 0;

function getNow() {
    const d = new Date();
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return h + ':' + m;
}

function addMessage(text, type) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message', type);

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    const p = document.createElement('p');
    p.textContent = text;

    const time = document.createElement('span');
    time.classList.add('time');

    if (type === 'sent') {
        time.innerHTML = getNow() + ' <span class="ticks">✓</span>';
    } else {
        time.textContent = getNow();
    }

    bubble.appendChild(p);
    bubble.appendChild(time);
    wrapper.appendChild(bubble);
    chatBody.appendChild(wrapper);
    chatBody.scrollTop = chatBody.scrollHeight;

    if (type === 'sent') {
        setTimeout(() => {
            const tick = bubble.querySelector('.ticks');
            if (tick) tick.textContent = '✓✓';
        }, 1500);
        setTimeout(() => {
            const tick = bubble.querySelector('.ticks');
            if (tick) tick.classList.add('read');
        }, 3000);

        setTimeout(() => {
            const replies = [
                'Ok je vois 😊',
                'Super !',
                'D\'accord',
                'Haha 😂',
                'Wow vraiment ?',
                '👍',
                'Je te réponds plus tard',
                'Trop bien !',
                'Pas de souci'
            ];
            const reply = replies[Math.floor(Math.random() * replies.length)];
            addMessage(reply, 'received');
        }, 2000 + Math.random() * 1500);
    }
}

function sendMessage() {
    const text = msgInput.value.trim();
    if (!text) return;
    addMessage(text, 'sent');
    msgInput.value = '';
    toggleSendMic();
}

function toggleSendMic() {
    if (msgInput.value.trim().length > 0) {
        btnSend.style.display = 'flex';
        btnMic.style.display = 'none';
    } else {
        btnSend.style.display = 'none';
        btnMic.style.display = 'flex';
    }
}

function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return m + ':' + sec;
}

function startCallTimer() {
    secondsElapsed = 0;
    callTimer = setInterval(() => {
        secondsElapsed++;
        callStatus.textContent = formatTime(secondsElapsed);
    }, 1000);
}

function stopCallTimer() {
    clearInterval(callTimer);
    callTimer = null;
}

btnSend.addEventListener('click', sendMessage);

msgInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
});

msgInput.addEventListener('input', toggleSendMic);

btnVoice.addEventListener('click', () => {
    callStatus.textContent = 'Appel en cours...';
    callOverlay.classList.add('active');
    setTimeout(() => startCallTimer(), 1500);
});

btnEndCall.addEventListener('click', () => {
    callOverlay.classList.remove('active');
    stopCallTimer();
});

btnVideo.addEventListener('click', () => {
    videoOverlay.classList.add('active');
});

btnEndVideo.addEventListener('click', () => {
    videoOverlay.classList.remove('active');
});

btnBack.addEventListener('click', () => {
    alert('Retour à la liste des contacts');
});

document.getElementById('btnMute').addEventListener('click', function () {
    this.style.background = this.style.background === 'rgb(0, 168, 132)' ? '' : '#00a884';
});

document.getElementById('btnSpeaker').addEventListener('click', function () {
    this.style.background = this.style.background === 'rgb(0, 168, 132)' ? '' : '#00a884';
});

document.getElementById('btnCam').addEventListener('click', function () {
    this.style.background = this.style.background === 'rgb(240, 40, 73)' ? '' : '#f02849';
});

chatBody.scrollTop = chatBody.scrollHeight;