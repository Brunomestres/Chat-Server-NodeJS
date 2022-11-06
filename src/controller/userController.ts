import 'dotenv/config'
import { Request, Response } from "express";
import { hash, compare } from "bcrypt";
import { sign } from 'jsonwebtoken'
import { IUser } from "../interface/user";
import { User } from "../models/User";
class UserController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as IUser;
      const userExist = await User.findOne({ email });
      if (!userExist) {
        return res.status(404).json({ message: "Email ou senha incorreta!" });
      }

      const passwordMatch = await compare(password, userExist.password!);

      if (!passwordMatch) {
        return res.status(404).json({ message: "Email ou senha incorreta!" });
      }

      const token = sign({}, process.env.SECRET_KEY ?? '', { subject: userExist.email, expiresIn:'1d'})


      return res.json({ message: "Logado com sucesso!", token });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
  async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body as IUser;
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.status(400).json({ message: "Email já cadastrado!" });
      }
      const user = new User({
        name,
        email,
        password: await hash(password, 8),
      });
      const userCreated = await user.save();
      return res.status(201).json(userCreated);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
}

export { UserController };
