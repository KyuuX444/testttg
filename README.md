<div align="center">
  <img src="https://files.catbox.moe/r8uumm.jpg" width="100" height="100" style="border-radius:50%;margin-bottom:16px" />
  <h1>🤖 Kyu Bot</h1>
  <p><b>WhatsApp Bot Multi-Device — Modular, Hot-Reload, Dual Plugin Format</b></p>

  <p>
    <img src="https://img.shields.io/badge/v2.0.0-6C63FF?style=flat-square&label=Version" />
    <img src="https://img.shields.io/badge/%3E%3D18-3C873A?style=flat-square&logo=nodedotjs&logoColor=white&label=Node.js" />
    <img src="https://img.shields.io/badge/Baileys-6.7.9-25D366?style=flat-square&logo=whatsapp&logoColor=white" />
    <img src="https://img.shields.io/badge/46%2B%20Commands-FF6B6B?style=flat-square&label=Plugins" />
    <img src="https://img.shields.io/badge/ES%20Modules-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
  </p>

  <p>
    <a href="https://kyuuimut.my.id">🌐 Website</a> ·
    <a href="https://wa.me/6285881530884">💬 WhatsApp</a> ·
    <a href="https://t.me/ryuukaaaaaaa">✈️ Telegram</a>
  </p>
</div>

---

## 📌 Daftar Isi

