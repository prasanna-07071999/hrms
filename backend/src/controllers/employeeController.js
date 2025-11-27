
const Employee = require('../models/employee')
const {createLog} = require('../utils/logger')

const checkOrgOwnership = (request, emp) => {
    return emp.organisationId === request.user.organisationId
}

const getAllEmployees = async(request, response) => {
    try{
        const employees = await Employee.findAll({
            where: {organisationId: request.user.organisationId}
        })
        response.json(employees)
    } catch(e){
        response.status(500).json({message:"failed to Fetch Employees", error:e.message})
    } 
}

const getEmployeeById = async(request, response) => {
    try{
        const employee = await Employee.findByPk(request.params.id)
        if (!employee ||!checkOrgOwnership(request, employee)) {
            return response.status(404).json({message: 'Employee Not Found'})
        }
        response.json(employee)
    } catch(e){
        response.status(500).json({message:"failed to Fetch Employee", error:e.message})
    } 
}



const createEmployee = async(request, response) => {
    try{
        const {firstName, lastName, email, phone} = request.body
        const employee = await Employee.create({
            organisationId: request.user.organisationId,
            firstName,
            lastName,
            email,
            phone
        })
        await createLog({
            req: request,
            status: 201,
            event: "EMPLOYEE_CREATED",
            employeeId: employee.id
        })
        response.status(201).json(employee)
    } catch(e){
        response.status(500).json({message: "Failed to Create Employee", error: e.message})
    }
}


const updateEmployee = async (request, response) => {
    try{
        const employee = await Employee.findByPk(request.params.id)
        if (!employee ||!checkOrgOwnership(request, employee)) {
            return response.status(404).json({message: 'Employee Not Found'})
        }
        await createLog({
            req: request,
            status: 200,
            event: "EMPLOYEE_UPDATED",
            employeeId: employee.id
        });
        await employee.update(request.body)
        response.json(employee)
    } catch(e){
        response.status(500).json({message: 'Failed to update Employee', error: e.message})
    }
}


const deleteEmployee = async (request, response) => {
    try{
        const employee = await Employee.findByPk(request.params.id)
        if (!employee ||!checkOrgOwnership(request, employee)) {
            return response.status(404).json({message: 'Employee Not Found'})
        }
        await createLog({
            req: request,
            status: 200,
            event: "EMPLOYEE_DELETED",
            employeeId: employee.id
        });
        await employee.destroy()
        response.json({message: "Employee Deleted Successfully"})

    } catch(e){
        response.status(500).json({message: 'Failed to Delete Employee', error: e.message})
    }
}

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
}