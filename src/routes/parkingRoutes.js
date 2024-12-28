const express = require("express");
const router = express.Router();
const parkingController = require("../controllers/parkingController");

// Rotas para gerenciamento de estacionamento
// Rota para obter todo o histórico
router.get("/", parkingController.getAll);

// Rota para registrar a entrada de um veículo
router.post("/", parkingController.entry);

// Rota para registrar a saída de um veículo
router.put("/:plate/out", parkingController.exit);

// Rota para registrar o pagamento de um veículo
router.put("/:plate/pay", parkingController.pay);

// Rota para obter o histórico de um veículo específico
router.get("/:plate", parkingController.history);

module.exports = router;
