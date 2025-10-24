import { transport } from "../config/nodemailer"

type EmailType = {
    name:string,
    email:string,
    token: string
}

export class AuthEmail{
    static sendConfirmationEmail = async(user: EmailType) =>{

    //*Importamos la configuraacion de nodemailer(transport) y utilizamos el metodo sendMail que nos ayuda a enviar un correo
        const email = await transport.sendMail({
            from:"CashTracker <Dominio@dominio.com>",
            //*Aqui es a donde enviaremos el email entonces nosotros accedemos a la bd, tomamos la tabla usuario y tomamos el email
            to: user.email,
            subject:"CashTracker - CONFIRMA TU CUENTA",
            html:
            `
            <p>${user.name} has creado tu cuenta en CashTracker, ya esta casi lista</p>
            <p>visita el siguiente enlace</p>
            <a href="#">Confirma tu cuenta</a> 
            <p>Ingresa el token:  ${user.token}</p>
            `
        })
        console.log("Mensaje enviado correctamente", email.messageId);
        
    }


    static sendPasswordResetToken = async(user: EmailType) =>{

    //*Importamos la configuraacion de nodemailer(transport) y utilizamos el metodo sendMail que nos ayuda a enviar un correo
        const email = await transport.sendMail({
            from:"CashTracker <Dominio@dominio.com>",
            //*Aqui es a donde enviaremos el email entonces nosotros accedemos a la bd, tomamos la tabla usuario y tomamos el email
            to: user.email,
            subject:"CashTracker - RESTABLECE TU CUENTA",
            html:
            `
            <p>${user.name} has restablecido tu cuenta en CashTracker</p>
            <p>visita el siguiente enlace</p>
            <a href="#">Restablece tu cuenta</a> 
            <p>Ingresa el token:  ${user.token}</p>
            `
        })
        console.log("Mensaje enviado correctamente", email.messageId);
        
    }
}
