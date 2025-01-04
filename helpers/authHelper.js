//encrpt and decrypt password
//hash and compare n decrypt

import bcrypt from 'bcrypt'

//hashing
export const hashPassword = async (password) => {
    try {
        const saltRounds = 10//higher salt rounds higher hashing rounds
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    } catch (error) {
        console.log(error)

    }
}

//compare
export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
}
