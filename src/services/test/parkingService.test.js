const ParkingService = require("../parkingService.js");
const Parking = require("../../models/parking.js");

jest.mock("../../models/parking.js", () => {
	return jest.fn().mockImplementation(() => {
		return {
			plate: "ABC-1234",
			paid: false,
			timeIn: new Date(),
			timeOut: null,
			save: jest.fn().mockResolvedValue(true),
		};
	});
});

describe("ParkingService", () => {
	beforeAll(() => {
		const fixedDate = new Date(2024, 11, 28, 8, 0, 0);
		jest.useFakeTimers().setSystemTime(fixedDate);
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("calculateParkingDuration", () => {
		it("should correctly calculate the parking duration", () => {
			const mockTimeIn = new Date();
			const mockTimeOut = new Date(
				mockTimeIn.getTime() + 2 * 60 * 60 * 1000
			);

			const duration = ParkingService.calculateParkingDuration(
				mockTimeIn,
				mockTimeOut
			);
			expect(duration).toBe("2h");
		});

		it("should handle parking durations without hours correctly", () => {
			const mockTimeIn = new Date("2024-12-28T08:00:00Z");
			const mockTimeOut = new Date("2024-12-28T08:15:00Z");

			const duration = ParkingService.calculateParkingDuration(
				mockTimeIn,
				mockTimeOut
			);
			expect(duration).toBe("15m");
		});
	});

	describe("registerEntry", () => {
		it("should register a parking entry with a valid plate", async () => {
			const validPlate = "ABC-1234";

			Parking.findOne = jest.fn().mockResolvedValue(null);

			const result = await ParkingService.registerEntry(validPlate);

			expect(result).toHaveProperty("plate", validPlate);
			expect(result).toHaveProperty("timeIn");
			expect(result.paid).toBe(false);
		});

		it("should throw an error if the vehicle is already in the parking lot", async () => {
			const validPlate = "ABC-1234";

			Parking.findOne = jest.fn().mockResolvedValue({
				plate: validPlate,
				timeOut: null,
			});

			await expect(
				ParkingService.registerEntry(validPlate)
			).rejects.toThrow("O Veículo ainda está no estacionamento.");
		});

		it("should throw error for invalid plate format", async () => {
			const invalidPlate = "ABC1234";
			await expect(
				ParkingService.registerEntry(invalidPlate)
			).rejects.toThrow("Placa inválida");
		});
	});

	describe("registerPayment", () => {
		it("should register payment for a vehicle", async () => {
			const plate = "ABC-1234";

			Parking.findOne = jest.fn().mockResolvedValue({
				plate,
				paid: false,
				timeIn: new Date(),
				timeOut: null,
				save: jest.fn().mockResolvedValue(),
			});

			const result = await ParkingService.registerPayment(plate);

			expect(result).toHaveProperty("paid", true);
			expect(Parking.findOne).toHaveBeenCalledWith({
				plate,
				timeOut: null,
			});
			expect(result).toHaveProperty("plate", plate);
			expect(result.paid).toBe(true);
		});

		it("should throw error if vehicle is already paid", async () => {
			const plate = "ABC-1234";
			const mockCar = { plate, paid: true };
			Parking.findOne = jest.fn().mockResolvedValue(mockCar);

			await expect(ParkingService.registerPayment(plate)).rejects.toThrow(
				"Veículo já foi pago."
			);
		});

		it("should throw error if vehicle is not registered", async () => {
			const plate = "XYZ-9999";
			Parking.findOne = jest.fn().mockResolvedValue(null);

			await expect(ParkingService.registerPayment(plate)).rejects.toThrow(
				"Veículo não cadastrado."
			);
		});
	});
	describe("registerExit", () => {
		it("should register vehicle exit and calculate duration", async () => {
			const plate = "ABC-1234";
			const mockCar = {
				plate,
				paid: true,
				timeIn: new Date(),
				timeOut: null,
				save: jest.fn().mockResolvedValue(),
			};
			Parking.findOne = jest.fn().mockResolvedValue(mockCar);
			const mockExitTime = new Date();

			const calculateDurationSpy = jest
				.spyOn(ParkingService, "calculateParkingDuration")
				.mockReturnValue("3h");

			const result = await ParkingService.registerExit(plate);

			expect(result).toHaveProperty("timeOut");
			expect(result).toHaveProperty("parkingDuration", "3h");
			expect(calculateDurationSpy).toHaveBeenCalledWith(
				mockCar.timeIn,
				mockExitTime
			);
		});

		it("should throw error if vehicle has already exited", async () => {
			const plate = "ABC-1234";
			const mockCar = {
				plate,
				paid: true,
				timeIn: new Date(),
				timeOut: new Date(),
			};
			Parking.findOne = jest.fn().mockResolvedValue(mockCar);

			await expect(ParkingService.registerExit(plate)).rejects.toThrow(
				"Veículo já saiu."
			);
		});

		it("should throw error if vehicle has unpaid status", async () => {
			const plate = "ABC-1234";
			const mockCar = {
				plate,
				paid: false,
				timeIn: new Date(),
				timeOut: null,
			};
			Parking.findOne = jest.fn().mockResolvedValue(mockCar);

			await expect(ParkingService.registerExit(plate)).rejects.toThrow(
				"Veículo possui débitos, regularize para liberar."
			);
		});
	});

	describe("getAll", () => {
		it("should return all parking history", async () => {
			const historyData = [
				{
					plate: "ABC-1234",
					paid: true,
					timeIn: new Date(),
					timeOut: new Date(),
				},
				{
					plate: "XYZ-5678",
					paid: false,
					timeIn: new Date(),
					timeOut: null,
				},
			];
			Parking.find = jest.fn().mockResolvedValue(historyData);

			const result = await ParkingService.getAll();

			expect(result).toHaveLength(2);
			expect(result[0]).toHaveProperty("plate", "ABC-1234");
			expect(result[1]).toHaveProperty("left", false);
		});

		it("should throw error when no history is found", async () => {
			Parking.find = jest.fn().mockResolvedValue([]);

			await expect(ParkingService.getAll()).rejects.toThrow(
				"Nenhum histórico encontrado."
			);
		});
	});

	describe("getHistoryByPlate", () => {
		it("should return parking history by plate", async () => {
			const plate = "ABC-1234";
			const mockCar = {
				plate,
				paid: true,
				timeIn: new Date(),
				timeOut: new Date(),
			};
			Parking.find = jest.fn().mockResolvedValue([mockCar]);

			const result = await ParkingService.getHistoryByPlate(plate);

			expect(result).toHaveLength(1);
			expect(result[0]).toHaveProperty("plate", plate);
			expect(result[0]).toHaveProperty("timeOut");
		});

		it("should throw error if no history is found for the plate", async () => {
			const plate = "XYZ-5678";
			Parking.find = jest.fn().mockResolvedValue([]);

			await expect(
				ParkingService.getHistoryByPlate(plate)
			).rejects.toThrow(
				"Nenhum histórico encontrado para a placa fornecida."
			);
		});
	});
});
