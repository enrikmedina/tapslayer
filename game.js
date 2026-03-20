/* ============================================================
   TapSlayer — game.js
   Complete vanilla JS implementation
   ============================================================ */

'use strict';

/* ===== MONSTER DATA ===== */
const MONSTER_ROSTER = [
  { id: 'shadow-rat',    name: 'Shadow Rat',    glyph: '🐀', glow: '#7b2fff', glowPx: 18 },
  { id: 'hollow-ghoul',  name: 'Hollow Ghoul',  glyph: '💀', glow: '#44ff44', glowPx: 22 },
  { id: 'bone-crawler',  name: 'Bone Crawler',  glyph: '🦂', glow: '#e8d8b0', glowPx: 16 },
  { id: 'plague-imp',    name: 'Plague Imp',    glyph: '👿', glow: '#80ff00', glowPx: 20 },
  { id: 'cursed-wraith', name: 'Cursed Wraith', glyph: '👻', glow: '#00ffee', glowPx: 28 },
  { id: 'tomb-lurker',   name: 'Tomb Lurker',   glyph: '🧟', glow: '#885522', glowPx: 16 },
  { id: 'blood-bat',     name: 'Blood Bat',     glyph: '🦇', glow: '#cc0000', glowPx: 22 },
  { id: 'rot-hound',     name: 'Rot Hound',     glyph: '🐺', glow: '#88cc00', glowPx: 18 },
  { id: 'venom-shade',   name: 'Venom Shade',   glyph: '🐍', glow: '#aa00ff', glowPx: 22 },
  { id: 'crypt-beetle',  name: 'Crypt Beetle',  glyph: '🪲', glow: '#228833', glowPx: 16 },
];

const BOSS_ROSTER = [
  { id: 'grave-warden', name: 'The Grave Warden',        glyph: '☠️', glow: '#d4a017', glowPx: 50, level: 10 },
  { id: 'malgorth',     name: 'Malgorth the Decayer',     glyph: '🧿', glow: '#40ff00', glowPx: 55, level: 20 },
  { id: 'hollow-king',  name: 'The Hollow King',          glyph: '👑', glow: '#9988ff', glowPx: 55, level: 30 },
  { id: 'dreadclaw',    name: 'Dreadclaw',                glyph: '🦂', glow: '#ff4400', glowPx: 60, level: 40 },
  { id: 'vaelgor',      name: 'Vaelgor, the Blood Titan', glyph: '👹', glow: '#ff0000', glowPx: 60, level: 50 },
];

/* ===== SHOP CATALOG ===== */
const SHOP_ITEMS = [
  {
    id: 'whetstone',
    name: 'Whetstone',
    icon: '🪨',
    desc: '+3 base damage',
    baseCost: 40,
    consumable: false,
    apply: p => { p.damage += 3; },
  },
  {
    id: 'lucky-charm',
    name: 'Lucky Charm',
    icon: '🍀',
    desc: '+5% critical chance',
    baseCost: 60,
    consumable: false,
    apply: p => { p.critChance += 0.05; },
  },
  {
    id: 'crit-stone',
    name: 'Fury Stone',
    icon: '💠',
    desc: '+0.4× critical multiplier',
    baseCost: 90,
    consumable: false,
    apply: p => { p.critMult += 0.4; },
  },
  {
    id: 'blood-coin',
    name: 'Blood Coin',
    icon: '🪙',
    desc: '+15 bonus gold per kill',
    baseCost: 120,
    consumable: false,
    apply: p => { p.bonusGold += 15; },
  },
  {
    id: 'life-potion',
    name: 'Life Potion',
    icon: '🧪',
    desc: 'Restore 50 HP',
    baseCost: 50,
    consumable: true,
    apply: null,
  },
  {
    id: 'execute',
    name: 'Execute',
    icon: '⚡',
    desc: 'Instantly slay the current monster',
    baseCost: 50,
    consumable: true,
    apply: null, // handled separately
  },
  {
    id: 'phantom-dust',
    name: 'Phantom Dust',
    icon: '👁️',
    desc: '+8% chance to strike twice',
    baseCost: 180,
    consumable: false,
    apply: p => { p.doubleStrike += 0.08; },
  },
];

