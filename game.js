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

/* ===== ARMOR & WEAPON CATALOG ===== */
const SLOT_META = {
  weapon:   { label: 'Weapon',   icon: '⚔️' },
  head:     { label: 'Head',     icon: '🪖' },
  chest:    { label: 'Chest',    icon: '🧥' },
  gloves:   { label: 'Gloves',   icon: '🥊' },
  trousers: { label: 'Trousers', icon: '👖' },
  greaves:  { label: 'Greaves',  icon: '👢' },
  shield:   { label: 'Shield',   icon: '🛡️' },
};

const ARMOR_CATALOG = [
  // ── WEAPONS ──────────────────────────────────────────────────────────────
  { id: 'rusty-dagger',     name: 'Rusty Dagger',       icon: '🗡️', slot: 'weapon',   tier: 1, cost: 45,   desc: '+3 dmg, +3% crit',                                  stats: { dmgBonus: 3, critBonus: 0.03 } },
  { id: 'iron-sword',       name: 'Iron Sword',          icon: '🔪', slot: 'weapon',   tier: 2, cost: 120,  desc: '+8 dmg, +5% crit',                                  stats: { dmgBonus: 8, critBonus: 0.05 } },
  { id: 'warhammer',        name: 'Warhammer',           icon: '🔨', slot: 'weapon',   tier: 3, cost: 270,  desc: '+18 dmg, +0.3× crit mult',                          stats: { dmgBonus: 18, critMultBonus: 0.3 } },
  { id: 'shadowfang',       name: 'Shadowfang',          icon: '🌑', slot: 'weapon',   tier: 4, cost: 500,  desc: '+14 dmg, +10% crit, +0.5× crit mult',               stats: { dmgBonus: 14, critBonus: 0.10, critMultBonus: 0.5 } },
  { id: 'soul-reaper-w',    name: 'Soul Reaper',         icon: '💀', slot: 'weapon',   tier: 5, cost: 880,  desc: '+22 dmg, +8% crit, heal 8% max HP per kill',        stats: { dmgBonus: 22, critBonus: 0.08, killHealPct: 0.08 } },
  { id: 'void-cleaver',     name: 'Void Cleaver',        icon: '🌟', slot: 'weapon',   tier: 6, cost: 1600, desc: '+35 dmg, +14% crit, +0.8× crit mult',               stats: { dmgBonus: 35, critBonus: 0.14, critMultBonus: 0.8 } },

  // ── HEAD ─────────────────────────────────────────────────────────────────
  { id: 'leather-cap',      name: 'Leather Cap',         icon: '🪖', slot: 'head',     tier: 1, cost: 50,   desc: '+15 max HP',                                        stats: { maxHpBonus: 15 } },
  { id: 'iron-helm',        name: 'Iron Helm',           icon: '⛑️', slot: 'head',     tier: 2, cost: 130,  desc: '+30 max HP, -1 dmg taken',                          stats: { maxHpBonus: 30, damageReduction: 1 } },
  { id: 'steel-coif',       name: 'Steel Coif',          icon: '🪖', slot: 'head',     tier: 3, cost: 270,  desc: '+45 max HP, -2 dmg taken',                          stats: { maxHpBonus: 45, damageReduction: 2 } },
  { id: 'shadow-hood',      name: 'Shadow Hood',         icon: '🎭', slot: 'head',     tier: 4, cost: 480,  desc: '+60 max HP, -2 dmg taken, +5% crit',                stats: { maxHpBonus: 60, damageReduction: 2, critBonus: 0.05 } },
  { id: 'warlord-crest',    name: "Warlord's Crest",     icon: '👑', slot: 'head',     tier: 5, cost: 820,  desc: '+85 max HP, -3 dmg taken, +8% crit',                stats: { maxHpBonus: 85, damageReduction: 3, critBonus: 0.08 } },
  { id: 'death-crown',      name: 'Death Crown',         icon: '💀', slot: 'head',     tier: 6, cost: 1400, desc: '+120 max HP, -4 dmg taken, +12% crit',              stats: { maxHpBonus: 120, damageReduction: 4, critBonus: 0.12 } },

  // ── CHEST ─────────────────────────────────────────────────────────────────
  { id: 'leather-tunic',    name: 'Leather Tunic',       icon: '👕', slot: 'chest',    tier: 1, cost: 60,   desc: '-1 damage taken',                                   stats: { damageReduction: 1 } },
  { id: 'chain-mail',       name: 'Chain Mail',          icon: '🧥', slot: 'chest',    tier: 2, cost: 150,  desc: '+20 max HP, -2 dmg taken',                          stats: { maxHpBonus: 20, damageReduction: 2 } },
  { id: 'brigandine',       name: 'Brigandine',          icon: '🥋', slot: 'chest',    tier: 3, cost: 310,  desc: '+40 max HP, -3 dmg taken',                          stats: { maxHpBonus: 40, damageReduction: 3 } },
  { id: 'knights-hauberk',  name: "Knight's Hauberk",    icon: '🧥', slot: 'chest',    tier: 4, cost: 550,  desc: '+65 max HP, -4 dmg taken',                          stats: { maxHpBonus: 65, damageReduction: 4 } },
  { id: 'dragon-hide',      name: 'Dragon Hide',         icon: '🐉', slot: 'chest',    tier: 5, cost: 920,  desc: '+95 max HP, -5 dmg taken',                          stats: { maxHpBonus: 95, damageReduction: 5 } },
  { id: 'plate-armor',      name: 'Plate Armor',         icon: '🛡️', slot: 'chest',    tier: 6, cost: 1600, desc: '+140 max HP, -7 dmg taken',                         stats: { maxHpBonus: 140, damageReduction: 7 } },

  // ── GLOVES ────────────────────────────────────────────────────────────────
  { id: 'leather-wraps',    name: 'Leather Wraps',       icon: '🥊', slot: 'gloves',   tier: 1, cost: 40,   desc: '+2 dmg',                                            stats: { dmgBonus: 2 } },
  { id: 'iron-gauntlets',   name: 'Iron Gauntlets',      icon: '🤜', slot: 'gloves',   tier: 2, cost: 105,  desc: '+5 dmg, +2% crit',                                  stats: { dmgBonus: 5, critBonus: 0.02 } },
  { id: 'battle-mitts',     name: 'Battle Mitts',        icon: '🥊', slot: 'gloves',   tier: 3, cost: 230,  desc: '+9 dmg, +4% crit',                                  stats: { dmgBonus: 9, critBonus: 0.04 } },
  { id: 'shadow-claws',     name: 'Shadow Claws',        icon: '🐾', slot: 'gloves',   tier: 4, cost: 430,  desc: '+14 dmg, +6% crit',                                 stats: { dmgBonus: 14, critBonus: 0.06 } },
  { id: 'berserker-fists',  name: 'Berserker Fists',     icon: '💪', slot: 'gloves',   tier: 5, cost: 730,  desc: '+20 dmg, +9% crit',                                 stats: { dmgBonus: 20, critBonus: 0.09 } },
  { id: 'deathgrip',        name: 'Deathgrip',           icon: '👊', slot: 'gloves',   tier: 6, cost: 1250, desc: '+30 dmg, +12% crit',                                stats: { dmgBonus: 30, critBonus: 0.12 } },

  // ── TROUSERS ──────────────────────────────────────────────────────────────
  { id: 'leather-legs',     name: 'Leather Leggings',    icon: '👖', slot: 'trousers', tier: 1, cost: 45,   desc: '+10 max HP, 5% dodge',                              stats: { maxHpBonus: 10, dodgeChance: 0.05 } },
  { id: 'chain-legs',       name: 'Chain Leggings',      icon: '⛓️', slot: 'trousers', tier: 2, cost: 115,  desc: '+25 max HP, 10% dodge',                             stats: { maxHpBonus: 25, dodgeChance: 0.10 } },
  { id: 'shadow-wraps',     name: 'Shadow Wraps',        icon: '🌫️', slot: 'trousers', tier: 3, cost: 250,  desc: '+40 max HP, 15% dodge',                             stats: { maxHpBonus: 40, dodgeChance: 0.15 } },
  { id: 'phantom-legs',     name: 'Phantom Leggings',    icon: '👻', slot: 'trousers', tier: 4, cost: 460,  desc: '+55 max HP, 20% dodge',                             stats: { maxHpBonus: 55, dodgeChance: 0.20 } },
  { id: 'specter-trousers', name: 'Specter Trousers',    icon: '🌑', slot: 'trousers', tier: 5, cost: 770,  desc: '+75 max HP, 26% dodge',                             stats: { maxHpBonus: 75, dodgeChance: 0.26 } },
  { id: 'wraithform',       name: 'Wraithform',          icon: '💨', slot: 'trousers', tier: 6, cost: 1350, desc: '+100 max HP, 32% dodge',                            stats: { maxHpBonus: 100, dodgeChance: 0.32 } },

  // ── GREAVES ───────────────────────────────────────────────────────────────
  { id: 'leather-boots',    name: 'Leather Boots',       icon: '👟', slot: 'greaves',  tier: 1, cost: 45,   desc: 'Monster attacks 200ms slower',                      stats: { attackIntervalBonus: 200 } },
  { id: 'iron-boots',       name: 'Iron Boots',          icon: '🥾', slot: 'greaves',  tier: 2, cost: 115,  desc: '+1 dmg, 400ms slower',                              stats: { dmgBonus: 1, attackIntervalBonus: 400 } },
  { id: 'steel-greaves',    name: 'Steel Greaves',       icon: '👢', slot: 'greaves',  tier: 3, cost: 255,  desc: '+3 dmg, 650ms slower',                              stats: { dmgBonus: 3, attackIntervalBonus: 650 } },
  { id: 'swift-greaves',    name: 'Swift Greaves',       icon: '⚡', slot: 'greaves',  tier: 4, cost: 470,  desc: '+6 dmg, 900ms slower',                              stats: { dmgBonus: 6, attackIntervalBonus: 900 } },
  { id: 'windwalker',       name: 'Windwalker',          icon: '🌪️', slot: 'greaves',  tier: 5, cost: 800,  desc: '+10 dmg, 1200ms slower',                            stats: { dmgBonus: 10, attackIntervalBonus: 1200 } },
  { id: 'phantom-striders', name: 'Phantom Striders',    icon: '👣', slot: 'greaves',  tier: 6, cost: 1400, desc: '+15 dmg, 1600ms slower',                            stats: { dmgBonus: 15, attackIntervalBonus: 1600 } },

  // ── SHIELD ────────────────────────────────────────────────────────────────
  { id: 'wooden-shield',    name: 'Wooden Shield',       icon: '🪵', slot: 'shield',   tier: 1, cost: 55,   desc: 'Block 2 damage per hit',                            stats: { block: 2 } },
  { id: 'iron-shield',      name: 'Iron Shield',         icon: '🛡️', slot: 'shield',   tier: 2, cost: 140,  desc: 'Block 4 damage per hit',                            stats: { block: 4 } },
  { id: 'tower-shield',     name: 'Tower Shield',        icon: '🏰', slot: 'shield',   tier: 3, cost: 290,  desc: '+10 max HP, block 6 damage',                        stats: { maxHpBonus: 10, block: 6 } },
  { id: 'spiked-shield',    name: 'Spiked Shield',       icon: '⚔️', slot: 'shield',   tier: 4, cost: 520,  desc: 'Block 7, reflect 3 dmg to attacker',               stats: { block: 7, reflectDamage: 3 } },
  { id: 'runed-bulwark',    name: 'Runed Bulwark',       icon: '🔮', slot: 'shield',   tier: 5, cost: 880,  desc: 'Block 9, reflect 5 dmg to attacker',               stats: { block: 9, reflectDamage: 5 } },
  { id: 'aegis',            name: 'Aegis of the Slayer', icon: '✨', slot: 'shield',   tier: 6, cost: 1600, desc: 'Block 12, reflect 8 dmg to attacker',              stats: { block: 12, reflectDamage: 8 } },
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

    shopPurchases: {},
    equippedArmor: { weapon: null, head: null, chest: null, gloves: null, trousers: null, greaves: null, shield: null },

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
  title:       $('screen-title'),
  game:        $('screen-game'),
  upgrade:     $('screen-upgrade'),
  shop:        $('screen-shop'),
  armory:      $('screen-armory'),
  stats:       $('screen-stats'),
  leaderboard: $('screen-leaderboard'),
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
  nameInput:        $('name-input'),
  nameError:        $('name-error'),
  leaderboardList:  $('leaderboard-list'),
  armoryGoldNum:    $('armory-gold-num'),
  armorSlotsGrid:   $('armor-slots-grid'),
  armorItemPicker:  $('armor-item-picker'),
  armorPickerTitle: $('armor-picker-title'),
  armorPickerItems: $('armor-picker-items'),
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

/* ===== ARMOR STATS ===== */
function getArmorStats() {
  const totals = { maxHpBonus: 0, dmgBonus: 0, critBonus: 0, critMultBonus: 0, damageReduction: 0, block: 0, dodgeChance: 0, attackIntervalBonus: 0, reflectDamage: 0, killHealPct: 0 };
  for (const itemId of Object.values(state.equippedArmor)) {
    if (!itemId) continue;
    const item = ARMOR_CATALOG.find(a => a.id === itemId);
    if (!item) continue;
    for (const [k, v] of Object.entries(item.stats)) {
      if (k in totals) totals[k] += v;
    }
  }
  return totals;
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
  const armor = getArmorStats();
  el.levelNum.textContent  = state.level;
  el.goldNum.textContent   = formatNum(state.gold);
  el.dmgNum.textContent    = state.player.damage + armor.dmgBonus;
  el.critNum.textContent   = Math.floor(clamp((state.player.critChance + armor.critBonus) * 100, 0, 50));
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
  const base = isBoss ? Math.max(1000, ms - 200) : ms;
  return base + getArmorStats().attackIntervalBonus;
}

/* ===== PLAYER HP ===== */
function effectiveMaxHp() {
  return state.player.maxHp + getArmorStats().maxHpBonus;
}

function updatePlayerHPBar() {
  const maxHp = effectiveMaxHp();
  const pct = clamp(state.player.hp / maxHp * 100, 0, 100);
  el.playerHpBarInner.style.width = pct + '%';
  el.playerHpText.textContent = Math.ceil(state.player.hp) + ' / ' + maxHp;
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

function spawnDodgeText() {
  const rect = el.monsterWrap.getBoundingClientRect();
  const wrapRect = el.gameWrap.getBoundingClientRect();
  const x = rect.left + rect.width / 2 - wrapRect.left;
  const y = rect.bottom - wrapRect.top;
  const div = document.createElement('div');
  div.className = 'dodge-text';
  div.textContent = 'DODGE!';
  div.style.left = x + 'px';
  div.style.top  = y + 'px';
  el.damageLayer.appendChild(div);
  setTimeout(() => { if (div.parentNode) div.parentNode.removeChild(div); }, 750);
}

function playerTakeDamage(amount) {
  if (state.playerClickLocked || state.screen !== 'game') return;
  const armor = getArmorStats();

  // Dodge
  if (armor.dodgeChance > 0 && Math.random() < armor.dodgeChance) {
    spawnDodgeText();
    return;
  }

  // Damage reduction + block (minimum 1)
  const reduced = Math.max(1, amount - armor.damageReduction - armor.block);
  state.player.hp = Math.max(0, state.player.hp - reduced);

  // Reflect damage back
  if (armor.reflectDamage > 0 && state.monster.hp > 0) {
    state.monster.hp = Math.max(0, state.monster.hp - armor.reflectDamage);
    updateHPBar();
    if (state.monster.hp <= 0) {
      state.playerClickLocked = true;
      killMonster().then(() => { state.playerClickLocked = false; });
      return;
    }
  }

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
  const armor = getArmorStats();
  let dmg = state.player.damage + armor.dmgBonus;
  const isCrit = Math.random() < Math.min(0.5, state.player.critChance + armor.critBonus);
  if (isCrit) dmg = Math.floor(dmg * (state.player.critMult + armor.critMultBonus));

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

  // Kill heal from weapon (e.g. Soul Reaper)
  const armorOnKill = getArmorStats();
  if (armorOnKill.killHealPct > 0) {
    const healAmt = Math.floor(effectiveMaxHp() * armorOnKill.killHealPct);
    state.player.hp = Math.min(effectiveMaxHp(), state.player.hp + healAmt);
    updatePlayerHPBar();
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
  const maxHp = effectiveMaxHp();
  const heal = Math.floor(maxHp * 0.30);
  state.player.hp = Math.min(maxHp, state.player.hp + heal);
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
  saveScore();
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

/* ===== ARMORY ===== */
function renderArmorSlots() {
  el.armorSlotsGrid.innerHTML = '';
  for (const [slot, meta] of Object.entries(SLOT_META)) {
    const equippedId = state.equippedArmor[slot];
    const equippedItem = equippedId ? ARMOR_CATALOG.find(a => a.id === equippedId) : null;

    const card = document.createElement('div');
    card.className = 'armor-slot-card' + (equippedItem ? ' is-equipped' : '');
    card.innerHTML = `
      <div class="armor-slot-icon">${meta.icon}</div>
      <div class="armor-slot-info">
        <div class="armor-slot-label">${meta.label}</div>
        <div class="armor-slot-name ${equippedItem ? '' : 'empty'}">${equippedItem ? equippedItem.name : 'Empty'}</div>
      </div>
    `;
    card.addEventListener('click', () => showArmorPicker(slot));
    card.addEventListener('touchstart', e => { e.preventDefault(); showArmorPicker(slot); }, { passive: false });
    el.armorSlotsGrid.appendChild(card);
  }
}

function showArmorPicker(slot) {
  const meta = SLOT_META[slot];
  el.armorPickerTitle.textContent = meta.label + ' Armor';
  el.armorPickerItems.innerHTML = '';

  const items = ARMOR_CATALOG.filter(a => a.slot === slot);
  items.forEach(item => {
    const isEquipped = state.equippedArmor[slot] === item.id;
    const canAfford = state.gold >= item.cost;

    const div = document.createElement('div');
    div.className = 'armor-picker-item'
      + (isEquipped ? ' is-equipped' : '')
      + (!isEquipped && !canAfford ? ' cant-afford' : '');

    div.innerHTML = `
      <div class="armor-picker-icon">${item.icon}</div>
      <div class="armor-picker-info">
        <div class="armor-picker-name">${item.name}</div>
        <div class="armor-picker-desc">${item.desc}</div>
      </div>
      <div class="armor-picker-price ${isEquipped ? 'equipped-label' : ''}">
        ${isEquipped ? '✓ Equipped' : '🪙 ' + formatNum(item.cost)}
      </div>
    `;

    if (!isEquipped) {
      div.addEventListener('click', () => onBuyArmor(item, slot));
      div.addEventListener('touchstart', e => { e.preventDefault(); onBuyArmor(item, slot); }, { passive: false });
    }
    el.armorPickerItems.appendChild(div);
  });

  el.armorSlotsGrid.classList.add('hidden');
  el.armorItemPicker.classList.remove('hidden');
}

function onBuyArmor(item, slot) {
  if (state.gold < item.cost) return;
  state.gold -= item.cost;
  state.equippedArmor[slot] = item.id;

  // Cap HP at new effective max
  state.player.hp = Math.min(state.player.hp, effectiveMaxHp());

  // Restart attack timer (interval may have changed from greaves)
  if (state.monsterAttackTimer) startMonsterAttackTimer();

  updateHUD();
  el.armoryGoldNum.textContent = formatNum(state.gold);
  showArmorPicker(slot); // refresh picker
}

function openArmory() {
  el.armoryGoldNum.textContent = formatNum(state.gold);
  el.armorItemPicker.classList.add('hidden');
  el.armorSlotsGrid.classList.remove('hidden');
  renderArmorSlots();
  showScreen('armory');
}

/* ===== LEADERBOARD ===== */
const LB_KEY = 'tapslayer_scores';
const LB_MAX = 10;

function loadLeaderboard() {
  try {
    const raw = localStorage.getItem(LB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveScore() {
  const name  = (el.nameInput.value || '').trim() || 'Unknown';
  const entry = {
    name,
    level: state.stats.levelsReached,
    date:  new Date().toLocaleDateString(),
  };
  const scores = loadLeaderboard();
  scores.push(entry);
  scores.sort((a, b) => b.level - a.level);
  try { localStorage.setItem(LB_KEY, JSON.stringify(scores.slice(0, LB_MAX))); } catch { /* ignore */ }
}

function showLeaderboardScreen(returnTo) {
  const scores = loadLeaderboard();
  el.leaderboardList.innerHTML = '';

  if (scores.length === 0) {
    el.leaderboardList.innerHTML = '<div class="lb-empty">No records yet. Be the first!</div>';
  } else {
    const medals = ['🥇', '🥈', '🥉'];
    scores.forEach((entry, i) => {
      const row = document.createElement('div');
      row.className = 'lb-row';
      const rankHtml = i < 3
        ? `<div class="lb-rank">${medals[i]}</div>`
        : `<div class="lb-rank numbered">${i + 1}.</div>`;
      row.innerHTML = `
        ${rankHtml}
        <div class="lb-name">${entry.name}</div>
        <div class="lb-level">Lvl ${entry.level}</div>
        <div class="lb-date">${entry.date}</div>
      `;
      el.leaderboardList.appendChild(row);
    });
  }

  $('btn-leaderboard-close').onclick = () => showScreen(returnTo || 'title');
  showScreen('leaderboard');
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
  // Start button — validate name first
  $('btn-start').addEventListener('click', () => {
    const name = el.nameInput.value.trim();
    if (!name) {
      el.nameError.classList.remove('hidden');
      el.nameInput.focus();
      return;
    }
    el.nameError.classList.add('hidden');
    state = freshState();
    startLevel(1);
  });

  // Name input — clear error on typing, start on Enter
  el.nameInput.addEventListener('input', () => {
    if (el.nameInput.value.trim()) el.nameError.classList.add('hidden');
  });
  el.nameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') $('btn-start').click();
  });

  // Title leaderboard button
  $('btn-title-leaderboard').addEventListener('click', () => showLeaderboardScreen('title'));

  // Retire button — stop attack timer, save score, show stats
  $('btn-retire').addEventListener('click', () => {
    stopMonsterAttackTimer();
    showStatsScreen();
  });

  // Armory button
  $('btn-armory').addEventListener('click', openArmory);

  // Armory close
  $('btn-armory-close').addEventListener('click', () => showScreen('game'));

  // Armory back to slots
  $('btn-armor-back').addEventListener('click', () => {
    el.armorItemPicker.classList.add('hidden');
    el.armorSlotsGrid.classList.remove('hidden');
    renderArmorSlots();
  });

  // Shop button
  $('btn-shop').addEventListener('click', openShop);

  // Shop close
  $('btn-shop-close').addEventListener('click', () => showScreen('game'));

  // Play Again — return to title
  $('btn-play-again').addEventListener('click', () => showScreen('title'));

  // Stats leaderboard button
  $('btn-stats-leaderboard').addEventListener('click', () => showLeaderboardScreen('stats'));

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
