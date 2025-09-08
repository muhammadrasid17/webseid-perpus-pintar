// ============================
// Ambil data pinjam dari localStorage
// ============================
function getDaftarPinjam() {
  return JSON.parse(localStorage.getItem("daftarPinjam")) || [];
}

// ============================
// Simpan data pinjam ke localStorage
// ============================
function saveDaftarPinjam(data) {
  localStorage.setItem("daftarPinjam", JSON.stringify(data));
}

// ============================
// Navigasi Halaman
// ============================
function showContent(pageId) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(pageId).style.display = "block";
}

// ============================
// Logout
// ============================
function logout(){
  window.location.href = "index.html";
}

// ============================
// Pinjam Buku
// ============================
function pinjamBuku(event) {
  event.preventDefault();
  const judul = document.getElementById("judul").value;
  const peminjam = document.getElementById("peminjam").value;
  const tanggal = new Date().toLocaleDateString("id-ID");

  if (!judul || !peminjam) {
    alert("Isi nama peminjam dan pilih buku dulu!");
    return;
  }

  let daftarPinjam = getDaftarPinjam();

  // 🚫 Jangan hapus opsi dari select, cukup simpan data peminjaman
  daftarPinjam.push({ judul, peminjam, tanggal });
  saveDaftarPinjam(daftarPinjam);

  renderTabel();
  document.getElementById("formPinjam").reset();
  alert(`Buku "${judul}" berhasil dipinjam oleh ${peminjam}`);
}


// ============================
// Render tabel Pinjam & Laporan
// ============================
function renderTabel() {
  const daftarPinjam = getDaftarPinjam();

  const tablePinjam = document.getElementById("tablePinjam");
  if(tablePinjam){
    tablePinjam.innerHTML = "<tr><th>Judul</th><th>Peminjam</th><th>Aksi</th></tr>";
  }

  const tableLaporan = document.getElementById("tableLaporan");
  if(tableLaporan){
    tableLaporan.innerHTML = "<tr><th>No</th><th>Judul</th><th>Peminjam</th><th>Tanggal Pinjam</th><th>Aksi</th></tr>";
  }

  daftarPinjam.forEach((item, i) => {
    if(tablePinjam){
      const row = tablePinjam.insertRow();
      row.insertCell(0).innerText = item.judul;
      row.insertCell(1).innerText = item.peminjam;
      const cellBtn = row.insertCell(2);
      const btnHapus = document.createElement("button");
      btnHapus.innerText = "Hapus";
      btnHapus.onclick = function() { hapusData(i); };
      cellBtn.appendChild(btnHapus);
    }

    if(tableLaporan){
      const row2 = tableLaporan.insertRow();
      row2.insertCell(0).innerText = i + 1;
      row2.insertCell(1).innerText = item.judul;
      row2.insertCell(2).innerText = item.peminjam;
      row2.insertCell(3).innerText = item.tanggal;
      const cellBtn2 = row2.insertCell(4);
      const btnHapus2 = document.createElement("button");
      btnHapus2.innerText = "Hapus";
      btnHapus2.onclick = function() { hapusData(i); };
      cellBtn2.appendChild(btnHapus2);
    }
  });

  updateChart();
}

// ============================
// Hapus data Pinjam
// ============================
function hapusData(index) {
  let daftarPinjam = getDaftarPinjam();
  daftarPinjam.splice(index, 1);
  saveDaftarPinjam(daftarPinjam);
  renderTabel();
}

// ============================
// Cetak PDF Laporan
// ============================
function cetakPDF() {
  const daftarPinjam = getDaftarPinjam();
  const isi = document.getElementById("isiLaporanResmi");
  isi.innerHTML = "";

  daftarPinjam.forEach((item, index) => {
    const row = isi.insertRow();
    row.insertCell(0).innerText = index + 1;
    row.insertCell(1).innerText = item.judul;
    row.insertCell(2).innerText = item.peminjam;
    row.insertCell(3).innerText = item.tanggal;
  });

  const element = document.getElementById("laporanResmi");
  element.style.display = "block";

  html2pdf().set({
    margin: 0.5,
    filename: "Laporan_Peminjaman.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "A4", orientation: "portrait" }
  }).from(element).save().then(() => {
    element.style.display = "none";
  });
}

// ============================
// Inisialisasi Chart.js
// ============================
let chartPeminjaman;
function initChart() {
  const ctx = document.getElementById("chartPeminjaman");
  if (!ctx) return;
  chartPeminjaman = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
      datasets: [{
        label: "Jumlah Peminjaman",
        data: Array(12).fill(0),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

// ============================
// Update Chart dari data
// ============================
function updateChart() {
  if (!chartPeminjaman) return;
  const daftarPinjam = getDaftarPinjam();
  let dataBaru = Array(12).fill(0);

  daftarPinjam.forEach(item => {
    let bulan;
    try {
      let parts = item.tanggal.split("/");
      if (parts.length === 3) {
        bulan = parseInt(parts[1], 10) - 1; // format IDN dd/mm/yyyy
      } else {
        bulan = new Date(item.tanggal).getMonth();
      }
    } catch {
      bulan = new Date().getMonth();
    }
    if (bulan >= 0 && bulan < 12) {
      dataBaru[bulan]++;
    }
  });

  chartPeminjaman.data.datasets[0].data = dataBaru;
  chartPeminjaman.update();
}

// ============================
// Inisialisasi saat load
// ============================
window.onload = function() {
  renderTabel();
  initChart();
  updateChart();
};
