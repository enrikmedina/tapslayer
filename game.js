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
    desc: '+5 bonus gold per kill',
    baseCost: 120,
    consumable: false,
    apply: p => { p.bonusGold += 5; },
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
    { id: 'blood-toll', name: 'Blood Toll',        icon: '💰',  rarity: 'common',   desc: '+3 gold per kill',                     apply: p => { p.bonusGold += 3; } },
    { id: 'tough-grip', name: 'Toughened Grip',    icon: '🤜',  rarity: 'common',   desc: '+1 damage, +1% crit chance',           apply: p => { p.damage += 1; p.critChance += 0.01; } },
  ],
  uncommon: [
    { id: 'vorpal',      name: 'Vorpal Edge',         icon: '🗡️', rarity: 'uncommon', desc: '+5 base damage',                       apply: p => { p.damage += 5; } },
    { id: 'assassin',   name: "Assassin's Instinct", icon: '🎯',  rarity: 'uncommon', desc: '+3% critical chance',                  critOnly: true,  apply: p => { p.critChance += 0.03; } },
    { id: 'brutal',     name: 'Brutal Force',        icon: '💪',  rarity: 'uncommon', desc: '+0.5× critical multiplier',            apply: p => { p.critMult += 0.5; } },
    { id: 'gold-frenzy',name: 'Gold Frenzy',         icon: '💎',  rarity: 'uncommon', desc: '+6 gold per kill',                     apply: p => { p.bonusGold += 6; } },
    { id: 'savage',     name: 'Savage Combo',        icon: '⚡',  rarity: 'uncommon', desc: '+3 damage, +2% crit chance',           apply: p => { p.damage += 3; p.critChance += 0.02; } },
    { id: 'vitality',   name: 'Vitality',            icon: '❤️',  rarity: 'uncommon', desc: '+40 max HP, restore 40 HP',            apply: p => { p.maxHp += 40; p.hp = Math.min(p.hp + 40, p.maxHp); } },
  ],
  rare: [
    { id: 'deaths-touch', name: "Death's Touch",   icon: '💀',  rarity: 'rare', desc: '+15 base damage',                          apply: p => { p.damage += 15; } },
    { id: 'phantom',      name: 'Phantom Strikes', icon: '👁️', rarity: 'rare', desc: '10% chance to hit twice per click',         apply: p => { p.doubleStrike += 0.10; } },
    { id: 'soul-harvest', name: 'Soul Harvest',    icon: '🌑',  rarity: 'rare', desc: 'Kills charge bonus dmg for next monster',   apply: p => { p.soulHarvest = true; } },
    { id: 'crit-mayhem',  name: 'Critical Mayhem', icon: '🌟',  rarity: 'rare', desc: '+5% crit, +0.5× crit multiplier',          critOnly: true,  apply: p => { p.critChance += 0.05; p.critMult += 0.5; } },
    { id: 'midas',        name: 'Midas Hand',      icon: '🏆',  rarity: 'rare', desc: 'All gold rewards permanently ×1.5',        apply: p => { p.goldMult *= 1.5; } },
    { id: 'iron-will',    name: 'Iron Will',       icon: '🛡️',  rarity: 'rare', desc: '+100 max HP, fully restore HP',            apply: p => { p.maxHp += 100; p.hp = p.maxHp; } },
  ],
  legendary: [
    { id: 'void-rift',       name: 'Void Rift',         icon: '🌀', rarity: 'legendary', desc: '+25 damage, +10% crit, +1.0× crit mult',           critOnly: true, apply: p => { p.damage += 25; p.critChance += 0.10; p.critMult += 1.0; } },
    { id: 'fortunes-curse',  name: "Fortune's Curse",   icon: '💰', rarity: 'legendary', desc: 'All gold rewards permanently ×2',                  apply: p => { p.goldMult *= 2; } },
    { id: 'titans-grasp',    name: "Titan's Grasp",     icon: '⚡', rarity: 'legendary', desc: '+40 damage, +150 max HP, fully restored',           apply: p => { p.damage += 40; p.maxHp += 150; p.hp = p.maxHp; } },
    { id: 'dark-ascension',  name: 'Dark Ascension',    icon: '🌑', rarity: 'legendary', desc: '+20 damage, +1.5× crit mult, soul harvest charged', apply: p => { p.damage += 20; p.critMult += 1.5; p.soulHarvest = true; } },
    { id: 'phantom-barrage', name: 'Phantom Barrage',   icon: '👁️', rarity: 'legendary', desc: '+30% chance to hit twice, +10 damage',             apply: p => { p.doubleStrike += 0.30; p.damage += 10; } },
  ],
};

