# FinanceControl.APP

Sistema de controle financeiro pessoal desenvolvido com React + TypeScript.

## Tecnologias

- **React** 19.2.0
- **TypeScript** com configuração strict
- **Vite** 7.2.7
- **Bootstrap** 5.3.8
- **Axios** 1.13.2
- **React Router DOM** 7.10.1
- **React Icons** 5.5.0

## Funcionalidades

- **Categorias**: Gerenciamento de categorias de receitas e despesas
- **Pessoas**: Cadastro de pessoas relacionadas às transações
- **Transações**: Registro de receitas e despesas com valores e relacionamentos
- **Relatórios**: Visualização consolidada por pessoa ou categoria com totais

## Recursos

- CRUD completo em todas as páginas
- Filtros avançados (nome, idade, tipo, categoria, pessoa)
- Paginação (10 itens por página)
- Autocomplete com busca em seleções
- Tabelas responsivas com texto truncado e tooltip
- Layout com sidebar fixa

## Instalação

```bash
cd finance-control-app
npm install
```

## Execução

```bash
npm run dev
```

Acesse: `http://localhost:5173`

## API

Backend esperado em: `https://localhost:7240/api`

### Endpoints:
- `/categorias` - CRUD de categorias
- `/pessoas` - CRUD de pessoas
- `/transacoes` - CRUD de transações
- `/transacoes/totais/pessoa/{id}` - Totais por pessoa
- `/transacoes/totais/categoria/{id}` - Totais por categoria
- `/transacoes/totais/geral` - Total geral