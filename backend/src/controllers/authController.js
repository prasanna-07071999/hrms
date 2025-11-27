const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Organisation = require('../models/organisation')
const { createLog } = require("../utils/logger");


const login = async (request, response) => {
    try{
        const {email, password} = request.body
        const user = await User.findOne({where: {email}})
        if(!user) {
            return response.status(404).json({message: "User Not Found"})
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash)
        if (!isMatch){
            return response.status(401).json({message: 'Invalid Password'})
        }
    
        const token = jwt.sign(
            {
                userId: user.id,
                organisationId: user.organisationId,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SECRET, {expiresIn: '8h'}
        )

         await createLog({
            req: request,
            action: "USER_LOGIN",
            status: 200,
            email
        });

        response.json({token})
    } catch(e){
        console.log(e)
        response.status(500).json({message: 'Login Failed', error: e.message})
    }
}


const register = async (request, response) => {
    try {
        const organisation = await Organisation.create({ name: orgName });
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            organisationId: organisation.id,
            email,
            passwordHash: hashedPassword,
            name: adminName,
            isAdmin: true
        });

        const token = jwt.sign(
            {
                userId: user.id,
                organisationId: organisation.id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        await createLog({
            req: request,
            action: "USER_REGISTER",
            status: 201,
            email, 
            organisationId: organisation.id
        });

        response.status(201).json({ token });

    } catch (error) {
        response.status(500).json({ message: "Registration Failed", error: error.message })
    }
}
module.exports = {
    register,
    login
}