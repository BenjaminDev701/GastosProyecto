import bcrypt from "bcrypt"

//*Toma como parametro la contraseña de req.body y sabe q es un string
export const hashPassword = async(password: string) =>{
    const salt = await bcrypt.genSalt(10);
    //* retornamos el hash que toma de parametros el password y el salt que generemos
    return await bcrypt.hash(password, salt)
}

///*Toma el la constraseña del cliente que esta dentro del req, y el hashpassword es de la bd
export const checkPassword = async(password:string, hash: string) =>{
    return await bcrypt.compare(password, hash)

    
    
}