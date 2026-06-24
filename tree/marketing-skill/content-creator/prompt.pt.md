# Content Creator → Redirecionado

> **Esta skill foi dividida em duas skills especialistas.** Use aquela que corresponde à sua intenção:

| Você quer... | Use isto em vez disso |
|----------------|-----------------|
| **Escrever** um post de blog, artigo ou guia | [content-production](../content-production/) |
| **Planejar** que conteúdo criar, clusters de tópicos, calendário | [content-strategy](../content-strategy/) |
| **Analisar voz da marca** | [content-production](../content-production/) (inclui `brand_voice_analyzer.py`) |
| **Otimizar SEO** para conteúdo existente | [content-production](../content-production/) (inclui `seo_optimizer.py`) |
| **Criar conteúdo para mídias sociais** | [social-content](../social-content/) |

## Por que Mudou

A skill `content-creator` original tentava fazer tudo: planejamento, redação, SEO, social, voz da marca. Isso a tornava um faz-tudo. As skills especialistas fazem cada trabalho melhor:

- **content-production** — Pipeline completo: pesquisa → briefing → rascunho → otimização → publicação. Inclui todas as ferramentas Python do content-creator original.
- **content-strategy** — Planejamento estratégico: clusters de tópicos, pesquisa de palavras-chave, calendários editoriais, frameworks de priorização.

## Gatilhos Proativos

- **Usuário pede "content creator"** → Redirecionar para content-production (intenção mais provável é redação).
- **Usuário pede "content plan" ou "o que devo escrever"** → Redirecionar para content-strategy.

## Artefatos de Saída

| Quando você pedir... | Direcionado para... |
|---------------------|-------------|
| "Escrever um post de blog" | content-production |
| "Calendário editorial" | content-strategy |
| "Análise de voz da marca" | content-production (`brand_voice_analyzer.py`) |
| "Otimização de SEO" | content-production (`seo_optimizer.py`) |

## Comunicação

Esta é uma skill de redirecionamento. Direcione o usuário à skill especialista correta — não tente tratar a solicitação aqui.

## Skills Relacionadas

- **content-production**: Pipeline completo de execução de conteúdo (sucessora).
- **content-strategy**: Planejamento de conteúdo e seleção de tópicos (sucessora).
- **content-humanizer**: Pós-processamento de conteúdo de IA para soar autêntico.
- **marketing-context**: Contexto base que ambas as sucessoras leem.