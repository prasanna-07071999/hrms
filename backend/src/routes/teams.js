const express = require('express')
const router = express.Router()

const authMiddleware = require('../middlewares/authMiddleware')
const { logAction } = require("../middlewares/logMiddleware");
const teamController = require('../controllers/teamController')


router.use(authMiddleware)

router.get("/", teamController.getAllTeams);
router.get("/:id", teamController.getTeamById);
router.post("/", teamController.createTeam);
router.put("/:id", teamController.updateTeam);
router.delete("/:id", teamController.deleteTeam);

router.post("/:teamId/assign", teamController.assignEmployees);
router.delete("/:teamId/unassign", teamController.unassignEmployee);

module.exports = router


// router.get('/', async (request, response) => {
//     try {
//         const teams = await Team.findAll({
//             where: { organisationId: request.user.organisationId}
//         })
//         response.json(teams)
//     } catch (error) {
//         console.log(error)
//         response.status(500).json({ message: 'Failed to fetch teams', error: error.message })
//     }
// })

// router.get('/:id', async (request, response) => {
//     try {
//         const team = await Team.findByPk(request.params.id)
//         if (!team || !checkOrgOwnership(request, team))
//             return response.status(404).json({ message: 'Team not found' })
//         response.json(team)
//     } catch (error) {
//         console.log(error)
//         response.status(500).json({ message: 'Failed to fetch team', error: error.message })
//     }
// })


// router.post('/', logAction("CREATE_TEAM"), async (request, response) => {
//     const { name, description } = request.body
//     try {
//         const team = await Team.create({
//             organisationId: request.user.organisationId,
//             name,
//             description
//         })

//         // await Log.create({
//         //     organisationId: request.user.organisationId,
//         //     user_id: request.user.id,
//         //     action: `Created team ${team.id}`,
//         //     meta: { teamId: team.id }
//         // })

//         response.status(201).json(team)
//     } catch (error) {
//         console.log(error)
//         response.status(500).json({ message: 'Failed to create team', error: error.message })
//     }
// })


// router.put('/:id', logAction("Update_Team"), async (request, response) => {
//     try {
//         const team = await Team.findByPk(request.params.id)
//         if (!team || !checkOrgOwnership(request, team))
//             return response.status(404).json({ message: 'Team not found' })

//         await team.update(request.body)
//         // await Log.create({
//         //     organisationId: request.user.organisationId,
//         //     user_id: request.user.id,
//         //     action: `Updated team ${team.id}`,
//         //     meta: { teamId: team.id }
//         // })

//         response.json(team)
//     } catch (error) {
//         console.log(error)
//         response.status(500).json({ message: 'Failed to update team', error: error.message })
//     }
// })

// router.delete('/:id', logAction("Delete_TEAM"), async (request, response) => {
//     try {
//         const team = await Team.findByPk(request.params.id)
//         if (!team || !checkOrgOwnership(request, team))
//             return response.status(404).json({ message: 'Team not found' })

//         await team.destroy()
//         // await Log.create({
//         //     organisationId: request.user.organisationId,
//         //     user_id: request.user.id,
//         //     action: `Deleted team ${team.id}`,
//         //     meta: { teamId: team.id }
//         // })

//         response.json({ message: 'Team deleted successfully' })
//     } catch (error) {
//         console.log(error)
//         response.status(500).json({ message: 'Failed to delete team', error: error.message })
//     }
// })


// //Team Assignments

// router.post('/:teamId/assign', logAction("ASSIGN_TEAM"), async (request, response) => {
//     const { employeeId, employeeIds } = request.body
//     const ids = employeeIds || (employeeId ? [employeeId] : [])
//     if (!ids.length) return response.status(400).json({ message: 'No employee IDs provided' })

//     try {
//         const team = await Team.findByPk(request.params.teamId)
//         if (!team || !checkOrgOwnership(request, team))
//             return response.status(404).json({ message: 'Team not found' })

//         const validEmployees = await Employee.findAll({
//             where: {
//                 id: ids,
//                 organisationId: request.user.organisationId
//             }
//         })

//         await Promise.all(validEmployees.map(e => EmployeeTeam.findOrCreate({
//             where: { teamId: team.id, employeeId: e.id }
//         })))

//         // await Log.create({
//         //     organisation_id: request.user.organisation_id,
//         //     user_id: request.user.id,
//         //     action: `Assigned employees to team ${team.id}`,
//         //     meta: { teamId: team.id, employeeIds: validEmployees.map(e => e.id) }
//         // })

//         response.json({ message: 'Employees assigned successfully' })
//     } catch (error) {
//         console.log(error)
//         response.status(500).json({ message: 'Failed to assign employees', error: error.message })
//     }
// })


// router.delete('/:teamId/unassign', logAction("UNASSIGN_TEAM"), async (request, response) => {
//     const { employeeId } = request.body
//     if (!employeeId) return response.status(400).json({ message: 'Employee ID required' })

//     try {
//         const team = await Team.findByPk(request.params.teamId)
//         if (!team || !checkOrgOwnership(request, team))
//             return response.status(404).json({ message: 'Team not found' })

//         await EmployeeTeam.destroy({
//             where: { teamId: team.id, employeeId: employeeId }
//         })

//         // await Log.create({
//         //     organisationId: request.user.organisationId,
//         //     user_id: request.user.id,
//         //     action: `Unassigned employee ${employeeId} from team ${team.id}`,
//         //     meta: { teamId: team.id, employeeId }
//         // })

//         response.json({ message: 'Employee unassigned successfully' })
//     } catch (error) {
//         console.log(error)
//         response.status(500).json({ message: 'Failed to unassign employee', error: error.message })
//     }
// })


