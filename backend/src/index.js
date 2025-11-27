require('dotenv').config()
const Organisation = require('./models/organisation');
const User = require('./models/user');
const Employee = require('./models/employee');
const Team = require('./models/team');
const EmployeeTeam = require('./models/employeeTeam');
const Log = require('./models/log');
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const authRoutes = require('./routes/auth');
const { logMiddleware } = require('./middlewares/logMiddleware');
const teamRoutes = require('./routes/teams');
const employeeRoutes = require('./routes/employees');
const logRoutes = require('./routes/logRoutes');
const statRoute = require('./routes/stats');
const errorHandler = require("./middlewares/errorHandler");
const authMiddleware = require('./middlewares/authMiddleware');
const cors = require("cors");

app.use(express.json());
app.use(cors({
    origin: "https://hrms-z5xo.onrender.com",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

app.use('/api/auth', authRoutes);

app.use(logMiddleware);

app.use(authMiddleware);

app.use('/api/teams', teamRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/stats', statRoute);
app.use('/api/logs', logRoutes);

app.use(errorHandler);

module.exports = app;

Organisation.hasMany(User, {foreignKey: 'organisationId'})
User.belongsTo(Organisation, {foreignKey: 'organisationId'})

Organisation.hasMany(Employee, {foreignKey: 'organisationId'})
Employee.belongsTo(Organisation, {foreignKey: 'organisationId'})

Organisation.hasMany(Team, {foreignKey: 'organisationId'})
Team.belongsTo(Organisation, {foreignKey: 'organisationId'})

Employee.belongsToMany(Team, {through: EmployeeTeam, foreignKey: 'employeeId'})
Team.belongsToMany(Employee, {through: EmployeeTeam, foreignKey: 'teamId'})

Log.belongsTo(Organisation, {foreignKey: 'organisationId'})
Log.belongsTo(User, {foreignKey: 'userId'})


sequelize.sync({ force: false })
.then(async() => {
    console.log("Database connected successfully");
    await seedData();
    app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
    })
}) 
.catch(error => {
    console.log("Failed to sync Database", error)
})

