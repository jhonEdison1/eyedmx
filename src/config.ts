import { registerAs } from "@nestjs/config";

export default registerAs("config", () => {
    return {
        mongo: {
            dbname: process.env.DATABASE_NAME || "eyedmx",
            user: process.env.DB_USERNAME || "admin",
            password: process.env.DB_PASSWORD  || "admin",
            port: process.env.DATABASE_PORT || 27017,
            hostname: process.env.HOST_NAME || "127.0.0.1",
            connection: process.env.DB_CONNECTION || "mongodb",
            params: process.env?.PARAMS 
        },
        session: {
            accessToken: process.env.ACCESS_TOKEN,
            jwtAccessTokenSecret: process.env.JWT_ACCESS_SECRET,
            jwtAccessTokenExpiresTime: process.env.JWT_ACCESS_EXPIRES_TIME,
            jwtRefreshTokenSecret: process.env.JWT_REFRESH_SECRET,
            jwtRefreshTokenExpiresTime: process.env.JWT_REFRESH_EXPIRES_TIME,
            jwtForgotPasswordSecret: process.env.JWT_FORGOT_PASSWORD_SECRET,
            jwtForgotPasswordExpiresTime: process.env.JWT_FORGOT_PASSWORD_EXPIRES_TIME,
        },
        frontend: {
            url: process.env.FRONTEND_URL,
            urlinfo: process.env.URL_INFO,
            urlreset: process.env.URL_RESET
        },
        s3: {
            bucket: process.env.AWS_BUCKET_NAME,
            region: process.env.AWS_BUCKET_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
            url:  process.env.AWS_BUCKET_URL
        },
        mail: {
            host: process.env.MAIL_HOST,
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
            from: process.env.MAIL_FROM
        },
        stripe: {
            secretKey: process.env.STRIPE_SK,
            publicKey: process.env.STRIPE_PK,
            currency: process.env.STRIPE_CURRENCY
        },
        convertio: {
            apiKey: process.env.CONVERTIO_API_KEY,
            url : process.env.CONVERTIO_URL
        },

    }

});