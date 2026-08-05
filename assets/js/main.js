(function () {
  "use strict";

  const config = window.LP_CONFIG || {};
  const previewMode = config.previewMode === true;
  const rdConfig = config.rdStation || {};
  const rdFormConfig = rdConfig.form || {};
  const whatsappConfig = config.whatsapp || {};
  const pageType = "lp_growth";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500
  });

  let gtmLoaded = false;
  let formStarted = false;
  let realFormSubmitted = false;
  let activeRdForm = null;
  let privacyReturnFocus = null;
  let primaryCtaObserver = null;
  const primaryCtaVisibility = new Map();
  const whatsappOpenedForms = new WeakSet();

  function pushEvent(eventName, parameters) {
    window.dataLayer.push(Object.assign({
      event: eventName,
      page_type: pageType
    }, parameters || {}));
  }

  function readStoredConsent() {
    try {
      return window.localStorage.getItem(config.consentStorageKey || "lp_growth_consent_v1");
    } catch (error) {
      return null;
    }
  }

  function storeConsent(value) {
    try {
      window.localStorage.setItem(config.consentStorageKey || "lp_growth_consent_v1", value);
    } catch (error) {
      return;
    }
  }

  function loadGtm() {
    const containerId = String(config.gtmContainerId || "").trim();

    if (gtmLoaded || !/^GTM-[A-Z0-9]+$/i.test(containerId)) {
      return;
    }

    gtmLoaded = true;
    window.dataLayer.push({
      "gtm.start": Date.now(),
      event: "gtm.js"
    });

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(containerId);
    document.head.appendChild(script);
  }

  function grantMeasurement() {
    window.gtag("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted"
    });
    loadGtm();
  }

  function denyMeasurement() {
    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied"
    });
  }

  function setupConsentBanner() {
    const banner = document.querySelector("[data-consent-banner]");
    const acceptButton = document.querySelector("[data-consent-accept]");
    const rejectButton = document.querySelector("[data-consent-reject]");

    if (!banner || !acceptButton || !rejectButton) {
      return;
    }

    const storedConsent = readStoredConsent();

    if (storedConsent === "granted") {
      grantMeasurement();
      return;
    }

    if (storedConsent === "denied") {
      denyMeasurement();
      return;
    }

    banner.hidden = false;

    acceptButton.addEventListener("click", function () {
      storeConsent("granted");
      grantMeasurement();
      banner.hidden = true;
    });

    rejectButton.addEventListener("click", function () {
      storeConsent("denied");
      denyMeasurement();
      banner.hidden = true;
    });
  }

  function setupPreviewVisibility() {
    document.querySelectorAll("[data-preview-only]").forEach(function (element) {
      element.hidden = !previewMode;
    });

    document.querySelectorAll("[data-preview-notice]").forEach(function (element) {
      element.hidden = !previewMode;
    });
  }

  function updateNavCta() {
    const navCta = document.querySelector("[data-nav-cta]");

    if (!navCta) {
      return;
    }

    const anotherPrimaryIsVisible = Array.from(primaryCtaVisibility.values()).some(Boolean);
    navCta.classList.toggle("btn-primary", !anotherPrimaryIsVisible);
    navCta.classList.toggle("btn-ghost", anotherPrimaryIsVisible);
  }

  function observePrimaryCta(element) {
    if (!element || !primaryCtaObserver || primaryCtaVisibility.has(element)) {
      return;
    }

    primaryCtaVisibility.set(element, false);
    primaryCtaObserver.observe(element);
  }

  function setupPrimaryCtaObserver() {
    if (!("IntersectionObserver" in window)) {
      return;
    }

    primaryCtaObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.2;
        primaryCtaVisibility.set(entry.target, visible);
      });
      updateNavCta();
    }, {
      threshold: [0, 0.2, 0.6]
    });

    document.querySelectorAll("[data-primary-cta]").forEach(observePrimaryCta);
  }

  function setupDiagnosticCtaTracking() {
    document.querySelectorAll("[data-track-diagnostico]").forEach(function (element) {
      element.addEventListener("click", function () {
        pushEvent("click_cta_diagnostico", {
          cta_location: element.dataset.ctaLocation || "nao_informado",
          cta_text: element.textContent.trim().replace(/\s+/g, " ")
        });
      });
    });
  }

  function markFormStarted() {
    if (formStarted) {
      return;
    }

    formStarted = true;
    pushEvent("form_start", {
      form_name: "diagnostico_comercial"
    });
  }

  const PERSONAL_EMAIL_DOMAINS = new Set([
    "gmail.com", "googlemail.com",
    "hotmail.com", "hotmail.com.br", "outlook.com", "outlook.com.br",
    "live.com", "live.com.br", "msn.com",
    "yahoo.com", "yahoo.com.br", "ymail.com", "rocketmail.com",
    "icloud.com", "me.com", "mac.com", "aol.com",
    "bol.com.br", "uol.com.br", "terra.com.br", "ig.com.br", "globo.com", "globomail.com",
    "gmx.com", "zoho.com", "proton.me", "protonmail.com", "yandex.com", "mail.com"
  ]);

  function isPersonalEmail(value) {
    const at = String(value || "").trim().toLowerCase().lastIndexOf("@");

    if (at === -1) {
      return false;
    }

    return PERSONAL_EMAIL_DOMAINS.has(value.trim().toLowerCase().slice(at + 1));
  }

  function getErrorMessage(field) {
    if (field.type === "checkbox" && !field.checked) {
      return "confirme a autorização para continuar.";
    }

    if (!String(field.value || "").trim()) {
      return "preencha este campo.";
    }

    if (field.type === "email") {
      if (field.validity.typeMismatch) {
        return "informe um email válido.";
      }

      if (isPersonalEmail(field.value)) {
        return "use um email corporativo (o do trabalho), não um pessoal.";
      }
    }

    if (field.type === "tel" && (
      field.validity.patternMismatch ||
      field.validity.tooShort ||
      String(field.value || "").replace(/\D/g, "").length < 10
    )) {
      return "informe um WhatsApp válido com DDD.";
    }

    if (field.validity.tooShort) {
      return "conte um pouco mais sobre o desafio.";
    }

    return "";
  }

  function validateField(field) {
    if (!field.required) {
      return true;
    }

    const message = getErrorMessage(field);
    const errorElement = document.getElementById(field.id + "-error");

    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (errorElement) {
      errorElement.textContent = message;
    }

    return !message;
  }

  function setFormStatus(message, status, action) {
    const statusElement = document.getElementById("form-status");

    if (!statusElement) {
      return;
    }

    statusElement.textContent = message;
    statusElement.dataset.status = status || "info";

    if (action && action.url) {
      const link = document.createElement("a");
      link.href = action.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = action.label || "abrir WhatsApp";
      statusElement.append(document.createTextNode(" "), link);
    }
  }

  function findWhatsappField(form, key) {
    const selectors = whatsappConfig.fieldSelectors || {};
    const selector = String(selectors[key] || "").trim();

    if (!form || !selector) {
      return null;
    }

    try {
      return form.querySelector(selector);
    } catch (error) {
      return null;
    }
  }

  function readWhatsappField(form, key) {
    const field = findWhatsappField(form, key);

    if (!field) {
      return "";
    }

    if (field.tagName === "SELECT") {
      const selectedOption = field.options[field.selectedIndex];
      return selectedOption ? selectedOption.textContent.trim() : "";
    }

    return String(field.value || "").trim();
  }

  function collectWhatsappLead(form) {
    return {
      name: readWhatsappField(form, "name"),
      email: readWhatsappField(form, "email"),
      whatsapp: readWhatsappField(form, "whatsapp"),
      company: readWhatsappField(form, "company"),
      role: readWhatsappField(form, "role"),
      investment: readWhatsappField(form, "investment"),
      challenge: readWhatsappField(form, "challenge")
    };
  }

  function buildWhatsappUrl(form) {
    const destinationPhone = String(whatsappConfig.destinationPhone || "").replace(/\D/g, "");
    const lead = collectWhatsappLead(form);
    const requiredKeys = ["name", "email", "whatsapp", "company", "role", "investment", "challenge"];
    const missingData = requiredKeys.some(function (key) {
      return !lead[key];
    });

    if (!/^\d{10,15}$/.test(destinationPhone) || missingData) {
      return "";
    }

    const message = [
      "Olá, equipe 2P! Quero agendar um diagnóstico comercial.",
      "",
      "Nome: " + lead.name,
      "Email: " + lead.email,
      "WhatsApp: " + lead.whatsapp,
      "Empresa: " + lead.company,
      "Cargo: " + lead.role,
      "Investimento mensal em mídia: " + lead.investment,
      "Desafio: " + lead.challenge
    ].join("\n");

    return "https://wa.me/" + destinationPhone + "?text=" + encodeURIComponent(message);
  }

  function openWhatsappForForm(form, source) {
    if (!form) {
      return false;
    }

    if (whatsappOpenedForms.has(form)) {
      return true;
    }

    const whatsappUrl = buildWhatsappUrl(form);

    if (!whatsappUrl) {
      setFormStatus("não foi possível montar a mensagem do WhatsApp. confirme o número comercial e o mapeamento dos campos.", "error");
      return false;
    }

    const whatsappWindow = window.open(whatsappUrl, "_blank");

    if (!whatsappWindow) {
      setFormStatus("o navegador impediu a abertura automática.", "error", {
        url: whatsappUrl,
        label: "abrir WhatsApp com a mensagem pronta"
      });
      return false;
    }

    whatsappWindow.opener = null;
    whatsappOpenedForms.add(form);
    pushEvent("open_whatsapp_diagnostico", {
      form_name: "diagnostico_comercial",
      open_source: source || "form_submit"
    });
    return true;
  }

  function setupPreviewForm() {
    const form = document.querySelector("[data-preview-form]");

    if (!form) {
      return;
    }

    form.addEventListener("focusin", markFormStarted, { once: true });

    Array.from(form.elements).forEach(function (field) {
      if (!field.id || !field.required) {
        return;
      }

      field.addEventListener("blur", function () {
        validateField(field);
      });

      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") {
          validateField(field);
        }
      });

      field.addEventListener("change", function () {
        if (field.getAttribute("aria-invalid") === "true") {
          validateField(field);
        }
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      markFormStarted();

      const requiredFields = Array.from(form.querySelectorAll("[required]"));
      const invalidFields = requiredFields.filter(function (field) {
        return !validateField(field);
      });

      if (invalidFields.length) {
        setFormStatus("revise os campos indicados para continuar.", "error");
        invalidFields[0].focus();
        return;
      }

      if (!previewMode && rdFormConfig.enabled !== true) {
        setFormStatus("o envio está indisponível até a integração do RD Station ser ativada.", "error");
        return;
      }

      const whatsappOpened = openWhatsappForForm(form, "preview_form");

      if (whatsappOpened) {
        setFormStatus("prévia validada. nenhum lead foi enviado ao RD Station. o WhatsApp foi aberto com a mensagem pronta.", "info");
      }
    });
  }

  function wireNativeRdForm(form) {
    if (!form || form.dataset.lpWired === "true") {
      return;
    }

    form.dataset.lpWired = "true";
    activeRdForm = form;
    form.addEventListener("focusin", markFormStarted, { once: true });
    form.addEventListener("submit", function () {
      const whatsappOpened = openWhatsappForForm(form, "rd_form_submit");

      if (whatsappOpened) {
        setFormStatus("enviando seus dados ao RD Station. o WhatsApp foi aberto com a mensagem pronta.", "info");
      }
    });

    const submit = form.querySelector("button[type='submit'], input[type='submit']");
    if (submit) {
      submit.setAttribute("data-primary-cta", "");
      observePrimaryCta(submit);
    }
  }

  function setupNativeRdForm() {
    if (rdFormConfig.enabled !== true) {
      return;
    }

    const previewForm = document.querySelector("[data-preview-form]");
    const previewNotice = document.querySelector("[data-preview-notice]");
    const mount = document.querySelector(rdFormConfig.mountSelector || "#rd-form-mount");

    if (previewForm) {
      previewForm.hidden = true;
    }
    if (previewNotice) {
      previewNotice.hidden = true;
    }
    if (!mount) {
      setFormStatus("o ponto de montagem do formulário RD Station não foi encontrado.", "error");
      return;
    }

    mount.hidden = false;
    mount.querySelectorAll("form").forEach(wireNativeRdForm);

    const observer = new MutationObserver(function () {
      mount.querySelectorAll("form").forEach(wireNativeRdForm);
    });
    observer.observe(mount, { childList: true, subtree: true });
  }

  function rdFormSuccess() {
    if (realFormSubmitted) {
      return;
    }

    realFormSubmitted = true;
    openWhatsappForForm(activeRdForm, "rd_form_success");
    pushEvent("form_submit", {
      form_name: "diagnostico_comercial",
      conversion_source: "rd_station"
    });
    setFormStatus("checkpoint desbloqueado. recebemos seu contexto e a equipe vai avaliar o próximo passo.", "success");
  }

  function rdFormError() {
    setFormStatus("não foi possível concluir o envio. revise os dados e tente novamente.", "error");
  }

  function setupPrivacyModal() {
    const modal = document.querySelector("[data-privacy-modal]");
    const triggers = document.querySelectorAll("[data-privacy-modal-trigger]");

    if (!modal || !triggers.length) {
      return;
    }

    function restorePrivacyFocus() {
      document.documentElement.classList.remove("privacy-modal-open");

      if (privacyReturnFocus && document.contains(privacyReturnFocus)) {
        privacyReturnFocus.focus({ preventScroll: true });
      }

      privacyReturnFocus = null;
    }

    function openPrivacyModal(trigger) {
      if (modal.open) {
        return;
      }

      privacyReturnFocus = trigger;
      document.documentElement.classList.add("privacy-modal-open");

      if (typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        modal.setAttribute("open", "");
        modal.setAttribute("aria-modal", "true");
      }

      const closeButton = modal.querySelector("[data-privacy-modal-close]");
      if (closeButton) {
        closeButton.focus({ preventScroll: true });
      }
    }

    function closePrivacyModal() {
      if (!modal.open) {
        return;
      }

      if (typeof modal.close === "function") {
        modal.close();
      } else {
        modal.removeAttribute("open");
        modal.removeAttribute("aria-modal");
        restorePrivacyFocus();
      }
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function (event) {
        event.preventDefault();
        openPrivacyModal(trigger);
      });
    });

    modal.querySelectorAll("[data-privacy-modal-close]").forEach(function (button) {
      button.addEventListener("click", closePrivacyModal);
    });

    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closePrivacyModal();
      }
    });

    modal.addEventListener("close", restorePrivacyFocus);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.open && typeof modal.showModal !== "function") {
        closePrivacyModal();
      }
    });
  }

  window.LPGrowth = Object.freeze({
    rdFormSuccess: rdFormSuccess,
    rdFormError: rdFormError,
    buildWhatsappUrl: buildWhatsappUrl
  });

  setupPreviewVisibility();
  setupConsentBanner();
  setupPrimaryCtaObserver();
  setupDiagnosticCtaTracking();
  setupPreviewForm();
  setupNativeRdForm();
  setupPrivacyModal();
})();
