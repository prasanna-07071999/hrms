const express = require('express')
const router = express.Router()


const Employee = require('../models/employee')
const Log = require('../models/log')
const authMiddleware = require('../middlewares/authMiddleware')
const { logAction } = require("../middlewares/logMiddleware");

router.use(authMiddleware)

const checkOrgOwnership = (request, emp) => {
    return emp.organisation_id === request.user.organisation_id
}

router.get('/',logAction("GET_EMPLOYEES"), async (request, response) => {
    try{
        const employees = await Employee.findAll({
            where: {organisationId: request.user.organisationId}
        })
        console.log(employees)
        response.json(employees)
    } catch(error){
        console.log(error)
        response.status(500).json({message: 'Failed to fetch employees', error: error.message})
    }
})

router.get('/:id', async (request, response) => {
   
    try{
        const employee = await Employee.findByPk(request.params.id)
        
        if(!employee || !checkOrgOwnership(request, employee))
            return response.status(404).json({message: "Employee Not Found"})
        response.json(employee)
    } catch(error){
        console.log(error)
        response.status(500).json({message: 'Failed to fetch employee', error: error.message})
    }
})

router.post('/', logAction("CREATE_EMPLOYEE"), async (request, response) => {
    const {firstName, lastName, email, phone} = request.body
    try{
        const employee = await Employee.create({
            organisationId: request.user.organisationId,
            firstName,
            lastName,
            email,
            phone
        })
        // await Log.create({
        //     organisationId: request.user.organisationId,
        //     user_id: request.user.id,
        //     action: `Created Employee ${employee.id}`,
        //     meta: {employeeId: employee.id}
        // })
        response.status(201).json(employee)
    } catch(error){
        console.log(error)
        response.status(500).json({message: 'Failed to Create employees', error: error.message})
    }
})

router.put('/:id',logAction("Update_Employee"), async (request, response) => {
    try{
        const employee = await Employee.findByPk(request.params.id)
        
        if(!employee || !checkOrgOwnership(request, employee))
            return response.status(404).json({message: "Employee Not Found"})
        await employee.update(request.body)
        // await Log.create({
        //     organisation_id: request.user.organisation_id,
        //     user_id: request.user.id,
        //     action: `Updated Employee ${employee.id}`,
        //     meta: {employeeId: employee.id}
        // })
        response.json(employee)
    } catch(error){
        console.log(error)
        response.status(500).json({message: 'Failed to Update employee', error: error.message})
    }
})

router.delete('/:id', logAction("DELETE_EMPLOYEE"), async (request, response) => {
    try{
        const employee = await Employee.findByPk(request.params.id)
        
        if(!employee || !checkOrgOwnership(request, employee))
            return response.status(404).json({message: "Employee Not Found"})
        await employee.destroy()
        // await Log.create({
        //     organisation_id: request.user.organisation_id,
        //     user_id: request.user.id,
        //     action: `Deleted Employee ${employee.id}`,
        //     meta: {employeeId: employee.id}
        // })
        response.json({message: 'Employee Deleted Successfully'})
    } catch(error){
        console.log(error)
        response.status(500).json({message: 'Failed to Delete employee', error: error.message})
    }
})

module.exports = router