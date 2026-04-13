const messagesArea = document.getElementById('messagesArea');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const emojiBtn = document.getElementById('emojiBtn');
const emojiPicker = document.getElementById('emojiPicker');
const videoCallBtn = document.getElementById('videoCallBtn');
const voiceCallBtn = document.getElementById('voiceCallBtn');
const groupInfoBtn = document.getElementById('groupInfoBtn');
const groupInfoPanel = document.getElementById('groupInfoPanel');
const closePanelBtn = document.getElementById('closePanelBtn');
const panelOverlay = document.getElementById('panelOverlay');
const callModal = document.getElementById('callModal');
const callTitle = document.getElementById('callTitle');
const endCallBtn = document.getElementById('endCallBtn');
const backBtn = document.getElementById('backBtn');
const sidebar = document.querySelector('.sidebar');
const micBtn = document.getElementById('micBtn');
const attachBtn = document.getElementById('attachBtn');
const typingIndicator = document.getElementById('typingIndicator');

function getCurrentTime() {
  const now = new Date();
  return now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
}

function scrollToBottom(smooth = true) {
  messagesArea.scrollTo({ top: messagesArea.scrollHeight, behavior: smooth ? 'smooth' : 'instant' });
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function createOutgoingMsg(text) {
  const block = document.createElement('div');
  block.className = 'msg-block outgoing new-msg';
  block.innerHTML = `
    <div class="msg-content">
      <div class="msg-bubble out-bubble">
        <p>${escapeHTML(text)}</p>
        <span class="msg-time">${getCurrentTime()} <i class="fas fa-check"></i></span>
      </div>
    </div>`;
  return block;
}

function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;
  if (typingIndicator.parentNode) messagesArea.removeChild(typingIndicator);
  const msg = createOutgoingMsg(text);
  messagesArea.appendChild(msg);
  msgInput.value = '';
  msgInput.style.height = 'auto';
  scrollToBottom();
  setTimeout(() => showTypingThenReply(), 1200);
}

function showTypingThenReply() {
  messagesArea.appendChild(typingIndicator);
  scrollToBottom();
  setTimeout(() => {
    if (typingIndicator.parentNode) messagesArea.removeChild(typingIndicator);
    scrollToBottom();
  }, 2000);
}

sendBtn.addEventListener('click', sendMessage);

msgInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

msgInput.addEventListener('input', () => {
  msgInput.style.height = 'auto';
  msgInput.style.height = Math.min(msgInput.scrollHeight, 100) + 'px';
});

emojiBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  emojiPicker.classList.toggle('show');
});

document.querySelectorAll('.emoji-grid span').forEach(span => {
  span.addEventListener('click', () => {
    msgInput.value += span.textContent;
    msgInput.focus();
    emojiPicker.classList.remove('show');
  });
});

document.addEventListener('click', (e) => {
  if (!emojiPicker.contains(e.target) && e.target !== emojiBtn) {
    emojiPicker.classList.remove('show');
  }
});

function openGroupPanel() {
  groupInfoPanel.classList.add('open');
  panelOverlay.classList.add('show');
}
function closeGroupPanel() {
  groupInfoPanel.classList.remove('open');
  panelOverlay.classList.remove('show');
}

groupInfoBtn.addEventListener('click', openGroupPanel);
closePanelBtn.addEventListener('click', closeGroupPanel);
panelOverlay.addEventListener('click', closeGroupPanel);

function openCall(isVideo) {
  callTitle.textContent = isVideo ? 'Appel vidéo en cours...' : 'Appel audio en cours...';
  callModal.classList.remove('hidden');
}

videoCallBtn.addEventListener('click', () => openCall(true));
voiceCallBtn.addEventListener('click', () => openCall(false));
endCallBtn.addEventListener('click', () => callModal.classList.add('hidden'));

backBtn.addEventListener('click', () => {
  sidebar.classList.remove('hidden');
});

document.querySelectorAll('.conv-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.conv-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    if (window.innerWidth <= 768) {
      sidebar.classList.add('hidden');
    }
  });
});

attachBtn.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '*/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const block = document.createElement('div');
    block.className = 'msg-block outgoing new-msg';
    const isImg = file.type.startsWith('image/');
    let inner = '';
    if (isImg) {
      const url = URL.createObjectURL(file);
      inner = `<img src="${url}" style="max-width:220px;border-radius:10px;display:block;margin-bottom:4px;" />`;
    } else {
      const ext = file.name.split('.').pop().toUpperCase();
      inner = `<div class="file-preview">
        <div class="file-icon"><i class="fas fa-file"></i></div>
        <div class="file-details">
          <span class="file-name">${escapeHTML(file.name)}</span>
          <span class="file-size">${(file.size/1024).toFixed(1)} KB • ${ext}</span>
        </div>
      </div>`;
    }
    block.innerHTML = `<div class="msg-content"><div class="msg-bubble out-bubble">${inner}<span class="msg-time">${getCurrentTime()} <i class="fas fa-check"></i></span></div></div>`;
    if (typingIndicator.parentNode) messagesArea.removeChild(typingIndicator);
    messagesArea.appendChild(block);
    scrollToBottom();
  };
  input.click();
});

document.querySelectorAll('.file-download').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const nameEl = btn.closest('.file-preview').querySelector('.file-name');
    if (nameEl) alert('Téléchargement : ' + nameEl.textContent);
  });
});

scrollToBottom(false);