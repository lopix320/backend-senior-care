import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

const authMiddleware = (req: Request, res: Response, next: any) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  jwt.verify(
    token.split(" ")[1],
    process.env.JWT_SECRET!,
    (err: any, decoded: any) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Sessão expirada" });
        }
        return res.status(500).json({ message: "Falha na autenticação" });
      }
      // res.status(200).json(decoded);
      return next();
    }
  );
};

export default authMiddleware;
