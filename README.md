# LP de Growth Marketing da 2P

Landing page estática para revisão local. Não há framework, processo de build ou envio real de leads nesta primeira versão.

## Como abrir

1. Abra o PowerShell nesta pasta.
2. Inicie um servidor local:

```powershell
python -m http.server 4173
```

3. Acesse `http://localhost:4173` no navegador.

Abrir o arquivo HTML diretamente não é recomendado porque alguns recursos do navegador e integrações futuras dependem de um servidor local.

## Arquivos principais

1. `index.html`: estrutura, conteúdo, formulário e pontos de integração.
2. `assets/css/landing.css`: layout e ajustes visuais da LP.
3. `assets/js/config.js`: modo de prévia, GTM e estado das integrações RD Station.
4. `assets/js/main.js`: validação, consentimento e tracking.
5. `assets/bit-system`: runtime, fontes, logo e ícones locais do Bit System.

## Modo de prévia

`previewMode` começa como `true` em `assets/js/config.js`.

Nesse modo:

1. os três blocos de cases pendentes ficam visíveis;
2. o formulário valida os campos, mas não envia dados;
3. `form_submit` não é disparado;
4. o botão de WhatsApp informa que a integração ainda está pendente.

Antes de publicar, substitua os cases por dados aprovados e altere `previewMode` para `false`. Conteúdo pendente não será mostrado com esse valor.

## Integração do formulário RD Station

1. Crie no RD Station um formulário com os mesmos campos apresentados na prévia.
2. Cole o código oficial gerado dentro de `#rd-form-mount`, no final da seção de diagnóstico em `index.html`.
3. Mantenha os scripts oficiais com carregamento assíncrono sempre que o snippet permitir.
4. Altere `rdStation.form.enabled` para `true` em `assets/js/config.js`.
5. No callback de sucesso fornecido pelo RD Station, chame:

```javascript
window.LPGrowth.rdFormSuccess();
```

6. Se houver callback de erro, chame:

```javascript
window.LPGrowth.rdFormError();
```

O evento `form_submit` somente nasce em `rdFormSuccess`. Isso evita registrar conversão quando houve apenas clique ou tentativa de envio.

Não adicione chave de API no navegador. Esta página foi preparada para usar o formulário nativo.

## Integração do WhatsApp RD Station

1. Cole o snippet oficial antes do fechamento de `body` em `index.html`.
2. Defina `rdStation.whatsapp.enabled` como `true`.
3. Preencha `rdStation.whatsapp.launcherSelector` com o seletor do botão criado pelo snippet.

O botão secundário da LP acionará esse launcher e registrará `click_whatsapp_rdstation`. Não existe fallback direto para `wa.me`.

## GTM e consentimento

O contêiner padrão é `GTM-KLSL6ZL`. Ele pode ser trocado em `assets/js/config.js`.

O GTM não é solicitado antes do aceite no aviso de mensuração. A escolha fica guardada no navegador pela chave `lp_growth_consent_v1`.

Para testar o aviso novamente, execute no console:

```javascript
localStorage.removeItem("lp_growth_consent_v1");
location.reload();
```

Eventos disponíveis no `dataLayer`:

1. `click_cta_diagnostico`
2. `form_start`
3. `form_submit`
4. `click_whatsapp_rdstation`

Nenhum evento recebe nome, email, empresa ou outro dado digitado no formulário.

## Checklist antes de publicar

1. Aprovar ou remover todos os cases pendentes.
2. Testar uma conversão real no RD Station e confirmar a entrada na automação.
3. Confirmar que `form_submit` aparece uma única vez no modo de prévia do GTM.
4. Testar o launcher do WhatsApp RD Station.
5. Revisar telefone, email, CNPJ e política de privacidade.
6. Alterar `previewMode` para `false`.
7. Validar a página em celular, tablet e desktop.
