const Parking = require("../models/parking");

class ParkingService {
	static calculateParkingDuration(timeIn, timeOut) {
		const durationInMillis = timeOut.getTime() - timeIn.getTime();
		const durationInSeconds = Math.floor(durationInMillis / 1000);

		const hours = Math.floor(durationInSeconds / 3600);
		const minutes = Math.floor((durationInSeconds % 3600) / 60);
		const seconds = durationInSeconds % 60;

		let durationString = "";
		if (hours > 0) {
			durationString += `${hours}h`;
		}
		if (minutes > 0) {
			durationString += ` ${minutes}m`;
		}
		if (seconds > 0 || (hours === 0 && minutes === 0)) {
			durationString += ` ${seconds}s`;
		}

		return durationString.trim();
	}

	static async getAll() {
		try {
			const history = await Parking.find();
			if (!history.length) {
				throw new Error("Nenhum histórico encontrado.");
			}

			return history.map((entry) => {
				const result = {
					plate: entry.plate,
					paid: entry.paid,
					timeIn: entry.timeIn,
				};

				if (entry.timeOut) {
					result.timeOut = entry.timeOut;
					result.parkingDuration = this.calculateParkingDuration(
						entry.timeIn,
						entry.timeOut
					);
				} else {
					result.left = false;
				}

				return result;
			});
		} catch (error) {
			throw new Error(`Erro ao obter histórico: ${error.message}`);
		}
	}

	static async registerEntry(plate) {
		if (!/^[A-Z]{3}-\d{4}$/.test(plate)) {
			throw new Error("Placa inválida");
		}

		const findByPlate = await Parking.findOne({ plate, timeOut: null });
		if (findByPlate)
			throw new Error("O Veículo ainda está no estacionamento.");

		const entry = new Parking({ plate });
		await entry.save();

		return {
			plate: entry.plate,
			paid: entry.paid,
			timeIn: entry.timeIn,
		};
	}

	static async registerPayment(plate) {
		const findCar = await Parking.findOne({ plate, timeOut: null });
		if (!findCar) {
			throw new Error("Veículo não cadastrado.");
		}
		if (findCar.paid) {
			throw new Error("Veículo já foi pago.");
		}

		findCar.paid = true;
		await findCar.save();

		return {
			plate: findCar.plate,
			paid: findCar.paid,
			timeIn: findCar.timeIn,
		};
	}

	static async registerExit(plate) {
		const findCar = await Parking.findOne({ plate, timeOut: null });
		if (!findCar) {
			throw new Error("Veículo não cadastrado.");
		}
		if (findCar.timeOut) {
			throw new Error("Veículo já saiu.");
		}
		if (!findCar.paid) {
			throw new Error("Veículo possui débitos, regularize para liberar.");
		}

		findCar.timeOut = new Date();
		findCar.parkingDuration = this.calculateParkingDuration(
			findCar.timeIn,
			findCar.timeOut
		);
		await findCar.save();

		return {
			plate: findCar.plate,
			paid: findCar.paid,
			timeIn: findCar.timeIn,
			timeOut: findCar.timeOut,
			parkingDuration: findCar.parkingDuration,
		};
	}

	static async getHistoryByPlate(plate) {
		const carHistory = await Parking.find({ plate });

		if (carHistory.length === 0) {
			throw new Error(
				"Nenhum histórico encontrado para a placa fornecida."
			);
		}

		const result = carHistory.map((entry) => {
			const entryResult = {
				plate: entry.plate,
				paid: entry.paid,
				timeIn: entry.timeIn,
			};

			if (entry.timeOut) {
				entryResult.timeOut = entry.timeOut;
				entryResult.parkingDuration = this.calculateParkingDuration(
					entry.timeIn,
					entry.timeOut
				);
			} else {
				entryResult.left = false;
			}

			return entryResult;
		});

		return result;
	}
}

module.exports = ParkingService;
