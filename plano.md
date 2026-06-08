# Plano de Execução — Transcritor de lousa e slides para texto alternativo com Inteligência Artificial

## Descrição do Problema

Alunos cegos ou com baixa visão enfrentam barreiras diárias na sala de aula quando professores utilizam conteúdos puramente visuais: anotações no quadro, esquemas com setas, gráficos e slides sem descrição alternativa. O material existe fisicamente, mas os softwares leitores de tela não conseguem interpretar imagens, deixando esses estudantes sem acesso ao conteúdo ensinado.

## Usuários-Alvo

### Professor
Qualquer professor de qualquer nível de ensino (fundamental, médio ou superior) e qualquer tipo de escola (pública ou privada). O professor acessa o sistema para fazer upload de fotos da lousa ou slides e obter uma descrição textual estruturada gerada por IA, salvando-a com um título para que os alunos possam acessá-la depois.

### Estudante com deficiência visual
Alunos cegos ou com baixa visão de qualquer faixa etária e tipo de instituição. O foco principal do sistema é esse usuário: ele acessa o histórico de transcrições em casa ou em qualquer lugar, pelo computador ou celular, e usa seu software leitor de tela (como NVDA, JAWS ou o leitor nativo do sistema operacional) para ouvir o conteúdo da aula que foi transcrito pela IA. O sistema é projetado para que o texto gerado seja compatível com essas ferramentas — estruturado, sem ambiguidades visuais e com semântica clara.

### Contexto de uso
O professor realiza o upload durante ou após a aula. O estudante acessa o conteúdo posteriormente, de forma autônoma, no seu próprio ritmo e dispositivo.

---

## Requisitos de Acessibilidade do Frontend

Por atender diretamente a usuários com deficiência visual, o frontend precisa seguir boas práticas de acessibilidade:

- Uso correto de atributos `aria-label`, `aria-live` e `role` para que leitores de tela descrevam os elementos da interface
- Navegação completa por teclado (sem depender do mouse)
- Contraste adequado de cores
- Texto do resultado da transcrição exibido em formato semântico, compatível com leitores de tela

---

## Entidades do Sistema

### User
| Campo | Tipo | Descrição |
|---|---|---|
| id | Integer (PK) | Identificador único |
| name | String | Nome completo |
| email | String (unique) | E-mail de login |
| password_hash | String | Senha criptografada |
| role | Enum (teacher/student) | Papel no sistema |
| created_at | DateTime | Data de criação |

### Transcription
| Campo | Tipo | Descrição |
|---|---|---|
| id | Integer (PK) | Identificador único |
| title | String | Título dado pelo professor |
| image_path | String | Caminho da imagem enviada |
| result_text | Text | Texto acessível gerado pela IA |
| created_at | DateTime | Data de criação |
| teacher_id | Integer (FK → User) | Professor que criou |

---

## Funcionalidade de IA

**Ferramenta:** Gemini 1.5 Flash (Google AI Studio)

**Como se integra ao fluxo:**
O professor faz upload de uma imagem (foto da lousa, slide ou esquema). O backend envia essa imagem para a API do Gemini com um prompt que instrui o modelo a converter o conteúdo visual em texto estruturado e acessível — sem descrições genéricas, com equações escritas por extenso e elementos visuais (setas, caixas, mapas mentais) convertidos em listas hierárquicas. O resultado é salvo no banco de dados com o título definido pelo professor e exibido no frontend de forma compatível com leitores de tela.

---

## Escopo

O escopo foi mantido pequeno e funcional para ser viável no tempo disponível. O sistema terá:
- Cadastro e login de usuários (professor e estudante)
- Upload de imagem e geração de transcrição pela IA
- Histórico de transcrições com título, acessível ao estudante
- Sem campo de disciplina ou categorização — apenas título simples

---

## Distribuição de Tarefas por Sprint

### Sprint 1 — Proposta e Protótipo Visual (entrega: 01/06)
- [x] Definição do problema e usuários-alvo
- [x] Modelagem das entidades
- [x] Elaboração do plano.md
- [x] Protótipo visual das telas principais

### Sprint 2 — Frontend (desenvolvimento: 02/06 | review: 08/06)
- [ ] Setup do projeto React + Tailwind CSS + Vite
- [ ] Tela de login e cadastro (modal)
- [ ] Área de upload de imagem com preview
- [ ] Exibição do resultado da transcrição (acessível com ARIA)
- [ ] Listagem do histórico de transcrições
- [ ] Gerenciamento de estado com useState

### Sprint 3 — Backend, Banco de Dados e IA (desenvolvimento: 09/06 | review: 15/06)
- [ ] Setup do backend (FastAPI + SQLModel + SQLite)
- [ ] Autenticação JWT (registro, login, proteção de rotas)
- [ ] Endpoint de upload e integração com Gemini 1.5 Flash
- [ ] Endpoints CRUD de transcrições
- [ ] Conexão do frontend com a API real

### Sprint 4 — Testes, Hospedagem e Documentação (desenvolvimento: 16/06 | review: 22/06)
- [ ] Testes manuais documentados
- [ ] Deploy (Render + Vercel)
- [ ] README com instruções de instalação
- [ ] Manual do usuário