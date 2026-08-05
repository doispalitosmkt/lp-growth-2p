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
3. `assets/js/config.js`: modo de prévia, avaliações do Google, GTM e estado das integrações RD Station.
4. `assets/js/main.js`: validação, consentimento, tracking e controles das avaliações.
5. `assets/bit-system`: runtime, fontes, logo e ícones locais do Bit System.

## Modo de prévia

`previewMode` começa como `true` em `assets/js/config.js`.

Nesse modo:

1. os três cases demonstrativos com dados fictícios ficam visíveis;
2. o formulário valida os campos, mas não envia dados;
3. `form_submit` não é disparado;
4. o WhatsApp abre com uma mensagem preenchida, mas o envio continua dependendo da confirmação do usuário no aplicativo.

Os cases demonstrativos incluem segmentos, períodos, narrativas e resultados inventados apenas para validar o formato visual. Antes de publicar, substitua todo esse conteúdo por dados aprovados e altere `previewMode` para `false`. Conteúdo demonstrativo não será mostrado com esse valor.

## Integração do formulário RD Station

1. Crie no RD Station um formulário com os mesmos campos apresentados na prévia, incluindo o campo obrigatório de WhatsApp.
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

No envio do formulário nativo, a página abre o WhatsApp com a mensagem pronta enquanto o RD Station processa o lead. O evento `form_submit` somente nasce em `rdFormSuccess`. Isso evita registrar conversão quando houve apenas clique ou tentativa de envio.

Não adicione chave de API no navegador. Esta página foi preparada para usar o formulário nativo.

## WhatsApp gerado pelo formulário

O número comercial fica centralizado em `whatsapp.destinationPhone`, dentro de `assets/js/config.js`. O valor atual é `5511963563678`.

Depois que os campos obrigatórios são validados, a página monta um link `wa.me` com nome, email, WhatsApp, empresa, cargo, investimento mensal em mídia e desafio. O link abre em uma nova aba, com a mensagem pronta. O usuário ainda precisa confirmar o envio no WhatsApp.

Quando o formulário nativo do RD Station for adicionado, ajuste `whatsapp.fieldSelectors` em `assets/js/config.js` para os seletores reais gerados pelo RD. A abertura ocorre no evento de envio do formulário, sem impedir o processamento normal do RD Station. O callback `rdFormSuccess` continua sendo a confirmação oficial da conversão.

Se o navegador bloquear a nova aba, a mensagem de status exibirá um link manual com o mesmo conteúdo preenchido.

## Política de privacidade

Os links do formulário, rodapé e aviso de mensuração abrem a política em um modal dentro da própria LP. O modal fecha pelo botão superior, pelo botão final, por clique fora do conteúdo ou pela tecla `Escape`. Ao fechar, o foco retorna ao link que iniciou a abertura.

## Avaliações do Google

A prova social inclui uma fotografia estática das 26 avaliações públicas consultadas em 5 de agosto de 2026. Os textos, atributos, autores e datas estão no HTML para permanecerem acessíveis mesmo sem JavaScript.

Nota, quantidade, fonte e data de atualização ficam em `googleReviews`, dentro de `assets/js/config.js`. A atualização é manual. A página não usa API, chave ou carregamento remoto do Google.

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
4. `open_whatsapp_diagnostico`

Nenhum evento do `dataLayer` recebe nome, email, WhatsApp, empresa ou outro dado digitado no formulário. Esses dados aparecem somente no formulário do RD Station e na mensagem codificada no link do WhatsApp, conforme a ação solicitada pelo usuário.

## Checklist antes de publicar

1. Substituir todos os cases demonstrativos por nomes, períodos, métricas, fontes e depoimentos aprovados.
2. Testar uma conversão real no RD Station e confirmar a entrada na automação.
3. Confirmar que `form_submit` aparece uma única vez no modo de prévia do GTM.
4. Confirmar o mapeamento dos campos do formulário RD em `whatsapp.fieldSelectors`.
5. Testar a abertura do WhatsApp em celular e desktop, incluindo bloqueio de nova aba.
6. Revisar telefone, email, CNPJ e política de privacidade.
7. Alterar `previewMode` para `false`.
8. Validar a página em celular, tablet e desktop.
