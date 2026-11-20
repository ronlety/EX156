(() => {
  const TOTAL_SECONDS = 90 * 60;
  const PASS_PCT = 70;

  const els = {
    home: document.getElementById("view-home"),
    topics: document.getElementById("view-topics"),
    exam: document.getElementById("view-exam"),
    results: document.getElementById("view-results"),
    metaCount: document.getElementById("meta-count"),
    progressLabel: document.getElementById("progress-label"),
    progressFill: document.getElementById("progress-fill"),
    timer: document.getElementById("timer"),
    domain: document.getElementById("q-domain"),
    text: document.getElementById("q-text"),
    code: document.getElementById("q-code"),
    options: document.getElementById("q-options"),
    prev: document.getElementById("btn-prev"),
    next: document.getElementById("btn-next"),
    scorePct: document.getElementById("score-pct"),
    scoreDetail: document.getElementById("score-detail"),
    verdict: document.getElementById("verdict"),
    domainScores: document.getElementById("domain-scores"),
    reviewList: document.getElementById("review-list"),
  };

  const state = {
    order: [],
    answers: {},
    index: 0,
    remaining: TOTAL_SECONDS,
    timerId: null,
    startedAt: null,
  };

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function show(view) {
    [els.home, els.topics, els.exam, els.results].forEach((v) =>
      v.classList.add("hidden")
    );
    view.classList.remove("hidden");
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function updateTimerUi() {
    els.timer.textContent = formatTime(state.remaining);
    els.timer.classList.toggle("warn", state.remaining <= 15 * 60 && state.remaining > 5 * 60);
    els.timer.classList.toggle("danger", state.remaining <= 5 * 60);
  }

  function stopTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    state.remaining = TOTAL_SECONDS;
    updateTimerUi();
    state.timerId = setInterval(() => {
      state.remaining -= 1;
      updateTimerUi();
      if (state.remaining <= 0) {
        stopTimer();
        finishExam(true);
      }
    }, 1000);
  }

  function currentQuestion() {
    return state.order[state.index];
  }

  function renderQuestion() {
    const q = currentQuestion();
    const n = state.order.length;
    els.progressLabel.textContent = `${state.index + 1} / ${n}`;
    els.progressFill.style.width = `${((state.index + 1) / n) * 100}%`;
    els.domain.textContent = q.domain;
    els.text.textContent = q.text;

    if (q.code) {
      els.code.textContent = q.code;
      els.code.classList.remove("hidden");
    } else {
      els.code.textContent = "";
      els.code.classList.add("hidden");
    }

    const selected = state.answers[q.id];
    els.options.innerHTML = "";
    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option" + (selected === i ? " selected" : "");
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-selected", selected === i ? "true" : "false");
      btn.innerHTML = `<span class="key">${String.fromCharCode(65 + i)}.</span><span>${escapeHtml(opt)}</span>`;
      btn.addEventListener("click", () => {
        state.answers[q.id] = i;
        renderQuestion();
      });
      els.options.appendChild(btn);
    });

    els.prev.disabled = state.index === 0;
    els.next.textContent = state.index === n - 1 ? "Entregar" : "Siguiente";
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function startExam() {
    state.order = shuffle(window.EX156_QUESTIONS);
    state.answers = {};
    state.index = 0;
    state.startedAt = Date.now();
    show(els.exam);
    startTimer();
    renderQuestion();
  }

  function confirmFinish() {
    const unanswered = state.order.filter((q) => state.answers[q.id] === undefined).length;
    const msg =
      unanswered > 0
        ? `Tienes ${unanswered} pregunta(s) sin responder. ¿Entregar de todos modos?`
        : "¿Entregar el examen?";
    if (window.confirm(msg)) finishExam(false);
  }

  function finishExam(fromTimer) {
    stopTimer();
    const total = state.order.length;
    let correct = 0;
    const byDomain = {};

    state.order.forEach((q) => {
      if (!byDomain[q.domain]) byDomain[q.domain] = { correct: 0, total: 0 };
      byDomain[q.domain].total += 1;
      const ok = state.answers[q.id] === q.answer;
      if (ok) {
        correct += 1;
        byDomain[q.domain].correct += 1;
      }
    });

    const pct = Math.round((correct / total) * 100);
    const passed = pct >= PASS_PCT;

    els.scorePct.textContent = `${pct}%`;
    els.scoreDetail.textContent = `${correct} / ${total} correctas`;
    els.verdict.textContent = fromTimer
      ? passed
        ? "Tiempo agotado — resultado: aprobado (práctica)."
        : "Tiempo agotado — resultado: no aprobado (práctica)."
      : passed
        ? "Aprobado en este simulacro (≥ 70%)."
        : "No aprobado en este simulacro. Revisa las explicaciones y reintenta.";
    els.verdict.className = "verdict " + (passed ? "pass" : "fail");

    els.domainScores.innerHTML = Object.entries(byDomain)
      .map(([domain, s]) => {
        const dp = Math.round((s.correct / s.total) * 100);
        return `<div class="domain-row">
          <span>${escapeHtml(domain)}</span>
          <strong>${s.correct}/${s.total}</strong>
          <div class="bar"><span style="width:${dp}%"></span></div>
        </div>`;
      })
      .join("");

    els.reviewList.innerHTML = state.order
      .map((q, idx) => {
        const chosen = state.answers[q.id];
        const ok = chosen === q.answer;
        const chosenText =
          chosen === undefined ? "Sin respuesta" : q.options[chosen];
        return `<article class="review-item ${ok ? "ok" : "bad"}">
          <h3>${idx + 1}. ${escapeHtml(q.text)}</h3>
          <p><strong>Tu respuesta:</strong> ${escapeHtml(chosenText)}</p>
          <p><strong>Correcta:</strong> ${escapeHtml(q.options[q.answer])}</p>
          <p class="explain">${escapeHtml(q.explain)}</p>
        </article>`;
      })
      .join("");

    show(els.results);
  }

  els.metaCount.textContent = String(window.EX156_QUESTIONS.length);

  document.getElementById("btn-start").addEventListener("click", startExam);
  document.getElementById("btn-start-from-topics").addEventListener("click", startExam);
  document.getElementById("btn-review-topics").addEventListener("click", () => show(els.topics));
  document.getElementById("btn-topics-back").addEventListener("click", () => show(els.home));
  document.getElementById("btn-home").addEventListener("click", () => {
    stopTimer();
    show(els.home);
  });
  document.getElementById("btn-retry").addEventListener("click", startExam);
  document.getElementById("btn-finish-early").addEventListener("click", confirmFinish);

  els.prev.addEventListener("click", () => {
    if (state.index > 0) {
      state.index -= 1;
      renderQuestion();
    }
  });

  els.next.addEventListener("click", () => {
    if (state.index >= state.order.length - 1) {
      confirmFinish();
    } else {
      state.index += 1;
      renderQuestion();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (els.exam.classList.contains("hidden")) return;
    if (e.key >= "1" && e.key <= "4") {
      const q = currentQuestion();
      state.answers[q.id] = Number(e.key) - 1;
      renderQuestion();
    } else if (e.key === "ArrowRight") {
      els.next.click();
    } else if (e.key === "ArrowLeft") {
      els.prev.click();
    }
  });
})();
