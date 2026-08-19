/* =============================================
   B1 Quiz — Cambridge PET Practice
   Main Application Logic
   ============================================= */
(() => {
  'use strict';

  const DATA = window.QUIZ_DATA;

  // --- GENERATE MASTER TEST ---
  (function generateMasterTest() {
    const masterTest = {
      id: "test-all",
      title: "Tất Cả Câu Hỏi (Master Test)",
      sections: [
        { id: "reading", title: "Reading", icon: "📖", parts: [] },
        { id: "listening", title: "Listening", icon: "🎧", parts: [] }
      ]
    };
    
    const readingParts = [1, 2, 3, 4, 5];
    const listeningParts = [1, 2, 3, 4];
    
    ['reading', 'listening'].forEach(secId => {
      const targetParts = secId === 'reading' ? readingParts : listeningParts;
      const masterSec = masterTest.sections.find(s => s.id === secId);
      
      targetParts.forEach(pNum => {
        let masterPart = null;
        let addedStem = new Set();
        
        DATA.tests.forEach(test => {
          const sec = test.sections.find(s => s.id === secId);
          if (!sec) return;
          const part = sec.parts.find(p => p.id === `part${pNum}`);
          if (!part) return;
          
          if (!masterPart) {
            masterPart = {
              id: `part${pNum}`,
              title: `Part ${pNum} (Tổng hợp)`,
              description: part.description,
              type: part.type,
              options: part.options,
              questions: []
            };
          }
          
          part.questions.forEach(q => {
            const stemNorm = q.stem.trim().toLowerCase();
            if (!addedStem.has(stemNorm)) {
              addedStem.add(stemNorm);
              masterPart.questions.push(q);
            }
          });
        });
        
        if (masterPart && masterPart.questions.length > 0) {
          masterSec.parts.push(masterPart);
        }
      });
    });
    
    DATA.tests.unshift(masterTest);
  })();

  const content = document.getElementById('content');

  /* =============================================
     STATE
     ============================================= */
  const STORAGE_KEY = 'b1quiz-state-v1';
  const COMMENTS_KEY = 'b1quiz-comments-v1';

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } 
    catch { return {}; }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } 
    catch {}
  }

  function loadComments() {
    try { return JSON.parse(localStorage.getItem(COMMENTS_KEY)) || {}; }
    catch { return {}; }
  }

  function saveComments() {
    try { localStorage.setItem(COMMENTS_KEY, JSON.stringify(commentsData)); } 
    catch {}
  }

  const savedState = loadState();
  const commentsData = loadComments(); // { qid: [ { author, date, text } ] }

  const state = {
    currentUser: savedState.currentUser || null,
    view: savedState.view || 'dashboard',
    testId: savedState.testId || null,
    sectionId: savedState.sectionId || null,
    partId: savedState.partId || null,
    answers: savedState.answers || {}, // { qid: 'A'|'B' } (always stores the original option label)
    revealed: savedState.revealed || {},
    scores: savedState.scores || {},
    shuffle: savedState.shuffle || false,
    shuffledMaps: savedState.shuffledMaps || {} // { partKey: { questions: [qid], options: { qid: ['C','A','B'] } } }
  };

  function partKey(testId, sectionId, partId) {
    return `${testId}::${sectionId}::${partId}`;
  }

  /* =============================================
     LOGIN LOGIC
     ============================================= */
  function updateLoginUI() {
    const loginBtn = document.getElementById('loginBtn');
    const profile = document.getElementById('userProfile');
    const nameDisplay = document.getElementById('userNameDisplay');
    
    if (state.currentUser) {
      if(loginBtn) loginBtn.style.display = 'none';
      if(profile) profile.style.display = 'flex';
      if(nameDisplay) nameDisplay.textContent = state.currentUser;
    } else {
      if(loginBtn) loginBtn.style.display = 'inline-flex';
      if(profile) profile.style.display = 'none';
    }
  }

  function handleLogin() {
    const input = document.getElementById('loginNameInput');
    const name = input.value.trim();
    if (name) {
      state.currentUser = name;
      saveState();
      updateLoginUI();
      hideDialog('loginDialog');
      render(); // re-render to update comment UI
      showToast(`Xin chào, ${name}!`);
    }
  }

  function handleLogout() {
    state.currentUser = null;
    saveState();
    updateLoginUI();
    render();
    showToast('Đã đăng xuất.');
  }

  function showDialog(id) {
    const d = document.getElementById(id);
    const b = document.getElementById('backdrop');
    if (d) { d.classList.add('show'); d.setAttribute('aria-hidden', 'false'); }
    if (b) b.classList.add('show');
  }

  function hideDialog(id) {
    const d = document.getElementById(id);
    const b = document.getElementById('backdrop');
    if (d) { d.classList.remove('show'); d.setAttribute('aria-hidden', 'true'); }
    if (b && !document.getElementById('sidebar').classList.contains('open')) {
      b.classList.remove('show');
    }
  }

  /* =============================================
     SHUFFLE LOGIC
     ============================================= */
  function getShuffledArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function generateShuffleMap(part, key) {
    const map = { questions: [], options: {} };
    // Shuffle questions
    map.questions = getShuffledArray(part.questions).map(q => q.id);
    // Shuffle options for abc, abcd
    part.questions.forEach(q => {
      if (part.type === 'abc' || part.type === 'abcd' || part.type === 'picture') {
        const labels = part.type === 'picture' ? ['A', 'B', 'C'] : q.options.map((_, i) => ['A','B','C','D'][i]);
        map.options[q.id] = getShuffledArray(labels);
      } else {
        // No shuffle for matching, truefalse, yesno
        map.options[q.id] = null;
      }
    });
    state.shuffledMaps[key] = map;
    saveState();
    return map;
  }

  function toggleShuffle() {
    state.shuffle = !state.shuffle;
    saveState();
    if (state.view === 'quiz') renderQuiz();
    else if (state.view === 'dashboard') renderDashboard();
    showToast(state.shuffle ? 'Đã BẬT trộn câu hỏi' : 'Đã TẮT trộn câu hỏi');
  }

  /* =============================================
     NAVIGATION & DATA HELPERS
     ============================================= */
  function navigate(view, params = {}) {
    state.view = view;
    if (params.testId !== undefined) state.testId = params.testId;
    if (params.sectionId !== undefined) state.sectionId = params.sectionId;
    if (params.partId !== undefined) state.partId = params.partId;
    saveState();
    render();
    content.scrollTo({ top: 0 });
    updateBreadcrumb();
    updateSidebarActive();
    if (window.innerWidth <= 768) closeSidebar();
  }

  function getTest(testId) { return DATA.tests.find(t => t.id === testId); }
  function getSection(testId, sectionId) {
    const test = getTest(testId);
    return test ? test.sections.find(s => s.id === sectionId) : null;
  }
  function getPart(testId, sectionId, partId) {
    const section = getSection(testId, sectionId);
    return section ? section.parts.find(p => p.id === partId) : null;
  }
  function getPartScore(testId, sectionId, partId) {
    const key = partKey(testId, sectionId, partId);
    return state.scores[key] || null;
  }
  function getTestProgress(testId) {
    const test = getTest(testId);
    if (!test) return { answered: 0, total: 0, correct: 0 };
    let answered = 0, total = 0, correct = 0;
    test.sections.forEach(sec => {
      sec.parts.forEach(part => {
        const key = partKey(testId, sec.id, part.id);
        const sc = state.scores[key];
        total += part.questions.length;
        if (sc) {
          answered += part.questions.length;
          correct += sc.correct;
        }
      });
    });
    return { answered, total, correct };
  }
  function getTotalProgress() {
    let answered = 0, total = 0, correct = 0;
    DATA.tests.forEach(test => {
      const p = getTestProgress(test.id);
      answered += p.answered;
      total += p.total;
      correct += p.correct;
    });
    return { answered, total, correct };
  }

  function getAnswerLabel(part, question) {
    if (part.type === 'abc' || part.type === 'abcd') {
      const keys = ['A', 'B', 'C', 'D'];
      return keys[question.answer];
    }
    if (part.type === 'matching' || part.type === 'truefalse' || part.type === 'yesno' || part.type === 'picture') {
      return question.answer;
    }
    return String(question.answer);
  }

  function getPartTypeLabel(type) {
    const map = {
      'abc': 'Trắc nghiệm 3 lựa chọn (A/B/C)',
      'abcd': 'Trắc nghiệm 4 lựa chọn (A/B/C/D)',
      'matching': 'Ghép nối (Matching)',
      'truefalse': 'Đúng/Sai (A=Correct, B=Incorrect)',
      'yesno': 'Đồng ý/Không đồng ý (A=YES, B=NO)',
      'picture': 'Câu hỏi hình ảnh (A/B/C)'
    };
    return map[type] || type;
  }

  /* =============================================
     RENDER DISPATCH
     ============================================= */
  function render() {
    if (state.view === 'dashboard') renderDashboard();
    else if (state.view === 'section') renderSectionOverview();
    else if (state.view === 'quiz') renderQuiz();
    else renderDashboard();
  }

  /* =============================================
     DASHBOARD
     ============================================= */
  function renderDashboard() {
    const total = getTotalProgress();
    const pct = total.total ? Math.round((total.correct / total.total) * 100) : 0;

    let cardsHtml = DATA.tests.map(test => {
      const prog = getTestProgress(test.id);
      const testPct = prog.total ? Math.round((prog.answered / prog.total) * 100) : 0;
      const isMaster = test.id === 'test-all';
      
      // Derive display label from test.id: "c2t3" -> "Book 2 · Test 3", "test1" -> "PET 1"
      let cardBadge = '';
      if (isMaster) {
        cardBadge = 'ALL';
      } else if (/^c(\d+)t(\d+)$/.test(test.id)) {
        const [, b, t] = test.id.match(/^c(\d+)t(\d+)$/);
        cardBadge = `B${b}·T${t}`;
      } else {
        cardBadge = test.id.replace('test','');
      }
      
      return `
        <article class="test-card fade-in ${isMaster ? 'master-card' : ''}" data-nav-test="${test.id}" tabindex="0" role="button" aria-label="${test.title}">
          <div class="test-card-header">
            <div class="test-num">${cardBadge}</div>
            <div class="test-card-score">${prog.correct}/${prog.total} đúng</div>
          </div>
          <div class="test-card-title">${test.title}</div>
          <div class="test-card-meta">${test.sections.length} phần · ${prog.total} câu hỏi</div>
          <div class="test-progress-bar">
            <div class="test-progress-fill" style="width:${testPct}%"></div>
          </div>
          <div class="test-card-sections">
            ${test.sections.map(s => `<span class="section-chip ${s.id}">${s.icon} ${s.title}</span>`).join('')}
          </div>
        </article>
      `;
    }).join('');

    content.innerHTML = `
      <div class="dashboard fade-in">
        <div class="dashboard-hero">
          <div class="hero-badge">📚 Cambridge PET for Schools</div>
          <h1>Luyện thi B1 Trắc nghiệm</h1>
          <p class="hero-sub">Bài tập đầy đủ Reading & Listening theo chuẩn Cambridge PET — làm bài, kiểm tra đáp án, theo dõi tiến độ.</p>
          <div class="hero-stats">
            <div class="hero-stat">
              <div class="hero-stat-num">${total.total}</div>
              <div class="hero-stat-label">Tổng câu hỏi</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-num">${total.correct}</div>
              <div class="hero-stat-label">Câu đúng</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-num">${pct}%</div>
              <div class="hero-stat-label">Tỉ lệ đúng</div>
            </div>
          </div>
          <div class="dashboard-global-actions">
            <label class="toggle-switch-wrapper shuffle-toggle-pill">
              <span class="toggle-switch-label">Trộn câu hỏi & đáp án</span>
              <div class="toggle-switch">
                <input type="checkbox" id="shuffleToggleGlobal" ${state.shuffle ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </div>
            </label>
          </div>
        </div>

        <div class="dashboard-search-wrap">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="searchInput" class="search-input" placeholder="Tìm câu hỏi..." autocomplete="off">
            <button class="search-clear" id="searchClear" style="display:none">✕</button>
          </div>
          <div class="search-results" id="searchResults" style="display:none"></div>
        </div>

        <div class="dashboard-grid">
          ${cardsHtml}
        </div>
      </div>
    `;

    const shuffleTgl = document.getElementById('shuffleToggleGlobal');
    if (shuffleTgl) shuffleTgl.addEventListener('change', toggleShuffle);

    // Search
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const searchResults = document.getElementById('searchResults');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim();
        searchClear.style.display = q ? '' : 'none';
        if (q.length >= 2) {
          searchResults.style.display = 'block';
          searchResults.innerHTML = renderSearchResults(q);
          attachSearchResultListeners();
        } else {
          searchResults.style.display = 'none';
        }
      });
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        searchResults.style.display = 'none';
      });
    }

    content.querySelectorAll('[data-nav-test]').forEach(el => {
      el.addEventListener('click', () => {
        const t = getTest(el.dataset.navTest);
        navigate('section', { testId: t.id, sectionId: t.sections[0].id });
      });
    });

    updateScoreRing();
  }

  /* =============================================
     SEARCH
     ============================================= */
  function renderSearchResults(query) {
    const q = query.toLowerCase();
    const MAX_RESULTS = 40;
    const results = [];

    for (const test of DATA.tests) {
      if (test.id === 'test-all') continue; // skip master
      for (const sec of test.sections) {
        for (const part of sec.parts) {
          for (const question of part.questions) {
            if (results.length >= MAX_RESULTS) break;
            const stemLow = question.stem.toLowerCase();
            const optionsLow = (question.options || []).map(o => o.toLowerCase()).join(' ');
            if (stemLow.includes(q) || optionsLow.includes(q)) {
              results.push({ test, sec, part, question });
            }
          }
        }
      }
    }

    if (!results.length) {
      return `<div class="search-empty">Không tìm thấy câu hỏi nào khớp với "${query}"</div>`;
    }

    function highlight(text) {
      if (!text) return '';
      const esc = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return text.replace(new RegExp(`(${esc})`, 'gi'), '<mark>$1</mark>');
    }

    return results.map(({test, sec, part, question}) => {
      const badge = /^c(\d+)t(\d+)$/.test(test.id)
        ? (() => { const [,b,t] = test.id.match(/^c(\d+)t(\d+)$/); return `Book ${b} · Test ${t}`; })()
        : `PET 1`;
      return `
        <div class="search-result-item" 
             data-search-test="${test.id}" 
             data-search-sec="${sec.id}" 
             data-search-part="${part.id}" 
             data-search-qid="${question.id}">
          <div class="search-result-meta">${badge} · ${sec.icon} ${sec.title} · ${part.title}</div>
          <div class="search-result-stem">${highlight(question.stem)}</div>
          ${(question.options || []).length ? `
            <div class="search-result-opts">
              ${question.options.map((o, i) => `<span class="sopt">${['A','B','C','D'][i]}. ${highlight(o)}</span>`).join('')}
            </div>` : ''}
        </div>
      `;
    }).join('');
  }

  function attachSearchResultListeners() {
    content.querySelectorAll('[data-search-test]').forEach(el => {
      el.addEventListener('click', () => {
        const tId = el.dataset.searchTest;
        const sId = el.dataset.searchSec;
        const pId = el.dataset.searchPart;
        const qId = el.dataset.searchQid;
        navigate('quiz', { testId: tId, sectionId: sId, partId: pId });
        // After navigation, try to scroll to the question
        setTimeout(() => {
          const el2 = document.getElementById(`qcard-${qId}`);
          if (el2) el2.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      });
    });
  }

  /* =============================================
     SECTION OVERVIEW
     ============================================= */
  function renderSectionOverview() {
    const test = getTest(state.testId);
    const section = getSection(state.testId, state.sectionId);
    if (!test || !section) { navigate('dashboard'); return; }

    const partsHtml = section.parts.map(part => {
      const sc = getPartScore(state.testId, state.sectionId, part.id);
      const pct = sc ? Math.round((sc.correct / sc.total) * 100) : null;
      let scoreClass = 'none', scoreText = '— Chưa làm';
      if (sc) {
        if (pct >= 80) { scoreClass = 'good'; scoreText = `${sc.correct}/${sc.total} (${pct}%)`; }
        else if (pct >= 50) { scoreClass = 'mid'; scoreText = `${sc.correct}/${sc.total} (${pct}%)`; }
        else { scoreClass = 'none'; scoreText = `${sc.correct}/${sc.total} (${pct}%)`; }
      }
      return `
        <div class="part-row fade-in" data-nav-part="${part.id}" tabindex="0" role="button">
          <div class="part-row-num">${part.title}</div>
          <div class="part-row-info">
            <div class="part-row-title">${getPartTypeLabel(part.type)}</div>
            <div class="part-row-desc">${part.description}</div>
          </div>
          <div class="part-row-meta">
            <div class="part-row-count">${part.questions.length} câu</div>
            <div class="part-row-score ${scoreClass}">${scoreText}</div>
          </div>
        </div>
      `;
    }).join('');

    const tabsHtml = test.sections.map(s => `
      <button class="btn ${s.id === state.sectionId ? 'btn-primary' : 'btn-ghost'}" 
              data-section-tab="${s.id}">${s.icon} ${s.title}</button>
    `).join('');

    content.innerHTML = `
      <div class="section-page fade-in">
        <div class="page-title-row">
          <span class="page-icon">${section.icon}</span>
          <h1 class="page-title">${test.title} — ${section.title}</h1>
        </div>
        <div class="page-subtitle">Chọn phần để bắt đầu làm bài trắc nghiệm.</div>
        <div class="section-tabs-row">
          ${tabsHtml}
        </div>
        <div class="parts-grid">
          ${partsHtml}
        </div>
      </div>
    `;

    content.querySelectorAll('[data-nav-part]').forEach(el => {
      el.addEventListener('click', () => navigate('quiz', { partId: el.dataset.navPart }));
    });
    content.querySelectorAll('[data-section-tab]').forEach(el => {
      el.addEventListener('click', () => navigate('section', { sectionId: el.dataset.sectionTab }));
    });
  }

  /* =============================================
     QUIZ VIEW
     ============================================= */
  function renderQuiz() {
    const test = getTest(state.testId);
    const section = getSection(state.testId, state.sectionId);
    const part = getPart(state.testId, state.sectionId, state.partId);
    if (!test || !section || !part) { navigate('dashboard'); return; }

    const key = partKey(state.testId, state.sectionId, state.partId);
    const isRevealed = !!state.revealed[key];

    // Shuffle processing
    let map = null;
    if (state.shuffle && !isRevealed) {
      map = state.shuffledMaps[key] || generateShuffleMap(part, key);
    }

    let orderedQuestions = part.questions;
    if (map) {
      orderedQuestions = map.questions.map(qid => part.questions.find(q => q.id === qid)).filter(Boolean);
    }

    // Instruction
    let instructionHtml = `<div class="quiz-instruction">${part.description}</div>`;

    // Matching options panel
    let matchingPanelHtml = '';
    if ((part.type === 'matching' || part.type === 'truefalse' || part.type === 'yesno') && part.options) {
      matchingPanelHtml = `
        <div class="matching-options-panel">
          <div class="matching-options-title">Các lựa chọn</div>
          <div class="matching-options-grid">
            ${part.options.map(opt => `<div class="matching-option-tag">${opt.label}</div>`).join('')}
          </div>
        </div>
      `;
    }

    // Questions
    const questionsHtml = orderedQuestions.map((q, idx) => renderQuestion(part, q, idx, key, isRevealed, map)).join('');

    // Submit / result area
    const sc = state.scores[key];
    let resultHtml = '';
    if (isRevealed && sc) {
      const pct = Math.round((sc.correct / sc.total) * 100);
      let msg = '';
      if (pct === 100) msg = '🎉 Xuất sắc! Bạn trả lời đúng tất cả các câu!';
      else if (pct >= 80) msg = '👏 Rất tốt! Hãy xem lại những câu còn sai nhé.';
      else if (pct >= 50) msg = '💪 Khá ổn! Cần luyện thêm một chút.';
      else msg = '📖 Hãy đọc kỹ lại đoạn văn/câu hỏi và thử lại.';

      resultHtml = `
        <div class="quiz-result-panel show">
          <div class="result-grid">
            <div class="result-stat correct">
              <div class="result-stat-num">${sc.correct}</div>
              <div class="result-stat-label">Câu đúng</div>
            </div>
            <div class="result-stat wrong">
              <div class="result-stat-num">${sc.total - sc.correct}</div>
              <div class="result-stat-label">Câu sai</div>
            </div>
            <div class="result-stat total">
              <div class="result-stat-num">${pct}%</div>
              <div class="result-stat-label">Tỉ lệ đúng</div>
            </div>
          </div>
          <p class="result-message">${msg}</p>
          <div class="result-actions">
            <button class="btn btn-ghost" id="retryBtn">🔄 Làm lại</button>
            <button class="btn btn-primary" id="nextPartBtn">Phần tiếp theo →</button>
          </div>
        </div>
      `;
    }

    const submitDisabled = isRevealed ? 'disabled' : '';
    const submitLabel = isRevealed ? '✓ Đã xem đáp án' : 'Kiểm tra đáp án';
    const submitClass = isRevealed ? 'btn btn-ghost' : 'btn btn-primary quiz-submit-btn';

    content.innerHTML = `
      <div class="quiz-page fade-in">
        <div class="quiz-header">
          <div class="quiz-header-top">
            <div class="quiz-title-group">
              <div class="quiz-super">${test.title} · ${section.icon} ${section.title}</div>
              <div class="quiz-title">${part.title} — ${getPartTypeLabel(part.type)}</div>
            </div>
            <div class="quiz-actions">
              <button class="btn btn-ghost" id="backToSectionBtn">← Quay lại</button>
            </div>
          </div>
          <div class="quiz-progress-wrap">
            <div class="quiz-progress-bar">
              <div class="quiz-progress-fill" id="quizProgressFill" style="width:0%"></div>
            </div>
            <div class="quiz-progress-text" id="quizProgressText">0 / ${part.questions.length}</div>
          </div>
        </div>

        ${instructionHtml}
        ${matchingPanelHtml}

        <div class="questions-list" id="questionsList">
          ${questionsHtml}
        </div>

        <div class="quiz-submit-area">
          <button class="${submitClass}" id="submitBtn" ${submitDisabled}>${submitLabel}</button>
          ${resultHtml}
        </div>
      </div>
    `;

    // Events
    document.getElementById('backToSectionBtn').addEventListener('click', () => navigate('section', {}));
    document.getElementById('submitBtn').addEventListener('click', () => submitQuiz(part, key));

    if (isRevealed) {
      const retryBtn = document.getElementById('retryBtn');
      const nextPartBtn = document.getElementById('nextPartBtn');
      if (retryBtn) retryBtn.addEventListener('click', () => retryPart(key));
      if (nextPartBtn) nextPartBtn.addEventListener('click', () => goNextPart());
    }

    attachOptionListeners(part, key);
    attachCommentListeners();
    updateQuizProgress(part, key);
  }

  function renderQuestion(part, q, idx, key, isRevealed, map) {
    const userAnswer = state.answers[q.id]; // This is the original correct label (e.g. 'A')
    const correctLabel = getAnswerLabel(part, q);
    const hasAnswer = userAnswer !== undefined && userAnswer !== null;

    let statusClass = '';
    if (isRevealed && hasAnswer) {
      const isCorrect = String(userAnswer) === String(correctLabel);
      statusClass = isCorrect ? 'revealed all-correct' : 'revealed has-wrong';
    } else if (hasAnswer) {
      statusClass = 'answered';
    }

    let numClass = '';
    if (isRevealed && hasAnswer) {
      numClass = (String(userAnswer) === String(correctLabel)) ? 'correct' : 'wrong';
    }

    let imageHtml = '';
    if (q.image) {
      imageHtml = `<div class="question-image"><img src="${q.image}" alt="Question Image" loading="lazy"></div>`;
    }

    // Build options HTML
    let optionsHtml = '';
    const keys = ['A', 'B', 'C', 'D'];

    if (part.type === 'abc' || part.type === 'abcd' || part.type === 'picture') {
      let qOpts = part.type === 'picture' ? ['A', 'B', 'C'] : q.options;
      let optOrder = keys.slice(0, qOpts.length);
      
      // Apply shuffle map if exists
      if (map && map.options[q.id]) {
        optOrder = map.options[q.id];
      }

      optionsHtml = `<div class="options-list">` + optOrder.map((origLabel, i) => {
        const visualLabel = keys[i]; // A, B, C...
        const origIdx = keys.indexOf(origLabel);
        const text = part.type === 'picture' ? `Hình ${origLabel}` : qOpts[origIdx];
        
        const isSelected = userAnswer === origLabel;
        const isCorrectOpt = origLabel === correctLabel;
        
        let cls = 'option-btn';
        if (isRevealed) {
          if (isCorrectOpt) cls += ' correct-ans';
          else if (isSelected && !isCorrectOpt) cls += ' wrong-ans';
        } else if (isSelected) {
          cls += ' selected';
        }

        return `<button class="${cls}" data-qid="${q.id}" data-orig-val="${origLabel}" ${isRevealed ? 'disabled' : ''}>
          <span class="option-key">${visualLabel}</span>
          <span>${text}</span>
        </button>`;
      }).join('') + `</div>`;
    } else if (part.type === 'matching') {
      const opts = part.options || [];
      optionsHtml = `<div class="options-list">` + opts.map(opt => {
        const isSelected = userAnswer === opt.id;
        const isCorrectOpt = opt.id === correctLabel;
        let cls = 'option-btn';
        if (isRevealed) {
          if (isCorrectOpt) cls += ' correct-ans';
          else if (isSelected && !isCorrectOpt) cls += ' wrong-ans';
        } else if (isSelected) cls += ' selected';
        
        return `<button class="${cls}" data-qid="${q.id}" data-orig-val="${opt.id}" ${isRevealed ? 'disabled' : ''}>
          <span class="option-key">${opt.id}</span>
          <span>${opt.label.replace(/^[A-H]\.\s*/, '')}</span>
        </button>`;
      }).join('') + `</div>`;
    } else if (part.type === 'truefalse' || part.type === 'yesno') {
      const opts = part.type === 'truefalse' 
        ? [{ id: 'A', label: 'A. Correct ✓' }, { id: 'B', label: 'B. Incorrect ✗' }]
        : [{ id: 'A', label: 'A. YES ✓' }, { id: 'B', label: 'B. NO ✗' }];
      
      optionsHtml = `<div class="tf-options">` + opts.map(opt => {
        const isSelected = userAnswer === opt.id;
        const isCorrectOpt = opt.id === correctLabel;
        let cls = 'tf-btn';
        if (isRevealed) {
          if (isCorrectOpt) cls += ' correct-ans';
          else if (isSelected && !isCorrectOpt) cls += ' wrong-ans';
        } else if (isSelected) cls += ' selected';
        
        return `<button class="${cls}" data-qid="${q.id}" data-orig-val="${opt.id}" ${isRevealed ? 'disabled' : ''}>${opt.label}</button>`;
      }).join('') + `</div>`;
    }

    // Feedback row
    let feedbackHtml = '';
    if (isRevealed && hasAnswer) {
      const isCorrect = String(userAnswer) === String(correctLabel);
      if (isCorrect) {
        feedbackHtml = `<div class="question-feedback show"><span class="feedback-correct">✓ Đúng rồi!</span></div>`;
      } else {
        feedbackHtml = `<div class="question-feedback show"><span class="feedback-wrong">✗ Sai. Đáp án đúng là: <strong>${correctLabel}</strong></span></div>`;
      }
    }

    // Comments section
    const qComments = commentsData[q.id] || [];
    const commentCount = qComments.length;
    let commentHtml = `
      <div class="question-comments-section" id="comments-${q.id}" style="display:none;">
        <div class="comments-list">
          ${qComments.map(c => `
            <div class="comment-item">
              <div class="comment-avatar">${c.author.charAt(0).toUpperCase()}</div>
              <div class="comment-body">
                <div class="comment-header">
                  <span class="comment-author">${c.author}</span>
                  <span class="comment-date">${c.date}</span>
                </div>
                <div class="comment-text">${c.text}</div>
              </div>
            </div>
          `).join('')}
        </div>
        ${state.currentUser ? `
          <div class="comment-input-area">
            <textarea id="comment-input-${q.id}" placeholder="Viết nhận xét..."></textarea>
            <button class="btn comment-submit-btn" data-comment-submit="${q.id}">Gửi</button>
          </div>
        ` : `<div style="font-size:12px;color:var(--text-muted);">Vui lòng <a href="#" style="color:var(--accent);" onclick="document.getElementById('loginBtn').click();return false;">đăng nhập</a> để bình luận.</div>`}
      </div>
    `;

    return `
      <div class="question-card ${statusClass}" id="qcard-${q.id}">
        <div class="question-head">
          <div class="question-num ${numClass}">${idx + 1}</div>
          <div class="question-text">${q.stem}</div>
        </div>
        ${imageHtml}
        ${optionsHtml}
        ${feedbackHtml}
        <button class="toggle-comments-btn" data-toggle-comment="${q.id}">
          💬 Nhận xét ${commentCount > 0 ? `(${commentCount})` : ''}
        </button>
        ${commentHtml}
      </div>
    `;
  }

  function attachOptionListeners(part, key) {
    if (state.revealed[key]) return;

    content.querySelectorAll('[data-orig-val]').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.qid;
        const val = btn.dataset.origVal;
        state.answers[qid] = val;
        saveState();
        
        content.querySelectorAll(`[data-qid="${qid}"]`).forEach(b => {
          b.classList.toggle('selected', b.dataset.origVal === val);
        });
        
        const card = document.getElementById(`qcard-${qid}`);
        if (card) card.classList.add('answered');

        updateQuizProgress(part, key);
        btn.classList.add('pulse');
        setTimeout(() => btn.classList.remove('pulse'), 400);
      });
    });
  }

  function attachCommentListeners() {
    content.querySelectorAll('[data-toggle-comment]').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.toggleComment;
        const section = document.getElementById(`comments-${qid}`);
        if (section.style.display === 'none') {
          section.style.display = 'block';
          btn.style.background = 'var(--bg-4)';
        } else {
          section.style.display = 'none';
          btn.style.background = 'var(--bg-3)';
        }
      });
    });

    content.querySelectorAll('[data-comment-submit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.commentSubmit;
        const input = document.getElementById(`comment-input-${qid}`);
        const text = input.value.trim();
        if (text && state.currentUser) {
          if (!commentsData[qid]) commentsData[qid] = [];
          commentsData[qid].push({
            author: state.currentUser,
            date: new Date().toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            text: text
          });
          saveComments();
          // Re-render part to show new comment
          renderQuiz();
          // Keep comment open
          setTimeout(() => {
            const section = document.getElementById(`comments-${qid}`);
            if (section) section.style.display = 'block';
          }, 50);
        }
      });
    });
  }

  function updateQuizProgress(part, key) {
    const answered = part.questions.filter(q => state.answers[q.id] !== undefined).length;
    const total = part.questions.length;
    const pct = total ? Math.round((answered / total) * 100) : 0;
    const fill = document.getElementById('quizProgressFill');
    const text = document.getElementById('quizProgressText');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = `${answered} / ${total}`;
  }

  function submitQuiz(part, key) {
    const unanswered = part.questions.filter(q => state.answers[q.id] === undefined);
    if (unanswered.length > 0) {
      showToast(`Còn ${unanswered.length} câu chưa trả lời. Hãy trả lời hết trước khi kiểm tra.`, 'info');
      const el = document.getElementById(`qcard-${unanswered[0].id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    let correct = 0;
    part.questions.forEach(q => {
      if (String(state.answers[q.id]) === String(getAnswerLabel(part, q))) correct++;
    });

    state.scores[key] = { correct, total: part.questions.length };
    state.revealed[key] = true;
    saveState();

    renderQuiz();
    updateScoreRing();
    updateSidebarActive();

    setTimeout(() => {
      const resultEl = document.querySelector('.quiz-result-panel');
      if (resultEl) resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }

  function retryPart(key) {
    const part = getPart(state.testId, state.sectionId, state.partId);
    if (!part) return;
    part.questions.forEach(q => { delete state.answers[q.id]; });
    delete state.revealed[key];
    delete state.scores[key];
    delete state.shuffledMaps[key]; // clear shuffle so it regenerates if shuffle is ON
    saveState();
    renderQuiz();
    updateScoreRing();
  }

  function goNextPart() {
    const section = getSection(state.testId, state.sectionId);
    if (!section) return;
    const idx = section.parts.findIndex(p => p.id === state.partId);
    if (idx < section.parts.length - 1) {
      navigate('quiz', { partId: section.parts[idx + 1].id });
    } else {
      const test = getTest(state.testId);
      const secIdx = test.sections.findIndex(s => s.id === state.sectionId);
      if (secIdx < test.sections.length - 1) {
        const nextSec = test.sections[secIdx + 1];
        navigate('quiz', { sectionId: nextSec.id, partId: nextSec.parts[0].id });
        showToast(`Chuyển sang ${nextSec.title}`, 'info');
      } else {
        navigate('section', {});
        showToast('Bạn đã hoàn thành tất cả các phần! 🎉', 'success');
      }
    }
  }

  /* =============================================
     SIDEBAR
     ============================================= */
  function buildSidebar() {
    const nav = document.getElementById('sidebarNav');
    if (!nav) return;

    nav.innerHTML = DATA.tests.map(test => {
      const prog = getTestProgress(test.id);
      const pct = prog.total ? Math.round((prog.correct / prog.total) * 100) : 0;
      const isActive = state.testId === test.id;

      const sectionsHtml = test.sections.map(sec => {
        const partsHtml = sec.parts.map(part => {
          const sc = getPartScore(test.id, sec.id, part.id);
          const isPartActive = state.view === 'quiz' && state.testId === test.id && state.sectionId === sec.id && state.partId === part.id;
          const isPerfect = sc && sc.correct === sc.total;
          const scoreTag = sc ? `<span class="nav-part-score ${isPerfect ? 'perfect' : ''}">${sc.correct}/${sc.total}</span>` : '';

          return `
            <button class="nav-part-btn ${isPartActive ? 'active' : ''}" 
                    data-nav-quiz="${test.id}" data-nav-sec="${sec.id}" data-nav-part="${part.id}">
              ${part.title}
              ${scoreTag}
            </button>
          `;
        }).join('');

        return `
          <div class="nav-section-header">${sec.icon} ${sec.title}</div>
          ${partsHtml}
        `;
      }).join('');

      return `
        <div class="nav-test-group ${isActive ? 'open' : ''}" id="navgroup-${test.id}">
          <div class="nav-test-header ${isActive ? 'active' : ''}" data-nav-toggle="${test.id}">
            <span class="nav-test-title">${test.title}</span>
            <span class="nav-test-badge">${pct}%</span>
            <span class="nav-chevron">›</span>
          </div>
          <div class="nav-test-items">
            <button class="nav-part-btn ${state.view === 'section' && state.testId === test.id ? 'active' : ''}"
                    data-nav-section="${test.id}">📋 Tổng quan</button>
            ${sectionsHtml}
          </div>
        </div>
      `;
    }).join('');

    nav.querySelectorAll('[data-nav-toggle]').forEach(el => {
      el.addEventListener('click', () => {
        const group = document.getElementById(`navgroup-${el.dataset.navToggle}`);
        if (group) group.classList.toggle('open');
      });
    });
    nav.querySelectorAll('[data-nav-section]').forEach(el => {
      el.addEventListener('click', () => {
        const test = getTest(el.dataset.navSection);
        navigate('section', { testId: el.dataset.navSection, sectionId: test?.sections[0]?.id });
      });
    });
    nav.querySelectorAll('[data-nav-quiz]').forEach(el => {
      el.addEventListener('click', () => {
        navigate('quiz', { testId: el.dataset.navQuiz, sectionId: el.dataset.navSec, partId: el.dataset.navPart });
      });
    });
  }

  function updateSidebarActive() {
    buildSidebar();
    updateScoreRing();
  }

  function updateScoreRing() {
    const total = getTotalProgress();
    const pct = total.total ? Math.round((total.correct / total.total) * 100) : 0;
    const ring = document.getElementById('ringFill');
    const pctText = document.getElementById('ringPercent');
    const detail = document.getElementById('sidebarScoreDetail');
    if (ring) {
      const circumference = 201.06;
      const offset = circumference - (pct / 100) * circumference;
      ring.style.strokeDashoffset = offset;
      ring.setAttribute('stroke', 'url(#ringGradient)');
      ring.style.stroke = '#58a6ff'; // fallback
    }
    if (pctText) pctText.textContent = pct + '%';
    if (detail) detail.textContent = `${total.correct} / ${total.total} câu đúng`;
  }

  /* =============================================
     BREADCRUMB & MOBILE
     ============================================= */
  function updateBreadcrumb() {
    const el = document.getElementById('topbarBreadcrumb');
    if (!el) return;
    if (state.view === 'dashboard') {
      el.innerHTML = `<span>B1 Quiz</span>`;
    } else if (state.view === 'section') {
      const test = getTest(state.testId);
      const section = getSection(state.testId, state.sectionId);
      el.innerHTML = `
        <button class="crumb-link" data-nav-dash>B1 Quiz</button>
        <span class="crumb-sep">/</span>
        <span class="crumb-current">${test?.title} · ${section?.icon} ${section?.title}</span>
      `;
    } else if (state.view === 'quiz') {
      const test = getTest(state.testId);
      const section = getSection(state.testId, state.sectionId);
      const part = getPart(state.testId, state.sectionId, state.partId);
      el.innerHTML = `
        <button class="crumb-link" data-nav-dash>B1 Quiz</button>
        <span class="crumb-sep">/</span>
        <button class="crumb-link" data-nav-section>
          ${test?.title} · ${section?.icon} ${section?.title}
        </button>
        <span class="crumb-sep">/</span>
        <span class="crumb-current">${part?.title}</span>
      `;
    }
    el.querySelectorAll('[data-nav-dash]').forEach(b => b.addEventListener('click', () => navigate('dashboard')));
    el.querySelectorAll('[data-nav-section]').forEach(b => b.addEventListener('click', () => navigate('section', {})));
  }

  function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('backdrop').classList.add('show');
  }

  function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    if (!document.getElementById('resetDialog')?.classList.contains('show') &&
        !document.getElementById('loginDialog')?.classList.contains('show')) {
      document.getElementById('backdrop').classList.remove('show');
    }
  }

  function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s';
      setTimeout(() => el.remove(), 300);
    }, 3000);
  }

  function resetAll() {
    state.answers = {};
    state.revealed = {};
    state.scores = {};
    state.shuffledMaps = {};
    state.view = 'dashboard';
    state.testId = null;
    state.sectionId = null;
    state.partId = null;
    saveState();
    hideDialog('resetDialog');
    render();
    buildSidebar();
    updateBreadcrumb();
    showToast('Đã đặt lại toàn bộ tiến độ.', 'success');
  }

  /* =============================================
     INIT & EVENTS
     ============================================= */
  function init() {
    buildSidebar();
    updateLoginUI();
    render();
    updateBreadcrumb();
    updateScoreRing();

    // Menu button
    document.getElementById('menuBtn')?.addEventListener('click', openSidebar);
    document.getElementById('sidebarClose')?.addEventListener('click', closeSidebar);
    document.querySelector('.brand')?.addEventListener('click', () => navigate('dashboard'));

    // Backdrop click
    document.getElementById('backdrop')?.addEventListener('click', () => {
      closeSidebar();
      hideDialog('resetDialog');
      hideDialog('loginDialog');
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeSidebar();
        hideDialog('resetDialog');
        hideDialog('loginDialog');
      }
    });

    // Reset Dialog
    document.getElementById('resetBtn')?.addEventListener('click', () => showDialog('resetDialog'));
    document.getElementById('resetCancel')?.addEventListener('click', () => hideDialog('resetDialog'));
    document.getElementById('resetConfirm')?.addEventListener('click', resetAll);

    // Login Dialog
    document.getElementById('loginBtn')?.addEventListener('click', () => showDialog('loginDialog'));
    document.getElementById('loginCancel')?.addEventListener('click', () => hideDialog('loginDialog'));
    document.getElementById('loginConfirm')?.addEventListener('click', handleLogin);
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
    
    // Login on Enter key
    document.getElementById('loginNameInput')?.addEventListener('keydown', (e) => {
      if(e.key === 'Enter') handleLogin();
    });
  }

  init();
})();
