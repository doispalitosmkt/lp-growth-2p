# Prompt para o Codex — Nova LP de Growth Marketing (2P Growth Lab / Dois Palitos)

> Cole todo o conteúdo abaixo no Codex como uma única tarefa. Foi escrito para ser autossuficiente.

---

## 0) Papel e objetivo

Você é engenheiro(a) de front-end com cabeça de growth designer. Crie uma **landing page (LP) nova, focada em GROWTH MARKETING**, para a agência **2P Growth Lab (Dois Palitos)**. Essa LP vai virar o **destino dos anúncios** no lugar da página atual (home / tráfego), que hoje converte mal e não posiciona a 2P como especialista em growth.

A LP tem **um único objetivo de negócio: gerar LEADS QUALIFICADOS B2B** (decisores de médias empresas) — e **não** cliques genéricos de WhatsApp. Toda decisão de estrutura, copy e CTA precisa servir a esse objetivo.

## 1) Ordem de trabalho (siga à risca)

1. **Leia o Design System** (seção 2) **antes** de escrever qualquer linha de código. Não invente estilo próprio.
2. **Antes de codar, PROPONHA e PARE:** me devolva (a) o wireframe em texto (seções na ordem), (b) o esqueleto da copy por seção, (c) os campos do formulário e (d) a lista de eventos de tracking. Espere meu **OK**.
3. Depois do OK, **construa** os arquivos.
4. Rode o **checklist** (seção 9) e me entregue um resumo do que fez + como rodar/testar localmente.

## 2) Design System — "Bit System" (leitura obrigatória)

A 2P tem um design system próprio, dark-first e retrô-gamer, chamado **Bit System**. Ele já é **legível por IA**. Consuma nesta ordem (fonte: o próprio site do DS):

**Base:** `https://bitsystem.doispalitosmkt.com.br/`

**Ordem de leitura para agentes:**
1. `SKILL.md` (guardrails, o que NÃO assumir)
2. `ai/llms.txt`
3. `ai/system.json`
4. `ai/components.json`
5. `ai/recipes.json`
6. `ai/templates.json`
7. `ai/assets.json`
8. `tokens.json`
9. `assets/manifest.json`

**Runtime público (use direto):** `tokens.css` e `components.css`.
**Exemplos prontos p/ copiar:** `examples/landing-page.html`, `examples/proposta-comercial.html`.
**Páginas úteis:** `pages/sections.html`, `pages/recipes.html`, `pages/components.html`, `pages/colors.html`, `pages/typography.html`, `pages/voice.html`.

**Regras inquebráveis do DS:**
- **Tema dark-first** (`<html data-theme="dark">`). Light é só para PDF/proposta — não é o caso aqui.
- **Só duas fontes:** VT323 (display/pixel) + Inconsolata (corpo/mono). Nenhuma outra.
- **Neon em no máximo 1 CTA por tela.** O CTA principal é o botão neon.
- **Copy em minúscula**, tom retrô-gamer direto (ver `pages/voice.html`).
- **Comece pelos recipes** e pelas seções do DS em vez de montar do zero. Recipes reais: **Mission, Boss Stats, Save Point, Player, Console, Ticker**. Seções: nav, hero, CTA, testimonials, footer.
- Se o repositório do Bit System estiver montado localmente, **leia os arquivos locais**; senão, **baixe pelas URLs acima**.

## 3) Stack e formato de entrega

**Padrão:** LP **estática em HTML + CSS**, consumindo `tokens.css` + `components.css` do Bit System (vendorize os arquivos localmente para a página ser rápida e autossuficiente). **JS mínimo**, só para validação do formulário, disparo de eventos e microinterações. Sem framework pesado, a menos que eu peça.
Entregue na raiz do projeto (ex.: `index.html`, `assets/…`) com um `README.md` curto: como rodar e onde trocar textos/links.

## 4) Contexto da empresa

- **2P Growth Lab (Dois Palitos)** — agência de marketing digital / growth em São Paulo. Posicionamento: "não somos uma agência padrão"; entra com **mentalidade de sócio**, foco em **resultado e crescimento**, não em métrica de vaidade.
- Serviços: gestão de **tráfego pago** (Google/Meta/etc.), **consultoria de gestão de leads / vendas** (CRM, treinamento, sprints), **criação de sites e LPs**, **SEO e conteúdo**.
- Contato: WhatsApp `+55 (11) 96356-3678` (`https://wa.me/5511963563678`), e-mail `contato@doispalitosmkt.com.br`.
- Tagline forte já existente (pode reusar/adaptar): **"Temos a fórmula do sucesso? Não. Temos o método que gera a fórmula? Sim."**

