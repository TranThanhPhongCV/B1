(() => {
  'use strict';

  const DATA = window.B1_DATA;
  const content = document.getElementById('content');
  const searchInput = document.getElementById('globalSearch');
  const toast = document.getElementById('toast');
  const TOTAL = DATA.topics.reduce((sum, topic) => sum + topic.items.length, 0);
  const allItems = DATA.topics.flatMap(topic => topic.items.map((item, index) => ({ ...item, topic, index })));

  const LEGACY_KEY = 'b1-speaking-state';
  const USERS_KEY = 'b1-speaking-users-v3';
  const SESSION_KEY = 'b1-speaking-session-v3';
  let currentUser = localStorage.getItem(SESSION_KEY) || '';
  let onboardingStep = 0;

  function profileKey(username = currentUser) {
    return `b1-speaking-profile-v3:${String(username || '').toLowerCase()}`;
  }

  const profileSaved = currentUser ? safeJSON(localStorage.getItem(profileKey(currentUser))) : null;
  const saved = profileSaved || safeJSON(localStorage.getItem(LEGACY_KEY)) || {};
  const state = {
    view: saved.view || 'dashboard',
    onboardingCompleted: saved.onboardingCompleted === true,
    answerMode: saved.answerMode || 'natural',
    showTranslation: saved.showTranslation !== false,
    fontScale: saved.fontScale || 1,
    selectedTopic: saved.selectedTopic || 'internet',
    mastered: new Set(saved.mastered || []),
    search: '',
    flashTopic: saved.flashTopic || 'all',
    flashIndex: 0,
    flashFlipped: false,
    practiceTab: saved.practiceTab || 'quiz',
    practiceScope: saved.practiceScope || 'all',
    practiceItemId: null,
    reviewFilter: 'all',
    reviewSearch: '',
    review: saved.review || {},
    stats: saved.stats || { attempts: 0, correct: 0, wrong: 0, uncertain: 0 },
    quizOptions: [],
    quizChoice: null,
    blankMask: [],
    blankRevealed: false,
    recallText: '',
    recallScore: null,
    dialogueRole: 'none',
    pictureForm: saved.pictureForm || {
      topic: 'people spending time together',
      people: 'three',
      relationship: 'friends',
      place: 'a park',
      activity: 'talking and relaxing together',
      appearance: 'The person on the left is wearing a T-shirt and jeans.',
      feeling: 'happy and relaxed',
      background: 'some trees, benches and a path',
      opinion: 'I like this picture because it shows a peaceful and friendly moment.',
      overall: 'pleasant and memorable'
    },
    generatedPicture: '',
    answerForm: saved.answerForm || {
      question: 'Do you often use the Internet?',
      direct: 'Yes, I do',
      reason: 'it helps me find information quickly',
      example: 'I use it to study English and read the news every day',
      result: 'it makes my daily life easier'
    },
    generatedAnswer: '',
    dreamForm: saved.dreamForm || {
      question: 'What do you usually do in your free time?',
      direct: 'I usually read books and listen to music',
      reason: 'these activities help me relax after studying',
      example: 'I often read short English stories before going to bed',
      add: 'I also share interesting books with my friends',
      ending: 'Overall, they make my free time more enjoyable'
    },
    generatedDream: '',
    emailForm: saved.emailForm || {
      tone: 'informal',
      recipient: 'Alex',
      purpose: 'tell you about my hometown',
      point1: 'It is a small and peaceful city in central Vietnam',
      point2: 'There are many beautiful places and delicious local dishes',
      response: 'I think you would enjoy spending a few days here',
      nextAction: 'Would you like to visit it with me next summer?',
      sender: 'Phong'
    },
    generatedEmail: ''
  };

  function safeJSON(text) {
    try { return text ? JSON.parse(text) : null; } catch { return null; }
  }

  function getUsers() {
    return safeJSON(localStorage.getItem(USERS_KEY)) || {};
  }

  function setUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function cleanUsername(value = '') {
    return String(value).trim().toLowerCase();
  }

  function makeSalt() {
    const bytes = new Uint8Array(16);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(bytes);
    else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    return [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  function sha256Fallback(input) {
    const text = unescape(encodeURIComponent(input));
    const rightRotate = (value, amount) => (value >>> amount) | (value << (32 - amount));
    const maxWord = Math.pow(2, 32);
    const words = [];
    const bitLength = text.length * 8;
    const hash = [];
    const constants = [];
    const composite = {};
    let primeCount = 0;
    for (let candidate = 2; primeCount < 64; candidate++) {
      if (!composite[candidate]) {
        for (let multiple = candidate * candidate; multiple < 400; multiple += candidate) composite[multiple] = true;
        if (primeCount < 8) hash[primeCount] = (Math.pow(candidate, 0.5) * maxWord) | 0;
        constants[primeCount] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
        primeCount++;
      }
    }
    let padded = text + '\x80';
    while (padded.length % 64 !== 56) padded += '\x00';
    for (let i = 0; i < padded.length; i++) words[i >> 2] |= padded.charCodeAt(i) << ((3 - i) % 4) * 8;
    words.push((bitLength / maxWord) | 0);
    words.push(bitLength);
    for (let offset = 0; offset < words.length; offset += 16) {
      const chunk = words.slice(offset, offset + 16);
      const working = hash.slice();
      for (let i = 0; i < 64; i++) {
        const w15 = chunk[i - 15];
        const w2 = chunk[i - 2];
        const a = working[0], e = working[4];
        const word = i < 16 ? chunk[i] : (
          chunk[i - 16] +
          (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
          chunk[i - 7] +
          (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
        ) | 0;
        chunk[i] = word;
        const temp1 = (working[7] + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + ((e & working[5]) ^ (~e & working[6])) + constants[i] + word) | 0;
        const temp2 = ((rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + ((a & working[1]) ^ (a & working[2]) ^ (working[1] & working[2]))) | 0;
        working.unshift((temp1 + temp2) | 0);
        working[4] = (working[4] + temp1) | 0;
        working.pop();
      }
      for (let i = 0; i < 8; i++) hash[i] = (hash[i] + working[i]) | 0;
    }
    return hash.map(value => (value >>> 0).toString(16).padStart(8, '0')).join('');
  }

  async function passwordDigest(password, salt) {
    const value = `${salt}:${password}`;
    if (window.crypto?.subtle && window.TextEncoder) {
      const buffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
      return [...new Uint8Array(buffer)].map(byte => byte.toString(16).padStart(2, '0')).join('');
    }
    return sha256Fallback(value);
  }

  function displayUser() {
    if (currentUser === '__guest__') return { username: 'guest', displayName: 'Học thử' };
    return getUsers()[currentUser] || { username: currentUser || '', displayName: currentUser || 'Tài khoản' };
  }

  function initials(name = '') {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? parts[0][0] + parts.at(-1)[0] : (parts[0] || '?').slice(0, 2)).toUpperCase();
  }

  function updateAccountChrome() {
    const user = displayUser();
    const avatar = initials(user.displayName);
    document.getElementById('profileAvatar').textContent = avatar;
    document.getElementById('profileName').textContent = user.displayName;
    document.getElementById('menuAvatar').textContent = avatar;
    document.getElementById('menuName').textContent = user.displayName;
    document.getElementById('menuUser').textContent = currentUser === '__guest__' ? 'Chế độ học thử' : `@${user.username}`;
  }

  function setAuthTab(tab = 'login') {
    document.querySelectorAll('[data-auth-tab]').forEach(button => button.classList.toggle('active', button.dataset.authTab === tab));
    document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
    document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register');
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
  }

  function openAuth(tab = 'login', allowClose = Boolean(currentUser)) {
    setAuthTab(tab);
    const overlay = document.getElementById('authOverlay');
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    document.getElementById('authClose').classList.toggle('hidden', !allowClose);
    document.getElementById('guestButton').classList.toggle('hidden', Boolean(currentUser));
    setTimeout(() => overlay.querySelector('input:not([type="checkbox"])')?.focus(), 50);
  }

  function closeAuth() {
    if (!currentUser) return;
    const overlay = document.getElementById('authOverlay');
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
  }

  function syncDeviceMode() {
    const width = window.innerWidth;
    const mode = width <= 660 ? 'phone' : width <= 1024 ? 'tablet' : 'laptop';
    document.documentElement.dataset.device = mode;
  }

  function updateOnboarding() {
    const steps = [...document.querySelectorAll('[data-onboarding-step]')];
    const dots = [...document.querySelectorAll('.onboarding-progress span')];
    onboardingStep = Math.max(0, Math.min(onboardingStep, steps.length - 1));
    steps.forEach((step, index) => step.classList.toggle('active', index === onboardingStep));
    dots.forEach((dot, index) => dot.classList.toggle('active', index <= onboardingStep));
    const counter = document.getElementById('onboardingCounter');
    if (counter) counter.textContent = `${onboardingStep + 1} / ${steps.length}`;
    const prev = document.querySelector('[data-onboarding-prev]');
    const next = document.querySelector('[data-onboarding-next]');
    if (prev) prev.disabled = onboardingStep === 0;
    if (next) next.classList.toggle('hidden', onboardingStep === steps.length - 1);
  }

  function openOnboarding(force = false) {
    if (!currentUser || (!force && state.onboardingCompleted)) return;
    onboardingStep = 0;
    const overlay = document.getElementById('onboardingOverlay');
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    updateOnboarding();
    setTimeout(() => overlay.querySelector('button:not([disabled])')?.focus(), 40);
  }

  function closeOnboarding(markComplete = true) {
    const overlay = document.getElementById('onboardingOverlay');
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (markComplete) {
      state.onboardingCompleted = true;
      saveState();
    }
  }

  function finishOnboarding(view = 'dashboard') {
    closeOnboarding(true);
    setView(view);
  }

  function startSession(username) {
    localStorage.setItem(SESSION_KEY, username);
    window.location.reload();
  }

  function profileSnapshot() {
    return {
      view: state.view,
      onboardingCompleted: state.onboardingCompleted,
      answerMode: state.answerMode,
      showTranslation: state.showTranslation,
      fontScale: state.fontScale,
      selectedTopic: state.selectedTopic,
      mastered: [...state.mastered],
      flashTopic: state.flashTopic,
      practiceTab: state.practiceTab,
      practiceScope: state.practiceScope,
      review: state.review,
      stats: state.stats,
      answerForm: state.answerForm,
      dreamForm: state.dreamForm,
      emailForm: state.emailForm,
      pictureForm: state.pictureForm,
      updatedAt: new Date().toISOString()
    };
  }

  function saveState() {
    if (!currentUser) return;
    localStorage.setItem(profileKey(), JSON.stringify(profileSnapshot()));
  }

  function escapeHTML(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function normalize(text = '') {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function answerFor(item) {
    if (state.answerMode === 'original') {
      return item.original || 'Tài liệu gốc không có câu trả lời cho câu này.';
    }
    return item.natural;
  }

  function reviewEntry(id) {
    return state.review[id] || null;
  }

  function reviewQueue(filter = 'all') {
    const entries = Object.entries(state.review).map(([id, entry]) => ({ id, ...entry, item: allItems.find(item => item.id === id) }))
      .filter(entry => entry.item);
    const filtered = filter === 'all' ? entries : entries.filter(entry => entry.status === filter);
    const order = { wrong: 0, uncertain: 1, improving: 2 };
    return filtered.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9) || (b.wrongCount || 0) - (a.wrongCount || 0) || String(b.lastAttempt || '').localeCompare(String(a.lastAttempt || '')));
  }

  function statusText(status) {
    return ({ wrong: 'Cần học lại', uncertain: 'Chưa chắc', improving: 'Đang tiến bộ' })[status] || 'Cần ôn';
  }

  function recordAttempt(itemId, result, mode = 'manual', score = null) {
    const now = new Date().toISOString();
    const previous = state.review[itemId] || { status: result, wrongCount: 0, uncertainCount: 0, correctStreak: 0 };
    state.stats.attempts = (state.stats.attempts || 0) + 1;

    if (result === 'correct') {
      state.stats.correct = (state.stats.correct || 0) + 1;
      if (state.review[itemId]) {
        previous.correctStreak = (previous.correctStreak || 0) + 1;
        previous.lastAttempt = now;
        previous.lastMode = mode;
        previous.lastScore = score;
        if (previous.correctStreak >= 2) delete state.review[itemId];
        else state.review[itemId] = { ...previous, status: 'improving' };
      }
    } else {
      previous.correctStreak = 0;
      previous.lastAttempt = now;
      previous.lastMode = mode;
      previous.lastScore = score;
      if (result === 'wrong') {
        state.stats.wrong = (state.stats.wrong || 0) + 1;
        previous.status = 'wrong';
        previous.wrongCount = (previous.wrongCount || 0) + 1;
      } else {
        state.stats.uncertain = (state.stats.uncertain || 0) + 1;
        previous.status = previous.status === 'wrong' ? 'wrong' : 'uncertain';
        previous.uncertainCount = (previous.uncertainCount || 0) + 1;
      }
      state.review[itemId] = previous;
      state.mastered.delete(itemId);
    }
    saveState();
  }

  function flagForReview(itemId, status = 'uncertain') {
    const previous = state.review[itemId] || { wrongCount: 0, uncertainCount: 0, correctStreak: 0 };
    state.review[itemId] = {
      ...previous,
      status,
      uncertainCount: (previous.uncertainCount || 0) + (status === 'uncertain' ? 1 : 0),
      wrongCount: (previous.wrongCount || 0) + (status === 'wrong' ? 1 : 0),
      correctStreak: 0,
      lastAttempt: new Date().toISOString(),
      lastMode: 'manual'
    };
    state.mastered.delete(itemId);
    saveState();
  }

  function topicProgress(topic) {
    const done = topic.items.filter(item => state.mastered.has(item.id)).length;
    return { done, total: topic.items.length, percent: Math.round(done / topic.items.length * 100) || 0 };
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function speak(text, rate = 0.92) {
    if (!('speechSynthesis' in window)) {
      showToast('Trình duyệt này không hỗ trợ đọc giọng nói.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = rate;
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices.find(v => /^en-(GB|US)/.test(v.lang)) || voices.find(v => v.lang.startsWith('en')) || null;
    window.speechSynthesis.speak(utterance);
  }

  function copyText(text) {
    const fallback = () => {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand('copy');
        showToast('Đã sao chép.');
      } catch {
        showToast('Không thể sao chép tự động.');
      }
      area.remove();
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast('Đã sao chép.')).catch(fallback);
    } else {
      fallback();
    }
  }

  function updateChrome() {
    syncDeviceMode();
    document.documentElement.style.setProperty('--text-scale', state.fontScale);
    updateAccountChrome();
    document.getElementById('modeNatural').classList.toggle('active', state.answerMode === 'natural');
    document.getElementById('modeOriginal').classList.toggle('active', state.answerMode === 'original');
    const vi = document.getElementById('translationToggle');
    vi.classList.toggle('active', state.showTranslation);
    vi.setAttribute('aria-pressed', String(state.showTranslation));

    const done = state.mastered.size;
    document.getElementById('sideProgressBar').style.width = `${Math.round(done / TOTAL * 100)}%`;
    document.getElementById('sideProgressText').textContent = `${done} / ${TOTAL} câu`;

    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === state.view && !state.search);
    });
  }

  function modeSwitch() {
    return `<div class="segmented inline-mode" aria-label="Chọn bản câu trả lời">
      <button data-set-mode="natural" class="${state.answerMode === 'natural' ? 'active' : ''}">Bản dễ nói</button>
      <button data-set-mode="original" class="${state.answerMode === 'original' ? 'active' : ''}">Bản gốc</button>
    </div>`;
  }

  function pageHead(eyebrow, title, description, action = '') {
    return `<div class="page-head">
      <div><div class="eyebrow">${escapeHTML(eyebrow)}</div><h1>${escapeHTML(title)}</h1><p>${escapeHTML(description)}</p></div>
      ${action}
    </div>`;
  }

  function topicCards(limit = DATA.topics.length) {
    return `<div class="topic-grid">${DATA.topics.slice(0, limit).map(topic => {
      const p = topicProgress(topic);
      return `<button class="topic-card" data-open-topic="${topic.id}">
        <div class="topic-num">Chủ đề ${topic.number}</div>
        <h3>${escapeHTML(topic.title)}</h3>
        <p>${escapeHTML(topic.titleVi)} · ${topic.items.length} câu</p>
        <div class="topic-progress"><span style="width:${p.percent}%"></span></div>
      </button>`;
    }).join('')}</div>`;
  }

  function renderDashboard() {
    const done = state.mastered.size;
    const pct = Math.round(done / TOTAL * 100);
    const reviewCount = reviewQueue().length;
    const accuracy = state.stats.attempts ? Math.round((state.stats.correct || 0) / state.stats.attempts * 100) : 0;
    const next = allItems.find(item => !state.mastered.has(item.id)) || allItems[0];
    content.innerHTML = `
      <section class="hero">
        <div>
          <div class="eyebrow" style="color:#a9d8d0">B1 Speaking · Bộ tài liệu cá nhân</div>
          <h1>Học đúng sườn,<br>nhớ theo từng lớp.</h1>
          <p>Toàn bộ 3 file đã được tách thành 66 câu hỏi, khung mô tả tranh và mẫu hội thoại. Bản gốc được giữ nguyên để đối chiếu; bản dễ nói đã được sửa về ngữ pháp và rút gọn ở mức B1.</p>
          <div class="hero-actions">
            <button class="button white" data-view="universal">Mở sườn vạn năng</button>
            <button class="button ghost-white" data-open-topic="${next.topic.id}">Tiếp tục học chủ đề</button>
            <button class="button ghost-white" data-view="review">Ôn ${reviewCount} câu chưa vững</button>
          </div>
        </div>
        <div class="hero-panel">
          <strong>${pct}%</strong>
          <span>${done} trong ${TOTAL} câu đã đánh dấu thuộc</span>
          <div class="progress-line" style="margin-top:18px"><span style="width:${pct}%"></span></div>
        </div>
      </section>

      <div class="metrics">
        <div class="metric"><div class="metric-icon">✓</div><strong>${done}</strong><span>Câu đã đánh dấu thuộc</span></div>
        <button class="metric metric-button" data-view="review"><div class="metric-icon">↺</div><strong>${reviewCount}</strong><span>Câu đang chờ ôn lại</span></button>
        <div class="metric"><div class="metric-icon">◎</div><strong>${state.stats.attempts || 0}</strong><span>Lượt tự kiểm tra</span></div>
        <div class="metric"><div class="metric-icon">%</div><strong>${accuracy}%</strong><span>Tỷ lệ nhớ đúng</span></div>
      </div>

      ${reviewCount ? `<div class="review-callout"><div><div class="eyebrow">Hệ thống ôn lại thông minh</div><h2>Bạn còn ${reviewCount} câu chưa thật sự chắc</h2><p>Câu sai được xếp trước câu chưa chắc. Trả lời đúng hai lần liên tiếp để hoàn tất một câu.</p></div><button class="button primary" data-start-review>Ôn ngay →</button></div>` : `<div class="review-callout success"><div><div class="eyebrow">Danh sách ôn lại đang trống</div><h2>Chưa có câu yếu nào được ghi nhận</h2><p>Hãy làm Luyện nhanh hoặc tự đánh giá flashcard để web tìm đúng phần bạn cần học kỹ.</p></div><button class="button" data-view="practice">Bắt đầu tự kiểm tra</button></div>`}

      <div class="section-title"><h2>Học cách tạo câu trước</h2><p>Phù hợp khi bạn chưa biết bắt đầu trả lời từ đâu.</p></div>
      <div class="starter-banner">
        <div><div class="eyebrow">Dành cho người mới bắt đầu</div><h2>Không học thuộc cả đoạn — học khung rồi thay từ</h2><p>Nhận dạng câu hỏi, ghép một câu đúng trật tự, mở rộng thành đoạn và dùng khung email có thể đổi chủ đề chỉ bằng vài cụm từ.</p></div>
        <button class="button primary" data-view="starter">Mở phần Học từ số 0 →</button>
      </div>

      <div class="section-title"><h2>Chọn chủ đề để bắt đầu</h2><p>Đánh dấu ✓ khi bạn có thể trả lời không nhìn đáp án.</p></div>
      ${topicCards()}

      <div class="section-title"><h2>Cách dùng hiệu quả</h2></div>
      <div class="grid-3">
        <div class="panel"><div class="eyebrow">Lượt 1 · Hiểu</div><h3>Đọc câu hỏi và nghĩa Việt</h3><p class="subtle">Mở đáp án “Bản dễ nói”, nghe phát âm và đọc thành tiếng hai lần.</p></div>
        <div class="panel"><div class="eyebrow">Lượt 2 · Nhớ</div><h3>Lật flashcard</h3><p class="subtle">Nhìn câu hỏi, tự nói trước rồi mới lật thẻ. Không cần nói giống 100%, chỉ cần đúng ý.</p></div>
        <div class="panel"><div class="eyebrow">Lượt 3 · Phản xạ</div><h3>Luyện nhanh không nhìn bài</h3><p class="subtle">Làm trắc nghiệm, điền từ và tự gõ lại câu trả lời để tìm phần còn yếu.</p></div>
      </div>

      <div class="section-title"><h2>Lưu ý về dữ liệu</h2></div>
      <div class="notice">Một số câu trong tài liệu gốc có lỗi ngữ pháp, dùng từ hoặc không thống nhất chuyên ngành. Web không xóa các câu đó: bạn có thể chuyển sang <strong>Bản gốc</strong> để đối chiếu, còn chế độ mặc định dùng <strong>Bản dễ nói</strong> đã sửa ở mức B1.</div>
    `;
  }

  function questionCard(item, displayIndex) {
    const mastered = state.mastered.has(item.id);
    const answer = answerFor(item);
    const originalBlank = state.answerMode === 'original' && !item.original;
    const review = reviewEntry(item.id);
    return `<article class="question-card ${review ? `has-review review-${review.status}` : ''}" id="q-${item.id}">
      <div class="question-top">
        <div class="question-number">${displayIndex}</div>
        <div class="question-main">
          <h3>${escapeHTML(item.question)}</h3>
          ${state.showTranslation ? `<p class="translation">${escapeHTML(item.questionVi)}</p>` : ''}
          ${review ? `<span class="review-badge ${review.status}">${statusText(review.status)}</span>` : ''}
        </div>
        <div class="question-actions">
          <button class="icon-mini" data-speak="${escapeHTML(item.question)}" title="Nghe câu hỏi" aria-label="Nghe câu hỏi">▶</button>
          <button class="icon-mini ${mastered ? 'mastered' : ''}" data-master="${item.id}" title="Đánh dấu đã thuộc" aria-label="Đánh dấu đã thuộc">✓</button>
          <button class="button small" data-toggle-answer="${item.id}">Hiện đáp án</button>
        </div>
      </div>
      <div class="answer-box">
        <div class="answer-label">${state.answerMode === 'natural' ? 'Bản dễ nói' : 'Bản gốc trong file'}</div>
        <p class="${originalBlank ? 'original-warning' : ''}">${escapeHTML(answer)}</p>
        ${state.showTranslation && state.answerMode === 'natural' ? `<p class="answer-vi">${escapeHTML(item.answerVi)}</p>` : ''}
        ${item.note ? `<div class="source-note">${escapeHTML(item.note)}</div>` : ''}
        <div class="filter-row" style="margin:12px 0 0">
          <button class="button small" data-speak="${escapeHTML(answer)}">▶ Nghe đáp án</button>
          <button class="button small" data-copy="${escapeHTML(answer)}">Sao chép</button>
          <button class="button small uncertain-button" data-mark-review="uncertain" data-item-id="${item.id}">? Chưa chắc</button>
          <button class="button small danger" data-mark-review="wrong" data-item-id="${item.id}">↺ Cần học lại</button>
        </div>
      </div>
    </article>`;
  }


  function sentence(text = '') {
    const clean = String(text).trim();
    if (!clean) return '';
    return /[.!?]$/.test(clean) ? clean : `${clean}.`;
  }

  function learningField(group, key, label, textarea = false, hint = '') {
    const form = group === 'answer' ? state.answerForm : state.emailForm;
    const value = form[key] || '';
    return `<div class="field"><label for="${group}-${key}">${escapeHTML(label)}</label>${textarea
      ? `<textarea id="${group}-${key}" data-learning-group="${group}" data-learning-field="${key}" rows="2">${escapeHTML(value)}</textarea>`
      : `<input id="${group}-${key}" data-learning-group="${group}" data-learning-field="${key}" value="${escapeHTML(value)}">`}${hint ? `<small class="field-hint">${escapeHTML(hint)}</small>` : ''}</div>`;
  }

  function answerPatternCard(title, question, frame, example, exampleVi = '') {
    return `<article class="pattern-card"><div class="pattern-question">${escapeHTML(title)}</div><h3>${escapeHTML(question)}</h3><div class="formula-line">${escapeHTML(frame)}</div><p><strong>Ví dụ:</strong> ${escapeHTML(example)}</p>${exampleVi ? `<small class="vi-guide block"><strong>Nghĩa:</strong> ${escapeHTML(exampleVi)}</small>` : ''}<button class="button small" data-speak="${escapeHTML(example)}">▶ Nghe ví dụ</button></article>`;
  }

  function generateStarterAnswer() {
    const f = state.answerForm;
    state.generatedAnswer = [
      sentence(f.direct),
      f.reason ? sentence(`This is because ${f.reason}`) : '',
      f.example ? sentence(`For example, ${f.example}`) : '',
      f.result ? sentence(`As a result, ${f.result}`) : ''
    ].filter(Boolean).join(' ');
  }

  function generateStarterEmail() {
    const f = state.emailForm;
    if (f.tone === 'formal') {
      state.generatedEmail = [
        `Dear ${f.recipient || 'Sir or Madam'},`,
        '',
        sentence(`I am writing to ${f.purpose}`),
        sentence(`Firstly, ${f.point1}`),
        sentence(`In addition, ${f.point2}`),
        sentence(f.response),
        sentence(f.nextAction || 'I would be grateful if you could reply soon'),
        '',
        'I look forward to hearing from you.',
        '',
        'Yours faithfully,',
        f.sender || 'Your name'
      ].join('\n');
    } else {
      state.generatedEmail = [
        `Hi ${f.recipient || 'Alex'},`,
        '',
        'Thanks for your email. It was great to hear from you.',
        sentence(`I'm writing to ${f.purpose}`),
        '',
        sentence(`First of all, ${f.point1}`),
        sentence(`Besides, ${f.point2}`),
        sentence(f.response),
        '',
        sentence(f.nextAction),
        'Anyway, that’s all for now. Write back soon.',
        '',
        'Best wishes,',
        f.sender || 'Your name'
      ].join('\n');
    }
  }

  function dreamField(key, label, textarea = false, hint = '') {
    const value = state.dreamForm[key] || '';
    return `<div class="field"><label for="dream-${key}">${escapeHTML(label)}</label>${textarea
      ? `<textarea id="dream-${key}" data-dream-field="${key}" rows="2">${escapeHTML(value)}</textarea>`
      : `<input id="dream-${key}" data-dream-field="${key}" value="${escapeHTML(value)}">`}${hint ? `<small class="field-hint">${escapeHTML(hint)}</small>` : ''}</div>`;
  }

  function generateDreamAnswer() {
    const f = state.dreamForm;
    state.generatedDream = [
      sentence(f.direct),
      f.reason ? sentence(`The main reason is that ${f.reason}`) : '',
      f.example ? sentence(`For example, ${f.example}`) : '',
      f.add ? sentence(`Besides, ${f.add}`) : '',
      sentence(f.ending)
    ].filter(Boolean).join(' ');
  }

  function renderUniversal() {
    const generated = state.generatedDream;
    content.innerHTML = `
      ${pageHead('Sườn chung cho mọi đề · Universal frames', 'Hai khung vạn năng: trả lời câu hỏi và mô tả tranh', 'Mỗi câu tiếng Anh đều có ghi chú tiếng Việt. Hãy đi lần lượt qua từng ô, dùng câu ngắn và chỉ thay nội dung nằm trong dấu [ ].')}

      <section class="universal-hero panel">
        <div><div class="eyebrow">Khung 1 · Trả lời mọi câu hỏi</div><h2>Nhớ từ DREAM</h2><p>Một câu trả lời B1 thường có 3–5 câu. Đề dễ dùng D–R–E; muốn tự nhiên hơn thì thêm A–M. Mỗi bước bên dưới có cả câu tiếng Anh và ý nghĩa tiếng Việt.</p></div>
        <div class="dream-row">
          <article><b>D</b><strong>Direct · Trả lời thẳng</strong><span>Nói ngay ý chính, không vòng vo.</span><code>I usually… / Yes, I do.</code><small class="vi-guide">Tôi thường… / Có, tôi có.</small></article>
          <article><b>R</b><strong>Reason · Lý do</strong><span>Giải thích vì sao bạn chọn ý đó.</span><code>The main reason is that…</code><small class="vi-guide">Lý do chính là…</small></article>
          <article><b>E</b><strong>Example · Ví dụ</strong><span>Nêu một việc thật, thời gian hoặc nơi chốn.</span><code>For example, I…</code><small class="vi-guide">Ví dụ, tôi…</small></article>
          <article><b>A</b><strong>Add · Thêm ý</strong><span>Bổ sung lợi ích, thói quen hoặc ý trái chiều.</span><code>Besides, I also…</code><small class="vi-guide">Ngoài ra, tôi cũng…</small></article>
          <article><b>M</b><strong>Mini ending · Kết ngắn</strong><span>Chốt cảm xúc hoặc quan điểm.</span><code>Overall, I think…</code><small class="vi-guide">Nhìn chung, tôi nghĩ…</small></article>
        </div>
      </section>

      <div class="section-title"><div><div class="eyebrow">Chọn đúng câu mở đầu</div><h2>Nhìn từ để hỏi rồi lấy khung</h2></div></div>
      <div class="question-frame-grid">
        <article class="frame-card"><span>YES / NO</span><h3>Do / Is / Can…?</h3><code>Yes, I do. / No, I don't really…</code><p><b>Example:</b> Yes, I do. The main reason is that it is convenient.</p><small class="vi-guide"><b>Nghĩa:</b> Có. Lý do chính là vì nó tiện lợi.</small></article>
        <article class="frame-card"><span>WHAT</span><h3>What do you…?</h3><code>I usually / often / prefer [activity].</code><p><b>Example:</b> I usually play badminton with my friends.</p><small class="vi-guide"><b>Nghĩa:</b> Tôi thường chơi cầu lông với bạn bè.</small></article>
        <article class="frame-card"><span>WHY</span><h3>Why do you…?</h3><code>I [action] mainly because [reason].</code><p><b>Example:</b> I read books mainly because they help me relax.</p><small class="vi-guide"><b>Nghĩa:</b> Tôi đọc sách chủ yếu vì chúng giúp tôi thư giãn.</small></article>
        <article class="frame-card"><span>HOW OFTEN</span><h3>How often…?</h3><code>I [frequency] [action], usually [time].</code><p><b>Example:</b> I exercise three times a week, usually in the evening.</p><small class="vi-guide"><b>Nghĩa:</b> Tôi tập thể dục ba lần mỗi tuần, thường vào buổi tối.</small></article>
        <article class="frame-card"><span>PAST</span><h3>What did / When did…?</h3><code>Last [time], I [V2]…</code><p><b>Example:</b> Last weekend, I visited my grandparents.</p><small class="vi-guide"><b>Nghĩa:</b> Cuối tuần trước, tôi đã thăm ông bà.</small></article>
        <article class="frame-card"><span>FUTURE</span><h3>What will / plan…?</h3><code>I am going to [V] because…</code><p><b>Example:</b> I am going to learn English because it is useful.</p><small class="vi-guide"><b>Nghĩa:</b> Tôi dự định học tiếng Anh vì nó hữu ích.</small></article>
        <article class="frame-card"><span>OPINION</span><h3>What do you think…?</h3><code>In my opinion, [idea] because…</code><p><b>Example:</b> In my opinion, public transport is very important.</p><small class="vi-guide"><b>Nghĩa:</b> Theo tôi, phương tiện công cộng rất quan trọng.</small></article>
        <article class="frame-card"><span>COMPARE</span><h3>Which do you prefer…?</h3><code>I prefer A to B because…</code><p><b>Example:</b> I prefer living in a city to living in the countryside.</p><small class="vi-guide"><b>Nghĩa:</b> Tôi thích sống ở thành phố hơn nông thôn.</small></article>
      </div>

      <div class="builder-lab universal-builder">
        <div class="builder-copy"><div class="eyebrow">Trình ghép DREAM</div><h2>Điền ý thật của bạn</h2><p class="subtle">Không cần dùng đủ năm câu. D + R + E đã đủ rõ; thêm A + M để câu trả lời tự nhiên và đầy đặn hơn.</p>
          <div class="notice info bilingual-tip"><strong>Cách điền:</strong> nhập ý bằng tiếng Anh ngắn. Phần hướng dẫn tiếng Việt cho biết bạn cần nói gì; web sẽ tự thêm các từ nối như <em>The main reason is that</em>, <em>For example</em> và <em>Besides</em>.</div>
          <div class="builder-form">
            ${dreamField('question','Câu hỏi đang luyện · Practice question',true)}
            ${dreamField('direct','D — Trả lời trực tiếp · Direct answer',true,'Nói thẳng ý chính. Ví dụ: I usually read books.')}
            ${dreamField('reason','R — Lý do · Reason',true,'Nhập phần sau “The main reason is that…”. Nghĩa: Lý do chính là…')}
            ${dreamField('example','E — Ví dụ cụ thể · Example',true,'Một việc bạn thật sự làm. Nghĩa: Ví dụ, tôi…')}
            ${dreamField('add','A — Ý bổ sung · Additional idea',true,'Có thể để trống. Nghĩa: Ngoài ra, tôi cũng…')}
            ${dreamField('ending','M — Câu kết ngắn · Mini ending',true,'Ví dụ: Overall, it is an important part of my life. = Nhìn chung, nó là một phần quan trọng trong cuộc sống của tôi.')}
            <button class="button primary" data-generate-dream>Tạo câu trả lời hay</button>
          </div>
        </div>
        <div class="builder-result sticky-panel"><div class="eyebrow">Kết quả · Result</div><p class="question-preview">${escapeHTML(state.dreamForm.question)}</p><div class="generated learning-output ${generated ? '' : 'empty'}">${generated ? escapeHTML(generated) : 'Câu trả lời theo DREAM sẽ xuất hiện ở đây.'}</div>${generated ? `<p class="vi-guide output-note">Hãy tự dịch ý chính sang tiếng Việt để kiểm tra mình có hiểu câu vừa tạo hay không, sau đó nghe và nói lại mà không nhìn.</p><div class="filter-row" style="margin:12px 0 0"><button class="button small" data-speak="${escapeHTML(generated)}">▶ Nghe</button><button class="button small" data-copy="${escapeHTML(generated)}">Sao chép</button></div>` : ''}</div>
      </div>

      <section class="picture-universal panel">
        <div class="eyebrow">Khung 2 · Mô tả mọi bức tranh</div><h2>Đi theo 8 ô, từ tổng quát đến chi tiết</h2>
        <p class="subtle">Bạn không cần biết chính xác mọi thứ trong ảnh. Hãy dùng <em>may be</em>, <em>seem to</em> hoặc <em>probably</em> khi chưa chắc.</p>
        <div class="picture-eight">
          <article><b>1</b><strong>Mở tranh · Opening</strong><code>The picture shows [topic].</code><small class="vi-guide">Bức tranh cho thấy [chủ đề].</small></article>
          <article><b>2</b><strong>Số người · People</strong><code>I can see [number] people.</code><small class="vi-guide">Tôi có thể thấy [số lượng] người.</small></article>
          <article><b>3</b><strong>Quan hệ · Relationship</strong><code>They may be [friends / family].</code><small class="vi-guide">Họ có thể là [bạn bè / gia đình].</small></article>
          <article><b>4</b><strong>Nơi chốn · Place</strong><code>They are in / at [place].</code><small class="vi-guide">Họ đang ở [địa điểm].</small></article>
          <article><b>5</b><strong>Hoạt động · Action</strong><code>They are [V-ing].</code><small class="vi-guide">Họ đang [làm gì].</small></article>
          <article><b>6</b><strong>Chi tiết · Details</strong><code>On the left/right, … is wearing…</code><small class="vi-guide">Ở bên trái/phải, … đang mặc…</small></article>
          <article><b>7</b><strong>Bối cảnh & cảm xúc</strong><code>In the background… They look…</code><small class="vi-guide">Ở phía sau… Họ trông có vẻ…</small></article>
          <article><b>8</b><strong>Ý kiến & kết · Ending</strong><code>I like this picture because…</code><small class="vi-guide">Tôi thích bức tranh này vì…</small></article>
        </div>
        <div class="picture-master-template">
          <div><strong>Sườn hoàn chỉnh · Full frame</strong><p>The picture shows <mark>[TOPIC]</mark>. I can see <mark>[NUMBER]</mark> people, and they may be <mark>[RELATIONSHIP]</mark>. They are in <mark>[PLACE]</mark>. In the foreground, they are <mark>[ACTIVITY]</mark>. On the left/right, <mark>[DETAIL]</mark>. In the background, there is/are <mark>[BACKGROUND]</mark>. They look <mark>[FEELING]</mark>. I like this picture because <mark>[OPINION]</mark>. Overall, it shows a <mark>[positive adjective]</mark> moment.</p>
          <div class="template-translation"><strong>Hiểu bằng tiếng Việt:</strong> Bức tranh nói về <mark>[CHỦ ĐỀ]</mark>. Tôi thấy <mark>[SỐ NGƯỜI]</mark> và họ có thể là <mark>[MỐI QUAN HỆ]</mark>. Họ đang ở <mark>[ĐỊA ĐIỂM]</mark>. Phía trước, họ đang <mark>[HOẠT ĐỘNG]</mark>. Bên trái/phải có <mark>[CHI TIẾT]</mark>. Phía sau có <mark>[BỐI CẢNH]</mark>. Họ trông <mark>[CẢM XÚC]</mark>. Tôi thích ảnh vì <mark>[Ý KIẾN]</mark>. Nhìn chung, đây là một khoảnh khắc <mark>[TÍNH TỪ TÍCH CỰC]</mark>.</div></div>
          <button class="button primary" data-view="picture">Mở trình ghép mô tả tranh →</button>
        </div>
      </section>

      <div class="section-title"><h2>Cụm “cứu nguy” khi chưa nghĩ ra</h2><p>Dùng để có thêm 1–2 giây suy nghĩ, không lạm dụng.</p></div>
      <div class="rescue-grid">
        <button data-speak="That's an interesting question. Let me think for a moment."><strong>Mở đầu</strong><span>That's an interesting question. Let me think for a moment.</span><small class="vi-guide">Đó là một câu hỏi thú vị. Hãy để tôi suy nghĩ một chút.</small></button>
        <button data-speak="As far as I know, it is quite common in my country."><strong>Thiếu kiến thức</strong><span>As far as I know, it is quite common in my country.</span><small class="vi-guide">Theo như tôi biết, điều này khá phổ biến ở đất nước tôi.</small></button>
        <button data-speak="I have never thought about it before, but I think…"><strong>Đề lạ</strong><span>I have never thought about it before, but I think…</span><small class="vi-guide">Tôi chưa từng nghĩ về điều này, nhưng tôi nghĩ…</small></button>
        <button data-speak="It depends on the situation, but personally, I prefer…"><strong>Có hai phía</strong><span>It depends on the situation, but personally, I prefer…</span><small class="vi-guide">Điều đó tùy tình huống, nhưng cá nhân tôi thích…</small></button>
      </div>

      <div class="universal-check panel">
        <h3>Kiểm tra nhanh trước khi dừng nói</h3>
        <div class="check-list"><span>✓ Tôi đã trả lời đúng trọng tâm ngay câu đầu.</span><span>✓ Tôi có ít nhất một lý do với because / The main reason is that.</span><span>✓ Tôi có ví dụ cụ thể, không chỉ nói chung chung.</span><span>✓ Tôi dùng đúng thì: hiện tại, quá khứ hoặc tương lai.</span><span>✓ Tôi kết lại bằng cảm xúc hoặc quan điểm ngắn.</span></div>
      </div>`;
  }

  function renderStarter() {
    const generatedAnswer = state.generatedAnswer;
    const generatedEmail = state.generatedEmail;
    content.innerHTML = `
      ${pageHead('Nền tảng B1 cho người mới', 'Học từ số 0: ghép câu, ghép đoạn và viết email', 'Học công thức có thể tái sử dụng. Bạn chỉ cần thay một vài cụm từ để chuyển sang chủ đề khác.')}

      <div class="learning-roadmap">
        <a href="#lesson-tip"><span>1</span><strong>Nhớ mẹo</strong><small>Không học vẹt</small></a>
        <a href="#lesson-sentence"><span>2</span><strong>Ghép câu</strong><small>Đúng trật tự</small></a>
        <a href="#lesson-paragraph"><span>3</span><strong>Ghép đoạn</strong><small>4 câu đủ ý</small></a>
        <a href="#lesson-email"><span>4</span><strong>Viết email</strong><small>Thay từ đổi đề</small></a>
      </div>

      <section id="lesson-tip" class="lesson-section">
        <div class="section-title"><div><div class="eyebrow">Bước 1</div><h2>Mẹo học cho người mới bắt đầu</h2></div></div>
        <div class="grid-3">
          <article class="panel lesson-card"><div class="lesson-icon">骨</div><h3>Học “xương”, không học cả bài</h3><p class="subtle">Hãy nhớ bốn mảnh: <strong>trả lời thẳng → lý do → ví dụ → kết quả</strong>. Nội dung bên trong được thay theo từng chủ đề.</p></article>
          <article class="panel lesson-card"><div class="lesson-icon">3</div><h3>Mỗi câu chỉ cần 1 ý</h3><p class="subtle">Câu ngắn, đúng và rõ tốt hơn câu dài dễ sai. Khi mới học, hãy nói 8–14 từ mỗi câu rồi mới nối thêm.</p></article>
          <article class="panel lesson-card"><div class="lesson-icon">↻</div><h3>Đổi từ để tạo câu mới</h3><p class="subtle">Giữ nguyên khung <em>I like … because …</em>, sau đó đổi <strong>Internet / music / sport / hometown</strong> và lý do tương ứng.</p></article>
        </div>
        <div class="memory-rule">
          <div class="memory-letter"><strong>A</strong><span>Answer</span><small>Trả lời trực tiếp</small></div>
          <div class="memory-arrow">→</div>
          <div class="memory-letter"><strong>R</strong><span>Reason</span><small>Nêu lý do</small></div>
          <div class="memory-arrow">→</div>
          <div class="memory-letter"><strong>E</strong><span>Example</span><small>Cho ví dụ</small></div>
          <div class="memory-arrow">→</div>
          <div class="memory-letter"><strong>R</strong><span>Result</span><small>Kết quả/cảm xúc</small></div>
        </div>
        <div class="notice info"><strong>Mẹo cứu nguy:</strong> Khi bí ý, chỉ cần dùng 2 câu: <em>Yes, I do. I like it because it is useful and convenient.</em><span class="vi-inline"> = Có. Tôi thích nó vì nó hữu ích và tiện lợi.</span> Khi đã quen, thêm <em>For example…</em> (Ví dụ…) và <em>As a result…</em> (Kết quả là…).</div>
      </section>

      <section class="lesson-section">
        <div class="section-title"><div><div class="eyebrow">Nhận dạng nhanh</div><h2>Nhìn câu hỏi để chọn câu mở đầu</h2></div></div>
        <div class="pattern-grid">
          ${answerPatternCard('Yes / No', 'Do you often use the Internet?', 'Yes, I do. / No, I don’t. + because …', 'Yes, I do. I use it every day because it is convenient.', 'Có. Tôi sử dụng Internet hằng ngày vì nó tiện lợi.')}
          ${answerPatternCard('What / Which', 'What is your favorite kind of music?', 'My favorite … is … because …', 'My favorite kind of music is pop because it helps me relax.', 'Thể loại nhạc yêu thích của tôi là nhạc pop vì nó giúp tôi thư giãn.')}
          ${answerPatternCard('Why', 'Why do you like your hometown?', 'I like … mainly because …', 'I like my hometown mainly because it is peaceful and friendly.', 'Tôi thích quê hương chủ yếu vì nơi đó yên bình và thân thiện.')}
          ${answerPatternCard('How often', 'How often do you exercise?', 'I usually … once/twice …', 'I usually exercise three times a week after school.', 'Tôi thường tập thể dục ba lần một tuần sau giờ học.')}
          ${answerPatternCard('Preference', 'Which do you prefer, buses or motorbikes?', 'I prefer A to B because …', 'I prefer buses to motorbikes because they are safer.', 'Tôi thích xe buýt hơn xe máy vì chúng an toàn hơn.')}
          ${answerPatternCard('Past', 'What did you do last weekend?', 'Last …, I + V2/ed …', 'Last weekend, I visited my grandparents and had dinner with them.', 'Cuối tuần trước, tôi đã thăm ông bà và ăn tối cùng họ.')}
          ${answerPatternCard('Future', 'What are you going to do next summer?', 'I am going to … / I would like to …', 'I am going to travel to Da Nang with my friends next summer.', 'Mùa hè tới, tôi dự định đi Đà Nẵng cùng bạn bè.')}
          ${answerPatternCard('Opinion', 'Do you think sport is important?', 'In my opinion, … because …', 'In my opinion, sport is important because it keeps us healthy.', 'Theo tôi, thể thao quan trọng vì nó giúp chúng ta khỏe mạnh.')}
        </div>
      </section>

      <section id="lesson-sentence" class="lesson-section">
        <div class="section-title"><div><div class="eyebrow">Bước 2</div><h2>Cách ghép một câu đúng và dễ nhớ</h2></div></div>
        <div class="sentence-formula">
          <span class="slot subject">S</span><b>+</b><span class="slot frequency">tần suất</span><b>+</b><span class="slot verb">V</span><b>+</b><span class="slot object">O</span><b>+</b><span class="slot place">nơi chốn</span><b>+</b><span class="slot time">thời gian</span>
        </div>
        <div class="grid-2">
          <article class="panel"><h3>Ví dụ ghép từng mảnh</h3><div class="build-line"><span>I</span><span>usually</span><span>read</span><span>English articles</span><span>at home</span><span>in the evening.</span></div><p class="vi-guide"><strong>Nghĩa:</strong> Tôi thường đọc các bài viết tiếng Anh ở nhà vào buổi tối.</p><p class="subtle">Không bắt buộc phải có đủ mọi mảnh. Chỉ cần <strong>S + V</strong> là đã thành câu; thêm phần sau để rõ hơn.</p></article>
          <article class="panel"><h3>5 từ nối đủ dùng ở B1</h3><div class="connector-list"><span><b>because</b> — nêu lý do</span><span><b>for example</b> — cho ví dụ</span><span><b>also / besides</b> — thêm ý</span><span><b>but / however</b> — ý trái ngược</span><span><b>so / as a result</b> — nêu kết quả</span></div></article>
        </div>
        <div class="grid-2" style="margin-top:16px">
          <article class="panel"><div class="eyebrow">Khung siêu ngắn · 2 câu</div><div class="template-box">[Trả lời trực tiếp].<br>I like / choose / do it because [lý do].</div><p><strong>Ví dụ:</strong> Yes, I do. I use the Internet because it helps me study.</p><p class="vi-guide"><strong>Nghĩa:</strong> Có. Tôi dùng Internet vì nó giúp tôi học tập.</p></article>
          <article class="panel"><div class="eyebrow">Khung tiêu chuẩn · 4 câu</div><div class="template-box">[Trả lời trực tiếp].<br>This is because [lý do].<br>For example, [ví dụ thật].<br>As a result, [kết quả/cảm xúc].</div><p><strong>Ví dụ:</strong> Yes, I do. This is because it is useful. For example, I search for English lessons online. As a result, I can study more effectively.</p><p class="vi-guide"><strong>Nghĩa:</strong> Có. Đó là vì Internet hữu ích. Ví dụ, tôi tìm bài học tiếng Anh trên mạng. Nhờ vậy, tôi có thể học hiệu quả hơn.</p></article>
        </div>

        <div class="builder-lab">
          <div class="builder-copy"><div class="eyebrow">Trình tạo câu trả lời</div><h2>Điền bốn ý, web tự ghép thành đoạn nói</h2><p class="subtle">Bạn có thể lấy câu hỏi trong phần “Học theo chủ đề”, sau đó thay nội dung ở bốn ô bên dưới.</p>
            <div class="builder-form">
              ${learningField('answer','question','Câu hỏi đang luyện',false,'Ô này giúp bạn nhớ đề, không được đưa vào đáp án.')}
              ${learningField('answer','direct','1. Trả lời trực tiếp',false,'Ví dụ: Yes, I do / My favorite hobby is reading')}
              ${learningField('answer','reason','2. Lý do',true,'Không cần nhập “because”.')}
              ${learningField('answer','example','3. Ví dụ',true,'Không cần nhập “For example”.')}
              ${learningField('answer','result','4. Kết quả hoặc cảm xúc',true,'Không cần nhập “As a result”.')}
              <button class="button primary" data-generate-starter-answer>Ghép câu trả lời</button>
            </div>
          </div>
          <div class="builder-result sticky-panel"><div class="eyebrow">Kết quả</div><p class="question-preview">${escapeHTML(state.answerForm.question)}</p><div class="generated learning-output ${generatedAnswer ? '' : 'empty'}">${generatedAnswer ? escapeHTML(generatedAnswer) : 'Câu trả lời hoàn chỉnh sẽ xuất hiện ở đây.'}</div>${generatedAnswer ? `<div class="filter-row" style="margin:12px 0 0"><button class="button small" data-speak="${escapeHTML(generatedAnswer)}">▶ Nghe</button><button class="button small" data-copy="${escapeHTML(generatedAnswer)}">Sao chép</button></div>` : ''}</div>
        </div>
      </section>

      <section id="lesson-paragraph" class="lesson-section">
        <div class="section-title"><div><div class="eyebrow">Bước 3</div><h2>Từ một câu mở rộng thành một đoạn</h2></div></div>
        <div class="paragraph-map">
          <article><span>1</span><div><strong>Câu chủ đề</strong><p>I think [topic] is [adjective].</p><small class="vi-guide">Tôi nghĩ [chủ đề] thì [tính từ].</small></div></article>
          <article><span>2</span><div><strong>Lý do chính</strong><p>First of all, it [reason 1].</p><small class="vi-guide">Trước hết, nó [lý do 1].</small></div></article>
          <article><span>3</span><div><strong>Ví dụ thật</strong><p>For example, I [specific example].</p><small class="vi-guide">Ví dụ, tôi [ví dụ cụ thể].</small></div></article>
          <article><span>4</span><div><strong>Ý bổ sung</strong><p>Besides, it [reason 2].</p><small class="vi-guide">Ngoài ra, nó [lý do 2].</small></div></article>
          <article><span>5</span><div><strong>Kết lại</strong><p>Overall, I really enjoy / recommend it.</p><small class="vi-guide">Nhìn chung, tôi rất thích / đề xuất nó.</small></div></article>
        </div>
        <div class="grid-2" style="margin-top:16px">
          <article class="panel"><div class="eyebrow">Khung thay từ</div><div class="template-box paragraph-template">I think <mark>[TOPIC]</mark> is <mark>[ADJECTIVE]</mark>.<br>First of all, it <mark>[REASON 1]</mark>.<br>For example, I <mark>[EXAMPLE]</mark>.<br>Besides, it <mark>[REASON 2]</mark>.<br>Overall, I <mark>[FEELING / OPINION]</mark>.</div><div class="template-translation"><strong>Khung nghĩa Việt:</strong> Tôi nghĩ <mark>[CHỦ ĐỀ]</mark> thì <mark>[TÍNH TỪ]</mark>. Trước hết, nó <mark>[LÝ DO 1]</mark>. Ví dụ, tôi <mark>[VÍ DỤ]</mark>. Ngoài ra, nó <mark>[LÝ DO 2]</mark>. Nhìn chung, tôi <mark>[CẢM XÚC / QUAN ĐIỂM]</mark>.</div></article>
          <article class="panel"><div class="eyebrow">Đổi một khung thành ba đề</div><div class="swap-examples"><p><b>Internet:</b> useful → find information → study English → communicate quickly.</p><p><b>Sport:</b> important → stay healthy → play badminton → make new friends.</p><p><b>Hometown:</b> wonderful → peaceful atmosphere → visit the river → friendly people.</p></div></article>
        </div>
      </section>

      <section id="lesson-email" class="lesson-section">
        <div class="section-title"><div><div class="eyebrow">Bước 4</div><h2>Khung email B1 dùng được cho nhiều đề tài</h2></div></div>
        <div class="notice info" style="margin-bottom:16px"><strong>Nguyên tắc:</strong> giữ nguyên phần chào, chuyển ý và kết thư; chỉ thay <strong>mục đích + hai ý chính + câu hỏi/hành động cuối</strong>. Như vậy một khung có thể dùng cho sở thích, chuyến đi, quê hương, lời mời, lời khuyên hoặc kể một sự kiện.</div>
        <div class="email-anatomy">
          <article><span>1</span><div><strong>Chào</strong><code>Hi [Name],</code><small class="vi-guide">Chào [Tên],</small></div></article>
          <article><span>2</span><div><strong>Mở thư cố định</strong><code>Thanks for your email. It was great to hear from you.</code><small class="vi-guide">Cảm ơn thư của bạn. Tôi rất vui khi nhận được tin từ bạn.</small></div></article>
          <article><span>3</span><div><strong>Mục đích</strong><code>I'm writing to [tell / invite / ask / explain] ...</code><small class="vi-guide">Tôi viết thư để [kể / mời / hỏi / giải thích]…</small></div></article>
          <article><span>4</span><div><strong>Ý chính 1</strong><code>First of all, [main point 1].</code><small class="vi-guide">Trước hết, [ý chính 1].</small></div></article>
          <article><span>5</span><div><strong>Ý chính 2</strong><code>Besides, [main point 2].</code><small class="vi-guide">Ngoài ra, [ý chính 2].</small></div></article>
          <article><span>6</span><div><strong>Tương tác</strong><code>What do you think? / Would you like to ...?</code><small class="vi-guide">Bạn nghĩ sao? / Bạn có muốn… không?</small></div></article>
          <article><span>7</span><div><strong>Kết thư cố định</strong><code>Anyway, that's all for now. Write back soon. Best wishes, [Name]</code><small class="vi-guide">Dù sao, tôi xin dừng bút. Hãy hồi âm sớm. Thân mến, [Tên].</small></div></article>
        </div>

        <div class="grid-2" style="margin-top:16px">
          <article class="panel"><div class="eyebrow">Email thân mật · khung chính</div><div class="template-box email-template">Hi <mark>[NAME]</mark>,<br><br>Thanks for your email. It was great to hear from you.<br>I'm writing to <mark>[PURPOSE]</mark>.<br><br>First of all, <mark>[POINT 1]</mark>.<br>Besides, <mark>[POINT 2]</mark>.<br><mark>[YOUR ANSWER / OPINION]</mark>.<br><br><mark>[QUESTION / INVITATION]</mark><br>Anyway, that's all for now. Write back soon.<br><br>Best wishes,<br><mark>[YOUR NAME]</mark></div><div class="template-translation"><strong>Cách hiểu:</strong> Chào người nhận → cảm ơn thư → nêu mục đích → viết hai ý chính → thêm quan điểm → đặt câu hỏi/lời mời → kết thư. Khi đổi đề, bạn chỉ thay các phần màu vàng.</div></article>
          <article class="panel"><div class="eyebrow">Cụm thay nhanh theo đề</div><div class="replacement-table">
            <div><b>Kể thông tin</b><span>tell you about my hometown / hobby / trip</span></div>
            <div><b>Mời ai đó</b><span>invite you to my birthday party / visit my city</span></div>
            <div><b>Đưa lời khuyên</b><span>give you some advice about studying / keeping fit</span></div>
            <div><b>Hỏi thông tin</b><span>ask you about the course / event / accommodation</span></div>
            <div><b>Xin lỗi</b><span>apologize for missing the meeting / replying late</span></div>
            <div><b>Kể kế hoạch</b><span>tell you about my plan for the weekend / summer holiday</span></div>
          </div></article>
        </div>

        <div class="topic-swap" style="margin-top:16px">
          <h3>Chỉ thay các ô màu để đổi đề</h3>
          <div class="topic-swap-grid">
            <article><div class="eyebrow">Đề quê hương</div><p><b>Purpose:</b> tell you about my hometown</p><p><b>Point 1:</b> it is peaceful and friendly</p><p><b>Point 2:</b> there are many local dishes</p><p><b>Question:</b> Would you like to visit it?</p></article>
            <article><div class="eyebrow">Đề sở thích</div><p><b>Purpose:</b> tell you about my favorite hobby</p><p><b>Point 1:</b> reading helps me relax</p><p><b>Point 2:</b> I learn many new things</p><p><b>Question:</b> What do you do in your free time?</p></article>
            <article><div class="eyebrow">Đề lời mời</div><p><b>Purpose:</b> invite you to my birthday party</p><p><b>Point 1:</b> it starts at 7 p.m. on Saturday</p><p><b>Point 2:</b> we will have food and games</p><p><b>Question:</b> Can you come?</p></article>
          </div>
        </div>

        <div class="builder-lab email-builder">
          <div class="builder-copy"><div class="eyebrow">Trình tạo email</div><h2>Điền nội dung, giữ nguyên khung</h2>
            <div class="field"><label for="email-tone">Kiểu email</label><select id="email-tone" data-learning-group="email" data-learning-field="tone"><option value="informal" ${state.emailForm.tone === 'informal' ? 'selected' : ''}>Thân mật: bạn bè / người quen</option><option value="formal" ${state.emailForm.tone === 'formal' ? 'selected' : ''}>Trang trọng: tổ chức / người không quen</option></select></div>
            <div class="builder-form" style="margin-top:12px">
              ${learningField('email','recipient','Người nhận',false,'Ví dụ: Alex hoặc Sir or Madam')}
              ${learningField('email','purpose','Mục đích sau “I’m writing to…”',true,'Ví dụ: tell you about my trip')}
              ${learningField('email','point1','Ý chính 1',true)}
              ${learningField('email','point2','Ý chính 2',true)}
              ${learningField('email','response','Câu trả lời / quan điểm bổ sung',true)}
              ${learningField('email','nextAction','Câu hỏi, lời mời hoặc yêu cầu cuối',true)}
              ${learningField('email','sender','Tên người gửi')}
              <button class="button primary" data-generate-email>Tạo email</button>
            </div>
          </div>
          <div class="builder-result sticky-panel"><div class="eyebrow">Email hoàn chỉnh</div><pre class="generated email-output ${generatedEmail ? '' : 'empty'}">${generatedEmail ? escapeHTML(generatedEmail) : 'Email hoàn chỉnh sẽ xuất hiện ở đây.'}</pre>${generatedEmail ? `<div class="filter-row" style="margin:12px 0 0"><button class="button small" data-copy="${escapeHTML(generatedEmail)}">Sao chép email</button><button class="button small" data-speak="${escapeHTML(generatedEmail)}">▶ Nghe</button></div>` : ''}</div>
        </div>

        <div class="grid-2" style="margin-top:16px">
          <article class="panel"><h3>Kiểm tra email trong 20 giây</h3><div class="check-list"><span>✓ Có lời chào và tên người nhận</span><span>✓ Trả lời đủ các ý đề yêu cầu</span><span>✓ Mỗi ý chính có ít nhất một câu</span><span>✓ Có từ nối: First of all, Besides, Because</span><span>✓ Có câu hỏi/lời mời ở cuối</span><span>✓ Có Best wishes + tên người gửi</span></div></article>
          <article class="panel"><h3>Lỗi người mới thường gặp</h3><div class="mistake-list"><p><del>I am agree</del> → <b>I agree</b></p><p><del>I very like it</del> → <b>I really like it</b></p><p><del>Because it useful</del> → <b>Because it is useful</b></p><p><del>I look forward to hear</del> → <b>I look forward to hearing</b></p><p><del>Thanks you</del> → <b>Thank you / Thanks</b></p></div></article>
        </div>
      </section>`;
  }

  function renderTopics() {
    const topic = DATA.topics.find(t => t.id === state.selectedTopic) || DATA.topics[0];
    const p = topicProgress(topic);
    content.innerHTML = `
      ${pageHead('Speaking Part 4', 'Học theo chủ đề', 'Học từng câu theo ba lớp: câu hỏi tiếng Anh, nghĩa tiếng Việt và đáp án mẫu.', modeSwitch())}
      <div class="topic-layout">
        <aside class="topic-index" aria-label="Danh sách chủ đề">
          ${DATA.topics.map(t => `<button class="${t.id === topic.id ? 'active' : ''}" data-open-topic="${t.id}"><span>${escapeHTML(t.title)}</span><small>${topicProgress(t).done}/${t.items.length}</small></button>`).join('')}
        </aside>
        <section>
          <div class="topic-header">
            <div><div class="eyebrow">Chủ đề ${topic.number}</div><h2>${escapeHTML(topic.title)} · ${escapeHTML(topic.titleVi)}</h2></div>
            <span class="pill">Đã thuộc ${p.done}/${p.total}</span>
          </div>
          ${state.answerMode === 'original' ? `<div class="notice" style="margin-bottom:12px">Bạn đang xem nguyên văn trong file, kể cả lỗi ngữ pháp. Hãy dùng chế độ này để đối chiếu, không nên học thuộc máy móc.</div>` : ''}
          <div class="question-list">${topic.items.map((item, i) => questionCard(item, i + 1)).join('')}</div>
        </section>
      </div>`;
  }

  function flashDeck() {
    return state.flashTopic === 'all' ? allItems : allItems.filter(item => item.topic.id === state.flashTopic);
  }

  function renderFlashcards() {
    const deck = flashDeck();
    if (!deck.length) return;
    state.flashIndex = ((state.flashIndex % deck.length) + deck.length) % deck.length;
    const item = deck[state.flashIndex];
    const answer = answerFor(item);
    content.innerHTML = `
      ${pageHead('Ghi nhớ chủ động', 'Flashcard', 'Tự trả lời trước khi lật thẻ. Dùng phím Space để lật, ← → để đổi thẻ và M để đánh dấu thuộc.', modeSwitch())}
      <div class="flash-wrap">
        <div class="filter-row">
          <label for="flashTopic"><strong>Phạm vi:</strong></label>
          <select id="flashTopic">
            <option value="all" ${state.flashTopic === 'all' ? 'selected' : ''}>Tất cả ${TOTAL} câu</option>
            ${DATA.topics.map(t => `<option value="${t.id}" ${state.flashTopic === t.id ? 'selected' : ''}>${escapeHTML(t.title)} (${t.items.length})</option>`).join('')}
          </select>
          <button class="button small" data-flash-action="random">Trộn thẻ</button>
        </div>
        <div class="flash-meta"><span>${escapeHTML(item.topic.title)} · Câu ${item.index + 1}</span><strong>${state.flashIndex + 1} / ${deck.length}</strong></div>
        <div class="flashcard ${state.flashFlipped ? 'flipped' : ''}" id="flashcard" data-flash-action="flip" tabindex="0" role="button" aria-label="Lật flashcard">
          <div class="flashcard-inner">
            <section class="flash-face flash-front">
              <div class="flash-topic">Question</div>
              <h2>${escapeHTML(item.question)}</h2>
              ${state.showTranslation ? `<p>${escapeHTML(item.questionVi)}</p>` : ''}
              <span class="flash-hint">Chạm hoặc nhấn Space để lật</span>
            </section>
            <section class="flash-face flash-back">
              <div class="flash-topic">${state.answerMode === 'natural' ? 'Bản dễ nói' : 'Bản gốc'}</div>
              <h2>${escapeHTML(answer)}</h2>
              ${state.showTranslation && state.answerMode === 'natural' ? `<p>${escapeHTML(item.answerVi)}</p>` : ''}
              <span class="flash-hint">Nhấn lại để xem câu hỏi</span>
            </section>
          </div>
        </div>
        <div class="flash-controls">
          <button class="button" data-flash-action="prev">← Trước</button>
          <button class="button" data-speak="${escapeHTML(state.flashFlipped ? answer : item.question)}">▶ Nghe</button>
          <button class="button result-good" data-flash-result="correct" data-item-id="${item.id}">✓ Nhớ rõ</button>
          <button class="button uncertain-button" data-flash-result="uncertain" data-item-id="${item.id}">? Chưa chắc</button>
          <button class="button danger" data-flash-result="wrong" data-item-id="${item.id}">↺ Quên</button>
          <button class="button" data-flash-action="next">Tiếp →</button>
        </div>
        <p class="flash-self-note">Tự đánh giá sau khi lật thẻ. “Nhớ rõ” hai lần liên tiếp sẽ đưa câu ra khỏi danh sách ôn.</p>
      </div>`;
  }

  function practicePool() {
    const base = allItems.filter(item => state.answerMode !== 'original' || item.original);
    if (state.practiceScope !== 'review') return base;
    const ids = new Set(reviewQueue().map(entry => entry.id));
    return base.filter(item => ids.has(item.id));
  }

  function randomItem() {
    const pool = practicePool();
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
  }

  function preparePractice(force = false) {
    const pool = practicePool();
    let current = allItems.find(i => i.id === state.practiceItemId);
    if (!pool.length) return null;
    const currentAllowed = current && pool.some(item => item.id === current.id);
    if (!currentAllowed || force || (state.answerMode === 'original' && !current.original)) {
      current = randomItem();
      state.practiceItemId = current.id;
      state.quizChoice = null;
      state.blankRevealed = false;
      state.recallText = '';
      state.recallScore = null;
      const words = answerFor(current).split(/\s+/);
      const candidates = words.map((word, i) => ({ word, i })).filter(x => x.word.replace(/[^A-Za-z]/g, '').length >= 5);
      state.blankMask = shuffle(candidates).slice(0, Math.min(5, Math.max(2, Math.round(words.length * .28)))).map(x => x.i);
      const distractors = shuffle(allItems.filter(i => i.id !== current.id && answerFor(i)).map(answerFor)).slice(0, 3);
      state.quizOptions = shuffle([answerFor(current), ...distractors]);
    }
    return current;
  }

  function shuffle(input) {
    const arr = [...input];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function renderPractice() {
    const reviewCount = reviewQueue().length;
    const item = preparePractice();
    const scopeBar = `<div class="practice-scope"><div><strong>Phạm vi luyện:</strong><span>Web tự lưu kết quả sau mỗi câu.</span></div><div class="segmented"><button data-practice-scope="all" class="${state.practiceScope === 'all' ? 'active' : ''}">Tất cả ${TOTAL} câu</button><button data-practice-scope="review" class="${state.practiceScope === 'review' ? 'active' : ''}">Ôn lại ${reviewCount} câu</button></div></div>`;

    if (!item) {
      content.innerHTML = `${pageHead('Tự kiểm tra', 'Luyện nhanh', 'Ba cách luyện từ nhận biết đến tự nhớ lại câu trả lời.', modeSwitch())}${scopeBar}<div class="empty-state review-complete"><div class="complete-icon">✓</div><h2>Bạn đã hoàn tất danh sách ôn lại</h2><p>Không còn câu sai hoặc chưa chắc. Khi làm bài mới, các câu yếu sẽ tự xuất hiện lại ở đây.</p><button class="button primary" data-practice-scope="all">Luyện toàn bộ câu hỏi</button></div>`;
      return;
    }

    const answer = answerFor(item);
    const entry = reviewEntry(item.id);
    let body = '';
    if (state.practiceTab === 'quiz') {
      const selectedOption = state.quizChoice === null ? '' : state.quizOptions[state.quizChoice];
      const isCorrect = selectedOption === answer;
      body = `<div class="practice-card panel">
        <div class="practice-card-head"><div><div class="eyebrow">Chọn đáp án phù hợp</div>${entry ? `<span class="review-badge ${entry.status}">${statusText(entry.status)}</span>` : ''}</div><span class="topic-chip">${escapeHTML(item.topic.title)}</span></div>
        <h2 class="practice-question">${escapeHTML(item.question)}</h2>
        ${state.showTranslation ? `<p class="translation" style="margin-bottom:18px">${escapeHTML(item.questionVi)}</p>` : ''}
        <div class="option-list">${state.quizOptions.map((option, i) => {
          let cls = '';
          if (state.quizChoice !== null) {
            if (option === answer) cls = 'correct';
            else if (state.quizChoice === i) cls = 'wrong';
          }
          return `<button class="quiz-option ${cls}" data-quiz-option="${i}" ${state.quizChoice !== null ? 'disabled' : ''}>${escapeHTML(option)}</button>`;
        }).join('')}</div>
        ${state.quizChoice !== null ? `<div class="result-message ${isCorrect ? 'good' : 'bad'}"><strong>${isCorrect ? 'Chính xác!' : 'Chưa đúng — câu này đã được thêm vào danh sách ôn.'}</strong><span>${isCorrect ? (reviewEntry(item.id) ? 'Hãy đúng thêm một lần để hoàn tất câu này.' : 'Kết quả đã được lưu vào tài khoản.') : `Đáp án đúng: ${escapeHTML(answer)}`}</span></div><div class="filter-row" style="margin:16px 0 0"><button class="button primary" data-practice-next>Câu tiếp theo →</button></div>` : ''}
      </div>`;
    } else if (state.practiceTab === 'blank') {
      const words = answer.split(/\s+/);
      const masked = words.map((word, i) => state.blankMask.includes(i) ? `<span class="blank-word">${escapeHTML(word)}</span>` : escapeHTML(word)).join(' ');
      body = `<div class="practice-card panel">
        <div class="practice-card-head"><div><div class="eyebrow">Nhớ từ khóa</div>${entry ? `<span class="review-badge ${entry.status}">${statusText(entry.status)}</span>` : ''}</div><span class="topic-chip">${escapeHTML(item.topic.title)}</span></div>
        <h2 class="practice-question">${escapeHTML(item.question)}</h2>
        <div class="blank-answer ${state.blankRevealed ? 'revealed' : ''}">${masked}</div>
        <div class="filter-row" style="margin:16px 0 0">
          <button class="button primary" data-reveal-blank>${state.blankRevealed ? 'Ẩn lại' : 'Hiện đáp án'}</button>
          <button class="button" data-speak="${escapeHTML(answer)}">▶ Nghe</button>
          <button class="button" data-practice-next>Câu khác</button>
        </div>
        ${state.blankRevealed ? `<div class="self-rating"><strong>Sau khi xem đáp án, bạn nhớ mức nào?</strong><div><button class="button result-good" data-blank-result="correct" data-item-id="${item.id}">✓ Nhớ đúng</button><button class="button uncertain-button" data-blank-result="uncertain" data-item-id="${item.id}">? Chưa chắc</button><button class="button danger" data-blank-result="wrong" data-item-id="${item.id}">↺ Tôi quên</button></div></div>` : ''}
      </div>`;
    } else {
      const scoreClass = state.recallScore === null ? '' : state.recallScore >= 70 ? 'good' : state.recallScore >= 40 ? 'warn' : 'bad';
      body = `<div class="practice-card panel">
        <div class="practice-card-head"><div><div class="eyebrow">Tự tạo câu trả lời</div>${entry ? `<span class="review-badge ${entry.status}">${statusText(entry.status)}</span>` : ''}</div><span class="topic-chip">${escapeHTML(item.topic.title)}</span></div>
        <h2 class="practice-question">${escapeHTML(item.question)}</h2>
        ${state.showTranslation ? `<p class="translation" style="margin-bottom:16px">${escapeHTML(item.questionVi)}</p>` : ''}
        <textarea id="recallInput" class="recall-input" placeholder="Gõ câu trả lời bằng tiếng Anh theo cách bạn nhớ…">${escapeHTML(state.recallText)}</textarea>
        <div class="filter-row" style="margin:14px 0 0">
          <button class="button primary" data-check-recall>So sánh và lưu kết quả</button>
          <button class="button" data-practice-next>Câu khác</button>
        </div>
        ${state.recallScore !== null ? `<div class="score-box ${scoreClass}"><strong>Mức trùng ý: ${state.recallScore}% — ${state.recallScore >= 70 ? 'Đạt' : state.recallScore >= 40 ? 'Chưa chắc' : 'Cần học lại'}</strong><p class="subtle">Đáp án tham khảo: ${escapeHTML(answer)}</p><p class="subtle">Không cần giống từng chữ. Hãy ưu tiên trả lời rõ ý, đúng ngữ pháp và nói trôi chảy.</p></div>` : ''}
      </div>`;
    }

    content.innerHTML = `
      ${pageHead('Tự kiểm tra', 'Luyện nhanh', 'Mọi câu sai hoặc chưa chắc đều được lưu riêng theo tài khoản.', modeSwitch())}
      ${scopeBar}
      <div class="practice-tabs">
        <button class="${state.practiceTab === 'quiz' ? 'active' : ''}" data-practice-tab="quiz">Trắc nghiệm</button>
        <button class="${state.practiceTab === 'blank' ? 'active' : ''}" data-practice-tab="blank">Điền từ khóa</button>
        <button class="${state.practiceTab === 'recall' ? 'active' : ''}" data-practice-tab="recall">Tự gõ câu trả lời</button>
      </div>
      ${body}`;
  }

  function similarity(userText, reference) {
    const a = new Set(normalize(userText).split(' ').filter(Boolean));
    const b = new Set(normalize(reference).split(' ').filter(Boolean));
    if (!a.size || !b.size) return 0;
    let overlap = 0;
    a.forEach(word => { if (b.has(word)) overlap++; });
    const precision = overlap / a.size;
    const recall = overlap / b.size;
    return Math.round((2 * precision * recall / (precision + recall || 1)) * 100);
  }

  function formatAttemptDate(value) {
    if (!value) return 'Chưa có thời gian';
    try {
      return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
    } catch { return ''; }
  }

  function renderReview() {
    const all = reviewQueue();
    const counts = {
      wrong: all.filter(entry => entry.status === 'wrong').length,
      uncertain: all.filter(entry => entry.status === 'uncertain').length,
      improving: all.filter(entry => entry.status === 'improving').length
    };
    const query = normalize(state.reviewSearch);
    const list = reviewQueue(state.reviewFilter).filter(entry => !query || normalize([entry.item.question, entry.item.questionVi, entry.item.topic.title, answerFor(entry.item)].join(' ')).includes(query));
    const user = displayUser();

    content.innerHTML = `
      ${pageHead('Tiến độ cá nhân', 'Ôn câu sai và câu chưa chắc', `Danh sách riêng của ${user.displayName}. Câu sai được ưu tiên trước; trả lời đúng hai lần liên tiếp để hoàn tất.`)}
      <div class="review-metrics">
        <article><span class="review-dot wrong"></span><strong>${counts.wrong}</strong><p>Cần học lại</p></article>
        <article><span class="review-dot uncertain"></span><strong>${counts.uncertain}</strong><p>Chưa chắc</p></article>
        <article><span class="review-dot improving"></span><strong>${counts.improving}</strong><p>Đang tiến bộ</p></article>
        <article><span class="review-dot total"></span><strong>${state.stats.attempts || 0}</strong><p>Tổng lượt kiểm tra</p></article>
      </div>

      <div class="review-toolbar panel">
        <div class="review-filter-row">
          <button class="${state.reviewFilter === 'all' ? 'active' : ''}" data-review-filter="all">Tất cả (${all.length})</button>
          <button class="${state.reviewFilter === 'wrong' ? 'active' : ''}" data-review-filter="wrong">Sai (${counts.wrong})</button>
          <button class="${state.reviewFilter === 'uncertain' ? 'active' : ''}" data-review-filter="uncertain">Chưa chắc (${counts.uncertain})</button>
          <button class="${state.reviewFilter === 'improving' ? 'active' : ''}" data-review-filter="improving">Đang tiến bộ (${counts.improving})</button>
        </div>
        <label class="review-search"><span>⌕</span><input id="reviewSearch" value="${escapeHTML(state.reviewSearch)}" placeholder="Tìm trong danh sách ôn…"></label>
        <button class="button primary" data-start-review ${all.length ? '' : 'disabled'}>Bắt đầu ôn theo ưu tiên</button>
      </div>

      ${list.length ? `<div class="review-list">${list.map((entry, index) => {
        const item = entry.item;
        const score = entry.lastScore === null || entry.lastScore === undefined ? '' : ` · Điểm gần nhất ${entry.lastScore}%`;
        return `<article class="review-item ${entry.status}">
          <div class="review-priority">${index + 1}</div>
          <div class="review-main">
            <div class="review-item-top"><span class="review-badge ${entry.status}">${statusText(entry.status)}</span><span class="topic-chip">${escapeHTML(item.topic.title)}</span><small>${formatAttemptDate(entry.lastAttempt)}${score}</small></div>
            <h3>${escapeHTML(item.question)}</h3>
            ${state.showTranslation ? `<p class="translation">${escapeHTML(item.questionVi)}</p>` : ''}
            <details><summary>Xem đáp án tham khảo</summary><p>${escapeHTML(answerFor(item))}</p></details>
            <div class="review-history"><span>Sai: <b>${entry.wrongCount || 0}</b></span><span>Chưa chắc: <b>${entry.uncertainCount || 0}</b></span><span>Đúng liên tiếp: <b>${entry.correctStreak || 0}/2</b></span></div>
          </div>
          <div class="review-actions"><button class="button primary" data-review-practice="${item.id}">Ôn câu này</button><button class="button" data-speak="${escapeHTML(item.question)}">▶ Nghe</button><button class="button small" data-review-remove="${item.id}">Xóa khỏi danh sách</button></div>
        </article>`;
      }).join('')}</div>` : `<div class="empty-state"><div class="complete-icon">${all.length ? '⌕' : '✓'}</div><h2>${all.length ? 'Không tìm thấy câu phù hợp' : 'Danh sách ôn lại đang trống'}</h2><p>${all.length ? 'Thử đổi bộ lọc hoặc từ khóa tìm kiếm.' : 'Hãy làm Luyện nhanh hoặc tự đánh giá Flashcard. Web sẽ tự lưu những câu bạn sai hoặc chưa chắc.'}</p>${all.length ? '' : '<button class="button primary" data-view="practice">Bắt đầu luyện nhanh</button>'}</div>`}

      <div class="review-rule panel">
        <div><strong>Quy tắc ôn lại</strong><p>Sai → ưu tiên cao nhất. Chưa chắc → ưu tiên thứ hai. Đúng một lần → “Đang tiến bộ”. Đúng lần thứ hai liên tiếp → hoàn tất và tự rời danh sách.</p></div>
        <div><strong>Dữ liệu được lưu ở đâu?</strong><p>Mỗi tài khoản có một hồ sơ riêng trong trình duyệt. Vì web chạy offline, dữ liệu không tự đồng bộ sang thiết bị khác.</p></div>
      </div>`;
  }

  function renderPicture() {
    const g = DATA.pictureGuide;
    const generated = state.generatedPicture;
    content.innerHTML = `
      ${pageHead('Speaking · Picture description', 'Mô tả mọi bức tranh theo 8 ô', 'Đi từ tổng quát đến chi tiết: mở tranh → người → nơi → hoạt động → chi tiết → bối cảnh → cảm xúc → ý kiến.', modeSwitch())}
      <div class="picture-flow-mini"><span>1 Mở tranh</span><i>→</i><span>2 Người</span><i>→</i><span>3 Nơi</span><i>→</i><span>4 Việc</span><i>→</i><span>5 Chi tiết</span><i>→</i><span>6 Bối cảnh</span><i>→</i><span>7 Cảm xúc</span><i>→</i><span>8 Kết</span></div>
      <div class="picture-layout">
        <section>
          <div class="panel" style="margin-bottom:14px">
            <div class="eyebrow">Cách mở bài</div>
            <div class="grid-2">
              ${g.openings.map(o => `<div class="opening-card"><strong>${escapeHTML(o.condition)}</strong><div class="code-line">${escapeHTML(state.answerMode === 'natural' ? o.natural : o.original)}</div></div>`).join('')}
            </div>
          </div>
          ${state.answerMode === 'original' ? `<div class="notice" style="margin-bottom:14px">Đây là câu trong file gốc, có một số lỗi như “What do they look likes?”, “many tree” và “this the picture”. Chuyển sang Bản dễ nói để học câu đã sửa.</div>` : ''}
          <div class="step-list">
            ${g.steps.map(step => `<article class="step-card">
              <div class="step-n">${step.n}</div>
              <div><h3>${escapeHTML(step.title)}</h3>${state.showTranslation ? `<p class="translation">${escapeHTML(step.vi)}</p>` : ''}<div class="code-line">${escapeHTML(state.answerMode === 'natural' ? step.natural : step.original)}</div></div>
            </article>`).join('')}
          </div>
          <div class="panel" style="margin-top:14px">
            <div class="eyebrow">Từ vựng trong file</div>
            ${Object.entries(g.vocabulary).map(([group, words]) => `<div style="margin-top:10px"><strong>${escapeHTML(group)}</strong><div class="vocab-pills">${words.map(w => `<span class="pill">${escapeHTML(w)}</span>`).join('')}</div></div>`).join('')}
          </div>
        </section>

        <aside class="panel sticky-panel">
          <div class="eyebrow">Trình ghép bài nói</div>
          <h2 style="margin-top:0">Điền nhanh theo tranh</h2>
          <div class="builder-form">
            ${pictureField('topic','Chủ đề tổng quan')}
            ${pictureField('people','Số người')}
            ${pictureField('relationship','Mối quan hệ')}
            ${pictureField('place','Địa điểm')}
            ${pictureField('activity','Hoạt động')}
            ${pictureField('appearance','Ngoại hình / trang phục', true)}
            ${pictureField('feeling','Cảm xúc')}
            ${pictureField('background','Bối cảnh')}
            ${pictureField('opinion','Ý kiến cá nhân', true)}
            ${pictureField('overall','Từ kết bài (pleasant / lively / meaningful)')}
            <button class="button primary" data-generate-picture>Tạo bài mô tả</button>
          </div>
          <div style="margin-top:15px" class="generated ${generated ? '' : 'empty'}" id="generatedPicture">${generated ? escapeHTML(generated) : 'Bài nói hoàn chỉnh sẽ xuất hiện ở đây.'}</div>
          ${generated ? `<div class="filter-row" style="margin:12px 0 0"><button class="button small" data-speak="${escapeHTML(generated)}">▶ Nghe</button><button class="button small" data-copy="${escapeHTML(generated)}">Sao chép</button></div>` : ''}
        </aside>
      </div>`;
  }

  function pictureField(key, label, textarea = false) {
    const value = state.pictureForm[key] || '';
    return `<div class="field"><label for="pic-${key}">${escapeHTML(label)}</label>${textarea
      ? `<textarea id="pic-${key}" data-picture-field="${key}" rows="2">${escapeHTML(value)}</textarea>`
      : `<input id="pic-${key}" data-picture-field="${key}" value="${escapeHTML(value)}">`}</div>`;
  }

  function generatePictureText() {
    const f = state.pictureForm;
    const parts = [
      sentence(`The picture shows ${f.topic}`),
      sentence(`At first glance, I can see ${f.people} people`),
      sentence(`They may be ${f.relationship}`),
      sentence(`The scene takes place in ${f.place}`),
      sentence(`In the foreground, they are ${f.activity}`),
      sentence(f.appearance),
      sentence(`In the background, there are ${f.background}`),
      sentence(`They look ${f.feeling}`),
      sentence(f.opinion),
      sentence(`Overall, the picture shows a ${f.overall || 'pleasant'} moment`)
    ].map(text => text.trim()).filter(Boolean);
    state.generatedPicture = parts.join(' ');
  }

  function renderDialogue() {
    const d = DATA.dialogue;
    const lines = state.answerMode === 'natural' ? d.natural : d.original;
    content.innerHTML = `
      ${pageHead('Speaking · Collaborative task', 'Hội thoại chọn phương án', 'Luyện đưa ý kiến, phản biện và cùng chốt một lựa chọn.', modeSwitch())}
      <div class="dialogue-layout">
        <section>
          <div class="prompt-box"><div class="eyebrow">Đề bài trong file</div><p><strong>${escapeHTML(d.prompt)}</strong></p>${state.showTranslation ? `<p class="translation" style="margin-top:8px">${escapeHTML(d.promptVi)}</p>` : ''}</div>
          <img class="dialogue-image" src="${d.image}" alt="Các món quà gợi ý cho thành viên câu lạc bộ quần vợt">
          <div class="panel" style="margin-top:14px"><div class="eyebrow">Các phương án trong tranh</div><div class="option-chips">${d.options.map(o => `<button class="option-chip" data-speak="${escapeHTML(o)}">${escapeHTML(o)}</button>`).join('')}</div></div>
          <div class="panel" style="margin-top:14px"><div class="eyebrow">Cụm câu có thể tái sử dụng</div>${d.usefulPhrases.map(g => `<div style="margin-top:12px"><strong>${escapeHTML(g.group)}</strong><div class="vocab-pills">${g.items.map(x => `<button class="option-chip" data-speak="${escapeHTML(x)}">${escapeHTML(x)}</button>`).join('')}</div></div>`).join('')}</div>
        </section>
        <section>
          <div class="panel">
            <div class="topic-header">
              <div><div class="eyebrow">Role-play</div><h2>Mẫu hội thoại</h2></div>
              <select id="dialogueRole" style="border:1px solid var(--line);border-radius:9px;padding:7px 9px">
                <option value="none" ${state.dialogueRole === 'none' ? 'selected' : ''}>Hiện cả A và B</option>
                <option value="A" ${state.dialogueRole === 'A' ? 'selected' : ''}>Ẩn vai A</option>
                <option value="B" ${state.dialogueRole === 'B' ? 'selected' : ''}>Ẩn vai B</option>
              </select>
            </div>
            ${state.answerMode === 'original' ? `<div class="notice" style="margin-bottom:14px">Nguyên văn có nhiều lỗi như “ofter”, “racket tennis”, “orthers”. Hãy dùng để đối chiếu với Bản dễ nói.</div>` : ''}
            <div class="dialogue-lines">${lines.map((line, i) => `<div class="dialogue-line ${state.dialogueRole === line.speaker ? 'hidden-role' : ''}" data-speaker="${line.speaker}">
              <div class="speaker">${line.speaker}</div>
              <div class="bubble">${escapeHTML(line.text)}</div>
              <button class="icon-mini" data-speak="${escapeHTML(line.text)}" aria-label="Nghe câu ${i+1}">▶</button>
            </div>`).join('')}</div>
            <div class="filter-row" style="margin:16px 0 0"><button class="button primary" data-speak="${escapeHTML(lines.map(x => x.text).join(' '))}">▶ Nghe toàn bộ</button><button class="button" data-reveal-dialogue>Hiện các vai</button></div>
          </div>
        </section>
      </div>`;
  }

  function renderSources() {
    const pictureRaw = [
      ...DATA.pictureGuide.openings.map(o => o.original),
      ...DATA.pictureGuide.steps.map(s => `${s.n}. ${s.title}\n${s.original}`)
    ].join('\n\n');
    const dialogueRaw = DATA.dialogue.original.map(x => `${x.speaker}: ${x.text}`).join('\n');
    content.innerHTML = `
      ${pageHead('Đối chiếu', 'Dữ liệu gốc từ 3 file', 'Phần này giữ nguyên nội dung đã trích từ tài liệu để bạn kiểm tra nguồn và so sánh với bản đã sửa.')}
      <div class="grid-3">
        ${DATA.sources.map(source => `<article class="source-card"><h2>${escapeHTML(source.name)}</h2><p>${escapeHTML(source.description)}</p><span class="source-tag">Đã đưa vào web</span></article>`).join('')}
      </div>
      <div class="section-title"><h2>1. Cấu trúc trả lời tranh</h2></div>
      <div class="raw-block">${escapeHTML(pictureRaw)}</div>
      <div class="section-title"><h2>2. Cấu trúc cuộc đối thoại</h2></div>
      <div class="raw-block">${escapeHTML(DATA.dialogue.prompt)}\n\n${escapeHTML(dialogueRaw)}</div>
      <div class="section-title"><h2>3. Speaking Part 4</h2><p>${TOTAL} câu trong 10 nhóm nội dung</p></div>
      ${DATA.topics.map(topic => `<details class="raw-topic"><summary>${escapeHTML(topic.number)}. ${escapeHTML(topic.title)} · ${topic.items.length} câu</summary><div class="raw-topic-body">${topic.items.map(item => `<div class="raw-row"><strong>${escapeHTML(item.question)}</strong><span>${escapeHTML(item.original || 'Tài liệu gốc không có câu trả lời.')}</span></div>`).join('')}</div></details>`).join('')}
    `;
  }

  function renderSearch() {
    const query = normalize(state.search);
    const matches = allItems.filter(item => normalize([item.question, item.questionVi, item.original, item.natural, item.answerVi, item.topic.title, item.topic.titleVi].join(' ')).includes(query));
    const picMatches = DATA.pictureGuide.steps.filter(step => normalize([step.title, step.vi, step.original, step.natural].join(' ')).includes(query));
    const dialogueMatches = [...DATA.dialogue.original, ...DATA.dialogue.natural].filter(line => normalize(line.text).includes(query));
    const starterMatched = normalize('học từ số 0 mẹo ghép câu ghép đoạn viết email khung thư answer reason example result câu hỏi yes no what why how often preference past future opinion từ nối because for example besides however').includes(query);
    const universalMatched = normalize('sườn vạn năng dream direct reason example add mini ending trả lời mọi câu hỏi mô tả mọi bức tranh mở tranh người nơi hoạt động chi tiết bối cảnh cảm xúc ý kiến cứu nguy').includes(query);
    content.innerHTML = `
      ${pageHead('Tìm kiếm', `Kết quả cho “${state.search}”`, `${matches.length + picMatches.length + dialogueMatches.length + (starterMatched ? 1 : 0) + (universalMatched ? 1 : 0)} nội dung phù hợp trong toàn bộ web.`)}
      ${universalMatched ? `<button class="starter-search-result" data-view="universal"><div class="eyebrow">Sườn vạn năng</div><h2>DREAM và khung 8 ô mô tả tranh</h2><p>Mở công thức dùng chung cho mọi chủ đề.</p></button>` : ''}
      ${starterMatched ? `<button class="starter-search-result" data-view="starter"><div class="eyebrow">Bài học nền tảng</div><h2>Ghép câu, ghép đoạn và khung email B1</h2><p>Mở hướng dẫn dành cho người mới và hai trình tạo tự động.</p></button>` : ''}
      ${matches.length ? `<div class="section-title"><h2>Câu hỏi theo chủ đề</h2></div><div class="question-list">${matches.map((item, i) => questionCard(item, i + 1)).join('')}</div>` : ''}
      ${picMatches.length ? `<div class="section-title"><h2>Khung mô tả tranh</h2></div><div class="step-list">${picMatches.map(step => `<article class="step-card"><div class="step-n">${step.n}</div><div><h3>${escapeHTML(step.title)}</h3><p>${escapeHTML(state.answerMode === 'natural' ? step.natural : step.original)}</p></div></article>`).join('')}</div>` : ''}
      ${dialogueMatches.length ? `<div class="section-title"><h2>Mẫu hội thoại</h2></div><div class="panel dialogue-lines">${dialogueMatches.slice(0, 15).map(line => `<div class="dialogue-line" data-speaker="${line.speaker}"><div class="speaker">${line.speaker}</div><div class="bubble">${escapeHTML(line.text)}</div></div>`).join('')}</div>` : ''}
      ${!matches.length && !picMatches.length && !dialogueMatches.length && !starterMatched && !universalMatched ? `<div class="empty-state"><h2>Không tìm thấy nội dung</h2><p>Thử từ khóa ngắn hơn, ví dụ: <strong>internet</strong>, <strong>hometown</strong>, <strong>park</strong> hoặc <strong>picture</strong>.</p></div>` : ''}
    `;
  }

  function render() {
    updateChrome();
    if (state.search.trim()) {
      renderSearch();
    } else {
      const renderers = {
        dashboard: renderDashboard,
        universal: renderUniversal,
        starter: renderStarter,
        topics: renderTopics,
        flashcards: renderFlashcards,
        practice: renderPractice,
        review: renderReview,
        picture: renderPicture,
        dialogue: renderDialogue,
        sources: renderSources
      };
      (renderers[state.view] || renderDashboard)();
    }
    saveState();
  }

  function setView(view) {
    state.view = view;
    state.search = '';
    searchInput.value = '';
    state.flashFlipped = false;
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('accountMenu').classList.remove('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    render();
    content.focus({ preventScroll: true });
  }

  document.addEventListener('click', event => {
    if (event.target.closest('[data-onboarding-next]')) { onboardingStep++; updateOnboarding(); return; }
    if (event.target.closest('[data-onboarding-prev]')) { onboardingStep--; updateOnboarding(); return; }
    if (event.target.closest('[data-onboarding-skip]')) { closeOnboarding(true); return; }
    const onboardingFinish = event.target.closest('[data-onboarding-finish]');
    if (onboardingFinish) { finishOnboarding(onboardingFinish.dataset.onboardingFinish || 'dashboard'); return; }

    const authTab = event.target.closest('[data-auth-tab]');
    if (authTab) { setAuthTab(authTab.dataset.authTab); return; }

    const viewButton = event.target.closest('[data-view]');
    if (viewButton) {
      document.getElementById('accountMenu').classList.remove('show');
      setView(viewButton.dataset.view);
      return;
    }

    const openTopic = event.target.closest('[data-open-topic]');
    if (openTopic) {
      state.selectedTopic = openTopic.dataset.openTopic;
      state.view = 'topics'; state.search = ''; searchInput.value = '';
      window.scrollTo({ top: 0, behavior: 'smooth' }); render(); return;
    }

    const mode = event.target.closest('[data-set-mode]');
    if (mode) { state.answerMode = mode.dataset.setMode; preparePractice(true); render(); return; }

    const topMode = event.target.closest('[data-answer-mode]');
    if (topMode) { state.answerMode = topMode.dataset.answerMode; preparePractice(true); render(); return; }

    const answerToggle = event.target.closest('[data-toggle-answer]');
    if (answerToggle) {
      const card = document.getElementById(`q-${answerToggle.dataset.toggleAnswer}`);
      card?.classList.toggle('open');
      answerToggle.textContent = card?.classList.contains('open') ? 'Ẩn đáp án' : 'Hiện đáp án';
      return;
    }

    const speakButton = event.target.closest('[data-speak]');
    if (speakButton) { speak(speakButton.dataset.speak); return; }

    const copyButton = event.target.closest('[data-copy]');
    if (copyButton) { copyText(copyButton.dataset.copy); return; }

    const masterButton = event.target.closest('[data-master]');
    if (masterButton) {
      const id = masterButton.dataset.master;
      state.mastered.has(id) ? state.mastered.delete(id) : state.mastered.add(id);
      showToast(state.mastered.has(id) ? 'Đã đánh dấu thuộc.' : 'Đã bỏ đánh dấu.');
      render(); return;
    }

    const markReview = event.target.closest('[data-mark-review]');
    if (markReview) {
      flagForReview(markReview.dataset.itemId, markReview.dataset.markReview);
      showToast(markReview.dataset.markReview === 'wrong' ? 'Đã thêm vào nhóm cần học lại.' : 'Đã lưu vào nhóm chưa chắc.');
      render(); return;
    }

    const flashResult = event.target.closest('[data-flash-result]');
    if (flashResult) {
      recordAttempt(flashResult.dataset.itemId, flashResult.dataset.flashResult, 'flashcard');
      const label = flashResult.dataset.flashResult === 'correct' ? 'Đã lưu: nhớ rõ.' : flashResult.dataset.flashResult === 'uncertain' ? 'Đã lưu: chưa chắc.' : 'Đã lưu: cần học lại.';
      showToast(label);
      const deck = flashDeck();
      state.flashIndex = (state.flashIndex + 1) % deck.length;
      state.flashFlipped = false;
      render(); return;
    }

    const flashAction = event.target.closest('[data-flash-action]');
    if (flashAction) {
      const action = flashAction.dataset.flashAction;
      const deck = flashDeck();
      if (action === 'flip') state.flashFlipped = !state.flashFlipped;
      if (action === 'next') { state.flashIndex = (state.flashIndex + 1) % deck.length; state.flashFlipped = false; }
      if (action === 'prev') { state.flashIndex = (state.flashIndex - 1 + deck.length) % deck.length; state.flashFlipped = false; }
      if (action === 'random') { state.flashIndex = Math.floor(Math.random() * deck.length); state.flashFlipped = false; }
      render(); return;
    }

    const scope = event.target.closest('[data-practice-scope]');
    if (scope) {
      state.practiceScope = scope.dataset.practiceScope;
      state.practiceItemId = null;
      preparePractice(true);
      render(); return;
    }

    const startReview = event.target.closest('[data-start-review]');
    if (startReview && reviewQueue().length) {
      state.practiceScope = 'review';
      state.practiceTab = 'recall';
      state.practiceItemId = null;
      state.view = 'practice';
      preparePractice(true);
      render(); return;
    }

    const reviewPractice = event.target.closest('[data-review-practice]');
    if (reviewPractice) {
      state.practiceScope = 'review';
      state.practiceTab = 'recall';
      state.practiceItemId = reviewPractice.dataset.reviewPractice;
      state.view = 'practice';
      state.search = ''; searchInput.value = '';
      render(); return;
    }

    const reviewRemove = event.target.closest('[data-review-remove]');
    if (reviewRemove) {
      delete state.review[reviewRemove.dataset.reviewRemove];
      saveState();
      showToast('Đã xóa khỏi danh sách ôn.');
      render(); return;
    }

    const reviewFilter = event.target.closest('[data-review-filter]');
    if (reviewFilter) { state.reviewFilter = reviewFilter.dataset.reviewFilter; render(); return; }

    const tab = event.target.closest('[data-practice-tab]');
    if (tab) { state.practiceTab = tab.dataset.practiceTab; preparePractice(true); render(); return; }

    const quiz = event.target.closest('[data-quiz-option]');
    if (quiz && state.quizChoice === null) {
      const item = allItems.find(i => i.id === state.practiceItemId);
      state.quizChoice = Number(quiz.dataset.quizOption);
      const selected = state.quizOptions[state.quizChoice];
      recordAttempt(item.id, selected === answerFor(item) ? 'correct' : 'wrong', 'quiz');
      render(); return;
    }

    const blankResult = event.target.closest('[data-blank-result]');
    if (blankResult) {
      recordAttempt(blankResult.dataset.itemId, blankResult.dataset.blankResult, 'fill-blank');
      showToast(blankResult.dataset.blankResult === 'correct' ? 'Đã lưu: nhớ đúng.' : blankResult.dataset.blankResult === 'uncertain' ? 'Đã lưu: chưa chắc.' : 'Đã lưu: cần học lại.');
      preparePractice(true); render(); return;
    }

    if (event.target.closest('[data-practice-next]')) { preparePractice(true); render(); return; }
    if (event.target.closest('[data-reveal-blank]')) { state.blankRevealed = !state.blankRevealed; render(); return; }
    if (event.target.closest('[data-check-recall]')) {
      const item = allItems.find(i => i.id === state.practiceItemId);
      if (!item) return;
      state.recallText = document.getElementById('recallInput')?.value || '';
      state.recallScore = similarity(state.recallText, answerFor(item));
      const result = state.recallScore >= 70 ? 'correct' : state.recallScore >= 40 ? 'uncertain' : 'wrong';
      recordAttempt(item.id, result, 'recall', state.recallScore);
      render(); return;
    }

    if (event.target.closest('[data-generate-dream]')) { generateDreamAnswer(); render(); return; }
    if (event.target.closest('[data-generate-starter-answer]')) { generateStarterAnswer(); render(); return; }
    if (event.target.closest('[data-generate-email]')) { generateStarterEmail(); render(); return; }
    if (event.target.closest('[data-generate-picture]')) { generatePictureText(); render(); return; }
    if (event.target.closest('[data-reveal-dialogue]')) { state.dialogueRole = 'none'; render(); return; }
  });

  document.addEventListener('input', event => {
    const field = event.target.closest('[data-picture-field]');
    if (field) {
      state.pictureForm[field.dataset.pictureField] = field.value;
      saveState();
    }
    const dreamFieldEl = event.target.closest('[data-dream-field]');
    if (dreamFieldEl) {
      state.dreamForm[dreamFieldEl.dataset.dreamField] = dreamFieldEl.value;
      saveState();
    }
    const learningFieldEl = event.target.closest('[data-learning-field]');
    if (learningFieldEl) {
      const group = learningFieldEl.dataset.learningGroup;
      const key = learningFieldEl.dataset.learningField;
      if (group === 'answer') state.answerForm[key] = learningFieldEl.value;
      if (group === 'email') state.emailForm[key] = learningFieldEl.value;
      saveState();
    }
    if (event.target.id === 'reviewSearch') {
      state.reviewSearch = event.target.value;
      clearTimeout(state.reviewSearchTimer);
      state.reviewSearchTimer = setTimeout(() => {
        render();
        const input = document.getElementById('reviewSearch');
        input?.focus();
        input?.setSelectionRange(input.value.length, input.value.length);
      }, 120);
    }
    if (event.target.id === 'recallInput') state.recallText = event.target.value;
  });

  document.addEventListener('change', event => {
    const learningFieldEl = event.target.closest('[data-learning-field]');
    if (learningFieldEl) {
      const group = learningFieldEl.dataset.learningGroup;
      const key = learningFieldEl.dataset.learningField;
      if (group === 'answer') state.answerForm[key] = learningFieldEl.value;
      if (group === 'email') state.emailForm[key] = learningFieldEl.value;
      saveState();
    }
    if (event.target.id === 'flashTopic') {
      state.flashTopic = event.target.value;
      state.flashIndex = 0;
      state.flashFlipped = false;
      render();
    }
    if (event.target.id === 'dialogueRole') {
      state.dialogueRole = event.target.value;
      render();
    }
  });

  searchInput.addEventListener('input', event => {
    state.search = event.target.value;
    render();
  });

  document.getElementById('translationToggle').addEventListener('click', () => {
    state.showTranslation = !state.showTranslation;
    render();
  });

  document.getElementById('fontButton').addEventListener('click', () => {
    const scales = [1, 1.1, 1.2];
    state.fontScale = scales[(scales.indexOf(state.fontScale) + 1) % scales.length];
    showToast(`Cỡ chữ ${Math.round(state.fontScale * 100)}%`);
    render();
  });

  document.getElementById('menuButton').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  document.getElementById('profileButton').addEventListener('click', event => {
    event.stopPropagation();
    if (!currentUser) { openAuth('login', false); return; }
    const menu = document.getElementById('accountMenu');
    menu.classList.toggle('show');
    menu.setAttribute('aria-hidden', String(!menu.classList.contains('show')));
  });

  document.getElementById('authClose').addEventListener('click', closeAuth);
  document.getElementById('guestButton').addEventListener('click', () => {
    const guestKey = profileKey('__guest__');
    if (!localStorage.getItem(guestKey)) localStorage.setItem(guestKey, JSON.stringify(profileSnapshot()));
    startSession('__guest__');
  });

  document.getElementById('openGuideButton').addEventListener('click', () => {
    document.getElementById('accountMenu').classList.remove('show');
    openOnboarding(true);
  });

  document.getElementById('switchAccountButton').addEventListener('click', () => {
    document.getElementById('accountMenu').classList.remove('show');
    openAuth('login', true);
  });

  document.getElementById('logoutButton').addEventListener('click', () => {
    saveState();
    localStorage.removeItem(SESSION_KEY);
    window.location.reload();
  });

  document.getElementById('loginForm').addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const username = cleanUsername(form.get('username'));
    const password = String(form.get('password') || '');
    const users = getUsers();
    const user = users[username];
    const error = document.getElementById('loginError');
    error.textContent = '';
    if (!user) { error.textContent = 'Không tìm thấy tài khoản này trên trình duyệt hiện tại.'; return; }
    const digest = await passwordDigest(password, user.salt);
    if (digest !== user.passwordHash) { error.textContent = 'Mật khẩu chưa đúng.'; return; }
    startSession(username);
  });

  document.getElementById('registerForm').addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const displayName = String(form.get('displayName') || '').trim();
    const username = cleanUsername(form.get('username'));
    const password = String(form.get('password') || '');
    const confirmPassword = String(form.get('confirmPassword') || '');
    const copyProgress = form.get('copyProgress') === 'on';
    const error = document.getElementById('registerError');
    error.textContent = '';
    if (!/^[a-z0-9_.-]{3,24}$/.test(username)) { error.textContent = 'Tên đăng nhập chỉ dùng chữ không dấu, số, dấu chấm, gạch dưới hoặc gạch ngang.'; return; }
    if (password.length < 6) { error.textContent = 'Mật khẩu cần ít nhất 6 ký tự.'; return; }
    if (password !== confirmPassword) { error.textContent = 'Hai mật khẩu chưa giống nhau.'; return; }
    const users = getUsers();
    if (users[username]) { error.textContent = 'Tên đăng nhập này đã tồn tại trên trình duyệt.'; return; }
    const salt = makeSalt();
    users[username] = {
      username,
      displayName,
      salt,
      passwordHash: await passwordDigest(password, salt),
      createdAt: new Date().toISOString()
    };
    setUsers(users);
    const newProfile = copyProgress ? profileSnapshot() : { view: 'dashboard', mastered: [], review: {}, stats: { attempts: 0, correct: 0, wrong: 0, uncertain: 0 } };
    newProfile.onboardingCompleted = false;
    localStorage.setItem(profileKey(username), JSON.stringify(newProfile));
    startSession(username);
  });

  document.getElementById('authOverlay').addEventListener('click', event => {
    if (event.target.id === 'authOverlay' && currentUser) closeAuth();
  });

  document.addEventListener('click', event => {
    const menu = document.getElementById('accountMenu');
    if (!event.target.closest('#accountMenu') && !event.target.closest('#profileButton')) {
      menu.classList.remove('show');
      menu.setAttribute('aria-hidden', 'true');
    }
  });

  document.addEventListener('keydown', event => {
    const typing = ['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName);
    if (event.key === '/' && !typing) { event.preventDefault(); searchInput.focus(); }
    if (event.key === 'Escape') {
      if (document.getElementById('onboardingOverlay').classList.contains('show')) { closeOnboarding(true); return; }
      document.getElementById('accountMenu').classList.remove('show');
      if (currentUser && document.getElementById('authOverlay').classList.contains('show')) { closeAuth(); return; }
      state.search = ''; searchInput.value = ''; document.getElementById('sidebar').classList.remove('open'); render();
    }
    if (state.view === 'flashcards' && !typing) {
      if (event.code === 'Space') { event.preventDefault(); state.flashFlipped = !state.flashFlipped; render(); }
      if (event.key === 'ArrowRight') { state.flashIndex++; state.flashFlipped = false; render(); }
      if (event.key === 'ArrowLeft') { state.flashIndex--; state.flashFlipped = false; render(); }
      if (event.key.toLowerCase() === 'm') {
        const item = flashDeck()[((state.flashIndex % flashDeck().length) + flashDeck().length) % flashDeck().length];
        state.mastered.has(item.id) ? state.mastered.delete(item.id) : state.mastered.add(item.id); render();
      }
    }
  });

  window.addEventListener('resize', syncDeviceMode, { passive: true });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
  }

  render();
  if (!currentUser) openAuth('login', false);
  else if (!state.onboardingCompleted) setTimeout(() => openOnboarding(false), 120);
})();
