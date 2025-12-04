# Espaço de Dança Fernanda Becker - Next.js

## 🎭 Sobre o Projeto

Site moderno e responsivo para a escola de dança Fernanda Becker, desenvolvido com Next.js, React e TypeScript.

## ✨ Funcionalidades

### Site Principal

- 🏠 **Página Inicial** com carrossel de imagens
- 📖 **Sobre** a escola e seus valores
- 🎉 **Eventos** com filtros e modal de detalhes
- 📞 **Contato** com formulário funcional
- 👥 **Área do Aluno** com login

### Área do Aluno (Nova!)

- 👤 **Perfil Completo** com foto, dados pessoais e status
- 📅 **Horários das Aulas** - Visualização clara dos dias e horários
- 💳 **Gestão de Mensalidades** - Pagamento via PIX ou Boleto
- 📊 **Histórico de Pagamentos** completo
- 📈 **Estatísticas Rápidas** - Aulas, frequência e mais

## 🚀 Como Executar

```bash
# Instalar dependências (se necessário)
npm install

# Executar o servidor de desenvolvimento
npm run dev
```

Acesse: **http://localhost:3000**

## 🔐 Credenciais de Teste

Para acessar a **Área do Aluno**:

- **Matrícula:** 12345
- **Senha:** 123456

## 📱 Responsivo

O site é totalmente responsivo e otimizado para:

- 📱 Smartphones
- 📱 Tablets
- 💻 Desktops

## 🎨 Tecnologias Utilizadas

- **Next.js 16** - Framework React
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **CSS3** - Estilização avançada
- **Font Awesome** - Ícones
- **Google Fonts** - Tipografia (Dancing Script e Open Sans)

## 📂 Estrutura do Projeto

```
app/
├── components/          # Componentes reutilizáveis
│   ├── Header.tsx      # Navegação principal
│   ├── Hero.tsx        # Seção hero com carrossel
│   ├── About.tsx       # Sobre a escola
│   ├── Events.tsx      # Listagem de eventos
│   ├── Contact.tsx     # Formulário de contato
│   ├── StudentArea.tsx # Login na página inicial
│   └── Footer.tsx      # Rodapé
├── aluno/              # Área exclusiva do aluno
│   └── page.tsx        # Dashboard completo do aluno
├── globals.css         # Estilos globais
├── types.ts            # Tipos TypeScript
├── layout.tsx          # Layout principal
└── page.tsx            # Página inicial

public/
└── images/             # Imagens do projeto
```

## 🎯 Próximos Passos

- [ ] Integração com backend/API
- [ ] Sistema de autenticação real
- [ ] Gateway de pagamento (PIX/Boleto)
- [ ] Upload de foto de perfil
- [ ] Sistema de notificações
- [ ] Relatórios de frequência
- [ ] Área do professor

## 📝 Notas

- As credenciais de teste são apenas para demonstração
- Os pagamentos são simulados (não há integração real)
- As imagens de perfil usam imagens do projeto

---

Desenvolvido com 💜 para o Espaço de Dança Fernanda Becker