/* ===== FAMILIARS DATA ===== */
const FAMILIARS = {
  ember_wisp: {
    id: 'ember_wisp', element: 'fire', color: '#ff6600',
    icons: ['🔥', '✨', '😈', '🦅'],
    stages: [
      { name: 'Ember Wisp',       dps:  3, interval: 2.0, evolveCost: null, skill: { burnDPS:  2, burnDuration: 3, canCrit: false } },
      { name: 'Flame Sprite',     dps:  6, interval: 1.8, evolveCost: 500,  skill: { burnDPS:  4, burnDuration: 3, canCrit: false } },
      { name: 'Inferno Imp',      dps: 14, interval: 1.5, evolveCost: 2000, skill: { burnDPS:  8, burnDuration: 4, canCrit: false } },
      { name: 'Hellfire Phoenix', dps: 32, interval: 1.2, evolveCost: 4000, skill: { burnDPS: 18, burnDuration: 5, canCrit: true  } },
    ],
  },
  shadow_pup: {
    id: 'shadow_pup', element: 'dark', color: '#9933ff',
    icons: ['🐾', '🐺', '👻', '🌑'],
    stages: [
      { name: 'Shadow Pup',   dps:  2, interval: 2.5, evolveCost: null, skill: { comboDamageMult: 5, comboThreshold: 10, frenzyBonus: 0,  frenzyDuration: 0 } },
      { name: 'Shade Hound',  dps:  4, interval: 2.2, evolveCost: 500,  skill: { comboDamageMult: 5, comboThreshold:  8, frenzyBonus: 0,  frenzyDuration: 0 } },
      { name: 'Phantom Wolf', dps: 10, interval: 1.8, evolveCost: 2000, skill: { comboDamageMult: 5, comboThreshold:  6, frenzyBonus: 0,  frenzyDuration: 0 } },
      { name: 'Void Fenrir',  dps: 22, interval: 1.5, evolveCost: 4000, skill: { comboDamageMult: 5, comboThreshold:  5, frenzyBonus: 15, frenzyDuration: 3 } },
    ],
  },
  crystal_beetle: {
    id: 'crystal_beetle', element: 'earth', color: '#00cccc',
    icons: ['🪲', '💎', '🗿', '⬛'],
    stages: [
      { name: 'Crystal Beetle', dps:  2, interval: 2.0, evolveCost: null, skill: { shredPercent: 2, maxStacks:  5, fractureChance: 0    } },
      { name: 'Gemstone Scarab',dps:  5, interval: 1.8, evolveCost: 500,  skill: { shredPercent: 3, maxStacks:  5, fractureChance: 0    } },
      { name: 'Diamond Golem',  dps: 12, interval: 1.5, evolveCost: 2000, skill: { shredPercent: 4, maxStacks:  8, fractureChance: 0    } },
      { name: 'Obsidian Titan', dps: 28, interval: 1.2, evolveCost: 4000, skill: { shredPercent: 5, maxStacks: 10, fractureChance: 0.20 } },
    ],
  },
  plague_rat: {
    id: 'plague_rat', element: 'poison', color: '#33cc33',
    icons: ['🐀', '🐭', '🧪', '☠️'],
    stages: [
      { name: 'Plague Rat',       dps:  3, interval: 2.0, evolveCost: null, skill: { poisonDPS:  2, poisonDuration: 3, bonusGoldPercent:  5, poisonSpreads: false, freeHealEveryN: 0 } },
      { name: 'Blight Vermin',    dps:  5, interval: 1.8, evolveCost: 500,  skill: { poisonDPS:  3, poisonDuration: 3, bonusGoldPercent: 10, poisonSpreads: false, freeHealEveryN: 0 } },
      { name: 'Pestilence Beast', dps: 11, interval: 1.5, evolveCost: 2000, skill: { poisonDPS:  6, poisonDuration: 4, bonusGoldPercent: 15, poisonSpreads: true,  freeHealEveryN: 0 } },
      { name: 'Contagion Lord',   dps: 24, interval: 1.2, evolveCost: 4000, skill: { poisonDPS: 14, poisonDuration: 5, bonusGoldPercent: 25, poisonSpreads: true,  freeHealEveryN: 5 } },
    ],
  },
  frost_wraith: {
    id: 'frost_wraith', element: 'ice', color: '#66ccff',
    icons: ['❄️', '🌨️', '🧊', '💀'],
    stages: [
      { name: 'Frost Wraith',     dps:  3, interval: 2.0, evolveCost: null, skill: { stacksToFreeze: 5, freezeBurst:  20, stunDuration: 2.0, clickBonus:  50 } },
      { name: 'Ice Phantom',      dps:  6, interval: 1.8, evolveCost: 500,  skill: { stacksToFreeze: 5, freezeBurst:  50, stunDuration: 2.0, clickBonus:  50 } },
      { name: 'Glacial Revenant', dps: 13, interval: 1.5, evolveCost: 2000, skill: { stacksToFreeze: 4, freezeBurst: 120, stunDuration: 2.5, clickBonus:  75 } },
      { name: 'Blizzard Lich',    dps: 30, interval: 1.2, evolveCost: 4000, skill: { stacksToFreeze: 4, freezeBurst: 280, stunDuration: 3.5, clickBonus: 100 } },
    ],
  },
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
    pickedUpgrades: [],

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

    familiars: { owned: {}, activeId: null },
    familiarCombat: {
      attackTimer: 0,
      burns: [],
      dotAccum: 0,
      shatterStacks: 0,
      chillStacks: 0,
      poisonDPS: 0, poisonDuration: 0,
      frozenClickBonus: 0, frozenClickTimer: 0,
      clicksSinceShadowProc: 0,
      frenzyTimer: 0,
      killsForHeal: 0,
    },

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
  petSelect:   $('screen-pet-select'),
  game:        $('screen-game'),
  upgrade:     $('screen-upgrade'),
  shop:        $('screen-shop'),
  armory:      $('screen-armory'),
  familiars:   $('screen-familiars'),
  upgrades:    $('screen-upgrades'),
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
  familiarCards:    $('familiar-cards-grid'),
  familiarGoldNum:  $('familiar-gold-num'),
  familiarDetail:   $('familiar-detail-panel'),
  familiarWidget:   $('familiar-widget'),
  monsterStatus:    $('monster-status-effects'),
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

/* ===== SOUND SYSTEM ===== */
let _audioCtx    = null;
let _masterGain  = null;
let soundEnabled = true;
const MASTER_VOL = 0.28;

function _audio() {
  if (!_audioCtx) {
    _audioCtx    = new (window.AudioContext || window.webkitAudioContext)();
    _masterGain  = _audioCtx.createGain();
    _masterGain.gain.value = MASTER_VOL;
    _masterGain.connect(_audioCtx.destination);
  }
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

function _dst() { return _masterGain; }

function _tone(freq, dur, type = 'sine', vol = 0.25, at = null) {
  const ctx = _audio(); const t = at ?? ctx.currentTime;
  const osc = ctx.createOscillator(), g = ctx.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g); g.connect(_dst());
  osc.start(t); osc.stop(t + dur + 0.02);
}

function _noise(dur, filterFreq, filterType = 'lowpass', vol = 0.25, at = null) {
  const ctx = _audio(); const t = at ?? ctx.currentTime;
  const size = Math.ceil(ctx.sampleRate * dur);
  const buf  = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
  const src  = ctx.createBufferSource();
  src.buffer = buf;
  const filt = ctx.createBiquadFilter();
  filt.type = filterType; filt.frequency.value = filterFreq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filt); filt.connect(g); g.connect(_dst());
  src.start(t); src.stop(t + dur + 0.02);
}

