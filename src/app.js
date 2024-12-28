const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const parkingRoutes = require("./routes/parkingRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/parking", parkingRoutes);

mongoose
	.connect("mongodb://127.0.0.1:27017/parking")
	.then(() => console.log("Conectado ao MongoDB"))
	.catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
