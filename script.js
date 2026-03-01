// ================================================================
// DATA — Thêm/sửa/xóa tại đây
// Mỗi object = 1 nhóm: { name, games: [{ name, url }] }
// ================================================================
const GROUPS = [
  {
    name: 'OKVIP',
    games: [
      { name: 'NEW88', url: 'https://m.new88ok1.com/' },
      { name: 'F8BET', url: 'https://m.f8beta2.com/' },
      { name: 'SHBET', url: 'https://m.shbet800.com/' },
      { name: 'MB66', url: 'https://d395sf074uh0f5.cloudfront.net/mb66.html' },
      { name: '78WIN', url: 'https://www.78win7.zone/signup' },
      { name: 'JUN88', url: 'https://asdas.jun881.xyz/gamelobby/hot_games' },
      { name: '789BET', url: 'https://m.789bettg.net/' },
      { name: 'HI88', url: 'https://m.hi183.com/Account/Login' },
      { name: 'OK8386', url: 'https://m.ok83866.com/order' },
      { name: 'QQ88', url: 'https://www.qq88444.com/m/login' },
      { name: 'OPEN88', url: 'https://www.open88b1.vip/register' },
      { name: 'GK', url: 'https://gk881.sbs/' },
    ]
  },
  {
    name: 'CSKH',
    games: [
      { name: '789F', url: 'https://789f17.com/' },
      { name: '99OK', url: 'https://m.999ok.tech/' },
      { name: '33WIN', url: 'https://m.33win1.com/' },
      { name: 'KUWIN', url: 'https://m.kuwin2.co/' },
      { name: 'VSWIN', url: 'https://vswin.org/' },
      { name: '799568', url: 'https://m.799568.win' },
    ]
  },
  {
    name: 'ABCVIP',
    games: [
      { name: 'U888', url: 'https://m.tuv6a.ink/' },
      { name: 'J88', url: 'https://m.j88tycc.buzz' },
      { name: '88CLB', url: 'https://m.yuu9r.ink' },
      { name: 'ABC8', url: 'https://m.abc11.link/' }
    ]
  },
  {
    name: 'KHÁC',
    games: [
      { name: '8QBET', url: 'http://www.988qbet.com' },
    ]
  },
];
// ================================================================

const SVG_LINK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
const SVG_TICK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`;
const SVG_COPY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
const SVG_DONE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><path d="M20 6L9 17l-5-5"/></svg>`;

// Render từng game item
function renderGame(game) {
  const div = document.createElement('div');
  div.className = 'game-item';
  div.innerHTML = `
    <div class="game-check-wrap">
      <input type="checkbox" class="game-check">
    </div>
    <span class="game-name">${game.name}</span>
    <button class="copy-btn">${SVG_COPY}Copy</button>
  `;

  const cb = div.querySelector('.game-check');
  const wrap = div.querySelector('.game-check-wrap');
  const copyBtn = div.querySelector('.copy-btn');

  // Checkbox: chỉ highlight, KHÔNG mở tab
  cb.addEventListener('change', () => div.classList.toggle('checked', cb.checked));
  cb.addEventListener('click', e => e.stopPropagation());
  wrap.addEventListener('click', e => e.stopPropagation());

  // Copy
  copyBtn.addEventListener('click', e => {
    e.stopPropagation();
    navigator.clipboard.writeText(game.url).then(() => {
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = SVG_DONE + 'Đã copy';
      showToast();
      setTimeout(() => { copyBtn.classList.remove('copied'); copyBtn.innerHTML = SVG_COPY + 'Copy'; }, 2000);
    });
  });

  // Lưu url vào dataset để dùng khi mở tab
  cb.dataset.url = game.url;
  return div;
}

