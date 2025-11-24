const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authMiddleware = async (request, response, next) => {
    const authHeader = request.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer '))
        return response.status(401).json({message: "Unauthorized"})

    const token = authHeader.split(' ')[1]

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findByPk(decoded.userId)
        
        if(!user) return response.status(401).json({message: 'User not Found'})
        
        request.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            organisationId: user.organisationId,   
            organisation_id: user.organisationId, 
            isAdmin: user.isAdmin
        };

        request.organisationId = decoded.organisationId
        next()

    } catch(error){
        console.log(error)
        response.status(401).json({message: "Invalid Token", error: error.message})
    }
} 

module.exports = authMiddleware