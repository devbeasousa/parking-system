# Instruções de Instalação e Execução

## Requisitos

Antes de rodar o projeto, você precisa ter instalado em sua máquina:

-   **Node.js**
-   **MongoDB**

## Passos para Rodar o Projeto

### 1. Clonar o Repositório

Clone o repositório do projeto:

```bash
git clone https://github.com/devbeasousa/parking-system.git
cd parking-system
```

### 2. Instalar as Dependências

Instale as dependências necessárias utilizando o comando abaixo:

```bash
npm install
```

### 3. Iniciar o MongoDB

Certifique-se de que o MongoDB está em execução.

Se você estiver utilizando o MongoDB Atlas ou outra instância remota, altere a URL de conexão no código-fonte, no arquivo `src/app.js`:

```js
mongoose.connect("mongodb://127.0.0.1:27017/parking");
```

Altere a URL de conexão para corresponder à sua instância do MongoDB.

### 4. Rodar o Servidor

Agora, inicie o servidor da aplicação:

```bash
npm start
```

A API estará disponível em `http://localhost:3000`.

### 5. Testar a API

Com o servidor em funcionamento, você pode testar os endpoints da API utilizando ferramentas como [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/).

Aqui estão alguns exemplos de como testar os endpoints:

-   **Registrar Entrada**

    -   **Método**: `POST`
    -   **URL**: `http://localhost:3000/parking`
    -   **Corpo da requisição**:
        ```json
        { "plate": "AAA-1234" }
        ```

-   **Registrar Saída**

    -   **Método**: `PUT`
    -   **URL**: `http://localhost:3000/parking/:plate/out`

-   **Registrar Pagamento**

    -   **Método**: `PUT`
    -   **URL**: `http://localhost:3000/parking/:plate/pay`

-   **Obter Histórico por Placa**

    -   **Método**: `GET`
    -   **URL**: `http://localhost:3000/parking/AAA-1234`

    -   **Obter Histórico do Estacionamento**
    -   **Método**: `GET`
    -   **URL**: `http://localhost:3000/parking`

### 6. Rodar os Testes

Para rodar os testes automatizados, use o comando abaixo:

```bash
npm test
```
