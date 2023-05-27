const express = require('express')
const router = express.Router()
const prisma = require('../db')
const verifyToken = require('../Auth/verifyToken')

// Get User
router.get('/user', verifyToken, async(req, res) => {
        const {id} = req.user;
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })

        const {name, email, role} = user
        // check if user
        if(user.role !== 'user'){
            res.status(405).json({message: `Welcome ${role}`, name, email})
        }

        return res.status(200).json({message: `Welcome ${role}`, name, email})
  });

module.exports = router;