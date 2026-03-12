import "./assets/scss/ma-main.scss";

// JS 準備完成標記：避免頁面切換時 Drawer / Overlay 先閃出
document.documentElement.classList.add("is-js-ready");

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
  const menuClose = document.getElementById("menu-close"); // 抽屜關閉按鈕

  const langToggleMobile = document.getElementById("lang-toggle-mobile"); // 手機版語言按鈕
  const langToggleDesktop = document.getElementById("lang-toggle-pc"); // 桌機版語言按鈕
  const drawerLangToggle = document.getElementById("drawer-lang-toggle"); // 抽屜內語言按鈕

  const overlay = document.getElementById("menu-overlay"); // 黑色半透明遮罩
  const drawer = document.getElementById("mobile-drawer"); // 側邊抽屜本體
  const menuContent = document.getElementById("menu-content"); // 主選單內容區
  const langContent = document.getElementById("lang-content"); // 語言內容區
  const body = document.body;

  // === 登入後選單相關元素 ===
  // PHP 工程師注意：
  // 這組 tab / panel 是「登入後的小版選單」用的。
  // 若尚未登入，可由後端直接不輸出「會員選單 tab」與「會員選單 panel」。
  const tabButtons = document.querySelectorAll("[data-menu-tab]"); // 上方頁籤按鈕（探索 / 會員）
  const tabPanels = document.querySelectorAll("[data-menu-panel]"); // 對應的內容面板

  if (!drawer || !overlay || !menuContent || !langContent) return;

  /**
   * === 2. 切換登入後選單頁籤函式 ===
   * @param {string} tabName - 'explore' 或 'member'
   */
  const switchMenuTab = (tabName) => {
    // --- PHP 工程師注意：---
    // 若登入後會員名稱、權限、顯示內容不同，可依登入身份動態輸出不同 tab / panel 內容。
    tabButtons.forEach((btn) => {
      const isActive = btn.dataset.menuTab === tabName;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    tabPanels.forEach((panel) => {
      const isActive = panel.dataset.menuPanel === tabName;
      panel.classList.toggle("is-active", isActive);

      if (isActive) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });
  };

  /**
   * === 3. 開啟抽屜函式 ===
   * @param {string} type - 'nav' (導覽) 或 'lang' (語言)
   */
  const openDrawer = (type) => {
    // --- PHP 工程師注意：選單打開前可以在這裡處理邏輯 (例如統計點擊次數) ---

    if (type === "nav") {
      menuContent.classList.remove("is-hidden");
      langContent.classList.add("is-hidden");

      // --- 登入後選單預設顯示「探索」頁籤 ---
      // PHP 工程師注意：
      // 若登入後要預設顯示「會員選單」，可改成 switchMenuTab("member")
      if (tabButtons.length && tabPanels.length) {
        switchMenuTab("explore");
      }
    } else {
      langContent.classList.remove("is-hidden");
      menuContent.classList.add("is-hidden");
    }

    // 先讓 drawer 出現在版面流程中，再加開啟 class
    drawer.hidden = false;

    // 小延遲可避免某些瀏覽器吃不到 transition
    requestAnimationFrame(() => {
      drawer.classList.add("is-open");
      overlay.classList.add("is-show");
      body.classList.add("is-scroll-locked"); // 防止底層捲動
      drawer.setAttribute("aria-hidden", "false");
      // 同步漢堡按鈕狀態（無障礙用）
      // 新增說明：
      // 1. aria-expanded=true 表示抽屜已展開
      // 2. .is-active 讓漢堡 icon 變成 X
      // 3. aria-label 改為 Close menu，方便輔助工具辨識
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close menu");
        menuToggle.classList.add("is-active");
      }

      drawer.focus();
    });
  };

  /**
   * === 4. 關閉抽屜函式 ===
   */
  const closeDrawer = () => {
    // --- PHP 工程師注意：選單正式消失前，若需要執行清理或記錄，可以在此寫入 ---

    drawer.classList.remove("is-open");
    overlay.classList.remove("is-show");
    body.classList.remove("is-scroll-locked");
    drawer.setAttribute("aria-hidden", "true");

    // 同步漢堡按鈕狀態（無障礙用）
    // 新增說明：
    // 1. aria-expanded=false 表示抽屜已收合
    // 2. 移除 .is-active，X 會恢復成漢堡 icon
    // 3. aria-label 改回 Menu
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Menu");
      menuToggle.classList.remove("is-active");
    }
  };

  // === 5. 事件監聽 (Event Listeners) ===

  // 點擊漢堡選單：
  // 1. 若目前抽屜是關閉 -> 打開主導覽
  // 2. 若目前抽屜已開啟 -> 直接關閉
  // 這樣使用者點 X 就能關閉選單
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = drawer.classList.contains("is-open");

      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer("nav");
      }
    });
  }

  // 點擊關閉按鈕 -> 關閉主導覽
  // PHP 工程師注意：
  // 目前 HEADER / Drawer 結構裡不一定有 menu-close，
  // 若未來有額外獨立的關閉按鈕，這段仍可直接沿用。
  if (menuClose) {
    menuClose.addEventListener("click", closeDrawer);
  }

  // 點擊語言圖示 (桌機 / 手機 / 抽屜內) -> 打開語言選單
  [langToggleMobile, langToggleDesktop, drawerLangToggle].forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openDrawer("lang");
      });
    }
  });

  // 點擊遮罩 -> 關閉
  // 使用者點選單外部 overlay 時，也會把抽屜關掉，
  // 並同步把漢堡 X 恢復為原本圖示
  if (overlay) {
    overlay.addEventListener("click", closeDrawer);
  }

  // 按下 ESC 鍵 -> 關閉
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  /**
   * === 6. 登入後頁籤切換處理 ===
   * 探索 / 會員選單
   */
  // PHP 工程師注意：
  // 這一段只有在「登入後版本」且有輸出 tab 結構時才會生效。
  // 若未登入時後端沒有輸出這些節點，不會報錯。
  if (tabButtons.length && tabPanels.length) {
    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.dataset.menuTab;
        switchMenuTab(targetTab);
      });
    });
  }

  /**
   * === 7. 選單內項目點擊處理 ===
   * 當點擊選單內的任何 <a> 時
   */
  const drawerLinks = drawer.querySelectorAll("a");
  drawerLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // --- PHP 工程師注意：這裡是最重要的 Hook ---
      // 例如：
      // 1. 可記錄使用者點了哪個選單
      // 2. 若為登入/登出/查看鏈證，可在這裡掛追蹤碼
      // 3. 若某些按鈕未來改成 AJAX 或 SPA 行為，可在這裡先攔截

      const targetHref = link.getAttribute("href");
      console.log("使用者點擊了：", link.textContent, "目標：", targetHref);

      closeDrawer();
    });
  });
});

