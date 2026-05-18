// ============================================
// Summer Sky Wedding — Main interactions
// ============================================

(function () {
  'use strict';

  const W = window.WEDDING;

  // ============================================
  // Utility — Toast
  // ============================================
  const toast = (() => {
    const el = document.getElementById('toast');
    let timer;
    return (msg) => {
      el.textContent = msg;
      el.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(() => el.classList.remove('show'), 2200);
    };
  })();

  // ============================================
  // Calendar — Aug 2026
  // ============================================
  function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;

    // 2026년 8월: 1일은 토요일 (Sat = index 6)
    // 8월에는 31일까지 있음
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    let html = days.map(d => `<div class="day-label">${d}</div>`).join('');

    // 8월 1일이 토요일 — 앞에 6개 빈칸
    const firstDayIdx = 6;
    for (let i = 0; i < firstDayIdx; i++) {
      html += `<div class="day empty"></div>`;
    }
    for (let d = 1; d <= 31; d++) {
      const isWedding = d === 9;
      html += `<div class="day ${isWedding ? 'wedding' : ''}">${d}</div>`;
    }
    grid.innerHTML = html;
  }

  // ============================================
  // D-Day Counter
  // ============================================
  function renderDday() {
    const target = new Date(W.date).getTime();
    const labelEl = document.querySelector('.dday-label');
    const messageEl = document.querySelector('.dday-message');
    const counterEl = document.querySelector('.dday-counter');
    const highlightEl = document.querySelector('.dday-highlight');

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        // 결혼식 당일 또는 지난 후
        const dayMs = 24 * 60 * 60 * 1000;
        const elapsed = Math.floor(-diff / dayMs);
        if (elapsed < 1) {
          labelEl.textContent = 'D-DAY';
          messageEl.textContent = '';
          counterEl.style.display = 'none';
          highlightEl.textContent = '오늘은 저희의 결혼식입니다 ❤';
          highlightEl.style.display = 'block';
        } else {
          labelEl.textContent = 'Thank you';
          messageEl.textContent = '';
          counterEl.style.display = 'none';
          highlightEl.textContent = '함께해 주셔서 감사합니다';
          highlightEl.style.display = 'block';
        }
        return false;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      counterEl.innerHTML = `
        <div class="unit"><span class="num">${pad(days)}</span><div class="lbl">DAYS</div></div>
        <div class="unit"><span class="num">${pad(hours)}</span><div class="lbl">HOURS</div></div>
        <div class="unit"><span class="num">${pad(minutes)}</span><div class="lbl">MIN</div></div>
        <div class="unit"><span class="num">${pad(seconds)}</span><div class="lbl">SEC</div></div>
      `;
      return true;
    }

    if (tick()) {
      setInterval(tick, 1000);
    }
  }

  // ============================================
  // Gallery + Lightbox
  // ============================================
  async function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    // Auto-detect from folder first, fallback to data.js list
    let imageList = await probeImages('assets/images/gallery');
    if (!imageList.length) imageList = W.gallery || [];

    grid.innerHTML = imageList.map((src, i) => `
      <div class="gallery-item" data-idx="${i}">
        <img src="${src}" alt="gallery ${i + 1}" loading="lazy">
      </div>
    `).join('');

    // Fade-in on load
    grid.querySelectorAll('img').forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('loaded'));
      }
    });

    // Lightbox
    const lb = document.getElementById('lightbox');
    const lbImg = lb.querySelector('.lightbox-img');
    const counter = lb.querySelector('.lightbox-counter');
    let current = 0;

    function show(i) {
      current = (i + imageList.length) % imageList.length;
      lbImg.src = imageList[current];
      counter.textContent = `${current + 1} / ${imageList.length}`;
    }

    grid.addEventListener('click', e => {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      show(parseInt(item.dataset.idx, 10));
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    lb.querySelector('.lightbox-close').addEventListener('click', () => {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    });
    lb.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
    lb.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));

    // Click on backdrop to close
    lb.addEventListener('click', e => {
      if (e.target === lb) {
        lb.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Swipe support
    let startX = 0;
    lb.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    });

    // Keyboard
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') { lb.classList.remove('open'); document.body.style.overflow = ''; }
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  // ============================================
  // Invitation — Parents block
  // ============================================
  function renderParents() {
    const box = document.getElementById('parents-box');
    if (!box) return;

    const renderSide = (side, sideLabel) => {
      const f = side.father, m = side.mother;
      const fName = (f.deceased ? '<span class="deceased">故</span>' : '') +
        `<span class="person-name">${f.name}</span>`;
      const mName = `<span class="person-name">${m.name}</span>`;
      return `
        <div class="parents-line">
          <div class="parents-text">
            ${fName}<span class="relation">·</span>${mName}
            <span class="relation">의 ${side.relation}</span>
            <span class="person-name">${side.name}</span>
          </div>
          <div class="contact-row">
            ${contactBtn(side.phone, 'call')}
            ${contactBtn(side.phone, 'sms')}
          </div>
        </div>
      `;
    };

    box.innerHTML = renderSide(W.groom) + renderSide(W.bride);
  }

  function contactBtn(phone, kind) {
    if (!phone) return `<button class="contact-btn disabled" disabled>${icon(kind)}</button>`;
    const href = kind === 'call' ? `tel:${phone}` : `sms:${phone}`;
    return `<a class="contact-btn" href="${href}">${icon(kind)}</a>`;
  }

  function icon(kind) {
    if (kind === 'call') {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
    }
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
  }

  // Parents-toggle: 혼주에게 연락하기
  function setupParentsToggle() {
    const toggle = document.getElementById('parents-toggle');
    const collapse = document.getElementById('parents-collapse');
    if (!toggle || !collapse) return;

    const renderHonju = () => {
      const row = (label, name, phone, deceased) => `
        <div class="account-row">
          <div class="account-info">
            <div class="account-holder">${deceased ? '<span style="color:#8B8B8B;font-size:0.75rem">故 </span>' : ''}${label} · ${name}</div>
          </div>
          ${phone ? `<a class="copy-btn" href="tel:${phone}">전화</a>` : '<span class="copy-btn" style="opacity:0.3">—</span>'}
        </div>
      `;
      return `
        <div style="padding:0.5rem 0">
          ${row('신랑 아버지', W.groom.father.name, W.groom.father.phone, W.groom.father.deceased)}
          ${row('신랑 어머니', W.groom.mother.name, W.groom.mother.phone, W.groom.mother.deceased)}
          ${row('신부 아버지', W.bride.father.name, W.bride.father.phone, W.bride.father.deceased)}
          ${row('신부 어머니', W.bride.mother.name, W.bride.mother.phone, W.bride.mother.deceased)}
        </div>
      `;
    };
    collapse.innerHTML = renderHonju();

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      collapse.classList.toggle('open');
    });
  }

  // ============================================
  // Map buttons
  // ============================================
  function setupMapButtons() {
    const v = W.venue;
    const name = encodeURIComponent(v.name);

    document.getElementById('btn-kakao-map').addEventListener('click', () => {
      window.open(`https://map.kakao.com/link/map/${name},${v.lat},${v.lng}`, '_blank');
    });
    document.getElementById('btn-naver-map').addEventListener('click', () => {
      window.open(`https://map.naver.com/p/search/${name}`, '_blank');
    });
    document.getElementById('btn-tmap').addEventListener('click', () => {
      window.open(`tmap://route?goalname=${name}&goalx=${v.lng}&goaly=${v.lat}`, '_blank');
    });

    document.getElementById('btn-copy-address').addEventListener('click', () => {
      copyText(`${v.address} ${v.addressDetail}`);
    });
  }

  // ============================================
  // Copy to clipboard
  // ============================================
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        () => toast('복사되었습니다'),
        () => fallbackCopy(text)
      );
    } else {
      fallbackCopy(text);
    }
  }
  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); toast('복사되었습니다'); } catch { toast('복사 실패'); }
    document.body.removeChild(ta);
  }

  // ============================================
  // RSVP
  // ============================================
  function setupRsvp() {
    const form = document.getElementById('rsvp-form');
    if (!form) return;

    let attending = null;
    const attendBtns = form.querySelectorAll('[data-attend]');
    attendBtns.forEach(b => b.addEventListener('click', () => {
      attending = b.dataset.attend;
      attendBtns.forEach(x => x.classList.toggle('active', x === b));
    }));

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!attending) { toast('참석 여부를 선택해 주세요'); return; }
      const name = form.querySelector('[name=name]').value.trim();
      if (!name) { toast('이름을 입력해 주세요'); return; }

      // localStorage stub (Supabase로 추후 교체)
      const entry = {
        name,
        side: form.querySelector('[name=side]').value,
        attending,
        count: form.querySelector('[name=count]').value,
        meal: form.querySelector('[name=meal]').value,
        contact: form.querySelector('[name=contact]').value,
        ts: Date.now()
      };
      const list = JSON.parse(localStorage.getItem('rsvp') || '[]');
      list.push(entry);
      localStorage.setItem('rsvp', JSON.stringify(list));

      toast('참석 의사가 전달되었습니다 ♥');
      form.reset();
      attendBtns.forEach(x => x.classList.remove('active'));
      attending = null;
    });
  }

  // ============================================
  // Guestbook
  // ============================================
  function setupGuestbook() {
    const listEl = document.getElementById('guestbook-list');
    const openBtn = document.getElementById('guestbook-open');
    const modal = document.getElementById('guestbook-modal');
    const form = document.getElementById('guestbook-form');
    if (!listEl) return;

    function render() {
      const list = JSON.parse(localStorage.getItem('guestbook') || '[]');
      if (!list.length) {
        listEl.innerHTML = '<div class="guestbook-empty">아직 메시지가 없어요.<br>첫 메시지의 주인공이 되어주세요 ♥</div>';
        return;
      }
      listEl.innerHTML = list.slice().reverse().map((g) => {
        const d = new Date(g.ts);
        const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
        return `
          <div class="guestbook-card" data-ts="${g.ts}">
            <button class="guestbook-delete" data-ts="${g.ts}">삭제</button>
            <div class="guestbook-card-head">
              <div class="guestbook-name">${escapeHtml(g.name)}</div>
              <div class="guestbook-date">${dateStr}</div>
            </div>
            <div class="guestbook-message">${escapeHtml(g.message)}</div>
          </div>
        `;
      }).join('');
    }

    function escapeHtml(s) {
      return s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
    }

    openBtn.addEventListener('click', () => {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    modal.querySelectorAll('[data-modal-close]').forEach(b => b.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }));
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.querySelector('[name=name]').value.trim();
      const pw = form.querySelector('[name=password]').value.trim();
      const message = form.querySelector('[name=message]').value.trim();

      if (!name || !pw || !message) { toast('모든 항목을 입력해 주세요'); return; }
      if (pw.length !== 4 || !/^\d{4}$/.test(pw)) { toast('비밀번호는 숫자 4자리'); return; }

      const list = JSON.parse(localStorage.getItem('guestbook') || '[]');
      list.push({ name, password: pw, message, ts: Date.now() });
      localStorage.setItem('guestbook', JSON.stringify(list));

      modal.classList.remove('open');
      document.body.style.overflow = '';
      form.reset();
      render();
      toast('메시지가 등록되었습니다 ♥');
    });

    listEl.addEventListener('click', e => {
      const btn = e.target.closest('.guestbook-delete');
      if (!btn) return;
      const ts = parseInt(btn.dataset.ts, 10);
      const pw = prompt('비밀번호를 입력하세요 (4자리)');
      if (!pw) return;
      const list = JSON.parse(localStorage.getItem('guestbook') || '[]');
      const item = list.find(x => x.ts === ts);
      if (!item) return;
      if (item.password !== pw) { toast('비밀번호가 일치하지 않습니다'); return; }
      const filtered = list.filter(x => x.ts !== ts);
      localStorage.setItem('guestbook', JSON.stringify(filtered));
      render();
      toast('삭제되었습니다');
    });

    render();
  }

  // ============================================
  // Accounts — accordion
  // ============================================
  function renderAccounts() {
    function renderSide(side) {
      return side.accounts.map(a => `
        <div class="account-row">
          <div class="account-info">
            <div class="account-holder">${a.holder}</div>
            <div class="account-number">${a.bank} ${a.number}</div>
          </div>
          <button class="copy-btn" data-copy="${a.number}">복사</button>
        </div>
      `).join('');
    }

    document.getElementById('account-groom-list').innerHTML = renderSide(W.groom);
    document.getElementById('account-bride-list').innerHTML = renderSide(W.bride);

    // Toggle accordions (only one open at a time)
    document.querySelectorAll('.account-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.account-card');
        const list = card.querySelector('.account-list');
        const isOpen = list.classList.contains('open');

        document.querySelectorAll('.account-list').forEach(l => l.classList.remove('open'));
        document.querySelectorAll('.account-toggle').forEach(t => t.classList.remove('open'));

        if (!isOpen) {
          list.classList.add('open');
          btn.classList.add('open');
        }
      });
    });

    // Copy handlers
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.copy;
        copyText(text);
        btn.classList.add('copied');
        btn.textContent = '완료';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.textContent = '복사';
        }, 1500);
      });
    });
  }

  // ============================================
  // Share buttons (Kakao Talk + Link copy)
  // ============================================
  const KAKAO_JS_KEY = '6b891ea36de164a90b1f677487e7225b';
  const SITE_URL = 'https://arborday.vercel.app/';
  const SHARE_IMAGE = 'https://arborday.vercel.app/assets/images/hero/01.jpg';

  function setupShare() {
    // Initialize Kakao SDK once
    if (window.Kakao && !Kakao.isInitialized()) {
      try { Kakao.init(KAKAO_JS_KEY); } catch (e) { console.warn('Kakao init failed', e); }
    }

    document.getElementById('share-kakao').addEventListener('click', () => {
      if (!window.Kakao || !Kakao.Share) {
        toast('카카오 SDK 로딩 중입니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '이재선 ♥ 정철환 결혼합니다',
          description: '2026.08.09 일요일 오전 11시\n아펠가모 선릉',
          imageUrl: SHARE_IMAGE,
          link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL }
        },
        buttons: [
          {
            title: '청첩장 보기',
            link: { mobileWebUrl: SITE_URL, webUrl: SITE_URL }
          }
        ]
      });
    });

    const linkBtn = document.getElementById('share-link');
    if (linkBtn) {
      linkBtn.addEventListener('click', () => copyText(SITE_URL));
    }
  }

  // ============================================
  // Scroll reveal
  // ============================================
  function setupReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ============================================
  // Image folder auto-detect — probes 01.jpg, 02.jpg ... until missing
  // ============================================
  async function probeImages(basePath, max = 30) {
    const checks = [];
    for (let i = 1; i <= max; i++) {
      const num = String(i).padStart(2, '0');
      checks.push(
        fetch(`${basePath}/${num}.jpg`, { method: 'HEAD' })
          .then(r => r.ok)
          .catch(() => false)
      );
    }
    const results = await Promise.all(checks);
    const stop = results.indexOf(false);
    const lastIdx = stop === -1 ? max : stop;
    return Array.from(
      { length: lastIdx },
      (_, i) => `${basePath}/${String(i + 1).padStart(2, '0')}.jpg`
    );
  }

  // Hero media auto-detect — probes NN.mp4 / NN.jpg for 01..max and collects every hit.
  // Gaps in numbering (e.g. missing 01.mp4) are tolerated.
  async function probeHeroMedia(basePath, max = 30) {
    const indices = Array.from({ length: max }, (_, i) => String(i + 1).padStart(2, '0'));
    const probes = indices.map(num => Promise.all([
      fetch(`${basePath}/${num}.mp4`, { method: 'HEAD' }).then(r => r.ok).catch(() => false),
      fetch(`${basePath}/${num}.jpg`, { method: 'HEAD' }).then(r => r.ok).catch(() => false),
    ]));
    const results = await Promise.all(probes);
    const items = [];
    for (let i = 0; i < results.length; i++) {
      const [mp4Ok, jpgOk] = results[i];
      if (mp4Ok) items.push({ src: `${basePath}/${indices[i]}.mp4`, type: 'video' });
      else if (jpgOk) items.push({ src: `${basePath}/${indices[i]}.jpg`, type: 'image' });
    }
    return items;
  }

  // ============================================
  // Status Bar Time — keep both lock & hero status bars in sync
  // ============================================
  function updateStatusBarTime() {
    const now = new Date();
    const h12 = ((now.getHours() % 12) || 12);
    const mm = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${h12}:${mm}`;
    document.querySelectorAll('.ios-time').forEach(el => {
      el.textContent = timeStr;
    });
  }

  // ============================================
  // Hero Slideshow — auto-detect + fade between images
  // ============================================
  // Gate the first video so it only starts when the lock screen slides away.
  let _heroStartResolve;
  const heroStartSignal = new Promise(resolve => { _heroStartResolve = resolve; });
  function signalHeroStart() {
    if (_heroStartResolve) { _heroStartResolve(); _heroStartResolve = null; }
  }

  async function setupHeroSlideshow() {
    const container = document.querySelector('.hero-photo');
    if (!container) return;

    // Auto-detect from folder first, fallback to data.js list
    let media = await probeHeroMedia('assets/images/hero');
    if (!media.length) {
      const fallback = (W.heroImages && W.heroImages.length)
        ? W.heroImages
        : ['assets/images/hero/01.jpg'];
      media = fallback.map(src => ({
        src,
        type: /\.mp4(\?|$)/i.test(src) ? 'video' : 'image',
      }));
    }

    container.innerHTML = '';
    media.forEach((m, i) => {
      const slide = document.createElement('div');
      slide.className = 'hero-slide' + (i === 0 ? ' active' : '');
      if (m.type === 'video') {
        slide.classList.add('hero-slide-video');
        const v = document.createElement('video');
        v.src = m.src;
        v.muted = true;
        v.playsInline = true;
        v.setAttribute('muted', '');
        v.setAttribute('playsinline', '');
        v.setAttribute('webkit-playsinline', '');
        v.setAttribute('preload', 'auto');
        slide.appendChild(v);
      } else {
        slide.style.backgroundImage = `url('${m.src}')`;
      }
      container.appendChild(slide);
    });

    const slides = Array.from(container.querySelectorAll('.hero-slide'));
    if (!slides.length) return;

    let current = 0;
    let advanceTimer = null;

    const advance = () => {
      if (slides.length < 2) return;
      const prevVideo = slides[current].querySelector('video');
      if (prevVideo) { try { prevVideo.pause(); } catch (_) {} }
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
      scheduleNext();
    };

    const scheduleNext = () => {
      if (advanceTimer) { clearTimeout(advanceTimer); advanceTimer = null; }
      const slide = slides[current];
      const v = slide.querySelector('video');
      if (v) {
        try { v.currentTime = 0; } catch (_) {}
        v.play().catch(() => {});
        if (slides.length < 2) {
          // single video: freeze on last frame instead of looping
          v.addEventListener('ended', () => {
            try {
              v.pause();
              v.currentTime = Math.max(0, v.duration - 0.05);
            } catch (_) {}
          }, { once: true });
        } else {
          v.addEventListener('ended', advance, { once: true });
          // safety net in case 'ended' never fires (network stall, autoplay block)
          advanceTimer = setTimeout(advance, 20000);
        }
      } else if (slides.length >= 2) {
        advanceTimer = setTimeout(advance, 6000);
      }
    };

    // Wait for the lock screen to slide away before starting playback.
    await heroStartSignal;
    scheduleNext();
  }

  // ============================================
  // Lock Screen — iOS Face ID intro sequence
  // ============================================
  function runLockScreen() {
    const screen = document.getElementById('lockScreen');
    if (!screen) { signalHeroStart(); return; }

    const timeEl = document.getElementById('lockTime');
    const dateEl = document.getElementById('lockDate');
    const statusTimeEl = document.getElementById('lockStatusTime');
    const hintText = document.getElementById('lockHintText');

    // Set current time
    const now = new Date();
    const h12 = ((now.getHours() % 12) || 12);
    const mm = String(now.getMinutes()).padStart(2, '0');
    const hh24 = String(now.getHours()).padStart(2, '0');

    // Big clock uses HH:MM (24h for that iOS lock feel)
    timeEl.textContent = `${now.getHours()}:${mm}`;
    statusTimeEl.textContent = `${h12}:${mm}`;

    const weekdays = ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];
    dateEl.textContent = `${now.getMonth() + 1}월 ${now.getDate()}일 ${weekdays[now.getDay()]}`;

    // Lock body scroll during sequence
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    // T=500ms : Black Face ID box appears, green circle starts drawing
    setTimeout(() => {
      screen.classList.add('faceid-scanning');
    }, 500);

    // T=1400ms : Circle complete, checkmark draws
    setTimeout(() => {
      screen.classList.remove('faceid-scanning');
      screen.classList.add('faceid-success');
      hintText.textContent = '위로 밀어 올리기';
    }, 1400);

    // T=2200ms : Black box fades out
    setTimeout(() => {
      screen.classList.add('faceid-done');
    }, 2200);

    // T=2700ms : Lock screen slides up, hero starts fading in simultaneously
    setTimeout(() => {
      screen.classList.add('unlocked');
      const heroEl = document.querySelector('.hero');
      if (heroEl) heroEl.classList.add('fade-in');
      signalHeroStart();
    }, 2700);

    // T=4500ms : Fully hide lock screen & unlock scroll (after 1.5s transition)
    setTimeout(() => {
      screen.classList.add('hidden');
      document.body.style.overflow = '';
    }, 4500);
  }

  // ============================================
  // Boot
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    updateStatusBarTime();
    setInterval(updateStatusBarTime, 30 * 1000);
    setupHeroSlideshow();
    runLockScreen();
    renderCalendar();
    renderDday();
    renderGallery();
    renderParents();
    setupParentsToggle();
    setupMapButtons();
    setupRsvp();
    setupGuestbook();
    renderAccounts();
    setupShare();
    setupReveal();
  });
})();