const SFX = {
  hit() {
    if (!soundEnabled) return;
    const ctx = _audio(); const t = ctx.currentTime;
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.07);
    g.gain.setValueAtTime(0.32, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    osc.connect(g); g.connect(_dst());
    osc.start(t); osc.stop(t + 0.09);
  },

  crit() {
    if (!soundEnabled) return;
    const ctx = _audio(); const t = ctx.currentTime;
    _noise(0.04, 3500, 'highpass', 0.38, t);
    _tone(900, 0.14, 'sine', 0.2, t + 0.02);
    _tone(1350, 0.1, 'sine', 0.12, t + 0.04);
  },

  kill() {
    if (!soundEnabled) return;
    const ctx = _audio(); const t = ctx.currentTime;
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.14);
    g.gain.setValueAtTime(0.38, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    osc.connect(g); g.connect(_dst());
    osc.start(t); osc.stop(t + 0.15);
    _tone(660, 0.22, 'sine', 0.14, t + 0.06);
  },

  levelComplete() {
    if (!soundEnabled) return;
    const ctx = _audio(); const t = ctx.currentTime;
    [523, 659, 784, 1047].forEach((f, i) => _tone(f, 0.28, 'sine', 0.22, t + i * 0.13));
  },

  boss() {
    if (!soundEnabled) return;
    const ctx = _audio(); const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain(), g = ctx.createGain();
    osc.type = 'sawtooth'; osc.frequency.value = 55;
    lfo.type = 'sine';     lfo.frequency.value = 5;
    lfoG.gain.value = 0.12;
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.3, t + 0.4);
    g.gain.linearRampToValueAtTime(0.001, t + 2.0);
    lfo.connect(lfoG); lfoG.connect(g.gain);
    osc.connect(g); g.connect(_dst());
    lfo.start(t); osc.start(t);
    lfo.stop(t + 2.1); osc.stop(t + 2.1);
    _tone(110, 1.5, 'sine', 0.12, t + 0.1);
  },

  buy() {
    if (!soundEnabled) return;
    const ctx = _audio(); const t = ctx.currentTime;
    _tone(1320, 0.08, 'sine', 0.22, t);
    _tone(1760, 0.12, 'sine', 0.18, t + 0.07);
  },

  evolve() {
    if (!soundEnabled) return;
    const ctx = _audio(); const t = ctx.currentTime;
    [440, 554, 659, 880, 1108, 1320].forEach((f, i) =>
      _tone(f, 0.2, 'sine', 0.16, t + i * 0.07));
  },

  legendary() {
    if (!soundEnabled) return;
    const ctx = _audio(); const t = ctx.currentTime;
    // Triumphant fanfare — rising arpeggio + sustained chord
    [523, 659, 784, 1047, 1319, 1568].forEach((f, i) =>
      _tone(f, 0.35, 'sine', 0.22, t + i * 0.08));
    _tone(523, 0.9, 'sine', 0.12, t + 0.55);
    _tone(659, 0.9, 'sine', 0.10, t + 0.55);
    _tone(784, 0.9, 'sine', 0.09, t + 0.55);
    _noise(0.15, 2000, 'bandpass', 0.08, t + 0.1);
  },

  gameOver() {
    if (!soundEnabled) return;
    const ctx = _audio(); const t = ctx.currentTime;
    [440, 392, 349, 294, 220].forEach((f, i) =>
      _tone(f, 0.4, 'sawtooth', 0.18, t + i * 0.2));
  },

  freeze() {
    if (!soundEnabled) return;
    const ctx = _audio(); const t = ctx.currentTime;
    _noise(0.15, 5000, 'highpass', 0.32, t);
    [2093, 2637, 3136].forEach((f, i) => _tone(f, 0.14, 'sine', 0.1, t + i * 0.045));
  },

  shadowCombo() {
    if (!soundEnabled) return;
    const ctx = _audio(); const t = ctx.currentTime;
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(55, t + 0.22);
    g.gain.setValueAtTime(0.28, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(g); g.connect(_dst());
    osc.start(t); osc.stop(t + 0.24);
  },

  familiarFire() {
    if (!soundEnabled) return;
    const ctx = _audio(); const t = ctx.currentTime;
    _noise(0.1, 900, 'bandpass', 0.18, t);
    _tone(220, 0.09, 'sawtooth', 0.09, t);
  },

  familiarDark() {
    if (!soundEnabled) return;
    _tone(75, 0.13, 'square', 0.22);
  },

  familiarEarth() {
    if (!soundEnabled) return;
    const ctx = _audio(); const t = ctx.currentTime;
    _noise(0.06, 350, 'lowpass', 0.28, t);
    _tone(160, 0.08, 'triangle', 0.18, t);
  },

  familiarPoison() {
    if (!soundEnabled) return;
    const ctx = _audio(); const t = ctx.currentTime;
    _tone(190, 0.14, 'sine', 0.13, t);
    _tone(285, 0.1, 'sine', 0.09, t + 0.06);
  },

  familiarIce() {
    if (!soundEnabled) return;
    const ctx = _audio(); const t = ctx.currentTime;
    _tone(1760, 0.07, 'sine', 0.11, t);
    _tone(2349, 0.06, 'sine', 0.09, t + 0.04);
  },
};

const FAM_SFX = {
  ember_wisp:     'familiarFire',
  shadow_pup:     'familiarDark',
  crystal_beetle: 'familiarEarth',
  plague_rat:     'familiarPoison',
  frost_wraith:   'familiarIce',
};

