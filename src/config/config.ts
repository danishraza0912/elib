// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {config as conf } from 'dotenv'
conf()

const _config= {
    port : process.env.PORT,
    databaseurl: process.env.databaseurl,
    NODE_ENV: process.env.NODE_ENV,
    jwtSecret: process.env.jwtSecret
}

export const config= Object.freeze(_config)