import { Request, Response } from "express";
import User from "../models/User";
import { AuthEmail } from "../emails/AuthEmail";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { generateJWT } from "../utils/jwt";


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
            //*Aqui haseamos al contraseña tomando una instancia del usuario y asignamos el password a su instancia
            user.password = await hashPassword(password)
            user.token = generateToken()
            //*Guardamos el usuario en la bd, si no hacemos esto no se guarda ya que la creacion esta en memoria
            await user.save()

            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            })
            res.json("Cuenta creada correctamente")

       } catch (error) {
            res.status(500).json({error:"Hubo un error"})
       }
    }

    static confirmAccount = async(req : Request , res : Response) =>{
        const { token } = req.body;

        const user = await User.findOne({where:{ token }})

        if(!user){
            const error = new Error("El token no es valido")
            return res.status(401).json({error:error.message})
        }

        //*Si el usuario existe con el token entonces confirmamos su cuenta
        user.confirmed = true
        //*hacemos aqui que el token se vuelva a algo vacio porque el tojen es de un solo uso
        user.token = ""
        //* Guardamos el cambio en la bd a confirmado  = true
        await user.save()
        console.log(user);
        
        res.json("Cuenta confirmada correctamente")
        
        
    }

    static login = async(req: Request, res: Response) =>{

    const {email, password} = req.body;

    const user = await User.findOne({where:{email}})
    if(!user){
        const error = new Error("El usuario no existe")
        return res.status(404).json({error:error.message})
    }

    if(!user.confirmed){
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(403).json({error:error.message})
    }
    const isPasswordCorrect = await checkPassword(password, user.password)

    if(!isPasswordCorrect){
        const error = new Error("La contraseña es incorrecta")
        //*401 es que las credenciales no son validas
        return res.status(401).json({error:error.message})
    }
    
    //*---- Despues de pasar las validaciones se genera el JWT--

    const token = generateJWT(user.id)

    res.json(token)
    
    }

    static forgotPassword = async(req: Request, res: Response) =>{

        const {email} = req.body;

        const user = await User.findOne({where: {email}})
        if(!user){
            const error = new Error("El usuario no existe")
            return res.status(404).json({error:error.message})
        }

        //*Vuelve a generar un token para asignarselo al usuario
        user.token = generateToken()
        //*El token generado lo guardamos en la bd
        await user.save();

        //*le pasamos la informacion de la instacnia del usuario para que se llene el correo con sun informacion
        await AuthEmail.sendPasswordResetToken({
            name: user.name,
            email: user.email,
            token: user.token
        })

    res.json("Revisa tu email para las intrucciones")
    }

    static validateToken = async(req: Request, res: Response) =>{
        const {token} = req.body;

        const tokenExists = await User.findOne({where:{token}} )
            if(!tokenExists){
                const error = new Error("El token no valido")
                return res.status(404).json({error:error.message})
            }

        res.json("Token valido")
    }

    static resetPasswordWithToken = async(req: Request, res:Response) =>{

        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({where:{token}})
        if(!user){
            const error = new Error("El token no es valido")
            return res.status(404).json({error:error.message})
        }

        //*Asignamos el nuevo password
        user.password = await hashPassword(password)
        //*Puede ser tambien con null y se hace para que no lo vuelva utilizar
        user.token = " "

        await user.save();

        
        res.json("El password se modifico correctamente")
    }

    //*Traera la informacion del usuario validado por el token
    static User = async(req: Request, res: Response) =>{
    res.json(req.user)
    }
}