function toggleSound() {
  soundEnabled = !soundEnabled;
  if (_masterGain) _masterGain.gain.value = soundEnabled ? MASTER_VOL : 0;
  const btn = $('btn-sound');
  if (btn) btn.textContent = soundEnabled ? '🔊' : '🔇';
}

/* ===== FAMILIAR HELPERS ===== */
function getActiveFamiliarDef() {
  return state.familiars.activeId ? FAMILIARS[state.familiars.activeId] : null;
}

function getActiveFamiliarStageData() {
  const id = state.familiars.activeId;
  if (!id) return null;
  const owned = state.familiars.owned[id];
  if (!owned) return null;
  return FAMILIARS[id].stages[owned.stage - 1];
}

function getDamageMultiplier() {
  if (state.familiars.activeId !== 'crystal_beetle') return 1;
  const sd = getActiveFamiliarStageData();
  if (!sd) return 1;
  return 1 + (state.familiarCombat.shatterStacks * sd.skill.shredPercent / 100);
}

function resetFamiliarCombat() {
  const prevShatterStacks = state.familiarCombat.shatterStacks;
  const prevKillsForHeal  = state.familiarCombat.killsForHeal;
  const hadPoison         = state.familiarCombat.poisonDuration > 0;

  state.familiarCombat = {
    attackTimer: 0,
    burns: [],
    dotAccum: 0,
    shatterStacks: 0,
    chillStacks: 0,
    poisonDPS: 0, poisonDuration: 0,
    frozenClickBonus: 0, frozenClickTimer: 0,
    clicksSinceShadowProc: 0,
    frenzyTimer: 0,
    killsForHeal: prevKillsForHeal,
  };

  // Crystal Beetle: shatter stacks persist between monsters
  if (state.familiars.activeId === 'crystal_beetle') {
    state.familiarCombat.shatterStacks = prevShatterStacks;
  }

  // Plague Rat stage 3+: poison spreads to next monster
  if (state.familiars.activeId === 'plague_rat' && hadPoison) {
    const sd = getActiveFamiliarStageData();
    if (sd && sd.skill.poisonSpreads) {
      state.familiarCombat.poisonDPS      = sd.skill.poisonDPS;
      state.familiarCombat.poisonDuration = sd.skill.poisonDuration;
    }
  }

  updateStatusIndicators();
}

function updateStatusIndicators() {
  if (!el.monsterStatus) return;
  const fc = state.familiarCombat;
  const parts = [];
  if (fc.burns && fc.burns.length > 0) parts.push(`<span class="status-icon status-fire">🔥×${fc.burns.length}</span>`);
  if (fc.poisonDuration > 0) parts.push(`<span class="status-icon status-poison">☠️</span>`);
  if (fc.shatterStacks > 0)  parts.push(`<span class="status-icon status-shatter">💎×${fc.shatterStacks}</span>`);
  if (fc.chillStacks > 0)    parts.push(`<span class="status-icon status-chill">❄️×${fc.chillStacks}</span>`);
  if (fc.frozenClickTimer > 0) parts.push(`<span class="status-icon status-frozen">🧊</span>`);
  el.monsterStatus.innerHTML = parts.join('');
}

/* ===== FAMILIAR COMBAT ===== */
function updateFamiliar(delta) {
  if (!state.familiars.activeId || state.playerClickLocked) return;
  const sd = getActiveFamiliarStageData();
  if (!sd) return;

  const fc = state.familiarCombat;
  fc.attackTimer += delta;
  if (fc.attackTimer >= sd.interval) {
    fc.attackTimer -= sd.interval;
    if (state.monster.hp > 0) familiarAutoAttack();
  }

  updateDOTEffects(delta);

  if (fc.frenzyTimer > 0) {
    fc.frenzyTimer = Math.max(0, fc.frenzyTimer - delta);
  }

  if (fc.frozenClickTimer > 0) {
    fc.frozenClickTimer = Math.max(0, fc.frozenClickTimer - delta);
    if (fc.frozenClickTimer <= 0) {
      fc.frozenClickBonus = 0;
      // Frost Wraith stun ended — restart monster attack
      if (state.monster.hp > 0 && !state.playerClickLocked && !state.monsterAttackTimer) {
        startMonsterAttackTimer();
      }
    }
  }
}

function familiarAutoAttack() {
  const def = getActiveFamiliarDef();
  const sd  = getActiveFamiliarStageData();
  if (!def || !sd || state.monster.hp <= 0 || state.playerClickLocked) return;

  let dmg = sd.dps;

  // Crystal Beetle: add stack first, then compute shred on this attack
  if (def.id === 'crystal_beetle') {
    const fc = state.familiarCombat;
    if (fc.shatterStacks < sd.skill.maxStacks) fc.shatterStacks++;
    dmg = Math.floor(dmg * getDamageMultiplier());
  }

  spawnFamiliarProjectile(def.color);
  const _sfxKey = FAM_SFX[def.id]; if (_sfxKey && SFX[_sfxKey]) SFX[_sfxKey]();
  applyFamiliarSkill(def, sd);

  state.monster.hp = Math.max(0, state.monster.hp - dmg);
  spawnFamiliarDamageNumber(dmg, def.color);
  updateHPBar();
  updateStatusIndicators();

  if (state.monster.hp <= 0 && !state.playerClickLocked) {
    state.playerClickLocked = true;
    killMonster().then(() => { state.playerClickLocked = false; });
  }
}

