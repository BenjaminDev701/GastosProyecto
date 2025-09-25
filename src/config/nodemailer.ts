import nodemailer from "nodemailer"
import dotenv from "dotenv"
//*Hace que cargue las variables de entorno y pueda ser utilizadas
dotenv.config()

//*Guardamos los datos que necesitamos para conectarnos a nuestro servicio como "Credenciales"
const config = () =>{
    return {
    host: process.env.EMAIL_HOST ,
    //*El puerto es un numero y si colocamos asi lo toma como un string entonces para que lo tome como un numero le colocamos el +
    port: +process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
            }
        }
}

//*Este es el servicio que nos permite enviar los correos pero utilizando las credenciales que le mandamos y el export para usar el servicio en otro archivo
export const transport = nodemailer.createTransport(config());