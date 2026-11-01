// ====== GANTI ISI DI BAGIAN INI ======
const WA = 'https://wa.me/6280000000000?text=Halo,%20saya%20tertarik%20dengan%20program%20mentoring'
const MENTOR = { nama: '[Nama Mentor]', bio: 'Trader aktif sejak [tahun]. Fokus pada price action dan manajemen risiko. Isi bagian ini dengan pengalaman, pasar yang diperdagangkan, dan gaya mengajarmu.' }
const topik = [
  ['Struktur pasar', 'Membaca tren, rentang, dan area harga penting sebelum mencari entry.'],
  ['Manajemen risiko', 'Menentukan ukuran posisi dan stop loss dulu, baru memikirkan target.'],
  ['Jurnal dan evaluasi', 'Mencatat setiap trade supaya kesalahan berulang bisa terlihat dan diperbaiki.'],
]
const minggu = [
  ['Dasar pasar dan platform', 'Istilah, jenis order, dan cara membaca grafik candlestick.'],
  ['Struktur dan area harga', 'Support, resistance, dan arah tren di berbagai timeframe.'],
  ['Rencana trade dan risiko', 'Menyusun entry, stop, target, dan rasio risiko-imbalan.'],
  ['Eksekusi dan jurnal', 'Latihan di akun demo dengan review mingguan bersama mentor.'],
]
const paket = [
  ['Kelas kelompok', 'Rp [harga]', ['4 sesi live mingguan', 'Materi dan rekaman', 'Grup diskusi peserta']],
  ['Pendampingan 1 lawan 1', 'Rp [harga]', ['Semua isi kelas kelompok', 'Review jurnal pribadi', '2 sesi konsultasi privat']],
]
const faq = [
  ['Apakah saya perlu pengalaman?', 'Tidak. Minggu pertama mulai dari dasar. Kamu hanya perlu laptop dan waktu untuk latihan.'],
  ['Apakah ada jaminan profit?', 'Tidak ada. Trading berisiko dan hasil tiap orang berbeda. Program ini mengajarkan proses, bukan janji keuntungan.'],
  ['Perlu modal berapa?', 'Selama program kamu berlatih di akun demo. Modal nyata baru dipikirkan setelah kamu punya rencana yang konsisten.'],
  ['Bagaimana cara daftar?', 'Klik tombol daftar, kirim pesan WhatsApp, lalu kami konfirmasi jadwal angkatan berikutnya.'],
]
// ======================================

const candles = [[50,54,48,52],[52,53,47,48],[48,51,45,50],[50,56,49,55],[55,58,53,54],[54,55,50,51],[51,52,46,47],[47,50,44,49],[49,53,48,52],[52,57,51,56],[56,60,55,59],[59,61,56,57],[57,58,54,55],[55,56,52,53],[53,57,52,56],[56,62,55,61],[61,65,60,64],[64,67,62,63],[63,68,62,67],[67,72,66,71],[71,74,69,73],[73,76,71,72]]
const X = (i) => 30 + i * 27
const Y = (p) => 20 + ((78 - p) / 36) * 320

function Chart() {
  const e = 56, s = 52, t = 68, x0 = X(14), w = 630 - X(14)
  return (
    <svg viewBox="0 0 640 360" role="img" aria-label="Contoh grafik candlestick dengan rencana trade: entry, stop loss, dan target">
      {[48, 58, 68].map((p) => <line key={p} x1="0" x2="640" y1={Y(p)} y2={Y(p)} className="gl" />)}
      {candles.map(([o, h, l, c], i) => (
        <g key={i} className={c >= o ? 'candle up' : 'candle dn'} style={{ '--i': i }}>
          <line x1={X(i)} x2={X(i)} y1={Y(h)} y2={Y(l)} />
          <rect x={X(i) - 6} y={Y(Math.max(o, c))} width="12" height={Math.max(2, Math.abs(Y(o) - Y(c)))} />
        </g>
      ))}
      <g className="plan">
        <rect x={x0} y={Y(t)} width={w} height={Y(e) - Y(t)} className="zone-up" />
        <rect x={x0} y={Y(e)} width={w} height={Y(s) - Y(e)} className="zone-dn" />
        <line x1={x0} x2="630" y1={Y(e)} y2={Y(e)} className="entry" />
        <text x={x0 + 6} y={Y(t) + 18}>Target</text>
        <text x={x0 + 6} y={Y(e) - 6}>Entry</text>
        <text x={x0 + 6} y={Y(s) + 16}>Stop</text>
      </g>
    </svg>
  )
}

export default function App() {
  return (
    <>
      <header className="bar">
        <a className="brand" href="#top">Mentoring Trading</a>
        <nav>
          <a href="#program">Program</a>
          <a href="#mentor">Mentor</a>
          <a href="#paket">Paket</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="btn small" href={WA}>Daftar</a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-text">
            <h1>Belajar trading dengan rencana, bukan tebakan.</h1>
            <p>Program 4 minggu untuk pemula dan trader yang masih sering rugi karena tanpa aturan. Kamu belajar membaca pasar, mengukur risiko, dan mencatat setiap keputusan.</p>
            <div className="actions">
              <a className="btn" href={WA}>Daftar angkatan berikutnya</a>
              <a className="btn ghost" href="#program">Lihat program</a>
            </div>
          </div>
          <figure className="chart">
            <Chart />
            <figcaption>Ilustrasi rencana trade dengan rasio risiko 1 : imbalan 3. Bukan sinyal beli atau jual.</figcaption>
          </figure>
        </section>

        <section className="sec">
          <h2>Yang kamu pelajari</h2>
          <dl className="rows">
            {topik.map(([a, b]) => (
              <div key={a}><dt>{a}</dt><dd>{b}</dd></div>
            ))}
          </dl>
        </section>

        <section className="sec" id="program">
          <h2>Program 4 minggu</h2>
          <ol className="weeks">
            {minggu.map(([a, b], i) => (
              <li key={a}><span>{i + 1}</span><div><h3>{a}</h3><p>{b}</p></div></li>
            ))}
          </ol>
        </section>

        <section className="sec" id="mentor">
          <h2>{MENTOR.nama}</h2>
          <p className="lead">{MENTOR.bio}</p>
        </section>

        <section className="sec" id="paket">
          <h2>Pilih paket</h2>
          <div className="plans">
            {paket.map(([n, h, f]) => (
              <article key={n}>
                <h3>{n}</h3>
                <p className="price">{h}</p>
                <ul>{f.map((x) => <li key={x}>{x}</li>)}</ul>
                <a className="btn" href={WA}>Pilih paket ini</a>
              </article>
            ))}
          </div>
        </section>

        <section className="sec" id="faq">
          <h2>Pertanyaan umum</h2>
          <div className="faq">
            {faq.map(([q, a]) => (
              <details key={q}><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <p><strong>Peringatan risiko.</strong> Trading instrumen keuangan berisiko tinggi dan bisa menyebabkan kerugian, termasuk seluruh modal. Konten di situs ini bersifat edukasi, bukan nasihat keuangan, dan tidak ada jaminan keuntungan. Hasil masa lalu tidak menjamin hasil di masa depan.</p>
      </footer>
    </>
  )
}