function applyFamiliarSkill(def, sd) {
  const fc = state.familiarCombat;
  const skill = sd.skill;

  if (def.id === 'ember_wisp') {
    // Stacking burns — each attack pushes a fresh burn layer
    fc.burns.push({ dps: skill.burnDPS, remaining: skill.burnDuration, canCrit: skill.canCrit });

  } else if (def.id === 'plague_rat') {
    fc.poisonDPS = skill.poisonDPS;
    fc.poisonDuration = skill.poisonDuration;

  } else if (def.id === 'frost_wraith') {
    fc.chillStacks++;
    updateStatusIndicators();
    if (fc.chillStacks >= skill.stacksToFreeze) {
      const burst = skill.freezeBurst;
      state.monster.hp = Math.max(0, state.monster.hp - burst);
      spawnFamiliarDamageNumber(burst, def.color, true);
      SFX.freeze();
      showFreezeEffect();
      fc.chillStacks = 0;
      // Stun monster and apply click bonus during window
      fc.frozenClickBonus = skill.clickBonus;
      fc.frozenClickTimer = skill.stunDuration;
      stopMonsterAttackTimer();
      updateHPBar();
      updateStatusIndicators();
      if (state.monster.hp <= 0 && !state.playerClickLocked) {
        state.playerClickLocked = true;
        killMonster().then(() => { state.playerClickLocked = false; });
      }
    }
  }
}

function updateDOTEffects(delta) {
  const fc = state.familiarCombat;
  if (!state.monster || state.monster.hp <= 0) return;

  fc.dotAccum += delta;
  while (fc.dotAccum >= 1.0 && state.monster.hp > 0) {
    fc.dotAccum -= 1.0;

    // Ember Wisp: tick all stacked burns
    if (fc.burns.length > 0) {
      const a = getArmorStats();
      for (let i = fc.burns.length - 1; i >= 0; i--) {
        const burn = fc.burns[i];
        if (burn.remaining > 0 && state.monster.hp > 0) {
          let burnDmg = burn.dps;
          if (burn.canCrit && Math.random() < Math.min(0.5, state.player.critChance + a.critBonus)) {
            burnDmg = Math.floor(burnDmg * (state.player.critMult + a.critMultBonus));
          }
          state.monster.hp = Math.max(0, state.monster.hp - burnDmg);
          spawnFamiliarDamageNumber(burnDmg, '#ff6600');
          burn.remaining--;
          updateHPBar();
          if (state.monster.hp <= 0 && !state.playerClickLocked) {
            state.playerClickLocked = true;
            killMonster().then(() => { state.playerClickLocked = false; });
            return;
          }
        }
        if (burn.remaining <= 0) fc.burns.splice(i, 1);
      }
      updateStatusIndicators();
    }

    if (fc.poisonDuration > 0 && fc.poisonDPS > 0 && state.monster.hp > 0) {
      state.monster.hp = Math.max(0, state.monster.hp - fc.poisonDPS);
      spawnFamiliarDamageNumber(fc.poisonDPS, '#33cc33');
      fc.poisonDuration--;
      updateHPBar();
      updateStatusIndicators();
      if (state.monster.hp <= 0 && !state.playerClickLocked) {
        state.playerClickLocked = true;
        killMonster().then(() => { state.playerClickLocked = false; });
        return;
      }
    }
  }
}

function showFreezeEffect() {
  el.monsterDisplay.classList.add('monster-frozen');
  setTimeout(() => el.monsterDisplay.classList.remove('monster-frozen'), 700);
}

function spawnFamiliarProjectile(color) {
  const famEl = el.familiarWidget;
  if (!famEl || !famEl.firstElementChild) return;
  const wrapRect = el.gameWrap.getBoundingClientRect();
  const famRect  = famEl.getBoundingClientRect();
  const monRect  = el.monsterWrap.getBoundingClientRect();

  const startX = famRect.left + famRect.width / 2 - wrapRect.left;
  const startY = famRect.top  + famRect.height / 2 - wrapRect.top;
  const endX   = monRect.left + monRect.width  / 2 - wrapRect.left;
  const endY   = monRect.top  + monRect.height / 2 - wrapRect.top;

  const proj = document.createElement('div');
  proj.className = 'familiar-projectile';
  proj.style.cssText = `left:${startX}px;top:${startY}px;background:${color};box-shadow:0 0 6px ${color};--pdx:${endX - startX}px;--pdy:${endY - startY}px;`;
  el.damageLayer.appendChild(proj);
  setTimeout(() => { if (proj.parentNode) proj.parentNode.removeChild(proj); }, 380);
}

function spawnFamiliarDamageNumber(amount, color, isBurst) {
  const rect     = el.monsterWrap.getBoundingClientRect();
  const wrapRect = el.gameWrap.getBoundingClientRect();
  const x = rect.left + rect.width / 2 - wrapRect.left + (Math.random() - 0.5) * 60;
  const y = rect.top  + rect.height * 0.35 - wrapRect.top;

  const div = document.createElement('div');
  div.className = 'damage-number familiar-dmg' + (isBurst ? ' familiar-burst' : '');
  div.style.color = color;
  div.style.left  = x + 'px';
  div.style.top   = y + 'px';
  div.textContent = (isBurst ? '❄ ' : '') + formatNum(amount);
  el.damageLayer.appendChild(div);
  setTimeout(() => { if (div.parentNode) div.parentNode.removeChild(div); }, 850);
}

/* ===== FAMILIAR WIDGET (game screen) ===== */
function renderFamiliarWidget() {
  if (!el.familiarWidget) return;
  const id = state.familiars.activeId;
  if (!id) {
    el.familiarWidget.className = 'familiar-widget-empty';
    el.familiarWidget.innerHTML = `<span class="no-fam-icon">🐾</span><span class="no-fam-text">No Familiar</span>`;
    return;
  }
  const def = FAMILIARS[id];
  const owned = state.familiars.owned[id];
  const sd  = def.stages[owned.stage - 1];
  const icon = def.icons[owned.stage - 1];

  el.familiarWidget.className = `familiar-widget-active fam-elem-${def.element}`;
  el.familiarWidget.innerHTML = `
    <div class="fam-sprite-wrap">
      <span class="fam-sprite" style="color:${def.color};text-shadow:0 0 16px ${def.color},0 0 32px ${def.color}60;">${icon}</span>
    </div>
    <span class="fam-name-label">${sd.name}</span>
  `;
}