// Render từng nhóm
function renderGroup(group, isFirst) {
  const el = document.createElement('div');
  el.className = 'group' + (isFirst ? ' open' : '');

  // Header
  const header = document.createElement('div');
  header.className = 'group-header';
  header.innerHTML = `
    <span class="group-title"><span class="group-arrow">▶</span>${group.name}</span>
    <div class="group-header-right">
      <button class="open-checked-btn">${SVG_TICK}Mở Đã Tích</button>
      <button class="open-all-btn">${SVG_LINK}Mở Tất Cả</button>
      <span class="group-count">${group.games.length}</span>
    </div>
  `;

  // Body
  const body = document.createElement('div');
  body.className = 'group-body';
  group.games.forEach(game => body.appendChild(renderGame(game)));

  el.appendChild(header);
  el.appendChild(body);

  // Toggle open/close
  header.addEventListener('click', () => el.classList.toggle('open'));

  // Mở Đã Tích
  header.querySelector('.open-checked-btn').addEventListener('click', e => {
    e.stopPropagation();
    const checked = body.querySelectorAll('.game-check:checked');
    const btn = e.currentTarget;
    if (checked.length === 0) {
      const orig = btn.innerHTML;
      btn.innerHTML = '⚠ Chưa tích game nào!';
      setTimeout(() => btn.innerHTML = orig, 1800);
      return;
    }
    checked.forEach((cb, i) => setTimeout(() => openTab(cb.dataset.url), i * 150));
    const orig = btn.innerHTML;
    btn.innerHTML = SVG_DONE + `Đã mở ${checked.length} tab!`;
    setTimeout(() => btn.innerHTML = orig, 2000);
  });

  // Mở Tất Cả
  header.querySelector('.open-all-btn').addEventListener('click', e => {
    e.stopPropagation();
    const btn = e.currentTarget;
    const allCb = body.querySelectorAll('.game-check');
    allCb.forEach((cb, i) => {
      setTimeout(() => {
        openTab(cb.dataset.url);
        cb.checked = true;
        cb.closest('.game-item').classList.add('checked');
      }, i * 150);
    });
    const orig = btn.innerHTML;
    btn.innerHTML = SVG_DONE + 'Đã mở!';
    setTimeout(() => btn.innerHTML = orig, 2000);
  });

  return el;
}

// Render tất cả nhóm
function render() {
  const container = document.getElementById('game-list');
  GROUPS.forEach((group, i) => container.appendChild(renderGroup(group, i === 0)));
}

function openTab(url) {
  const a = document.createElement('a');
  a.href = url; a.target = '_blank'; a.rel = 'noopener';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function showPage(id, tab) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  tab.classList.add('active');
}

