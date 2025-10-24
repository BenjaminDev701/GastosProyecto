import jwt from "jsonwebtoken"

export const generateJWT = (id : string) =>{
    const token = jwt.sign({id}, process.env.JWT_SECRET ,{
        //*Tiempo en que expira el token
        expiresIn:"30d"
    })
    //*Para retornar el token
    return token;
    
}