## 5) Estratégia — saída da etapa "Definir" (Double Diamond). Esta é a espinha do conteúdo.

### 5.1 Público que DEVE chegar (ICP — atrair)
- Donos, CEOs, diretores comerciais e gerentes de marketing que **precisam escalar vendas**.
- Proprietários de **médias empresas**, empreendedores, negócios que **querem investir em crescimento**.
- Negócios que **já têm orçamento para tráfego** e procuram um **parceiro estratégico / growth lab** para acelerar resultado — **não** "alguém pra fazer post".

### 5.2 Perfis que devemos REPELIR (a copy NÃO pode atraí-los)
- Quem busca **emprego** (estagiário, PJ, candidato a vaga).
- Quem busca **aprendizado** (estudante, curso, certificação).
- **Fornecedores, freelancers, influencers.**
- Pessoa física caçando **"dica de marketing" grátis** ou análise de site **sem intenção de compra**.

→ Implicação: a linguagem fala com **decisor de empresa**, com foco comercial. Nada de isca genérica que atraia curioso.

### 5.3 Intenção de busca a capturar (SEO + mensagem)
Contratar agência de marketing digital; encontrar **empresa de Growth Marketing**; estruturar/otimizar a estratégia de marketing; contratar gestão de Google/Meta Ads; criar/reformular site; melhorar SEO; social media.
Termos-alvo: **"empresas de growth"**, "agência de marketing digital B2B", "consultoria de vendas e tráfego", "terceirizar marketing digital".

### 5.4 Proposta de valor a comunicar
- Atendimento **consultivo** e **acompanhamento contínuo**.
- Foco em **crescimento e resultado**, não em métrica de vaidade.
- Equipe especialista em **mídia paga, SEO, criação de sites e automação**.
- **Impulsionar crescimento via Growth Marketing orientado por dados.**

### 5.5 O que é um LEAD QUALIFICADO (isto define o CTA e o formulário)
- É **proprietário / sócio / gestor** disposto a conversar sobre estratégia.
- Tem interesse real nos serviços e **busca resolver um desafio de marketing/vendas**.
- **Não** clica num "WhatsApp" genérico — clica em **"Agendar Diagnóstico Comercial"** ou **"Receber Proposta"**.
- Preenche um formulário de negócio com: **e-mail corporativo, nome da empresa/site, cargo (mostra que é decisor) e desafio do negócio**.

### 5.6 Métricas (isto define o tracking)
- Aquisição: impressões, cliques, CTR, CPC, taxa de conversão, conversões, CPA.
- Qualidade: **MQL**, taxa de qualificação de leads.

→ A conversão principal é o **envio do formulário** (evento rastreável). CTAs distintos = eventos distintos.

### 5.7 Dados reais que ORIENTAM a página (use como bússola)
- **Clarity (heatmap): o bloco que mais reteve atenção foi a explicação do CICLO DE GROWTH.** → vire a **seção-assinatura** da LP, protagonista, logo depois do hero.
- **Palavra-chave nº 1 no Planejador do Google: "growth marketing".** → ancore título, H1, meta description e a narrativa nela.
- Na home atual, **o bloco de growth é o mais visitado.** → growth é o eixo, não os serviços soltos.

## 6) Estrutura da página (proposta inicial — refine e me mostre no passo 1)

Ordem sugerida (mapeie cada uma a um recipe/seção do DS):
1. **Nav** minimal (logo + 1 CTA neon "agendar diagnóstico"). — seção `nav`.
2. **Hero** — H1 com "growth marketing" + subhead de proposta de valor + CTA principal neon + microprova. — `hero`.
3. **Ciclo de Growth (SEÇÃO-ASSINATURA)** — explique o método/loop **Análise → Planejamento → Execução** (ciclo contínuo de melhoria). Visual forte, é o que prende atenção. Reaproveite/recrie o diagrama `ciclo-de-growth`. — recipe `Mission` / `Console`.
4. **"Não somos uma agência padrão"** — dor + contraste (o que a 2P faz × o que uma agência convencional faz). Repele o público errado e qualifica o certo.
5. **O que fazemos (growth-first)** — tráfego pago, gestão de leads/vendas, sites/LP, SEO/conteúdo — sempre amarrado a crescimento/resultado. — cards / `Player`.
6. **Resultados / cases** — nichos e conquistas ("checkpoints"). Use `Boss Stats` para KPIs. **Não invente números** — use placeholders claros se não houver dado.
7. **Prova social** — depoimentos reais do site atual (ex.: Humberto De Biase / mentor Endeavor; Júnior / JDR Solar; Simone Seimetz). — `testimonials`.
8. **CTA final + FORMULÁRIO de Diagnóstico Comercial** — o momento de conversão, integrado ao RD Station. O botão de WhatsApp (RD Station Conversas) aparece aqui como opção secundária, não-neon. — recipe `Save Point`.
9. **Footer** — contato, selos, redes. — `footer`.

