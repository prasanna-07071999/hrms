const Team = require("../models/team")
const Employee = require("../models/employee")
const EmployeeTeam = require("../models/employeeTeam");
const {createLog} = require('../utils/logger')


const checkOrgOwnership = (request, team) => {
    return team.organisationId === request.user.organisationId;
};

const getAllTeams = async (request, response) => {
    try {
        const teams = await Team.findAll({
            where: { organisationId: request.user.organisationId }
        });

        response.json(teams);
    } catch (error) {
        response.status(500).json({ message: "Failed to fetch teams", error: error.message });
    }
};


const getTeamById = async (request, response) => {
    try {
        const team = await Team.findByPk(request.params.id);

        if (!team || !checkOrgOwnership(request, team)) {
            return response.status(404).json({ message: "Team Not Found" });
        }

        response.json(team);
    } catch (error) {
        response.status(500).json({ message: "Failed to fetch team", error: error.message });
    }
};


const createTeam = async (request, response) => {
    try {
        const { name, description } = request.body;

        const team = await Team.create({
            organisationId: request.user.organisationId,
            name,
            description
        });
        await createLog({
            req: request,
            status: 201,
            event: "TEAM_CREATED",
            teamId: team.id
        });

        response.status(201).json(team);
    } catch (error) {
        response.status(500).json({ message: "Failed to create team", error: error.message });
    }
};


const updateTeam = async (request, response) => {
    try {
        const team = await Team.findByPk(request.params.id);

        if (!team || !checkOrgOwnership(request, team))
            return response.status(404).json({ message: "Team Not Found" });

        await team.update(request.body);
        await createLog({
            req: request,
            status: 200,
            event: "TEAM_UPDATED",
            teamId: team.id
        });

        response.json(team);
    } catch (error) {
        response.status(500).json({ message: "Failed to update team", error: error.message });
    }
}



const deleteTeam = async (request, response) => {
    try {
        const team = await Team.findByPk(request.params.id);

        if (!team || !checkOrgOwnership(request, team))
            return response.status(404).json({ message: "Team Not Found" });

        await team.destroy();
        await createLog({
            req: request,
            status: 200,
            event: "TEAM_DELETED",
            teamId: team.id
        });

        response.json({ message: "Team deleted successfully" });
    } catch (error) {
        response.status(500).json({ message: "Failed to delete team", error: error.message });
    }
}



// Assign employees
const assignEmployees = async (request, response) => {
    try {
        const { employeeId, employeeIds } = request.body;

        const ids = employeeIds || (employeeId ? [employeeId] : []);

        if (!ids.length) return response.status(400).json({ message: "No employee IDs provided" });

        const team = await Team.findByPk(request.params.teamId);

        if (!team || !checkOrgOwnership(request, team))
            return response.status(404).json({ message: "Team not found" });

        const validEmployees = await Employee.findAll({
            where: {
                id: ids,
                organisationId: request.user.organisationId
            }
        });

        await Promise.all(
            validEmployees.map(e =>
                EmployeeTeam.findOrCreate({
                    where: { teamId: team.id, employeeId: e.id }
                })
            )
        );
        await createLog({
            req: request,
            status: 200,
            event: "TEAM_EMPLOYEES_ASSIGNED",
            teamId: team.id,
        });

        response.json({ message: "Employees assigned successfully" });
    } catch (error) {
        response.status(500).json({ message: "Failed to assign employees", error: error.message });
    }
};


const unassignEmployee = async (request, response) => {
    try {
        const { employeeId } = request.body;

        if (!employeeId)
            return response.status(400).json({ message: "Employee ID required" });

        const team = await Team.findByPk(request.params.teamId);

        if (!team || !checkOrgOwnership(request, team))
            return response.status(404).json({ message: "Team not found" });

        await EmployeeTeam.destroy({
            where: { teamId: team.id, employeeId }
        });
        await createLog({
            req: request,
            status: 200,
            event: "TEAM_EMPLOYEE_UNASSIGNED",
            teamId: team.id
        });

        response.json({ message: "Employee unassigned successfully" });
    } catch (error) {
        response.status(500).json({ message: "Failed to unassign employee", error: error.message });
    }
}
module.exports = {
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
    assignEmployees,
    unassignEmployee
}