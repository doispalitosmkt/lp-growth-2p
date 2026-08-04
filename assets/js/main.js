(function () {
  "use strict";

  const config = window.LP_CONFIG || {};
  const previewMode = config.previewMode === true;
  const rdConfig = config.rdStation || {};
  const rdFormConfig = rdConfig.form || {};
  const rdWhatsappConfig = rdConfig.whatsapp || {};
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
  let primaryCtaObserver = null;
  const primaryCtaVisibility = new Map();

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

  function getErrorMessage(field) {
    if (field.type === "checkbox" && !field.checked) {
      return "confirme a autorização para continuar.";
    }

    if (!String(field.value || "").trim()) {
      return "preencha este campo.";
    }

    if (field.type === "email" && field.validity.typeMismatch) {
      return "informe um email válido.";
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

  function setFormStatus(message, status) {
    const statusElement = document.getElementById("form-status");

    if (!statusElement) {
      return;
    }

    statusElement.textContent = message;
    statusElement.dataset.status = status || "info";
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

      setFormStatus("prévia validada. nenhum lead foi enviado ao RD Station.", "info");
    });
  }

  function wireNativeRdForm(form) {
    if (!form || form.dataset.lpWired === "true") {
      return;
    }

    form.dataset.lpWired = "true";
    form.addEventListener("focusin", markFormStarted, { once: true });

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
    pushEvent("form_submit", {
      form_name: "diagnostico_comercial",
      conversion_source: "rd_station"
    });
    setFormStatus("checkpoint desbloqueado. recebemos seu contexto e a equipe vai avaliar o próximo passo.", "success");
  }

  function rdFormError() {
    setFormStatus("não foi possível concluir o envio. revise os dados e tente novamente.", "error");
  }

  function setupWhatsappTrigger() {
    const button = document.querySelector("[data-rd-whatsapp-trigger]");

    if (!button) {
      return;
    }

    button.addEventListener("click", function () {
      if (rdWhatsappConfig.enabled !== true) {
        setFormStatus("o WhatsApp via RD Station será ativado depois da configuração do código oficial.", "info");
        return;
      }

      const selector = String(rdWhatsappConfig.launcherSelector || "").trim();
      const launcher = selector ? document.querySelector(selector) : null;

      if (!launcher || launcher === button) {
        setFormStatus("o iniciador do WhatsApp via RD Station não foi encontrado.", "error");
        return;
      }

      pushEvent("click_whatsapp_rdstation", {
        cta_location: "formulario_secundario"
      });
      launcher.click();
    });
  }

  window.LPGrowth = Object.freeze({
    rdFormSuccess: rdFormSuccess,
    rdFormError: rdFormError
  });

  setupPreviewVisibility();
  setupConsentBanner();
  setupPrimaryCtaObserver();
  setupDiagnosticCtaTracking();
  setupPreviewForm();
  setupNativeRdForm();
  setupWhatsappTrigger();
})();
