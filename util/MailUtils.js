const nodemailer = require("nodemailer");

let testAccount = nodemailer.createTestAccount();
let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "admin@giftshare.xyz", // generated ethereal user
        pass: "", // generated ethereal password
    },
});

module.exports = {
    sendVerificationEmail: function (target, username, code) {
        let info = transporter.sendMail({
            from: '"GiftShare" <admin@giftshare.xyz>', // sender address
            to: target + ', ' + target, // list of receivers
            subject: "Zweryfikuj swoje konto na Giftshare! ✔", // Subject line
            text: "Zweryfikuj swoje konto na Giftshare! ✔", // plain text body
            html: "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <style>\n" +
                "        .main {\n" +
                "            width: 201px;\n" +
                "            height: 251px;\n" +
                "            margin: 0 auto;\n" +
                "        }\n" +
                "        .logo {\n" +
                "            width: 200px;\n" +
                "            height: 200px;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"main\">\n" +
                "        <h1 style=\"font-family: 'Microsoft JhengHei Light'; text-align: center;\">Zweryfikuj swoje konto na Giftshare!</h1>\n" +
                "        <img class=\"logo\" src=\"https://raw.githubusercontent.com/vjasieg/GiftShare/master/Logo.png\"/>\n" +
                "    </div>\n" +
                "    <h2 style=\"font-family: 'Microsoft JhengHei Light'; text-align: center; margin-top: 120px;\">Hej, " + username + "! Twój kod weryfikacji to: " + code + "</h2>\n" +
                "</body>\n" +
                "</html>", // html body
        });
    },
    sendEndingMail: async function(target) {
        let info2 = transporter.sendMail({
            from: '"GiftShare" <admin@giftshare.xyz', // sender address
            to: target + ', ' + target, // list of receivers
            subject: "Dziękujemy za rejestracje! ❤", // Subject line
            text: "Dziękujemy za rejestracje! ❤", // plain text body
            html: "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <style>\n" +
                "        .main {\n" +
                "            width: 201px;\n" +
                "            height: 251px;\n" +
                "            margin: 0 auto;\n" +
                "        }\n" +
                "        .logo {\n" +
                "            width: 200px;\n" +
                "            height: 200px;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"main\">\n" +
                "        <h1 style=\"font-family: 'Microsoft JhengHei Light'; text-align: center;\">Dziękujemy za rejestracje na Giftshare! ❤</h1>\n" +
                "        <img class=\"logo\" src=\"https://raw.githubusercontent.com/vjasieg/GiftShare/master/Logo.png\"/>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>", // html body
        });
    }
};