/* ===== UPGRADE POOL ===== */
const UPGRADE_POOL = {
  common: [
    { id: 'sharpen',    name: 'Sharpen Blade',    icon: '⚔️',  rarity: 'common',   desc: '+1 base damage',                       apply: p => { p.damage += 1; } },
    { id: 'iron-fist',  name: 'Iron Fist',         icon: '✊',  rarity: 'common',   desc: '+2 base damage',                       apply: p => { p.damage += 2; } },
    { id: 'lucky',      name: 'Lucky Strike',      icon: '🍀',  rarity: 'common',   desc: '+1% critical chance',                  critOnly: true,  apply: p => { p.critChance += 0.01; } },
    { id: 'keen',       name: 'Keen Edge',         icon: '🔪',  rarity: 'common',   desc: '+0.2× critical multiplier',            apply: p => { p.critMult += 0.2; } },
    { id: 'blood-toll', name: 'Blood Toll',        icon: '💰',  rarity: 'common',   desc: '+5 gold per kill',                     apply: p => { p.bonusGold += 5; } },
    { id: 'tough-grip', name: 'Toughened Grip',    icon: '🤜',  rarity: 'common',   desc: '+1 damage, +1% crit chance',           apply: p => { p.damage += 1; p.critChance += 0.01; } },
  ],
  uncommon: [
    { id: 'vorpal',      name: 'Vorpal Edge',         icon: '🗡️', rarity: 'uncommon', desc: '+5 base damage',                       apply: p => { p.damage += 5; } },
    { id: 'assassin',   name: "Assassin's Instinct", icon: '🎯',  rarity: 'uncommon', desc: '+3% critical chance',                  critOnly: true,  apply: p => { p.critChance += 0.03; } },
    { id: 'brutal',     name: 'Brutal Force',        icon: '💪',  rarity: 'uncommon', desc: '+0.5× critical multiplier',            apply: p => { p.critMult += 0.5; } },
    { id: 'gold-frenzy',name: 'Gold Frenzy',         icon: '💎',  rarity: 'uncommon', desc: '+15 gold per kill',                    apply: p => { p.bonusGold += 15; } },
    { id: 'savage',     name: 'Savage Combo',        icon: '⚡',  rarity: 'uncommon', desc: '+3 damage, +2% crit chance',           apply: p => { p.damage += 3; p.critChance += 0.02; } },
    { id: 'vitality',   name: 'Vitality',            icon: '❤️',  rarity: 'uncommon', desc: '+40 max HP, restore 40 HP',            apply: p => { p.maxHp += 40; p.hp = Math.min(p.hp + 40, p.maxHp); } },
  ],
  rare: [
    { id: 'deaths-touch', name: "Death's Touch",   icon: '💀',  rarity: 'rare', desc: '+15 base damage',                          apply: p => { p.damage += 15; } },
    { id: 'phantom',      name: 'Phantom Strikes', icon: '👁️', rarity: 'rare', desc: '10% chance to hit twice per click',         apply: p => { p.doubleStrike += 0.10; } },
    { id: 'soul-harvest', name: 'Soul Harvest',    icon: '🌑',  rarity: 'rare', desc: 'Kills charge bonus dmg for next monster',   apply: p => { p.soulHarvest = true; } },
    { id: 'crit-mayhem',  name: 'Critical Mayhem', icon: '🌟',  rarity: 'rare', desc: '+5% crit, +0.5× crit multiplier',          critOnly: true,  apply: p => { p.critChance += 0.05; p.critMult += 0.5; } },
    { id: 'midas',        name: 'Midas Hand',      icon: '🏆',  rarity: 'rare', desc: 'All gold rewards permanently doubled',      apply: p => { p.goldMult *= 2; } },
    { id: 'iron-will',    name: 'Iron Will',       icon: '🛡️',  rarity: 'rare', desc: '+100 max HP, fully restore HP',            apply: p => { p.maxHp += 100; p.hp = p.maxHp; } },
  ],
};

