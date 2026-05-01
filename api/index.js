const { default: makeWASocket, useMultiFileAuthState, delay, disconnectReason } = require("@whiskeysockets/baileys");
const pino = require("pino");

module.exports = async (req, res) => {
    const { number } = req.query;
    if (!number) return res.status(400).json({ status: false, message: "Nomor wajib diisi!" });

    const { state, saveCreds } = await useMultiFileAuthState('/tmp/session-' + number);
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: "fatal" }),
        browser: ["Chrome (Linux)", "Ryuka-Depeloger", "1.0.0"]
    });

    // Handle Update Credential (wajib untuk simpan session)
    sock.ev.on('creds.update', saveCreds);

    // LOGIKA FITUR (Sederhana untuk Uji Coba)
    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const from = msg.key.remoteJid;

        // FITUR 1: PING
        if (text === '.ping') {
            await sock.sendMessage(from, { text: 'Bot Active via Vercel! 🚀' });
        }
        
        // FITUR 2: INFO
        if (text === '.menu') {
            await sock.sendMessage(from, { text: '*Daftar Fitur Uji Coba:*\n1. .ping\n2. .runtime\n\n_Bot akan mati otomatis jika Vercel mencapai timeout._' });
        }
    });

    try {
        // Request Pairing Code
        await delay(2000);
        const code = await sock.requestPairingCode(number);
        
        // Kirim kode ke Frontend
        res.status(200).json({ 
            status: true, 
            code: code,
            message: "Masukkan kode di WhatsApp Anda. Bot akan aktif sementara."
        });

        // Biarkan koneksi hidup selama 20 detik untuk tes fitur
        await delay(20000); 
    } catch (err) {
        res.status(500).json({ status: false, error: err.message });
    }
};