function showSubTab(id, tab) {
  document.querySelectorAll('.sub-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('sub-' + id).classList.add('active');
  tab.classList.add('active');
}

function showToast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

render();

// ================================================================
// INFO PAGE
// ================================================================

// Danh sách địa danh random chi nhánh
const LOCATIONS = [
  'Hoàn Kiếm, Hà Nội', 'Ba Đình, Hà Nội', 'Đống Đa, Hà Nội', 'Cầu Giấy, Hà Nội',
  'Hai Bà Trưng, Hà Nội', 'Hoàng Mai, Hà Nội', 'Thanh Xuân, Hà Nội', 'Long Biên, Hà Nội',
  'Quận 1, TP.HCM', 'Quận 3, TP.HCM', 'Quận 5, TP.HCM', 'Quận 7, TP.HCM',
  'Bình Thạnh, TP.HCM', 'Tân Bình, TP.HCM', 'Gò Vấp, TP.HCM', 'Thủ Đức, TP.HCM',
  'Hải Châu, Đà Nẵng', 'Thanh Khê, Đà Nẵng', 'Sơn Trà, Đà Nẵng', 'Ngũ Hành Sơn, Đà Nẵng',
  'Ninh Kiều, Cần Thơ', 'Bình Thuỷ, Cần Thơ', 'Hưng Lợi, Cần Thơ',
  'TP Huế, Thừa Thiên Huế', 'TP Vinh, Nghệ An', 'TP Nha Trang, Khánh Hoà',
  'TP Vũng Tàu, Bà Rịa', 'TP Buôn Ma Thuột, Đắk Lắk', 'TP Đà Lạt, Lâm Đồng',
  'TP Thái Nguyên, Thái Nguyên', 'TP Hải Phòng, Hải Phòng', 'TP Nam Định, Nam Định',
  'Huyện Từ Liêm, Hà Nội', 'Huyện Gia Lâm, Hà Nội', 'Huyện Đông Anh, Hà Nội',
  'Huyện Bình Chánh, TP.HCM', 'Huyện Củ Chi, TP.HCM', 'Huyện Hóc Môn, TP.HCM',
  'Huyện Điện Bàn, Quảng Nam', 'Huyện Hội An, Quảng Nam', 'Huyện Tam Kỳ, Quảng Nam',
  'Huyện Cam Ranh, Khánh Hoà', 'Huyện Phan Rang, Ninh Thuận', 'Huyện Bảo Lộc, Lâm Đồng',
];

let currentDOB = '';
let currentBranch = '';

function randomDOB() {
  const start = new Date('1990-01-01').getTime();
  const end = new Date('2009-01-01').getTime();
  const d = new Date(start + Math.random() * (end - start));
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  currentDOB = `${dd}/${mm}/${yyyy}`;
  document.getElementById('dob-display').textContent = currentDOB;
}

function randomBranch() {
  currentBranch = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  document.getElementById('branch-display').textContent = currentBranch;
}

// Auto random khi vào trang
randomDOB();
randomBranch();

function togglePass(id, btn) {
  const el = document.getElementById(id);
  el.type = el.type === 'password' ? 'text' : 'password';
  btn.textContent = el.type === 'password' ? '👁' : '🙈';
}

function validate() {
  let ok = true;
  const setErr = (id, msg) => { document.getElementById('err-' + id).textContent = msg; if (msg) ok = false; };

  const username = document.getElementById('f-username').value.trim();
  const password = document.getElementById('f-password').value;
  const wPass = document.getElementById('f-withdraw-pass').value;
  const email = document.getElementById('f-email').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const fullname = document.getElementById('f-fullname').value.trim();
  const bankAcc = document.getElementById('f-bank-acc').value.trim();
  const bank = document.getElementById('f-bank').value;

  setErr('username', username.length < 6 || username.length > 10 ? 'Tài khoản phải từ 6-10 ký tự' : '');
  setErr('password', password.length < 1 ? 'Vui lòng nhập mật khẩu' : '');
  setErr('withdraw-pass', !/^\d{6}$/.test(wPass) ? 'Mật khẩu rút tiền phải đúng 6 chữ số' : '');
  setErr('email', !/^[^\s@]+@gmail\.com$/.test(email) ? 'Email phải là @gmail.com' : '');
  setErr('phone', !/^(0[3|5|7|8|9])+([0-9]{8})$/.test(phone) ? 'Số điện thoại không hợp lệ' : '');
  setErr('fullname', fullname.length < 2 ? 'Vui lòng nhập họ tên' : '');
  setErr('bank-acc', bankAcc.length < 6 ? 'Số tài khoản phải ít nhất 6 số' : '');
  setErr('bank', !bank ? 'Vui lòng chọn ngân hàng' : '');

  return ok;
}

function saveInfo() {
  if (!validate()) return;

  const data = {
    username: document.getElementById('f-username').value.trim(),
    password: document.getElementById('f-password').value,
    withdrawPass: document.getElementById('f-withdraw-pass').value,
    email: document.getElementById('f-email').value.trim(),
    phone: document.getElementById('f-phone').value.trim(),
    dob: currentDOB,
    fullname: document.getElementById('f-fullname').value.trim(),
    bankAcc: document.getElementById('f-bank-acc').value.trim(),
    bank: document.getElementById('f-bank').value,
    branch: currentBranch,
  };

  localStorage.setItem('portal_info', JSON.stringify(data));
  renderDisplay(data);

  // Tự chuyển sang tab Xem
  const viewTab = document.querySelector('.sub-tab:nth-child(2)');
  showSubTab('view', viewTab);

  const btn = document.querySelector('.save-btn');
  btn.textContent = '✅ Đã lưu!';
  setTimeout(() => btn.textContent = '💾 Lưu Thông Tin', 2000);
}

function renderDisplay(data) {
  const fields = [
    { key: 'username', label: 'Tài khoản', icon: '👤', secret: false },
    { key: 'password', label: 'Mật khẩu', icon: '🔑', secret: true },
    { key: 'withdrawPass', label: 'Mật khẩu rút tiền', icon: '🔐', secret: true },
    { key: 'email', label: 'Gmail', icon: '📧', secret: false },
    { key: 'phone', label: 'Số điện thoại', icon: '📱', secret: false },
    { key: 'dob', label: 'Năm sinh', icon: '🎂', secret: false },
    { key: 'fullname', label: 'Chủ tài khoản', icon: '🏦', secret: false },
    { key: 'bankAcc', label: 'Số tài khoản', icon: '💳', secret: false },
    { key: 'bank', label: 'Ngân hàng', icon: '🏛', secret: false },
    { key: 'branch', label: 'Chi nhánh', icon: '📍', secret: false },
  ];

  const SVG_COPY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
  const SVG_DONE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><path d="M20 6L9 17l-5-5"/></svg>`;

  const rows = fields.map(f => {
    const val = data[f.key] || '—';
    const display = f.secret ? '••••••••' : val;
    const eyeBtn = f.secret ? `<button class="eye-toggle-btn" onclick="toggleInfoPass(this)" data-val="${val}" title="Xem mật khẩu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    </button>` : '';
    return `
      <div class="info-row">
        <span class="info-row-icon">${f.icon}</span>
        <div class="info-row-body">
          <div class="info-row-label">${f.label}</div>
          <div class="info-row-value ${f.secret ? 'secret-val' : ''}">${display}</div>
        </div>
        ${eyeBtn}
        <button class="info-copy-btn" data-val="${val}" data-label="${f.label}">
          ${SVG_COPY}Copy
        </button>
      </div>`;
  }).join('');

  document.getElementById('info-display').innerHTML = `<div class="info-grid">${rows}</div>`;

  document.querySelectorAll('.info-copy-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(this.dataset.val).then(() => {
        const SVG_DONE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><path d="M20 6L9 17l-5-5"/></svg>`;
        const SVG_COPY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
        this.innerHTML = SVG_DONE + 'Đã copy';
        this.classList.add('copied');
        showCopiedHint(this.dataset.label);
        setTimeout(() => {
          this.innerHTML = SVG_COPY + 'Copy';
          this.classList.remove('copied');
        }, 2000);
      });
    });
  });
}

function toggleInfoPass(btn) {
  const row = btn.closest('.info-row');
  const valEl = row.querySelector('.secret-val');
  const val = btn.dataset.val;
  if (btn.classList.contains('showing')) {
    valEl.textContent = '••••••••';
    btn.classList.remove('showing');
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  } else {
    valEl.textContent = val;
    btn.classList.add('showing');
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  }
}

function showCopiedHint(label) {
  let hint = document.getElementById('copied-hint');
  if (!hint) {
    hint = document.createElement('div');
    hint.id = 'copied-hint';
    hint.className = 'copied-hint';
    document.body.appendChild(hint);
  }
  hint.innerHTML = '✅ Đã copy <strong>' + label + '</strong>';
  hint.classList.add('show');
  clearTimeout(hint._timer);
  hint._timer = setTimeout(() => hint.classList.remove('show'), 2000);
}

// ================================================================
// CUSTOM DROPDOWN
// ================================================================
function toggleCDD(id) {
  const cdd = document.getElementById(id);
  const isOpen = cdd.classList.contains('open');
  document.querySelectorAll('.cdd.open').forEach(c => c.classList.remove('open'));
  if (!isOpen) {
    cdd.classList.add('open');
    // Focus ô tìm kiếm
    setTimeout(() => {
      const search = cdd.querySelector('.cdd-search');
      if (search) { search.value = ''; filterBanks(''); search.focus(); }
    }, 50);
  }
}

function selectBank(value, logoCode, el) {
  const cdd = el.closest('.cdd');
  // Update label + logo
  const label = document.getElementById('bank-cdd-label');
  const logo = document.getElementById('bank-cdd-logo');
  label.textContent = value;
  label.classList.remove('placeholder');
  logo.src = `https://api.vietqr.io/img/${logoCode}.png`;
  logo.style.display = 'block';
  logo.onerror = () => logo.style.display = 'none';
  // Mark selected
  cdd.querySelectorAll('.cdd-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  // Update hidden input
  document.getElementById('f-bank').value = value;
  // Close
  cdd.classList.remove('open');
  // Trigger lookup
  triggerLookup();
}

function filterBanks(q) {
  const opts = document.querySelectorAll('#bank-options .cdd-option');
  const kw = q.trim().toLowerCase();
  let count = 0;
  opts.forEach(o => {
    const match = o.dataset.name.toLowerCase().includes(kw);
    o.classList.toggle('hidden', !match);
    if (match) count++;
  });
  document.getElementById('bank-no-result').style.display = count === 0 ? 'block' : 'none';
}

// Close dropdown khi click ngoài
document.addEventListener('click', e => {
  if (!e.target.closest('.cdd')) {
    document.querySelectorAll('.cdd.open').forEach(c => c.classList.remove('open'));
  }
});

// ================================================================
// VIETQR LOOKUP
// ================================================================
const BANK_BIN = {
  'VPBANK': '970432',
  'TPBANK': '970423',
  'VIETCOMBANK': '970436',
  'BIDV': '970418',
  'SACOMBANK': '970403',
};

// Demo key public của VietQR (free tier)
const VIETQR_CLIENT_ID = 'de8a0804-a76d-41e5-8ad6-31503ce7d5f4';
const VIETQR_API_KEY = '17c29f09-4ea2-4417-b9c2-7f020d35de42';

let lookupTimer = null;

function triggerLookup() {
  clearTimeout(lookupTimer);
  const accNum = document.getElementById('f-bank-acc').value.trim();
  const bank = document.getElementById('f-bank').value;
  const result = document.getElementById('lookup-result');

  if (!accNum || accNum.length < 6 || !bank) {
    result.innerHTML = '';
    return;
  }

  // Debounce 600ms
  lookupTimer = setTimeout(() => lookupAccount(accNum, bank), 600);
}

async function lookupAccount(accNum, bank) {
  const result = document.getElementById('lookup-result');
  const bin = BANK_BIN[bank];
  if (!bin) return;

  result.innerHTML = `<div class="lookup-status loading"><div class="spinner"></div> Đang tra cứu tên chủ tài khoản...</div>`;

  try {
    const res = await fetch('https://api.vietqr.io/v2/lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': VIETQR_CLIENT_ID,
        'x-api-key': VIETQR_API_KEY,
      },
      body: JSON.stringify({ bin, accountNumber: accNum }),
    });

    const json = await res.json();

    if (json.code === '00' && json.data?.accountName) {
      const name = json.data.accountName;
      result.innerHTML = `
        <div class="lookup-status success">✅ Tìm thấy tài khoản hợp lệ</div>
        <div class="lookup-name">👤 ${name}</div>`;
      // Tự điền vào Chủ tài khoản
      const fullnameEl = document.getElementById('f-fullname');
      if (!fullnameEl.value) fullnameEl.value = name;
    } else {
      result.innerHTML = `<div class="lookup-status error">❌ Không tìm thấy tài khoản — kiểm tra lại số TK hoặc ngân hàng</div>`;
    }
  } catch (e) {
    result.innerHTML = `<div class="lookup-status error">⚠️ Không thể kết nối API — kiểm tra lại mạng</div>`;
  }
}