/* ===== GAME STATE ===== */
function freshState() {
  return {
    screen: 'title',
    level: 1,
    gold: 0,
    kills: 0,
    killsRequired: 5,
    isBossLevel: false,
    levelMonsterType: null,
    playerClickLocked: false,

    player: {
      damage: 1,
      critChance: 0.05,
      critMult: 2.0,
      bonusGold: 0,
      doubleStrike: 0,
      goldMult: 1,
      soulHarvest: false,
      soulHarvestBonus: 0,
      hp: 100,
      maxHp: 100,
    },

    monsterAttackTimer: null,

    monster: {
      name: '',
      hp: 10,
      maxHp: 10,
      goldReward: 5,
      isBoss: false,
      data: null,
    },

    shopPurchases: {},   // id -> count of times purchased

    stats: {
      totalClicks: 0,
      totalDamage: 0,
      totalGold: 0,
      totalKills: 0,
      totalCrits: 0,
      levelsReached: 1,
    },
  };
}

let state = freshState();

/* ===== DOM REFERENCES ===== */
const $ = id => document.getElementById(id);

const screens = {
  title:   $('screen-title'),
  game:    $('screen-game'),
  upgrade: $('screen-upgrade'),
  shop:    $('screen-shop'),
  stats:   $('screen-stats'),
};

const el = {
  gameWrap:      $('game-wrap'),
  levelNum:      $('level-num'),
  goldNum:       $('gold-num'),
  monsterName:   $('monster-name'),
  monsterWrap:   $('monster-wrap'),
  monsterDisplay:$('monster-display'),
  hpBarInner:    $('hp-bar-inner'),
  hpText:        $('hp-text'),
  dmgNum:        $('dmg-num'),
  critNum:       $('crit-num'),
  bannerOverlay: $('banner-overlay'),
  bannerText:    $('banner-text'),
  bossWarning:   $('boss-warning'),
  bossTint:      $('boss-tint'),
  damageLayer:   $('damage-layer'),
  upgradeCards:  $('upgrade-cards'),
  statsList:     $('stats-list'),
  shopItems:        $('shop-items'),
  shopGoldNum:      $('shop-gold-num'),
  playerHpBarInner: $('player-hp-bar-inner'),
  playerHpText:     $('player-hp-text'),
  playerHitFlash:   $('player-hit-flash'),
  canvas:           $('particle-canvas'),
};

/* ===== UTILITIES ===== */
function formatNum(n) {
  n = Math.floor(n);
  if (n >= 10000) return Math.floor(n / 1000) + 'k';
  if (n >= 1000)  return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/* ===== SCREEN MANAGEMENT ===== */
function showScreen(name) {
  Object.keys(screens).forEach(k => {
    screens[k].classList.add('hidden');
  });
  screens[name].classList.remove('hidden');
  state.screen = name;
}

/* ===== PARTICLE SYSTEM ===== */
const canvas = el.canvas;
const ctx = canvas.getContext('2d');
let particles = [];
let particleRaf = null;

function initParticles() {
  const W = canvas.width  = canvas.offsetWidth  || window.innerWidth;
  const H = canvas.height = canvas.offsetHeight || window.innerHeight;
  particles = [];
  for (let i = 0; i < 28; i++) {
    particles.push(makeParticle(W, H, true));
  }
}

function makeParticle(W, H, randomY) {
  const colors = ['#ff6600', '#ff9933', '#ffcc00', '#ff4400'];
  return {
    x: Math.random() * W,
    y: randomY ? Math.random() * H : H + 4,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -(0.3 + Math.random() * 0.7),
    size: 1 + Math.random() * 2,
    opacity: 0.2 + Math.random() * 0.6,
    color: rand(colors),
  };
}

function drawParticles() {
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    p.x += p.vx;
    p.y += p.vy;
    // Fade near top
    if (p.y < H * 0.3) {
      p.opacity -= 0.005;
    }
    // Reset when off top or fully faded
    if (p.y < -5 || p.opacity <= 0) {
      const fresh = makeParticle(W, H, false);
      Object.assign(p, fresh);
    }
  });
}

