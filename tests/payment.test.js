const request = require("supertest");
const app = require("../app"); // O arquivo principal onde o Express é configurado

// Mock da função que chama a API do Stark Bank
jest.mock("../controllers/paymentController", () => ({
  createPayment: jest.fn((req, res) => {
    return res
      .status(201)
      .json({ success: true, transfer: { amount: req.body.amount } });
  }),
  getPayments: jest.fn((req, res) => {
    return res.status(200).json({
      success: true,
      transactions: [{ amount: 1000, name: "Gabriel Lopes" }],
    });
  }),
}));

describe("Testando endpoints de pagamento", () => {
  it("deve criar um pagamento com sucesso", async () => {
    const paymentData = {
      amount: 1000,
      name: "Gabriel Lopes",
      taxId: "480.901.818-05",
      bankCode: "200",
      branchCode: "1234",
      accountNumber: "123456-7",
    };

    const response = await request(app)
      .post("/api/payments")
      .send(paymentData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.transfer.amount).toBe(paymentData.amount);
  });

  it("deve listar pagamentos com sucesso", async () => {
    const response = await request(app).get("/api/payments").expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.transactions.length).toBeGreaterThan(0);
    expect(response.body.transactions[0].name).toBe("Gabriel Lopes");
  });
});