/* ===== FAMILIAR SHOP ===== */
function getFamiliarSkillDesc(def, stageIdx) {
  const skill = def.stages[stageIdx].skill;
  switch (def.id) {
    case 'ember_wisp':
      return `🔥 Stacking Ignite: +${skill.burnDPS}/s for ${skill.burnDuration}s per attack${skill.canCrit ? ' · Burns can crit!' : ''}`;
    case 'shadow_pup': {
      const frenzy = skill.frenzyDuration > 0 ? ` · Combo triggers Frenzy: +${skill.frenzyBonus}% dmg for ${skill.frenzyDuration}s` : '';
      return `🐾 Shadow Combo: every ${skill.comboThreshold} clicks → ${skill.comboDamageMult}× burst${frenzy}`;
    }
    case 'crystal_beetle': {
      const fracture = skill.fractureChance > 0 ? ` · At max stacks: ${skill.fractureChance * 100}% Fracture (3× dmg)` : '';
      return `💎 Shatter: +${skill.shredPercent}%/stack (max ${skill.maxStacks}) · Stacks persist${fracture}`;
    }
    case 'plague_rat': {
      const spread = skill.poisonSpreads ? ' · Spreads on kill' : '';
      const heal   = skill.freeHealEveryN > 0 ? ` · Every ${skill.freeHealEveryN} kills: +50 HP` : '';
      return `☠️ Toxic: ${skill.poisonDPS}/s · +${skill.bonusGoldPercent}% gold${spread}${heal}`;
    }
    case 'frost_wraith':
      return `❄️ Freeze at ${skill.stacksToFreeze} stacks → ${skill.freezeBurst} burst · Stuns ${skill.stunDuration}s · +${skill.clickBonus}% click dmg`;
    default: return '';
  }
}

function renderFamiliarShop() {
  el.familiarGoldNum.textContent = formatNum(state.gold);
  el.familiarCards.innerHTML = '';
  el.familiarDetail.classList.add('hidden');

  Object.values(FAMILIARS).forEach(def => {
    const owned     = state.familiars.owned[def.id];
    const isEquipped = state.familiars.activeId === def.id;
    const stage     = owned ? owned.stage : 0;
    const sd        = owned ? def.stages[stage - 1] : null;
    const nextSd    = (owned && stage < def.stages.length) ? def.stages[stage] : null;

    const card = document.createElement('div');
    card.className = 'fam-card' + (isEquipped ? ' fam-equipped' : '') + (!owned ? ' fam-locked' : '');

    const icon = owned ? def.icons[stage - 1] : '❓';
    const stageName = sd ? sd.name : def.stages[0].name;

    let actionHtml = '';
    if (!owned) {
      actionHtml = `<span class="fam-locked-badge">Select at game start</span>`;
    } else {
      if (!isEquipped) {
        actionHtml = `<button class="fam-btn fam-equip-btn" data-action="equip" data-id="${def.id}">Equip</button>`;
      } else {
        actionHtml = `<span class="fam-active-badge">ACTIVE</span>`;
      }
      if (nextSd) {
        const canEvo = state.gold >= nextSd.evolveCost;
        actionHtml += `<button class="fam-btn fam-evolve ${canEvo ? '' : 'fam-cant'}" data-action="evolve" data-id="${def.id}">⬆ ${formatNum(nextSd.evolveCost)}g</button>`;
      } else {
        actionHtml += `<span class="fam-max-badge">MAX</span>`;
      }
    }

    card.innerHTML = `
      <div class="fam-card-icon" style="color:${def.color};text-shadow:0 0 6px ${def.color}60;${!owned ? 'opacity:0.4;' : ''}">${icon}</div>
      <div class="fam-card-name">${stageName}</div>
      <div class="fam-card-actions">${actionHtml}</div>
    `;

    card.addEventListener('click', e => {
      if (!e.target.closest('.fam-btn')) showFamiliarDetail(def.id);
    });
    card.addEventListener('touchstart', e => {
      if (!e.target.closest('.fam-btn')) { e.preventDefault(); showFamiliarDetail(def.id); }
    }, { passive: false });

    el.familiarCards.appendChild(card);
  });

  el.familiarCards.querySelectorAll('.fam-btn').forEach(btn => {
    const fire = () => {
      const { action, id } = btn.dataset;
      if (action === 'equip')  onEquipFamiliar(id);
      if (action === 'evolve') onEvolveFamiliar(id);
    };
    btn.addEventListener('click', e => { e.stopPropagation(); fire(); });
    btn.addEventListener('touchstart', e => { e.preventDefault(); e.stopPropagation(); fire(); }, { passive: false });
  });
}

function showFamiliarDetail(id) {
  const def   = FAMILIARS[id];
  const owned = state.familiars.owned[id];
  const stage = owned ? owned.stage : 0;
  const sd    = owned ? def.stages[stage - 1] : null;
  const nextSd = (owned && stage < def.stages.length) ? def.stages[stage] : null;

  let html = `<div class="fam-detail-name" style="color:${def.color};">${sd ? sd.name : def.stages[0].name}</div>`;
  if (!owned) {
    html += `<div class="fam-detail-row" style="opacity:0.6;">Selected at game start</div>`;
    html += `<div class="fam-detail-row">${getFamiliarSkillDesc(def, 0)}</div>`;
  } else {
    html += `<div class="fam-detail-row">Auto: ${sd.dps} dmg / ${sd.interval}s · Stage ${stage}/${def.stages.length}</div>`;
    html += `<div class="fam-detail-row">${getFamiliarSkillDesc(def, stage - 1)}</div>`;
    if (nextSd) {
      html += `<div class="fam-detail-next">→ ${nextSd.name}: ${nextSd.dps} dmg / ${nextSd.interval}s · 🪙 ${formatNum(nextSd.evolveCost)}</div>`;
    } else {
      html += `<div class="fam-detail-next">✨ MAX STAGE</div>`;
    }
  }
  el.familiarDetail.innerHTML = html;
  el.familiarDetail.classList.remove('hidden');
}

