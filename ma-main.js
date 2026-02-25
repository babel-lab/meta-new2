import "./assets/scss/ma-main.scss";

//HEADER STICKY
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".ma-header");
  if (!header) return;

  header.classList.remove("is-sticky");

  const onScroll = () => {
    header.classList.toggle("is-sticky", window.scrollY > 0);
  };

  onScroll(); // 進頁先跑一次
  window.addEventListener("scroll", onScroll, { passive: true });
});

//開啟導覽列選單
document.addEventListener("DOMContentLoaded", () => {
  // === 1. 元素取得 (DOM Selection) ===
  const menuToggle = document.getElementById("menu-toggle"); // 漢堡選單按鈕
  const langToggleMobile = document.getElementById("lang-toggle-mobile"); // 手機版語言按鈕
  const langToggleDesktop = document.getElementById("lang-toggle-pc"); // 桌機版語言按鈕

  const overlay = document.getElementById("menu-overlay"); // 黑色半透明遮罩
  const drawer = document.getElementById("mobile-drawer"); // 側邊抽屜本體
  const menuContent = document.getElementById("menu-content"); // 選單內容區
  const langContent = document.getElementById("lang-content"); // 語言內容區
  const body = document.body;

  /**
   * === 2. 開啟抽屜函式 ===
   * @param {string} type - 'nav' (導覽) 或 'lang' (語言)
   */
  const openDrawer = (type) => {
    // --- PHP 工程師注意：選單打開前可以在這裡處理邏輯 (例如統計點擊次數) ---

    if (type === "nav") {
      menuContent.classList.remove("is-hidden");
      langContent.classList.add("is-hidden");
    } else {
      langContent.classList.remove("is-hidden");
      menuContent.classList.add("is-hidden");
    }

    drawer.classList.add("is-open");
    overlay.classList.add("is-show");
    body.classList.add("is-scroll-locked"); // 防止底層捲動
    drawer.focus();
  };

  /**
   * === 3. 關閉抽屜函式 ===
   */
  const closeDrawer = () => {
    // --- PHP 工程師注意：選單正式消失前，若需要執行清理或記錄，可以在此寫入 ---

    drawer.classList.remove("is-open");
    overlay.classList.remove("is-show");
    body.classList.remove("is-scroll-locked");
  };

  // === 4. 事件監聽 (Event Listeners) ===

  // 點擊漢堡選單 -> 打開主導覽
  if (menuToggle) {
    menuToggle.addEventListener("click", () => openDrawer("nav"));
  }

  // 點擊語言圖示 (桌機/手機) -> 打開語言選單
  [langToggleMobile, langToggleDesktop].forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openDrawer("lang");
      });
    }
  });

  // 點擊遮罩 -> 關閉
  if (overlay) {
    overlay.addEventListener("click", closeDrawer);
  }

  // 按下 ESC 鍵 -> 關閉
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  /**
   * === 5. 選單內項目點擊處理 ===
   * 當點擊選單內的任何 <a> 或 <button> 時
   */
  const drawerLinks = drawer.querySelectorAll("a, button");
  drawerLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      // --- PHP 工程師注意：這裡是最重要的 Hook ---
      // 如果是語系切換按鈕，可以在這裡執行 AJAX 或切換 Cookie/Session
      const targetHref = link.getAttribute("href");
      console.log("使用者點擊了：", link.textContent, "目標：", targetHref);

      // 如果該按鈕只是純觸發 JS (例如沒有 href)，可以使用 e.preventDefault()
      // 如果點擊後要「先關閉選單、再執行其他動作」，請寫在 closeDrawer() 之前

      closeDrawer();
    });
  });
});