function startParticleLoop() {
  if (particleRaf) cancelAnimationFrame(particleRaf);
  function loop() {
    drawParticles();
    particleRaf = requestAnimationFrame(loop);
  }
  loop();
}

/* ===== HUD UPDATE ===== */
function updateHUD() {
  el.levelNum.textContent  = state.level;
  el.goldNum.textContent   = formatNum(state.gold);
  el.dmgNum.textContent    = state.player.damage;
  el.critNum.textContent   = Math.floor(clamp(state.player.critChance * 100, 0, 50));
  updatePlayerHPBar();
}

/* ===== HP BAR ===== */
function updateHPBar() {
  const pct = clamp(state.monster.hp / state.monster.maxHp * 100, 0, 100);
  el.hpBarInner.style.width = pct + '%';
  el.hpText.textContent = formatNum(state.monster.hp) + ' / ' + formatNum(state.monster.maxHp);
  // Color shift from red to dark red as HP lowers
  if (pct < 25) {
    el.hpBarInner.style.background = 'linear-gradient(90deg, #550000, #990000)';
  } else {
    el.hpBarInner.style.background = 'linear-gradient(90deg, #990000, #cc0000)';
  }
}

/* ===== MONSTER RENDERING ===== */
function renderMonster(data, isBoss) {
  const px   = isBoss ? 176 : 112;   // ~11rem / ~7rem at 16px base
  const pad  = 24;
  const size = px + pad * 2;
  const dpr  = window.devicePixelRatio || 1;

  const canvas = el.monsterDisplay;
  const ctx    = canvas.getContext('2d');

  canvas.width        = Math.round(size * dpr);
  canvas.height       = Math.round(size * dpr);
  canvas.style.width  = size + 'px';
  canvas.style.height = size + 'px';

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.font         = `${px}px serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.glyph, size / 2, size / 2);
  ctx.restore();

  canvas.style.filter = 'none';
  canvas.className    = 'monster-idle';
  if (isBoss) canvas.classList.add('monster-boss');
  el.monsterName.textContent = data.name;
}

/* ===== BANNER ===== */
async function showBanner(text, durationMs) {
  el.bannerText.textContent = text;
  el.bannerOverlay.classList.remove('hidden');
  // Force reflow to restart animation
  el.bannerText.style.animation = 'none';
  void el.bannerText.offsetWidth;
  el.bannerText.style.animation = '';
  await delay(durationMs);
  el.bannerOverlay.classList.add('hidden');
}

/* ===== BOSS WARNING ===== */
async function showBossWarning() {
  el.bossWarning.classList.remove('hidden');
  el.bossWarning.classList.add('active');
  await delay(1500);
  el.bossWarning.classList.add('hidden');
  el.bossWarning.classList.remove('active');
}

/* ===== DAMAGE NUMBERS ===== */
function spawnDamageNumber(amount, isCrit, clientX, clientY) {
  const wrapRect = el.gameWrap.getBoundingClientRect();
  const x = clientX - wrapRect.left;
  const y = clientY - wrapRect.top;

  const div = document.createElement('div');
  div.className = 'damage-number' + (isCrit ? ' is-crit' : '');

  let txt = formatNum(amount);
  if (isCrit) txt = '💥 ' + txt + ' CRIT!';
  div.textContent = txt;

  // Random x scatter
  const scatter = (Math.random() - 0.5) * 40;
  div.style.left = (x + scatter) + 'px';
  div.style.top  = (y - 10) + 'px';

  el.damageLayer.appendChild(div);
  // Remove after animation completes
  setTimeout(() => {
    if (div.parentNode) div.parentNode.removeChild(div);
  }, 750);
}

/* ===== CLICK RIPPLE ===== */
function spawnRipple(clientX, clientY) {
  const wrapRect = el.gameWrap.getBoundingClientRect();
  const x = clientX - wrapRect.left;
  const y = clientY - wrapRect.top;

  const div = document.createElement('div');
  div.className = 'click-ripple';
  div.style.left = (x - 40) + 'px';
  div.style.top  = (y - 40) + 'px';

  el.gameWrap.appendChild(div);
  setTimeout(() => {
    if (div.parentNode) div.parentNode.removeChild(div);
  }, 480);
}

/* ===== SCREEN SHAKE ===== */
function doScreenShake() {
  el.gameWrap.classList.remove('screen-shake');
  void el.gameWrap.offsetWidth; // reflow
  el.gameWrap.classList.add('screen-shake');
  setTimeout(() => el.gameWrap.classList.remove('screen-shake'), 320);
}

/* ===== MONSTER HIT FLASH ===== */
function doHitFlash() {
  el.monsterDisplay.classList.remove('monster-hit');
  void el.monsterDisplay.offsetWidth;
  el.monsterDisplay.classList.add('monster-hit');
  setTimeout(() => el.monsterDisplay.classList.remove('monster-hit'), 120);
}

/* ===== FORMULAS ===== */
function calcMonsterHP(level, isBoss) {
  const base = Math.floor(60 * Math.pow(1.18, level));
  return isBoss ? base * 4 : base;
}

function calcGoldReward(level, isBoss) {
  let g = 2 + Math.floor(level * 0.8);
  if (isBoss) g *= 10;
  g += state.player.bonusGold;
  return Math.floor(g * state.player.goldMult);
}

function calcKillsRequired() {
  return 1;
}

function calcMonsterDamage(level, isBoss) {
  const base = Math.floor(3 * Math.pow(1.08, level));
  return isBoss ? Math.floor(base * 1.2) : base;
}

function calcMonsterAttackInterval(level, isBoss) {
  const ms = Math.max(900, 2200 - level * 30);
  return isBoss ? Math.max(1000, ms - 200) : ms;
}

/* ===== PLAYER HP ===== */
function updatePlayerHPBar() {
  const pct = clamp(state.player.hp / state.player.maxHp * 100, 0, 100);
  el.playerHpBarInner.style.width = pct + '%';
  el.playerHpText.textContent = Math.ceil(state.player.hp) + ' / ' + state.player.maxHp;
  if (pct < 25) {
    el.playerHpBarInner.style.background = 'linear-gradient(90deg, #550000, #880000)';
  } else if (pct < 50) {
    el.playerHpBarInner.style.background = 'linear-gradient(90deg, #882200, #cc4400)';
  } else {
    el.playerHpBarInner.style.background = 'linear-gradient(90deg, #aa1111, #dd2222)';
  }
}

function doPlayerHitFlash() {
  el.playerHitFlash.classList.remove('active');
  void el.playerHitFlash.offsetWidth;
  el.playerHitFlash.classList.add('active');
}

function playerTakeDamage(amount) {
  if (state.playerClickLocked || state.screen !== 'game') return;
  state.player.hp = Math.max(0, state.player.hp - amount);
  updatePlayerHPBar();
  doPlayerHitFlash();
  if (state.player.hp <= 0) {
    stopMonsterAttackTimer();
    gameOver();
  }
}

function startMonsterAttackTimer() {
  stopMonsterAttackTimer();
  const dmg      = calcMonsterDamage(state.level, state.isBossLevel);
  const interval = calcMonsterAttackInterval(state.level, state.isBossLevel);
  state.monsterAttackTimer = setInterval(() => playerTakeDamage(dmg), interval);
}

function stopMonsterAttackTimer() {
  if (state.monsterAttackTimer) {
    clearInterval(state.monsterAttackTimer);
    state.monsterAttackTimer = null;
  }
}

async function gameOver() {
  state.playerClickLocked = true;
  stopMonsterAttackTimer();
  await showBanner('You Died...', 1600);
  showStatsScreen();
}

/* ===== SPAWN MONSTER ===== */
function spawnMonster(animate) {
  const data    = state.levelMonsterType;
  const isBoss  = state.isBossLevel;
  const hp      = calcMonsterHP(state.level, isBoss);
  const gold    = calcGoldReward(state.level, isBoss);

  state.monster = {
    name:      data.name,
    hp:        hp,
    maxHp:     hp,
    goldReward:gold,
    isBoss:    isBoss,
    data:      data,
  };

  renderMonster(data, isBoss);
  updateHPBar();

  if (animate) {
    el.monsterDisplay.classList.remove('monster-idle', 'monster-boss', 'monster-spawning');
    void el.monsterDisplay.offsetWidth;
    el.monsterDisplay.classList.add('monster-spawning');
    const classes = ['monster-idle'];
    if (isBoss) classes.push('monster-boss');
    setTimeout(() => {
      el.monsterDisplay.classList.remove('monster-spawning');
      classes.forEach(c => el.monsterDisplay.classList.add(c));
      startMonsterAttackTimer();
    }, 380);
  } else {
    startMonsterAttackTimer();
  }
}

/* ===== COMPUTE DAMAGE ===== */
function computeHit() {
  let dmg = state.player.damage;
  const isCrit = Math.random() < Math.min(0.5, state.player.critChance);
  if (isCrit) dmg = Math.floor(dmg * state.player.critMult);

  // Soul Harvest bonus
  dmg += state.player.soulHarvestBonus;
  state.player.soulHarvestBonus = 0;

  // Phantom Strikes
  let extraHit = false;
  if (state.player.doubleStrike > 0 && Math.random() < state.player.doubleStrike) {
    extraHit = true;
  }

  return { dmg, isCrit, extraHit };
}

/* ===== KILL MONSTER ===== */
async function killMonster() {
  stopMonsterAttackTimer();
  state.kills++;
  state.gold += state.monster.goldReward;
  state.stats.totalKills++;
  state.stats.totalGold += state.monster.goldReward;

  // Soul Harvest charge from kills
  if (state.player.soulHarvest) {
    state.player.soulHarvestBonus += Math.floor(state.monster.maxHp * 0.01);
  }

  updateHUD();

  if (state.kills >= state.killsRequired) {
    await delay(250);
    await levelComplete();
  } else {
    // Death animation then new monster
    el.monsterDisplay.classList.remove('monster-idle', 'monster-boss');
    el.monsterDisplay.classList.add('monster-dying');
    await delay(420);
    spawnMonster(true);
  }
}

/* ===== HANDLE CLICK / TAP ===== */
async function handleMonsterHit(clientX, clientY) {
  if (state.screen !== 'game' || state.playerClickLocked) return;

  spawnRipple(clientX, clientY);
  doHitFlash();

  const { dmg, isCrit, extraHit } = computeHit();

  state.stats.totalClicks++;
  state.stats.totalDamage += dmg;
  if (isCrit) state.stats.totalCrits++;

  spawnDamageNumber(dmg, isCrit, clientX, clientY);
  if (isCrit) doScreenShake();

  state.monster.hp = Math.max(0, state.monster.hp - dmg);
  updateHPBar();

  // Phantom Strikes second hit
  if (extraHit && state.monster.hp > 0) {
    const extraDmg = state.player.damage;
    state.stats.totalDamage += extraDmg;
    state.monster.hp = Math.max(0, state.monster.hp - extraDmg);
    spawnDamageNumber(extraDmg, false, clientX + 20, clientY - 20);
    updateHPBar();
  }

  if (state.monster.hp <= 0) {
    state.playerClickLocked = true;
    await killMonster();
    state.playerClickLocked = false;
  }
}

/* ===== LEVEL COMPLETE ===== */
async function levelComplete() {
  state.playerClickLocked = true;
  // Heal 30% of max HP on level complete
  const heal = Math.floor(state.player.maxHp * 0.30);
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
  updatePlayerHPBar();
  await showBanner('Level Complete!  ❤️ +' + heal, 1400);
  showUpgradeScreen();
}

/* ===== UPGRADE SELECTION ===== */
function rollRarity() {
  const r = Math.random();
  if (r < 0.60) return 'common';
  if (r < 0.90) return 'uncommon';
  return 'rare';
}

function genUpgradeChoices() {
  const atCritCap = state.player.critChance >= 0.5;
  const choices = [];
  const usedIds = new Set();
  let attempts = 0;

  while (choices.length < 3 && attempts < 100) {
    attempts++;
    const rarity = rollRarity();
    const pool   = UPGRADE_POOL[rarity];
    const pick   = rand(pool);
    if (!usedIds.has(pick.id) && !(atCritCap && pick.critOnly)) {
      usedIds.add(pick.id);
      choices.push(pick);
    }
  }

  // Fallback: fill remaining from common if needed
  if (choices.length < 3) {
    for (const up of UPGRADE_POOL.common) {
      if (!usedIds.has(up.id) && choices.length < 3) {
        usedIds.add(up.id);
        choices.push(up);
      }
    }
  }

  return choices;
}

function showUpgradeScreen() {
  const choices = genUpgradeChoices();
  el.upgradeCards.innerHTML = '';

  choices.forEach((up, idx) => {
    const card = document.createElement('div');
    card.className = `upgrade-card rarity-${up.rarity}`;
    card.innerHTML = `
      <div class="upgrade-icon">${up.icon}</div>
      <div class="upgrade-name">${up.name}</div>
      <div class="upgrade-rarity-badge badge-${up.rarity}">${up.rarity.toUpperCase()}</div>
      <div class="upgrade-desc">${up.desc}</div>
    `;

    card.addEventListener('click', () => onSelectUpgrade(up, card, choices));
    card.addEventListener('touchstart', e => {
      e.preventDefault();
      onSelectUpgrade(up, card, choices);
    }, { passive: false });

    el.upgradeCards.appendChild(card);
  });

  showScreen('upgrade');
}

async function onSelectUpgrade(upgrade, selectedCard, allChoices) {
  // Prevent double-selecting
  if (selectedCard.classList.contains('selected')) return;

  // Apply upgrade
  upgrade.apply(state.player);

  // Animate cards
  const allCards = el.upgradeCards.querySelectorAll('.upgrade-card');
  allCards.forEach(c => {
    if (c === selectedCard) {
      c.classList.add('selected');
    } else {
      c.classList.add('faded');
    }
  });

  await delay(600);
  startLevel(state.level + 1);
}

/* ===== START LEVEL ===== */
async function startLevel(n) {
  state.level        = n;
  state.kills        = 0;
  state.isBossLevel  = (n % 10 === 0);
  state.killsRequired= calcKillsRequired();
  state.stats.levelsReached = n;
  state.playerClickLocked = true;

  // Pick monster type for this level
  if (state.isBossLevel) {
    const bossIndex = Math.floor((n / 10) - 1);
    state.levelMonsterType = BOSS_ROSTER[bossIndex % BOSS_ROSTER.length];
  } else {
    state.levelMonsterType = rand(MONSTER_ROSTER);
  }

  stopMonsterAttackTimer();
  showScreen('game');
  updateHUD();
  updatePlayerHPBar();

  // Boss tint
  if (state.isBossLevel) {
    el.bossTint.classList.remove('hidden');
  } else {
    el.bossTint.classList.add('hidden');
  }

  // Level banner
  await showBanner('Level ' + n, 1200);

  // Boss warning
  if (state.isBossLevel) {
    await showBossWarning();
  }

  // Spawn the first monster
  spawnMonster(false);
  updateHPBar();
  state.playerClickLocked = false;
}

/* ===== SHOP ===== */
function shopItemCost(item) {
  // Consumables keep flat cost; permanent upgrades scale with purchases
  const count = state.shopPurchases[item.id] || 0;
  if (item.consumable) return item.baseCost;
  return Math.floor(item.baseCost * Math.pow(1.5, count));
}

function renderShop() {
  el.shopGoldNum.textContent = formatNum(state.gold);
  el.shopItems.innerHTML = '';

  SHOP_ITEMS.forEach(item => {
    const cost = shopItemCost(item);
    const canAfford = state.gold >= cost;

    const div = document.createElement('div');
    div.className = 'shop-item' + (item.consumable ? ' consumable' : '') + (!canAfford ? ' cant-afford' : '');

    const count = state.shopPurchases[item.id] || 0;
    const timesLabel = (!item.consumable && count > 0) ? ` (×${count})` : '';

    div.innerHTML = `
      <div class="shop-item-icon">${item.icon}</div>
      <div class="shop-item-info">
        <div class="shop-item-name">${item.name}${timesLabel}</div>
        <div class="shop-item-desc">${item.desc}</div>
      </div>
      <div class="shop-item-price">🪙 ${formatNum(cost)}</div>
    `;

    div.addEventListener('click', () => onBuyItem(item));
    div.addEventListener('touchstart', e => { e.preventDefault(); onBuyItem(item); }, { passive: false });
    el.shopItems.appendChild(div);
  });
}

async function onBuyItem(item) {
  const cost = shopItemCost(item);
  if (state.gold < cost) return;

  state.gold -= cost;
  state.shopPurchases[item.id] = (state.shopPurchases[item.id] || 0) + 1;

  if (item.id === 'life-potion') {
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + 50);
    updatePlayerHPBar();
    renderShop();
    updateHUD();
  } else if (item.id === 'execute') {
    // Instant kill — close shop first, then kill
    showScreen('game');
    updateHUD();
    state.monster.hp = 0;
    updateHPBar();
    state.playerClickLocked = true;
    await killMonster();
    state.playerClickLocked = false;
  } else {
    item.apply(state.player);
    renderShop();
    updateHUD();
  }
}

function openShop() {
  renderShop();
  showScreen('shop');
}

/* ===== STATS SCREEN ===== */
function showStatsScreen() {
  const s = state.stats;
  const rows = [
    ['Levels Reached',  s.levelsReached],
    ['Total Kills',     formatNum(s.totalKills)],
    ['Total Damage',    formatNum(s.totalDamage)],
    ['Gold Earned',     formatNum(s.totalGold)],
    ['Critical Hits',   formatNum(s.totalCrits)],
    ['Total Clicks',    formatNum(s.totalClicks)],
  ];

  el.statsList.innerHTML = rows.map(([label, val]) =>
    `<div class="stat-row">
       <span class="stat-label">${label}</span>
       <span class="stat-value">${val}</span>
     </div>`
  ).join('');

  showScreen('stats');
}

/* ===== RESIZE HANDLER ===== */
function onResize() {
  canvas.width  = canvas.offsetWidth  || window.innerWidth;
  canvas.height = canvas.offsetHeight || window.innerHeight;
  // Reinit particles at new dimensions without resetting positions entirely
  const W = canvas.width;
  const H = canvas.height;
  while (particles.length < 28) particles.push(makeParticle(W, H, true));
}

/* ===== EVENT SETUP ===== */
function setupEvents() {
  // Start button
  $('btn-start').addEventListener('click', () => {
    state = freshState();
    startLevel(1);
  });

  // Retire button
  $('btn-retire').addEventListener('click', showStatsScreen);

  // Shop button
  $('btn-shop').addEventListener('click', openShop);

  // Shop close
  $('btn-shop-close').addEventListener('click', () => showScreen('game'));

  // Play Again
  $('btn-play-again').addEventListener('click', () => {
    state = freshState();
    startLevel(1);
  });

  // Monster tap — mouse
  el.monsterWrap.addEventListener('click', e => {
    handleMonsterHit(e.clientX, e.clientY);
  });

  // Monster tap — touch
  el.monsterWrap.addEventListener('touchstart', e => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    handleMonsterHit(touch.clientX, touch.clientY);
  }, { passive: false });

  // Prevent scroll on touch everywhere
  document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

  // Resize
  window.addEventListener('resize', onResize);
}

/* ===== INIT ===== */
function init() {
  // Size canvas
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  initParticles();
  startParticleLoop();
  setupEvents();
  showScreen('title');
}

document.addEventListener('DOMContentLoaded', init);