function onEquipFamiliar(id) {
  state.familiars.activeId = id;
  resetFamiliarCombat();
  renderFamiliarShop();
  renderFamiliarWidget();
}

function onEvolveFamiliar(id) {
  const owned = state.familiars.owned[id];
  if (!owned) return;
  const nextSd = FAMILIARS[id].stages[owned.stage];
  if (!nextSd || !nextSd.evolveCost || state.gold < nextSd.evolveCost) return;
  SFX.evolve();
  state.gold -= nextSd.evolveCost;
  owned.stage++;
  if (state.familiars.activeId === id) {
    el.familiarWidget.classList.add('fam-evolving');
    setTimeout(() => el.familiarWidget.classList.remove('fam-evolving'), 800);
    renderFamiliarWidget();
  }
  renderFamiliarShop();
  updateHUD();
}

function openFamiliarShop() {
  renderFamiliarShop();
  showScreen('familiars');
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

let lastRafTime = 0;
function startParticleLoop() {
  if (particleRaf) cancelAnimationFrame(particleRaf);
  lastRafTime = 0;
  function loop(ts) {
    const delta = lastRafTime ? Math.min((ts - lastRafTime) / 1000, 0.1) : 0;
    lastRafTime = ts;
    drawParticles();
    if (state.screen === 'game') updateFamiliar(delta);
    particleRaf = requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
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
  SFX.boss();
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
  // Gentler exponent so L100 ≈ what L40 used to feel like
  const base = Math.floor(40 * Math.pow(1.065, level));
  return isBoss ? base * 4 : base;
}

function calcGoldReward(level, isBoss) {
  // Slower gold curve so buying everything takes until ~level 80–90
  let g = 1 + Math.floor(level * 0.25);
  if (isBoss) g *= 6;
  g += state.player.bonusGold;
  return Math.floor(g * state.player.goldMult);
}

function calcKillsRequired() {
  // More monsters per level at higher tiers — levels feel meatier
  if (state.level >= 70) return 4;
  if (state.level >= 40) return 3;
  if (state.level >= 20) return 2;
  return 1;
}

function calcMonsterDamage(level, isBoss) {
  // Lower base and gentler exponent — survivable through level 100
  const base = Math.floor(2 * Math.pow(1.032, level));
  return isBoss ? Math.floor(base * 1.3) : base;
}

function calcMonsterAttackInterval(level, isBoss) {
  // Reaches max speed at level 100 rather than level 43
  const ms = Math.max(850, 2400 - level * 16);
  const base = isBoss ? Math.max(950, ms - 150) : ms;
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
  SFX.gameOver();
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

  resetFamiliarCombat();

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

  // Shadow Pup stage 4: frenzy buff after shadow combo proc
  if (state.familiars.activeId === 'shadow_pup') {
    const sd = getActiveFamiliarStageData();
    const fc2 = state.familiarCombat;
    if (sd && sd.skill.frenzyBonus > 0 && fc2.frenzyTimer > 0) {
      dmg = Math.floor(dmg * (1 + sd.skill.frenzyBonus / 100));
    }
  }

  // Crystal Beetle: shred multiplier applies to click damage too
  dmg = Math.floor(dmg * getDamageMultiplier());

  // Crystal Beetle stage 4: Fracture Strike — 20% chance at max stacks for 3× damage
  if (state.familiars.activeId === 'crystal_beetle') {
    const sd = getActiveFamiliarStageData();
    const fc2 = state.familiarCombat;
    if (sd && sd.skill.fractureChance > 0 && fc2.shatterStacks >= sd.skill.maxStacks && Math.random() < sd.skill.fractureChance) {
      dmg *= 3;
    }
  }

  // Frost Wraith: click bonus during freeze stun window
  const fc = state.familiarCombat;
  if (fc.frozenClickBonus > 0 && fc.frozenClickTimer > 0) {
    dmg = Math.floor(dmg * (1 + fc.frozenClickBonus / 100));
  }

  // Phantom Strikes
  let extraHit = false;
  if (state.player.doubleStrike > 0 && Math.random() < state.player.doubleStrike) {
    extraHit = true;
  }

  return { dmg, isCrit, extraHit };
}

/* ===== KILL MONSTER ===== */
async function killMonster() {
  SFX.kill();
  stopMonsterAttackTimer();
  state.kills++;

  // Plague Rat: gold bonus on kill
  let goldEarned = state.monster.goldReward;
  if (state.familiars.activeId === 'plague_rat') {
    const sd = getActiveFamiliarStageData();
    if (sd) {
      const bonusPct = sd.skill.bonusGoldPercent;
      if (bonusPct > 0) goldEarned = Math.floor(goldEarned * (1 + bonusPct / 100));
    }
  }

  state.gold += goldEarned;
  state.stats.totalKills++;
  state.stats.totalGold += goldEarned;

  // Plague Rat stage 4: every N kills restore 50 HP (Plague Tribute)
  if (state.familiars.activeId === 'plague_rat') {
    const sd = getActiveFamiliarStageData();
    if (sd && sd.skill.freeHealEveryN > 0) {
      state.familiarCombat.killsForHeal++;
      if (state.familiarCombat.killsForHeal >= sd.skill.freeHealEveryN) {
        state.familiarCombat.killsForHeal = 0;
        state.player.hp = Math.min(effectiveMaxHp(), state.player.hp + 50);
        updatePlayerHPBar();
      }
    }
  }

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

  resetFamiliarCombat();

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
  if (isCrit) { SFX.crit(); doScreenShake(); } else { SFX.hit(); }

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

  // Shadow Pup: every N clicks triggers a Shadow Combo burst
  if (state.familiars.activeId === 'shadow_pup') {
    const sd = getActiveFamiliarStageData();
    if (sd && state.monster.hp > 0) {
      state.familiarCombat.clicksSinceShadowProc++;
      if (state.familiarCombat.clicksSinceShadowProc >= sd.skill.comboThreshold) {
        state.familiarCombat.clicksSinceShadowProc = 0;
        const comboDmg = Math.floor(sd.dps * sd.skill.comboDamageMult);
        state.monster.hp = Math.max(0, state.monster.hp - comboDmg);
        SFX.shadowCombo();
        spawnFamiliarDamageNumber(comboDmg, '#9933ff', true);
        updateHPBar();
        if (sd.skill.frenzyDuration > 0) {
          state.familiarCombat.frenzyTimer = sd.skill.frenzyDuration;
        }
        if (state.monster.hp <= 0 && !state.playerClickLocked) {
          state.playerClickLocked = true;
          killMonster().then(() => { state.playerClickLocked = false; });
        }
      }
    }
  }

  if (state.monster.hp <= 0) {
    state.playerClickLocked = true;
    await killMonster();
    state.playerClickLocked = false;
  }
}

/* ===== LEVEL COMPLETE ===== */
async function levelComplete() {
  SFX.levelComplete();
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
  if (r < 0.62) return 'common';
  if (r < 0.89) return 'uncommon';
  if (r < 0.99) return 'rare';
  return 'legendary';
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
  if (upgrade.rarity === 'legendary') SFX.legendary(); else SFX.evolve();
  upgrade.apply(state.player);
  state.pickedUpgrades.push({ icon: upgrade.icon, name: upgrade.name, rarity: upgrade.rarity, desc: upgrade.desc });

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
  renderFamiliarWidget();

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
  SFX.buy();
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

function openUpgradesScreen() {
  const list = $('upgrades-list');
  list.innerHTML = '';
  const p = state.player;
  const armor = getArmorStats();

  const stats = [
    { label: 'Base Damage',      value: `${p.damage + armor.dmgBonus}` },
    { label: 'Crit Chance',      value: `${Math.round(p.critChance * 100)}%` },
    { label: 'Crit Multiplier',  value: `${p.critMult.toFixed(1)}×` },
    { label: 'Double Strike',    value: p.doubleStrike > 0 ? `${Math.round(p.doubleStrike * 100)}%` : null },
    { label: 'Bonus Gold/Kill',  value: p.bonusGold > 0 ? `+${p.bonusGold}` : null },
    { label: 'Gold Multiplier',  value: p.goldMult > 1 ? `×${p.goldMult}` : null },
    { label: 'Max HP',           value: `${p.maxHp}` },
    { label: 'Damage Reduction', value: armor.damageReduction > 0 ? `-${armor.damageReduction}` : null },
    { label: 'Block',            value: armor.block > 0 ? `${armor.block}` : null },
    { label: 'Soul Harvest',     value: p.soulHarvest ? 'Active' : null },
    { label: 'Upgrades Taken',   value: `${state.pickedUpgrades.length}` },
  ];

  if (state.pickedUpgrades.length === 0) {
    list.innerHTML = '<p style="opacity:0.5;text-align:center;">No upgrades yet.</p>';
  } else {
    stats.filter(s => s.value !== null).forEach(s => {
      const div = document.createElement('div');
      div.className = 'upgrade-summary-row';
      div.innerHTML = `<span class="upgrade-summary-label">${s.label}</span><span class="upgrade-summary-value">${s.value}</span>`;
      list.appendChild(div);
    });
  }
  showScreen('upgrades');
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

/* ===== PET SELECTION SCREEN ===== */
function showPetSelectScreen() {
  const grid = $('pet-select-grid');
  grid.innerHTML = '';

  Object.values(FAMILIARS).forEach(def => {
    const stage0 = def.stages[0];
    const card = document.createElement('div');
    card.className = `pet-select-card fam-elem-${def.element}`;
    card.innerHTML = `
      <div class="pet-select-sprite" style="color:${def.color};text-shadow:0 0 14px ${def.color},0 0 28px ${def.color}60;">${def.icons[0]}</div>
      <div class="pet-select-name" style="color:${def.color};">${stage0.name}</div>
      <div class="pet-select-skill">${getFamiliarSkillDesc(def, 0)}</div>
      <button class="btn-primary pet-select-btn" data-id="${def.id}">Choose</button>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('.pet-select-btn').forEach(btn => {
    const fire = () => {
      const id = btn.dataset.id;
      state.familiars.owned[id] = { stage: 1 };
      state.familiars.activeId  = id;
      startLevel(1);
    };
    btn.addEventListener('click', fire);
    btn.addEventListener('touchstart', e => { e.preventDefault(); fire(); }, { passive: false });
  });

  showScreen('petSelect');
}

/* ===== EVENT SETUP ===== */
function setupEvents() {
  // Start button — validate name first, then show pet selection
  $('btn-start').addEventListener('click', () => {
    const name = el.nameInput.value.trim();
    if (!name) {
      el.nameError.classList.remove('hidden');
      el.nameInput.focus();
      return;
    }
    el.nameError.classList.add('hidden');
    state = freshState();
    state.playerName = name;
    showPetSelectScreen();
  });

  // Name input — clear error on typing, start on Enter
  el.nameInput.addEventListener('input', () => {
    if (el.nameInput.value.trim()) el.nameError.classList.add('hidden');
  });
  el.nameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') $('btn-start').click();
  });

  // Sound toggle
  $('btn-sound').addEventListener('click', toggleSound);

  // Title leaderboard button
  $('btn-title-leaderboard').addEventListener('click', () => showLeaderboardScreen('title'));

  // Retire button — stop attack timer, save score, show stats
  $('btn-retire').addEventListener('click', () => {
    stopMonsterAttackTimer();
    showStatsScreen();
  });

  // Upgrades button
  $('btn-upgrades').addEventListener('click', openUpgradesScreen);

  // Upgrades close
  $('btn-upgrades-close').addEventListener('click', () => showScreen('game'));

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

  // Familiars button
  $('btn-familiars').addEventListener('click', openFamiliarShop);

  // Familiars close
  $('btn-familiars-close').addEventListener('click', () => showScreen('game'));

  // Familiar widget — tap to open shop
  el.familiarWidget.addEventListener('click', openFamiliarShop);

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
