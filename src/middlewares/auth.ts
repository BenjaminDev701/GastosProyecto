
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"

declare global {
    namespace Express{
        interface Request{
            user?: User
        }
    }
}

export const authenticate = async(req: Request, res: Response, next: NextFunction) =>{
     //*Accedemos al header de la autorizacion
        const bearer = req.headers.authorization

        if(!bearer){
            const error = new Error("No estas autorizado")
            return res.status(401).json({error:error.message})
        }

        //* esto sirve mas que nada para separar el bearer del token ya que solo necesitamos el token, split es un metodo que separa un string
        const [texto, token] = bearer.split(" ")

        //*esta parte verifica si el token que viene enviado de axios esta vacio pues no tiene autorizacion para ver la info de ese usuario
        if(!token){
            const error = new Error("El token no fue valido")
            return res.status(401).json({error:error.message})
        }

        //*Si pasa las validaciones buscamos el token alla sido validado por nosotros 
        try {
            //*Usa verify para decodificar el token y la palabra secreta para comporobar si es valida, si es valido devuelve un payload con datos del usuario
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            //*Despues de decodificar el token el if asegura que el contenido sea un objeto y que tenga la propiedad id 
            if(typeof decoded === "object" && decoded.id){
                //*Busca el usuario por el id que viene decodificado del token
                req.user = await User.findByPk(decoded.id, {
                    //*Aqui seleccionamos los atributos del usuario que necesitamos enviar a el nageador
                    attributes: ["id", "name", "email"]
                })
                //*lo envia
                next()
            }
            
        } catch (error) {
            res.status(500).json({error:"Token no valido"})
        }

        
}