// =========================================================
// 會員資產頁：詳細資料展開 / 收合、設定 Modal 開關
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  // === 1. 詳細資料展開 / 收合 ===
  const detailToggles = document.querySelectorAll(
    ".ma-member-asset-card__detail-toggle",
  );

  detailToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const detailBlock = this.closest(".ma-member-asset-card__detail");
      if (!detailBlock) return;

      const isExpanded = this.getAttribute("aria-expanded") === "true";

      this.setAttribute("aria-expanded", String(!isExpanded));
      detailBlock.classList.toggle("is-open", !isExpanded);
    });
  });

  // === 2. Modal 開啟 / 關閉 ===
  const modalOpenButtons = document.querySelectorAll("[data-modal-open]");
  const modalCloseButtons = document.querySelectorAll("[data-modal-close]");

  const openModal = (modal) => {
    if (!modal) return;

    modal.classList.add("is-show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-scroll-locked");
  };

  const closeModal = (modal) => {
    if (!modal) return;

    modal.classList.remove("is-show");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-scroll-locked");
  };

  modalOpenButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modalId = this.getAttribute("data-modal-open");
      const modal = document.getElementById(modalId);
      openModal(modal);
    });
  });

  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".ma-member-asset-modal");
      closeModal(modal);
    });
  });

  // 點背景關閉
  document.querySelectorAll(".ma-member-asset-modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      const isOverlay = event.target.classList.contains(
        "ma-member-asset-modal__overlay",
      );

      if (isOverlay) {
        closeModal(modal);
      }
    });
  });

  // ESC 關閉 Modal
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const activeModal = document.querySelector(
      ".ma-member-asset-modal.is-show",
    );
    if (activeModal) {
      closeModal(activeModal);
    }
  });
});
