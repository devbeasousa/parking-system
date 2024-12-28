const ParkingService = require("../services/parkingService");

class ParkingController {
	static async getAll(req, res) {
		try {
			res.status(200).json(await ParkingService.getAll());
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	}

	static async entry(req, res) {
		try {
			const { plate } = req.body;
			res.status(201).json(await ParkingService.registerEntry(plate));
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	}

	static async exit(req, res) {
		try {
			const { plate } = req.params;
			res.status(200).json(await ParkingService.registerExit(plate));
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	}

	static async pay(req, res) {
		try {
			const { plate } = req.params;
			res.status(200).json(await ParkingService.registerPayment(plate));
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	}

	static async history(req, res) {
		try {
			const { plate } = req.params;
			const carHistory = await ParkingService.getHistoryByPlate(plate);
			res.status(200).json(carHistory);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	}
}

module.exports = ParkingController;
