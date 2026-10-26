// ---------- Thước phim ----------
const DANH_SACH = (window.DANH_SACH_ANH || []).map((anh, i) => ({ ...anh, so: i + 1 }));

function taoKhung(anh) {
  const khung = document.createElement("figure");
  khung.className = "khung";

  const oAnh = document.createElement("div");
  oAnh.className = "o-anh";
  const img = new Image();
  img.alt = anh.chu || `Ảnh ${anh.so}`;
  img.decoding = "async";
  img.src = "anh/" + anh.file;
  img.onerror = () => {
    const oTrong = document.createElement("span");
    oTrong.className = "o-trong";
    oTrong.textContent = "📷\n" + anh.file;
    img.replaceWith(oTrong);
  };
  oAnh.appendChild(img);
  khung.appendChild(oAnh);

  if (anh.chu) {
    const chu = document.createElement("figcaption");
    chu.textContent = anh.chu;
    khung.appendChild(chu);
  }
  return khung;
}

// Lặp danh sách đủ dài để phủ màn hình, rồi nhân đôi để cuộn vòng không bị hở
function dungDaiPhim(id, ds) {
  const dai = document.getElementById(id);
  if (!dai || !ds.length) return;
  let mot = [...ds];
  while (mot.length < 8) mot = mot.concat(ds);

  const ray = document.createElement("div");
  ray.className = "ray";
  [...mot, ...mot].forEach((anh) => ray.appendChild(taoKhung(anh)));
  ray.style.animationDuration = mot.length * 4 + "s";
  dai.appendChild(ray);
}

// Nhiều ảnh thì mỗi dải một nửa, ít ảnh thì hai dải dùng chung (dải dưới đảo thứ tự)
const giua = Math.ceil(DANH_SACH.length / 2);
const chiaDoi = DANH_SACH.length >= 16;
dungDaiPhim("dai-phim-1", chiaDoi ? DANH_SACH.slice(0, giua) : DANH_SACH);
dungDaiPhim("dai-phim-2", chiaDoi ? DANH_SACH.slice(giua) : [...DANH_SACH].reverse());

// ---------- Xem ảnh to ----------
const xemAnh = document.getElementById("xem-anh");
document.addEventListener("click", (e) => {
  const img = e.target.closest(".o-anh img");
  if (!img) return;
  xemAnh.querySelector("img").src = img.src;
  xemAnh.querySelector("p").textContent = img.alt;
  xemAnh.classList.add("mo");
});
xemAnh.addEventListener("click", () => xemAnh.classList.remove("mo"));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") xemAnh.classList.remove("mo");
});

// ---------- Tim bay nền ----------
const nenTim = document.getElementById("nen-tim");
const KIEU_TIM = ["💗", "💖", "💕", "🌸", "🎀", "✨"];

function thaTim() {
  if (document.hidden) return;
  const tim = document.createElement("span");
  tim.className = "tim";
  tim.textContent = KIEU_TIM[Math.floor(Math.random() * KIEU_TIM.length)];
  tim.style.left = Math.random() * 100 + "vw";
  tim.style.fontSize = 14 + Math.random() * 22 + "px";
  tim.style.animationDuration = 7 + Math.random() * 6 + "s";
  tim.addEventListener("animationend", () => tim.remove());
  nenTim.appendChild(tim);
}
setInterval(thaTim, 700);

// ---------- Pháo giấy khi mở quà ----------
const MAU_GIAY = ["#ff5c9a", "#ffb3cf", "#ffd27a", "#ffffff", "#e23d7f", "#ff8fb8"];

function banPhaoGiay() {
  for (let i = 0; i < 120; i++) {
    const giay = document.createElement("span");
    giay.className = "phao-giay";
    giay.style.left = Math.random() * 100 + "vw";
    giay.style.background = MAU_GIAY[i % MAU_GIAY.length];
    giay.style.animationDuration = 2.5 + Math.random() * 2.5 + "s";
    giay.style.animationDelay = Math.random() * 0.6 + "s";
    giay.addEventListener("animationend", () => giay.remove());
    document.body.appendChild(giay);
  }
}

// ---------- Nhạc (YouTube IFrame API) ----------
const VIDEO_ID = "lL8zmaMpMFw";
const nutNhac = document.getElementById("nut-nhac");
let player = null;
let nhacSanSang = false;
let nhacLoi = false;
let daMoQua = false;

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("yt", {
    width: 200,
    height: 200,
    videoId: VIDEO_ID,
    playerVars: { controls: 0, loop: 1, playlist: VIDEO_ID, playsinline: 1 },
    events: {
      onReady: () => {
        nhacSanSang = true;
        if (daMoQua) player.playVideo();
      },
      onStateChange: (e) => {
        nutNhac.classList.toggle("dang-phat", e.data === YT.PlayerState.PLAYING);
      },
      onError: () => { nhacLoi = true; },
    },
  });
};

nutNhac.addEventListener("click", () => {
  // Không phát được trong trang thì mở bài hát trên YouTube
  if (nhacLoi) return window.open("https://youtu.be/" + VIDEO_ID, "_blank", "noopener");
  if (!nhacSanSang) return;
  const dangPhat = player.getPlayerState() === YT.PlayerState.PLAYING;
  dangPhat ? player.pauseVideo() : player.playVideo();
});

// ---------- Mở quà ----------
document.getElementById("nut-mo-qua").addEventListener("click", () => {
  daMoQua = true;
  if (nhacSanSang) player.playVideo();
  document.getElementById("man-mo-qua").classList.add("an");
  banPhaoGiay();
});
