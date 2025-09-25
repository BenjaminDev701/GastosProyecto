import {Request, Response} from "express"
import User from "../models/User"
import { error } from "console";
import { hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";

export class AuthController {
    static createAccount = async(req : Request , res : Response) =>{

        const { email, password } = req.body;
        //*Verificamos si el email ya existe en la bd
        //*Utilizamos la consulta como en sql, colocamos un where donde abrimos otro objeto y colocamos el nombre de la columna
        const userExists = await User.findOne({where : {email}})
        if(userExists){
           const error = new Error("El usuario con ese email ya esta registrado")
           //*Quiere decir que hay un conflicto
           return res.status(409).json({error:error.message})
        }
        
        try {
        //*Creamos el usario con lo que envia el cliente el (req.body)
            const user = new User(req.body)
            user.token = generateToken()
            console.log(user.token);
            
            //*Aqui haseamos al contraseña tomando una instancia del usuario y asignamos el password a su instancia
            user.password = await hashPassword(password)
            //*Guardamos el usuario en la bd, si no hacemos esto no se guarda ya que la creacion esta en memoria
            await user.save()
            res.json("Cuenta creada correctamente")

       } catch (error) {
            res.status(500).json({error:"Hubo un error"})
       }
    }

}