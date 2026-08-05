window.LP_CONFIG = Object.freeze({
  previewMode: true,
  gtmContainerId: "GTM-KLSL6ZL",
  consentStorageKey: "lp_growth_consent_v1",
  rdStation: Object.freeze({
    form: Object.freeze({
      enabled: false,
      mountSelector: "#rd-form-mount"
    })
  }),
  whatsapp: Object.freeze({
    destinationPhone: "5511963563678",
    fieldSelectors: Object.freeze({
      name: "[name='nome']",
      email: "[name='email']",
      whatsapp: "[name='whatsapp']",
      company: "[name='empresa']",
      role: "[name='cargo']",
      investment: "[name='investimento']",
      challenge: "[name='desafio']"
    })
  })
});
