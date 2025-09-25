import bcrypt from "bcrypt"

//*Toma como parametro la contraseña de req.body y sabe q es un string
export const hashPassword = async(password: string) =>{
    const salt = await bcrypt.genSalt(10);
    //* retornamos el hash que toma de parametros el password y el salt que generemos
    return await bcrypt.hash(password, salt)
}