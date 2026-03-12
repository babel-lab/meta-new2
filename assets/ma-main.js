(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
document.documentElement.classList.add("is-js-ready");
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".ma-header");
  if (!header) return;
  header.classList.remove("is-sticky");
  const onScroll = () => {
    header.classList.toggle("is-sticky", window.scrollY > 0);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const menuClose = document.getElementById("menu-close");
  const langToggleMobile = document.getElementById("lang-toggle-mobile");
  const langToggleDesktop = document.getElementById("lang-toggle-pc");
  const drawerLangToggle = document.getElementById("drawer-lang-toggle");
  const overlay = document.getElementById("menu-overlay");
  const drawer = document.getElementById("mobile-drawer");
  const menuContent = document.getElementById("menu-content");
  const langContent = document.getElementById("lang-content");
  const body = document.body;
  const tabButtons = document.querySelectorAll("[data-menu-tab]");
  const tabPanels = document.querySelectorAll("[data-menu-panel]");
  if (!drawer || !overlay || !menuContent || !langContent) return;
  const switchMenuTab = (tabName) => {
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
  const openDrawer = (type) => {
    if (type === "nav") {
      menuContent.classList.remove("is-hidden");
      langContent.classList.add("is-hidden");
      if (tabButtons.length && tabPanels.length) {
        switchMenuTab("explore");
      }
    } else {
      langContent.classList.remove("is-hidden");
      menuContent.classList.add("is-hidden");
    }
    drawer.hidden = false;
    requestAnimationFrame(() => {
      drawer.classList.add("is-open");
      overlay.classList.add("is-show");
      body.classList.add("is-scroll-locked");
      drawer.setAttribute("aria-hidden", "false");
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close menu");
        menuToggle.classList.add("is-active");
      }
      drawer.focus();
    });
  };
  const closeDrawer = () => {
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-show");
    body.classList.remove("is-scroll-locked");
    drawer.setAttribute("aria-hidden", "true");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Menu");
      menuToggle.classList.remove("is-active");
    }
  };
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
  if (menuClose) {
    menuClose.addEventListener("click", closeDrawer);
  }
  [langToggleMobile, langToggleDesktop, drawerLangToggle].forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openDrawer("lang");
      });
    }
  });
  if (overlay) {
    overlay.addEventListener("click", closeDrawer);
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
  if (tabButtons.length && tabPanels.length) {
    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.dataset.menuTab;
        switchMenuTab(targetTab);
      });
    });
  }
  const drawerLinks = drawer.querySelectorAll("a");
  drawerLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const targetHref = link.getAttribute("href");
      console.log("使用者點擊了：", link.textContent, "目標：", targetHref);
      closeDrawer();
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const detailToggles = document.querySelectorAll(
    ".ma-member-asset-card__detail-toggle"
  );
  detailToggles.forEach((toggle) => {
    toggle.addEventListener("click", function() {
      const detailBlock = this.closest(".ma-member-asset-card__detail");
      if (!detailBlock) return;
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", String(!isExpanded));
      detailBlock.classList.toggle("is-open", !isExpanded);
    });
  });
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
    button.addEventListener("click", function() {
      const modalId = this.getAttribute("data-modal-open");
      const modal = document.getElementById(modalId);
      openModal(modal);
    });
  });
  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", function() {
      const modal = this.closest(".ma-member-asset-modal");
      closeModal(modal);
    });
  });
  document.querySelectorAll(".ma-member-asset-modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      const isOverlay = event.target.classList.contains(
        "ma-member-asset-modal__overlay"
      );
      if (isOverlay) {
        closeModal(modal);
      }
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const activeModal = document.querySelector(
      ".ma-member-asset-modal.is-show"
    );
    if (activeModal) {
      closeModal(activeModal);
    }
  });
});
