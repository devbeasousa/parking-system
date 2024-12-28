# Sistema de Controle de Estacionamento - API

Este projeto tem como objetivo a criação de uma API para controle de um estacionamento, onde é possível registrar a entrada, saída e pagamento de veículos, além de fornecer um histórico de veículos por placa. A aplicação foi desenvolvida utilizando Node.js, Express e MongoDB.

## Funcionalidades

A API oferece as seguintes funcionalidades:

-   **Entrada**: Registrar a entrada de um veículo no estacionamento.
-   **Saída**: Registrar a saída de um veículo, após o pagamento.
-   **Pagamento**: Registrar o pagamento de um veículo antes da saída.
-   **Histórico**: Obter o histórico de veículos por placa, com detalhes da entrada, pagamento e saída.

## Endpoints

A API possui os seguintes endpoints:

### 1. **Registrar Entrada**

-   **Método**: `POST /parking`
-   **Corpo da Requisição**:
    ```json
    {
    	"plate": "AAA-1234"
    }
    ```
-   **Descrição**: Registra a entrada do veículo.

### 2. **Registrar Saída**

-   **Método**: `PUT /parking/:plate/out`
-   **Descrição**: Registra a saída do veículo, sendo obrigatório que o pagamento tenha sido feito.

### 3. **Registrar Pagamento**

-   **Método**: `PUT /parking/:plate/pay`
-   **Descrição**: Marca o pagamento do veículo. O pagamento deve ser realizado antes da saída.

### 4. **Obter Histórico Por Placa**

-   **Método**: `GET /parking/:plate`
-   **Descrição**: Retorna o histórico de um veículo, com as informações de entrada, pagamento e saída.

### 5. **Obter Histórico Do Estacionamento**

-   **Método**: `GET /parking/`
-   **Descrição**: Retorna todo o histórico de veículos do estacionamento.

## Tecnologias Usadas

-   **Node.js**: Ambiente de execução JavaScript.
-   **Express**: Framework para construção da API.
-   **MongoDB**: Banco de dados NoSQL para persistência de dados.
-   **Jest**: Framework de testes.

## Testes

Os testes automatizados estão implementados com o framework Jest. Para rodar os testes, execute o seguinte comando:

```bash
npm test
```

## Instalação e Execução

Para rodar o projeto localmente, siga os passos no arquivo `INSTALL.md`.
