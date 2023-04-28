import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "stevenseventboard@gmail.com",
        pass: "jdvnoliqbxybhfmq"
    },
});
const passwordResetByEmail = async ({id, email}, res) => {
    try{
        const url = `http://localhost:3000/reset-password/${id}`;
        const mailOptions = {
            from: "stevenseventboard@gmail.com",
            to: email || "stevenseventboard@gmail.com",
            subject: "Reset your password",
            html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`
        }

        const result = await transporter.sendMail(mailOptions);
        if(result) {
             return res.redirect('/login');

        }else{
            return res.json({
                success: true,
                message: "Link was sent to your email"
            })
        }
    }catch (e){
        return res.status(500).json({
            success: false,
            message: "Some error occurred, try again later"
        })
    }
}

export {passwordResetByEmail}