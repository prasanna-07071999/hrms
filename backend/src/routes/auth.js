const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Organisation = require('../models/organisation');
const { createLog } = require("../utils/logger");


router.post('/register', async (req, res) => {
    const { orgName, adminName, email, password } = req.body;

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
            req,
            action: "USER_REGISTER",
            status: 201,
            meta: { email, organisationId: organisation.id }
        });

        res.status(201).json({ token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Registration Failed", error: error.message });
    }
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user)
            return res.status(404).json({ message: 'User Not Found' });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match)
            return res.status(401).json({ message: "Invalid Login Credentials" });

        const token = jwt.sign(
            {
                userId: user.id,
                organisationId: user.organisationId,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        await createLog({
            req,
            action: "USER_LOGIN",
            status: 200,
            meta: { email }
        });

        res.json({ token });

    } catch (error) {
        res.status(500).json({ message: 'Login Failed', error: error.message });
    }
});

module.exports = router;

// const express = require('express')
// const router = express.Router()
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')

// const User = require('../models/user')
// const Organisation = require('../models/organisation')
// const Log = require('../models/log')



// router.post('/register', async(request, response) => {
//     const {orgName, adminName, email, password} = request.body
//     try{
//         const organisation = await Organisation.create({name: orgName})
//         const hashedPassword = await bcrypt.hash(password, 10)
//         const user = await User.create({
//             organisationId: organisation.id,
//             email,
//             passwordHash: hashedPassword,
//             name: adminName,
//             isAdmin: true  
//         })
//         const token = jwt.sign(
//             {userId: user.id, orgId: organisation.id, isAdmin: user.isAdmin },
//             process.env.JWT_SECRET, {expiresIn: '8h'}
//         )

//         await Log.create({
//             organisationId: organisation.id,
//             userId: user.id,
//             action: `User '${user.id}' created Organisation '${organisation.id}'`,
//             meta: {}
//         })

//         response.status(201).json({token})
//     } 
//     catch(error){
//         console.log(error)
//         response.status(500).json({message: "Registration Failed", error: error.message})
//     }
// })

// router.post('/login', async(request, response) => {
//     const {email, password} = request.body

//     try{
//         const user = await User.findOne({where: {email}})
//         if (!user) return response.status(404).json({message: 'User Not Found'})
        
//         const match = await bcrypt.compare(password, user.passwordHash);
//         if (!match) return response.status(401).json({message: "Invalid Login Credentials"})

//         const token = jwt.sign(
//             {userId: user.id, organisationId: user.organisationId, isAdmin: user.isAdmin },
//             process.env.JWT_SECRET,
//             {expiresIn: '8h'}
//         )
//         await Log.create({
//             organisationId: user.organisation_id,
//             userId: user.id,
//             action: `User '${user.id}' logged in`,
//             meta: {}
//         })

//         response.json({token})
//     } catch(error){
//         response.status(500).json({message: 'Login Failed', error: error.message  })
// }
// })

// module.exports = router