# Projeto 1 – Programação Web Back-End  
# Victor Ehiti Itimura Tamay, Vitor Gabriel Menck Diniz

Este projeto foi elaborado no contexto da disciplina de Programação Web Back-End, tendo como propósito a construção de uma biblioteca destinada à interação com Sistemas Gerenciadores de Banco de Dados (SGBDs) por meio da plataforma Node.js.

A proposta temática adotada concentra-se no domínio de comércio eletrônico (e-commerce), priorizando o gerenciamento e a recuperação de dados relacionados a usuários, vendedores e produtos em um ambiente de loja virtual.

---

## Funcionalidades  

- Modelagem das entidades do banco de dados por meio de classes em JavaScript, garantindo melhor organização e encapsulamento das informações.

- Implementação de operações essenciais para manipulação de dados no MongoDB, incluindo inserção, consulta e remoção de registros.

- Aplicação de mecanismos de validação de dados previamente ao armazenamento, conforme critérios específicos:
    - Usuário: nome composto exclusivamente por caracteres alfabéticos, CPF contendo 11 dígitos (ou o caractere X), endereço de e-mail válido e senha com no mínimo quatro caracteres.
    - Vendedor: nome formado apenas por letras, CNPJ com 14 dígitos e e-mail em formato válido.
    - Produto: título de preenchimento obrigatório, valor numérico positivo e descrição com extensão mínima definida.

- Realização de verificação de unicidade para CPF e CNPJ, evitando a inserção de registros duplicados.

- Implementação de tratamento de exceções, com persistência das ocorrências em arquivo de log (log.txt) para fins de rastreabilidade.

- Desenvolvimento dos principais casos de uso, contemplando:
    - Cadastro de usuário
    - Cadastro de vendedor
    - Publicação de produto
    - Vinculação de produto a um vendedor

  ## Tecnologias Utilizadas  

- **Node.js**  
- **MongoDB** (com driver oficial `mongodb`)  
- **MongoDB Compass** para visualização dos dados 

## Como executar o projeto

1. Clone este repositório

2. Acesse a pasta do projeto

3. Instale a dependência necessária (driver oficial do MongoDB)
  
4. Configure a conexão com o banco de dados
  - Abra o arquivo database.js.
  - Substitua a URL de conexão pelo seu endereço local ou do MongoDB Atlas.

5. Execute o projeto


6. Visualize os dados no banco de dados


