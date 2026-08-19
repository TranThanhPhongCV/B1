/* =============================================
   B1 Quiz — Cambridge PET Practice
   Main Application Logic
   ============================================= */
(() => {
  'use strict';

  const DATA = window.QUIZ_DATA;
  const content = document.getElementById('content');

  /* =============================================
     STATE
     ============================================= */
  const STORAGE_KEY = 'b1quiz-state-v1';

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch { return {}; }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }

  const savedState = loadState();

  const state = {
    view: savedState.view || 'dashboard',     // 'dashboard' | 'section' | 'quiz'
    testId: savedState.testId || null,
    sectionId: savedState.sectionId || null,
    partId: savedState.partId || null,
    // answers: { questionId: answerIndex | 'A'|'B'|... }
    answers: savedState.answers || {},
    // revealed: { partKey: true } — whether this part's answers were revealed
    revealed: savedState.revealed || {},
    // scores: { partKey: { correct, total } }
    scores: savedState.scores || {}
  };

  function partKey(testId, sectionId, partId) {
    return `${testId}::${sectionId}::${partId}`;
  }

  /* =============================================
     NAVIGATION
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
    // Close sidebar on mobile
    if (window.innerWidth <= 768) closeSidebar();
  }

  /* =============================================
     DATA HELPERS
     ============================================= */
  function getTest(testId) {
    return DATA.tests.find(t => t.id === testId);
  }

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

  /* Compute correct answer label (A/B/C/D) or index */
  function getAnswerLabel(part, question) {
    if (part.type === 'abc' || part.type === 'abcd') {
      const keys = ['A', 'B', 'C', 'D'];
      return keys[question.answer];
    }
    if (part.type === 'matching' || part.type === 'truefalse' || part.type === 'yesno') {
      return question.answer; // already 'A'/'B'/...
    }
    if (part.type === 'picture') {
      return question.answer; // 'A', 'B', or 'C'
    }
    return String(question.answer);
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
      const scorePct = prog.total ? Math.round((prog.correct / prog.total) * 100) : 0;
      return `
        <article class="test-card fade-in" data-nav-test="${test.id}" tabindex="0" role="button" aria-label="${test.title}">
          <div class="test-card-header">
            <div class="test-num">${test.id.replace('test', '')}</div>
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
      <svg class="svg-defs">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#58a6ff"/>
            <stop offset="100%" stop-color="#a371f7"/>
          </linearGradient>
        </defs>
      </svg>
      <div class="dashboard fade-in">
        <div class="dashboard-hero">
          <div class="hero-badge">📚 Cambridge PET for Schools</div>
          <h1>Luyện thi B1 Trắc nghiệm</h1>
          <p class="hero-sub">4 bài Test đầy đủ Reading & Listening theo chuẩn Cambridge PET — làm bài, kiểm tra đáp án, theo dõi tiến độ.</p>
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
        </div>
        <div class="dashboard-grid">
          ${cardsHtml}
        </div>
      </div>
    `;

    // Events
    content.querySelectorAll('[data-nav-test]').forEach(el => {
      el.addEventListener('click', () => showTestMenu(el.dataset.navTest));
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') showTestMenu(el.dataset.navTest); });
    });

    updateScoreRing();
  }

  function showTestMenu(testId) {
    const test = getTest(testId);
    if (!test) return;
    navigate('section', { testId, sectionId: test.sections[0].id });
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

    // Section switcher tabs
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
        <div style="display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap;">
          ${tabsHtml}
        </div>
        <div class="parts-grid">
          ${partsHtml}
        </div>
      </div>
    `;

    content.querySelectorAll('[data-nav-part]').forEach(el => {
      el.addEventListener('click', () => navigate('quiz', { testId: state.testId, sectionId: state.sectionId, partId: el.dataset.navPart }));
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') navigate('quiz', { testId: state.testId, sectionId: state.sectionId, partId: el.dataset.navPart }); });
    });

    content.querySelectorAll('[data-section-tab]').forEach(el => {
      el.addEventListener('click', () => navigate('section', { testId: state.testId, sectionId: el.dataset.sectionTab }));
    });
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
     QUIZ VIEW
     ============================================= */
  function renderQuiz() {
    const test = getTest(state.testId);
    const section = getSection(state.testId, state.sectionId);
    const part = getPart(state.testId, state.sectionId, state.partId);
    if (!test || !section || !part) { navigate('dashboard'); return; }

    const key = partKey(state.testId, state.sectionId, state.partId);
    const isRevealed = !!state.revealed[key];

    // Instruction
    let instructionHtml = `<div class="quiz-instruction">${part.description}</div>`;

    // Picture gallery for listening part 1
    let pictureHtml = '';
    if (part.type === 'picture' && part.images) {
      pictureHtml = `
        <div class="picture-gallery">
          ${part.images.map(src => `<img src="${src}" alt="Hình câu hỏi Listening Part 1" loading="lazy">`).join('')}
        </div>
      `;
    }

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
    const questionsHtml = part.questions.map((q, idx) => renderQuestion(part, q, idx, key, isRevealed)).join('');

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
        ${pictureHtml}
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
    updateQuizProgress(part, key);
  }

  function renderQuestion(part, q, idx, key, isRevealed) {
    const userAnswer = state.answers[q.id];
    const correctLabel = getAnswerLabel(part, q);
    const hasAnswer = userAnswer !== undefined && userAnswer !== null;

    let statusClass = '';
    if (isRevealed && hasAnswer) {
      const isCorrect = checkAnswer(part, q, userAnswer);
      statusClass = isCorrect ? 'revealed all-correct' : 'revealed has-wrong';
    } else if (hasAnswer) {
      statusClass = 'answered';
    }

    let numClass = '';
    if (isRevealed && hasAnswer) {
      numClass = checkAnswer(part, q, userAnswer) ? 'correct' : 'wrong';
    }

    // Build options HTML based on type
    let optionsHtml = '';

    if (part.type === 'abc' || part.type === 'abcd' || part.type === 'picture') {
      const opts = part.type === 'picture' ? ['A', 'B', 'C'] : q.options;
      const keys = ['A', 'B', 'C', 'D'];
      optionsHtml = `<div class="options-list">` + opts.map((opt, i) => {
        const label = keys[i];
        const isSelected = userAnswer === label;
        const isCorrectOpt = label === correctLabel;
        let cls = 'option-btn';
        if (isRevealed) {
          if (isCorrectOpt) cls += ' correct-ans';
          else if (isSelected && !isCorrectOpt) cls += ' wrong-ans';
        } else if (isSelected) {
          cls += ' selected';
        }
        const text = part.type === 'picture' ? `Hình ${label}` : opt;
        return `<button class="${cls}" data-qid="${q.id}" data-val="${label}" ${isRevealed ? 'disabled' : ''}>
          <span class="option-key">${label}</span>
          <span>${text}</span>
        </button>`;
      }).join('') + `</div>`;
    } else if (part.type === 'matching') {
      // Dropdown-style: show all option buttons A-H
      const opts = part.options || [];
      optionsHtml = `<div class="options-list">` + opts.map(opt => {
        const isSelected = userAnswer === opt.id;
        const isCorrectOpt = opt.id === correctLabel;
        let cls = 'option-btn';
        if (isRevealed) {
          if (isCorrectOpt) cls += ' correct-ans';
          else if (isSelected && !isCorrectOpt) cls += ' wrong-ans';
        } else if (isSelected) {
          cls += ' selected';
        }
        return `<button class="${cls}" data-qid="${q.id}" data-val="${opt.id}" ${isRevealed ? 'disabled' : ''}>
          <span class="option-key">${opt.id}</span>
          <span>${opt.label.replace(/^[A-H]\.\s*/, '')}</span>
        </button>`;
      }).join('') + `</div>`;
    } else if (part.type === 'truefalse') {
      const opts = [{ id: 'A', label: 'A. Correct ✓' }, { id: 'B', label: 'B. Incorrect ✗' }];
      optionsHtml = `<div class="tf-options">` + opts.map(opt => {
        const isSelected = userAnswer === opt.id;
        const isCorrectOpt = opt.id === correctLabel;
        let cls = 'tf-btn';
        if (isRevealed) {
          if (isCorrectOpt) cls += ' correct-ans';
          else if (isSelected && !isCorrectOpt) cls += ' wrong-ans';
        } else if (isSelected) {
          cls += ' selected';
        }
        return `<button class="${cls}" data-qid="${q.id}" data-val="${opt.id}" ${isRevealed ? 'disabled' : ''}>${opt.label}</button>`;
      }).join('') + `</div>`;
    } else if (part.type === 'yesno') {
      const opts = [{ id: 'A', label: 'A. YES ✓' }, { id: 'B', label: 'B. NO ✗' }];
      optionsHtml = `<div class="tf-options">` + opts.map(opt => {
        const isSelected = userAnswer === opt.id;
        const isCorrectOpt = opt.id === correctLabel;
        let cls = 'tf-btn';
        if (isRevealed) {
          if (isCorrectOpt) cls += ' correct-ans';
          else if (isSelected && !isCorrectOpt) cls += ' wrong-ans';
        } else if (isSelected) {
          cls += ' selected';
        }
        return `<button class="${cls}" data-qid="${q.id}" data-val="${opt.id}" ${isRevealed ? 'disabled' : ''}>${opt.label}</button>`;
      }).join('') + `</div>`;
    }

    // Feedback row
    let feedbackHtml = '';
    if (isRevealed && hasAnswer) {
      const isCorrect = checkAnswer(part, q, userAnswer);
      if (isCorrect) {
        feedbackHtml = `<div class="question-feedback show"><span class="feedback-correct">✓ Đúng rồi!</span></div>`;
      } else {
        feedbackHtml = `<div class="question-feedback show"><span class="feedback-wrong">✗ Sai. Đáp án đúng là: <strong>${correctLabel}</strong></span></div>`;
      }
    }

    const qNumDisplay = idx + 1;
    return `
      <div class="question-card ${statusClass}" id="qcard-${q.id}">
        <div class="question-head">
          <div class="question-num ${numClass}">${qNumDisplay}</div>
          <div class="question-text">${q.stem}</div>
        </div>
        ${optionsHtml}
        ${feedbackHtml}
      </div>
    `;
  }

  function attachOptionListeners(part, key) {
    if (state.revealed[key]) return;

    content.querySelectorAll('[data-qid]').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.qid;
        const val = btn.dataset.val;
        state.answers[qid] = val;
        saveState();
        // Update button states
        content.querySelectorAll(`[data-qid="${qid}"]`).forEach(b => {
          b.classList.toggle('selected', b.dataset.val === val);
          const keyEl = b.querySelector('.option-key');
          if (keyEl) {
            // handled by class
          }
        });
        // update card class
        const card = document.getElementById(`qcard-${qid}`);
        if (card) card.classList.add('answered');

        updateQuizProgress(part, key);
        btn.classList.add('pulse');
        setTimeout(() => btn.classList.remove('pulse'), 400);
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

  function checkAnswer(part, q, userAnswer) {
    if (userAnswer === undefined || userAnswer === null) return false;
    const correctLabel = getAnswerLabel(part, q);
    return String(userAnswer) === String(correctLabel);
  }

  function submitQuiz(part, key) {
    // Check if all answered
    const unanswered = part.questions.filter(q => state.answers[q.id] === undefined);
    if (unanswered.length > 0) {
      showToast(`Còn ${unanswered.length} câu chưa trả lời. Hãy trả lời hết trước khi kiểm tra.`, 'info');
      // Scroll to first unanswered
      const firstQ = unanswered[0];
      const el = document.getElementById(`qcard-${firstQ.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Calculate score
    let correct = 0;
    part.questions.forEach(q => {
      if (checkAnswer(part, q, state.answers[q.id])) correct++;
    });

    state.scores[key] = { correct, total: part.questions.length };
    state.revealed[key] = true;
    saveState();

    // Re-render quiz with revealed answers
    renderQuiz();
    updateScoreRing();
    updateSidebarActive();

    // Scroll to result
    setTimeout(() => {
      const resultEl = document.querySelector('.quiz-result-panel');
      if (resultEl) resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }

  function retryPart(key) {
    const part = getPart(state.testId, state.sectionId, state.partId);
    if (!part) return;
    // Clear answers for this part
    part.questions.forEach(q => { delete state.answers[q.id]; });
    delete state.revealed[key];
    delete state.scores[key];
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
      // Try next section
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

    // Events
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
    buildSidebar(); // Rebuild to reflect active states
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
     BREADCRUMB
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

  /* =============================================
     MOBILE SIDEBAR
     ============================================= */
  function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('backdrop').classList.add('show');
  }

  function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('backdrop').classList.remove('show');
  }

  /* =============================================
     TOAST
     ============================================= */
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

  /* =============================================
     RESET
     ============================================= */
  function showResetDialog() {
    const dialog = document.getElementById('resetDialog');
    const backdrop = document.getElementById('backdrop');
    if (dialog) { dialog.classList.add('show'); dialog.setAttribute('aria-hidden', 'false'); }
    if (backdrop) backdrop.classList.add('show');
  }

  function hideResetDialog() {
    const dialog = document.getElementById('resetDialog');
    const backdrop = document.getElementById('backdrop');
    if (dialog) { dialog.classList.remove('show'); dialog.setAttribute('aria-hidden', 'true'); }
    if (backdrop) backdrop.classList.remove('show');
    if (document.getElementById('sidebar')?.classList.contains('open') && window.innerWidth <= 768) {
      // keep backdrop if sidebar is open
    } else {
      if (backdrop) backdrop.classList.remove('show');
    }
  }

  function resetAll() {
    state.answers = {};
    state.revealed = {};
    state.scores = {};
    state.view = 'dashboard';
    state.testId = null;
    state.sectionId = null;
    state.partId = null;
    saveState();
    hideResetDialog();
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
    render();
    updateBreadcrumb();
    updateScoreRing();

    // Menu button
    document.getElementById('menuBtn')?.addEventListener('click', openSidebar);

    // Backdrop click
    document.getElementById('backdrop')?.addEventListener('click', () => {
      closeSidebar();
      hideResetDialog();
    });

    // Sidebar close
    document.getElementById('sidebarClose')?.addEventListener('click', closeSidebar);

    // Reset button
    document.getElementById('resetBtn')?.addEventListener('click', showResetDialog);
    document.getElementById('resetCancel')?.addEventListener('click', hideResetDialog);
    document.getElementById('resetConfirm')?.addEventListener('click', resetAll);

    // Brand logo click → dashboard
    document.querySelector('.brand')?.addEventListener('click', () => navigate('dashboard'));

    // Keyboard shortcut Escape = close sidebar
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeSidebar();
        hideResetDialog();
      }
    });
  }

  init();
})();