## 7) Copy e tom
- Minúscula, retrô-gamer, direto e confiante; fala com **decisor B2B**.
- Vocabulário de **crescimento / resultado / método / dados**, não de "posts e engajamento".
- Escreva para **qualificar**: deixe claro que é para empresa com orçamento e intenção — não para curioso, candidato ou caçador de brinde.
- Todos os textos são **direção/rascunho**, não copy final: proponha as versões no passo 1.

## 8) Conversão, formulário e tracking (via RD Station)

A 2P usa **RD Station**. A LP tem dois pontos de contato — um formulário (conversão principal) e um botão de WhatsApp — **ambos pelo RD Station**, para o lead cair na automação com lead scoring e virar MQL.

- **CTA principal (botão neon):** "agendar diagnóstico comercial" (alternativa: "receber proposta") → leva ao formulário. **Um único CTA neon por tela.**
- **Formulário de Diagnóstico Comercial** (campos): nome, **e-mail corporativo**, **nome da empresa / site**, **cargo**, **desafio de negócio** (textarea). Integração com **RD Station Marketing**, em ordem de preferência:
  1. **Formulário custom estilizado 100% no Bit System** que envia para o RD Station via integração/API — mantém a fidelidade visual do DS, que é rígido.
  2. Se preferirem o tracking/scoring nativo automático: **embutir o formulário nativo do RD Station** e **sobrescrever o CSS** para casar com o DS (tokens de cor, VT323/Inconsolata, inputs do DS).
  Deixe o **ID/token do formulário do RD Station parametrizável** (não hardcode). Consulte a **documentação atual do RD Station** para o snippet correto.
- **Botão de WhatsApp = RD Station (RD Station Conversas).** É o CTA **secundário** (não-neon), presente mas nunca protagonista. Deixe o ID/snippet configurável e consulte a doc atual do RD Station Conversas. Carregue os scripts de forma assíncrona (`async`/`defer`) para não pesar a página.
- **Fonte de verdade do MQL = RD Station** (via formulário). **Além disso**, dispare eventos no `dataLayer` para o GTM (`GTM-KLSL6ZL`, ou parametrizável): `click_cta_diagnostico`, `form_start`, `form_submit`, `click_whatsapp_rdstation`. Garanta que a conversão do RD e o evento do GTM não se dupliquem/contradigam — documente no README qual mede o quê.

## 9) Checklist / Definition of Done
- [ ] Segue o Bit System (dark, VT323 + Inconsolata, recipes reais, **1 CTA neon por tela**).
- [ ] "growth marketing" no `<title>`, meta description e H1; HTML semântico.
- [ ] Ciclo de Growth é visualmente o ponto alto, logo após o hero.
- [ ] Copy qualifica o ICP e **não** atrai os perfis a filtrar.
- [ ] Conversão principal = formulário integrado ao **RD Station** (MQL); WhatsApp via RD Station como **secundário**, não-neon.
- [ ] Eventos de tracking implementados e testáveis via `dataLayer`.
- [ ] Responsivo (mobile-first) e acessível (contraste, foco, labels, alt).
- [ ] Rápido: imagens otimizadas, sem libs desnecessárias.
- [ ] Nenhum logo / depoimento / número inventado.

## 10) Não faça
- Não use outras fontes além de VT323 + Inconsolata.
- WhatsApp (via RD Station) é o CTA **secundário** — nunca o botão neon principal.
- Não crie isca de "análise grátis" solta que atraia curioso sem intenção — se houver lead magnet, **gate atrás de qualificação de negócio**.
- Não invente clientes, logos ou métricas.
- Não fuja da gramática visual do DS "para ficar mais bonito".
