const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema({
	plate: { type: String, required: true },
	paid: { type: Boolean, default: false },
	timeIn: { type: Date, default: Date.now },
	timeOut: { type: Date, default: null },
});

const Parking = mongoose.model("Parking", parkingSchema);

module.exports = Parking;