function confirmClear() {
  document.getElementById('clear-modal').classList.add('show');
}

function closeClearModal() {
  document.getElementById('clear-modal').classList.remove('show');
}

function clearInfo() {
  // Xóa localStorage
  localStorage.removeItem('portal_info');

  // Reset form
  document.getElementById('f-username').value = '';
  document.getElementById('f-password').value = '';
  document.getElementById('f-withdraw-pass').value = '';
  document.getElementById('f-email').value = '';
  document.getElementById('f-phone').value = '';
  document.getElementById('f-fullname').value = '';
  document.getElementById('f-bank-acc').value = '';

  // Reset dropdown ngân hàng
  document.getElementById('f-bank').value = '';
  document.getElementById('bank-cdd-label').textContent = '-- Chọn ngân hàng --';
  document.getElementById('bank-cdd-label').classList.add('placeholder');
  document.getElementById('bank-cdd-logo').style.display = 'none';
  document.querySelectorAll('.cdd-option').forEach(o => o.classList.remove('selected'));

  // Reset lookup result
  document.getElementById('lookup-result').innerHTML = '';

  // Random lại DOB & Branch
  randomDOB();
  randomBranch();

  // Reset display
  document.getElementById('info-display').innerHTML = '<div class="no-data">Chưa có thông tin. Hãy nhập và lưu ở tab Nhập Thông Tin.</div>';

  closeClearModal();

  // Feedback
  const btn = document.querySelector('.clear-btn');
  const orig = btn.innerHTML;
  btn.innerHTML = '✅ Đã xóa!';
  btn.style.borderColor = 'var(--success)';
  btn.style.color = 'var(--success)';
  setTimeout(() => {
    btn.innerHTML = orig;
    btn.style.borderColor = '';
    btn.style.color = '';
  }, 2000);
}

// Load lại từ localStorage nếu có
(function loadSaved() {
  const saved = localStorage.getItem('portal_info');
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    // Điền lại form
    document.getElementById('f-username').value = data.username || '';
    document.getElementById('f-password').value = data.password || '';
    document.getElementById('f-withdraw-pass').value = data.withdrawPass || '';
    document.getElementById('f-email').value = data.email || '';
    document.getElementById('f-phone').value = data.phone || '';
    document.getElementById('f-fullname').value = data.fullname || '';
    document.getElementById('f-bank-acc').value = data.bankAcc || '';
    document.getElementById('f-bank').value = data.bank || '';
    if (data.dob) { currentDOB = data.dob; document.getElementById('dob-display').textContent = currentDOB; }
    if (data.branch) { currentBranch = data.branch; document.getElementById('branch-display').textContent = currentBranch; }
    renderDisplay(data);
  } catch (e) { }
})();