- [Fitur](#-fitur)
- [Requirements](#-requirements)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Struktur Proyek](#-struktur-proyek)
- [System Plugin](#-system-plugin)
- [Dual Plugin Format](#-dual-plugin-format)
- [Handler Properties](#-handler-properties)
- [Daftar Command](#-daftar-command)
- [ctx API](#-ctx-api)
- [Database Schema](#-database-schema)
- [Cara Buat Plugin](#-cara-buat-plugin)
- [Hot-Reload](#-hot-reload)

---

## ✨ Fitur

| Fitur | Keterangan |
|---|---|
| 🔌 **Dual Plugin Format** | Support format lama (object) dan baru (handler function) secara bersamaan |
| 🔥 **Hot-Reload** | Plugin otomatis reload tanpa perlu restart bot |
| 🛡️ **Guard System** | Proteksi limit / register / owner / group / private per command |
| 📱 **Multi-Device** | Koneksi via pairing code atau QR code |
| 🗃️ **JSON Database** | Auto read/write, zero config, langsung pakai |
| 🎯 **Regex Command** | Trigger command pakai pattern regex yang fleksibel |
| ⚡ **Before Handler** | Intercept setiap pesan masuk sebelum matching command |
| 🧩 **8 Kategori** | 46+ command siap pakai dari downloader sampai stalker |

---

## 📋 Requirements

| Requirement | Versi | Keterangan |
|---|---|---|
| **Node.js** | `>= 18.0.0` | Wajib, ES Module native |
| **npm** | `>= 8.0.0` | Atau yarn / pnpm |
| **ffmpeg** | Latest | Untuk command `ytmp3` dan `ytmp4` |
| **RAM** | `>= 512 MB` | Rekomendasi 1 GB+ untuk VPS |

---

## 📦 Instalasi

```bash
# Clone repository
git clone https://github.com/kyudev/kyu-bot.git
cd kyu-bot

# Install dependencies
npm install

# Jalankan bot
npm start
```

Saat pertama kali jalan, bot akan menanyakan mode koneksi:

```
Gunakan mode pairing (kode)? [yes/no]:
```

| Jawaban | Mode | Cocok untuk |
|---|---|---|
| `yes` | Pairing code — masukkan nomor WA | VPS / server |
| `no` | QR code — scan di terminal | Lokal / laptop |

```bash
# Mode development (auto-restart saat file berubah)
npm run dev
```

---

## ⚙️ Konfigurasi

Edit file `core/config.js`:

```js
global.bot = {
  name: 'Kyu Bot',           // Nama bot
  versions: '2.0.0',

  author: {
    name: 'Ky Dev',
    number: '6285881530884', // Nomor owner (tanpa + atau spasi)
  },

  media: {
    banner1: 'https://...',  // Banner utama (tampil di .menu)
    banner2: 'https://...',  // Banner sekunder
    icon1:   'https://...',  // Icon kecil untuk thumbnail reply
    icon2:   'https://...',  // Icon alternatif
  },

  utils: {
    source_urls:   'https://kyuuimut.my.id',
    title:         'Kyu Multi Device',
    body:          'Simple WhatsApp Bot.',
    newsletterJid: '120363407145383686@newsletter',
  },

  key: {
    termai_api: 'Bell409',   // API key eksternal
  },
};
```

---

## 📁 Struktur Proyek

<details>
<summary>Lihat struktur lengkap</summary>

```
kyu-bot/
├── core/
│   ├── config.js        → Konfigurasi global bot
│   ├── handler.js       → Message handler + guard system
│   ├── loader.js        → Plugin loader + hot-reload + dual format
│   ├── serialize.js     → Serialisasi pesan WA ke object ctx
│   └── tools.js         → Helper functions
│
├── data/
│   ├── database.json    → Database (auto-generated)
│   └── db.js            → Read / write database
│
├── lib/
│   ├── catbox.js        → Upload file ke catbox.moe
│   ├── exif.js          → Edit metadata EXIF sticker
│   ├── fakeQuoted.js    → Generator fake quoted message
│   └── mediafire.js     → Parser link MediaFire
│
├── plugins/
│   ├── downloader/      → fbdl, igdl, tiktok, ytmp3, ytmp4, mediafire
│   ├── general/         → menu, allmenu
│   ├── maker/           → blur, brat, remini, iqc, img2img, dst
│   ├── owner/           → eval, exec, addplugin, setpremium, dst
│   ├── random/          → waifu, loli, quote, animequote, sonicmeme
│   ├── search/          → github, spotify, youtube, pinterest, dst
│   ├── stalker/         → roblox, tiktok, youtube stalk
│   └── tools/           → sticker, ssweb, webscrape, dst
│
├── session/             → Session WA (auto-generated, jangan diedit)
├── index.js             → Entry point
└── package.json
```

</details>

---

## 🔌 System Plugin

Kyu Bot menggunakan `CommandLoader` di `core/loader.js` yang bisa mendeteksi dan menjalankan dua format plugin sekaligus.

**Alur deteksi format:**

```
Export default diterima
        │
        ├─ function + .command (RegExp)?   →  Format Baru
        │
        ├─ object + .name + .execute?      →  Format Lama
        │
        └─ array of object?                →  Format Lama (multi-command)
```

**Alur guard system sebelum command dieksekusi:**

```
Pesan masuk → Before handlers → Cek ctx.cmd → Cari di commandMap
     │
     ├─ handler.limit    → Kurangi limit, tolak jika habis
     ├─ handler.register → Tolak jika belum register
     ├─ handler.owner    → Tolak jika bukan owner
     ├─ handler.group    → Tolak jika bukan di grup
     ├─ handler.private  → Tolak jika bukan private chat
     │
     └─ Semua lolos → execute()
```

---

## 📝 Dual Plugin Format

### Format Lama — Object Export

Parameter: `execute(kyu, ctx, msg)`

```js
import { simpleQuoted } from '../../lib/fakeQuoted.js';

export default {
  name: 'halo',
  aliases: ['hi', 'hello'],
  description: 'Sapaan dari bot',
  category: 'General',

  execute: async (kyu, ctx, msg) => {
    await kyu.sendMessage(
      ctx.id,
      { text: `Halo, ${ctx.pushname}! 👋` },
      { quoted: simpleQuoted(ctx) }
    );
  }
};
```

### Format Baru — Handler Function

Parameter: `handler(m, { conn, db, args, text })`

```js
let handler = async (m, { conn, db, args, text }) => {
  if (!text) return m.reply('Masukkan teks!');
  m.reply(`Kamu bilang: ${text}`);
};

handler.help        = ['echo'];
handler.tags        = ['tools'];
handler.command     = /^echo$/i;
handler.description = 'Ulangi teks kamu';
handler.limit       = true;
handler.register    = false;

export default handler;
```

### Format Baru dengan Before Handler

`handler.before` dijalankan di **setiap pesan masuk** — berguna untuk intercept button response atau event khusus.

```js
const PREFIX = 'mybot_';

let handler = async (m, { conn, db }) => {
  // command utama
};

handler.before = async (m, { conn, db }) => {
  const msg = m.message?.buttonsResponseMessage;
  if (!msg) return;

  const id = msg.selectedButtonId || '';
  if (!id.startsWith(PREFIX)) return;

  await conn.sendMessage(m.chat, { text: 'Tombol ditekan!' }, { quoted: m });
};

handler.help    = ['mycommand'];
handler.tags    = ['tools'];
handler.command = /^mycommand$/i;

export default handler;
```

---

## 🗂️ Handler Properties

| Property | Tipe | Default | Keterangan |
|---|---|---|---|
| `handler.help` | `string[]` | `[]` | Nama command — index 0 = nama utama, sisanya alias |
| `handler.tags` | `string[]` | `[]` | Kategori plugin, tampil di menu |
| `handler.command` | `RegExp` | — | **Wajib.** Regex untuk trigger command |
| `handler.description` | `string` | `''` | Deskripsi singkat |
| `handler.limit` | `boolean` | `false` | Kurangi 1 limit user setiap dipakai |
| `handler.register` | `boolean` | `false` | User harus sudah register |
| `handler.owner` | `boolean` | `false` | Hanya bisa dipakai owner |
| `handler.group` | `boolean` | `false` | Hanya bisa dipakai di grup |
| `handler.private` | `boolean` | `false` | Hanya bisa dipakai di chat pribadi |
| `handler.before` | `async function` | `null` | Dijalankan di setiap pesan masuk |

---

## 📜 Daftar Command

<details>
<summary><b>📥 Downloader (6 command)</b></summary>

| Command | Alias | Deskripsi |
|---|---|---|
| `.fbdl` | `fb`, `facebook` | Download video Facebook |
| `.igdl` | `ig`, `instagram` | Download media Instagram |
| `.mediafire` | `mf`, `mfdown` | Download file MediaFire |
| `.tiktok` | `tt`, `ttdl` | Download TikTok tanpa watermark |
| `.ytmp3` | `ytm3`, `ytaudio` | Download YouTube → MP3 |
| `.ytmp4` | `ytm4`, `ytvideo` | Download YouTube → MP4 |

</details>

<details>
<summary><b>🗂️ General (2 command)</b></summary>

| Command | Alias | Deskripsi |
|---|---|---|
| `.menu` | `main`, `help`, `list` | Menu utama bot |
| `.allmenu` | `all`, `fitur` | Semua command per kategori |

</details>

<details>
<summary><b>🎨 Maker (12 command)</b></summary>

| Command | Alias | Deskripsi |
|---|---|---|
| `.blur` | `makeblur` | Efek blur pada gambar |
| `.brat` | `makebrat` | Sticker brat dari teks |
| `.fakengl` | `fakeng`, `nglmaker` | Fake NGL message |
| `.fakeytcomment` | `fakeyt`, `ytcomment` | Fake YouTube comment |
| `.gura` | `memegura` | Meme Gura dari gambar |
| `.hijaukan` | `makegreen` | Ubah warna gambar → hijau |
| `.hitamkan` | `makeblack` | Ubah warna gambar → hitam |
| `.putihkan` | `makewhite` | Ubah warna gambar → putih |
| `.img2img` | `editgambar`, `aiimage` | Edit gambar dengan AI |
| `.iqc` | `iphonequote` | iPhone Quote Chat image |
| `.remini` | `hd`, `enhance` | Perjelas / enhance gambar |
| `.tonikawa` | `tonikawaframe` | Frame gambar Tonikawa |

</details>

<details>
<summary><b>👑 Owner (13 command)</b></summary>

> Hanya bisa digunakan oleh nomor yang terdaftar di `config.js`

| Command | Alias | Deskripsi |
|---|---|---|
| `.addowner` | `tambahowner` | Tambah owner baru |
| `.delowner` | `hapusowner` | Hapus dari daftar owner |
| `.addplugin` | `tambahplugin` | Upload plugin baru |
| `.delplugin` | `hapusplugin` | Hapus plugin |
| `.getplugin` | `gp` | Ambil source code plugin |
| `.saveplugin` | — | Update / overwrite plugin |
| `.backupdb` | `dbbackup` | Backup database JSON |
| `.backupscript` | `backup` | Backup semua file script |
| `.deluser` | `hapususer` | Hapus user dari database |
| `.eval` | `=>`, `ev` | Eksekusi kode JavaScript |
| `.exec` | `sh`, `terminal` | Eksekusi perintah terminal |
| `.setchat` | — | Ban / unban grup atau user |
| `.setpremium` | — | Atur status premium user |

</details>

<details>
<summary><b>🎲 Random (5 command)</b></summary>

| Command | Alias | Deskripsi |
|---|---|---|
| `.animequote` | `quoteanime` | Quote random dari anime |
| `.loli` | `randomloli` | Gambar loli random |
| `.quote` | — | Quote random |
| `.sonicmeme` | — | Meme Sonic random |
| `.waifu` | `randomwaifu` | Gambar waifu random |

</details>

<details>
<summary><b>🔍 Search (10 command)</b></summary>

| Command | Deskripsi |
|---|---|
| `.githubsearch` | Cari repository di GitHub |
| `.komikusearch` | Cari manga di Komiku |
| `.nekopoisearch` | Cari konten di Nekopoi |
| `.npms` | Cari package di NPM |
| `.otakudesu` | Cari anime di Otakudesu |
| `.pinterest` | Cari gambar di Pinterest |
| `.spotifysearch` | Cari lagu di Spotify |
| `.sticker-search` | Cari sticker dari Combot |
| `.tiktoksearch` | Cari video di TikTok |
| `.ytsearch` | Cari konten di YouTube |

</details>

<details>
<summary><b>👤 Stalker (3 command)</b></summary>

| Command | Deskripsi |
|---|---|
| `.robloxstalk` | Stalk profil Roblox |
| `.ttstalk` | Stalk akun TikTok |
| `.ytstalk` | Stalk channel YouTube |

</details>

<details>
<summary><b>🛠️ Tools (9 command)</b></summary>

| Command | Deskripsi |
|---|---|
| `.axiosget` | HTTP GET request manual |
| `.axiospost` | HTTP POST request manual |
| `.countryinfo` | Info detail sebuah negara |
| `.fakemailinbox` | Fake mail inbox |
| `.ssweb` | Screenshot website |
| `.sticker` | Buat sticker dari gambar/video |
| `.subdomainfinder` | Temukan subdomain sebuah domain |
| `.toimg` | Konversi sticker ke gambar |
| `.webscrape` | Scrape isi halaman website |

</details>

---

## 🧾 ctx API

`ctx` adalah hasil serialisasi pesan dari `core/serialize.js`. Tersedia sebagai parameter ke-2 di format lama: `execute(kyu, ctx, msg)`.

<details>
<summary><b>Properties</b></summary>

```ts
ctx.id           : string        // JID chat (group / private)
ctx.sender       : string        // JID pengirim — 628xxx@s.whatsapp.net
ctx.pushname     : string        // Nama display pengirim
ctx.group        : boolean       // true jika di grup
ctx.fromMe       : boolean       // true jika dari bot sendiri

ctx.text         : string        // Teks pesan lengkap
ctx.cmd          : string|null   // Command tanpa prefix — 'menu'
ctx.args         : string[]      // Argumen setelah command
ctx.query        : string        // args.join(' ')
ctx.prefix       : string|null   // Prefix yang dipakai — '.', '!', dll

ctx.msgType      : string        // 'imageMessage', 'videoMessage', dll
ctx.isMedia      : boolean       // true jika ada media
ctx.mediaType    : string|null   // 'image', 'video', 'audio', 'sticker'
ctx.mimetype     : string|null   // MIME type media
ctx.fileName     : string|null   // Nama file (jika ada)
ctx.fileSize     : number|null   // Ukuran file dalam bytes
ctx.isViewOnce   : boolean       // true jika pesan sekali lihat
ctx.media        : object|null   // Raw media content dari Baileys

ctx.quoted       : object|null   // Pesan yang di-reply (lihat di bawah)
ctx.mentionedJid : string[]      // JID yang di-mention (@xxx)
ctx.timestamp    : number        // Timestamp pesan (milliseconds)
ctx.device       : string        // 'Web' | 'Android' | 'Unknown'
```

</details>

<details>
<summary><b>Methods</b></summary>

```js
ctx.reply('Teks')                        // Balas pesan
ctx.reply('Teks', { mentions: [jid] })   // Balas dengan mention
ctx.react('✅')                          // React emoji
ctx.delete()                             // Hapus pesan bot
ctx.edit('Teks baru')                    // Edit pesan bot
ctx.forward('628xxx@s.whatsapp.net')     // Forward ke chat lain
const buf = await ctx.download()         // Download media → Buffer
const name = ctx.getName()               // Nama pengirim
```

</details>

<details>
<summary><b>ctx.quoted</b></summary>

```js
ctx.quoted.message    // Raw quotedMessage
ctx.quoted.sender     // JID pengirim pesan yang di-quote
ctx.quoted.text       // Teks isi pesan yang di-quote
ctx.quoted.msgType    // Tipe pesan yang di-quote
ctx.quoted.key        // Message key untuk operasi Baileys
ctx.quoted.isMedia    // true jika quoted berisi media
ctx.quoted.mediaType  // Tipe media quoted
ctx.quoted.mimetype   // MIME type
ctx.quoted.media      // Raw media content
```

</details>

---

## 🗃️ Database Schema

Database disimpan di `data/database.json`, diakses via `global.db`.

<details>
<summary><b>Lihat schema lengkap</b></summary>

```js
global.db = {
  user: {
    '628xxx@s.whatsapp.net': {
      name:        string,   // Nama (setelah register)
      limit:       number,   // Sisa limit (default: 20)
      ownerAcces:  boolean,  // true = owner, limit unlimited
      premium: {
        status:    boolean,  // true jika aktif premium
        expired:   number,   // Timestamp expired
      },
      // RPG:
      level, exp, hp, hpMax, mana, manaMax, atk, def
    }
  },

  group: {
    '120xxx@g.us': {
      banned: boolean        // true jika grup dibanned
    }
  },

  cmd: {
    // State bebas per command
    // contoh: 'waifu2_index': 5
  }
}
```

</details>

**Cara baca dan simpan:**

```js
import db from '../../data/db.js';

const saved = db.read();              // Baca dari disk
global.db.cmd['mykey'] = 42;          // Modifikasi
db.write(global.db);                  // Simpan ke disk
```

---

## 🧩 Cara Buat Plugin

<details>
<summary><b>Plugin teks sederhana</b></summary>

`plugins/tools/ping.js`

```js
export default {
  name: 'ping',
  aliases: ['p'],
  description: 'Cek apakah bot aktif',
  category: 'Tools',
  execute: async (kyu, ctx, msg) => {
    const start = Date.now();
    await ctx.reply('Pong! 🏓');
    const ping = Date.now() - start;
    await ctx.edit(`Pong! 🏓\n\n⚡ *${ping}ms*`);
  }
};
```

</details>

<details>
<summary><b>Plugin media + limit</b></summary>

`plugins/random/fox.js`

```js
import axios from 'axios';

let handler = async (m, { conn }) => {
  try {
    const { data } = await axios.get('https://randomfox.ca/floof/');
    const buffer = (await axios.get(data.image, { responseType: 'arraybuffer' })).data;

    await conn.sendMessage(m.chat, {
      image: Buffer.from(buffer),
      caption: '🦊 *Random Fox*',
    }, { quoted: m });

  } catch (e) {
    m.reply('❌ Gagal: ' + e.message);
  }
};

handler.help        = ['fox', 'randomfox'];
handler.tags        = ['random'];
handler.command     = /^(fox|randomfox)$/i;
handler.description = 'Kirim foto rubah lucu random';
handler.limit       = true;

export default handler;
```

</details>

<details>
<summary><b>Plugin dengan state sequential</b></summary>

`plugins/random/mywaifu.js`

```js
import axios from 'axios';
import db from '../../data/db.js';

const LIST_URL = 'https://pastebin.com/raw/XxxXxxXx';
const KEY      = 'mywaifu_index';
let   _cache   = null;

const getList = async () => {
  if (_cache) return _cache;
  const { data } = await axios.get(LIST_URL);
  return (_cache = Array.isArray(data) ? data : JSON.parse(data));
};

let handler = async (m, { conn }) => {
  const list  = await getList();
  const saved = db.read();
  if (!saved.cmd) saved.cmd = {};

  let index = saved.cmd[KEY] ?? 0;
  if (index >= list.length) index = 0;

  const nextIdx      = index + 1 >= list.length ? 0 : index + 1;
  saved.cmd[KEY]     = nextIdx;
  db.write(saved);

  const buffer = (await axios.get(list[index].url, { responseType: 'arraybuffer' })).data;

  await conn.sendMessage(m.chat, {
    image: Buffer.from(buffer),
    caption: `🌸 *Waifu Gallery*\n\n📸 ${index + 1} / ${list.length}\n\n> Ketik *.mywaifu* untuk lanjut`,
  }, { quoted: m });
};

handler.help        = ['mywaifu'];
handler.tags        = ['anime'];
handler.command     = /^mywaifu$/i;
handler.description = 'Kirim waifu berurutan dari list';
handler.limit       = true;
handler.register    = true;

export default handler;
```

</details>

---

## 🔥 Hot-Reload

Bot menggunakan **chokidar** untuk memantau folder `plugins/` secara real-time.

| Event | Aksi |
|---|---|
| File baru ditambahkan | `loadPlugin()` otomatis |
| File diubah / disimpan | `reloadPlugin()` otomatis |
| File dihapus | `unloadPlugin()` otomatis |

```js
// Reload satu plugin
await global.loader.reloadPlugin('./plugins/tools/ping.js');

// Lihat semua command terdaftar
global.loader.listCommands();

// Lihat command per kategori
global.loader.getCommandsByCategory();

// Ambil satu command by nama
global.loader.getCommand('ping');
```

---

## 📄 Lisensi

MIT License © 2024 [KyuDev](https://kyuuimut.my.id)

---

<div align="center">
  <p>Dibuat dengan ❤️ oleh <a href="https://kyuuimut.my.id"><b>KyuDev</b></a></p>
  <p>
    <code>Node.js</code> &nbsp;·&nbsp;
    <code>@whiskeysockets/baileys</code> &nbsp;·&nbsp;
    <code>ES Modules</code> &nbsp;·&nbsp;
    <code>WhatsApp Multi-Device</code>
  </p>
</div>
