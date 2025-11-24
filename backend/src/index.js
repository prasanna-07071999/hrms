require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;

const {sequelize} = require('./db')
const Organisation = require('./models/organisation')
const User = require('./models/user')
const Employee = require('./models/employee')
const Team = require('./models/team')
const EmployeeTeam = require('./models/employeeTeam')
const Log = require('./models/log')

const authMiddleware = require('./middlewares/authMiddleware')

const seedData = require('./seed');
const cors = require("cors");

const authRoutes = require('./routes/auth')
const teamRoutes = require('./routes/teams')
const employeeRoutes = require('./routes/employees');
const {logMiddleware} = require('./middlewares/logMiddleware');
const logRoutes = require('./routes/logRoutes');

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));
app.use(express.json())
app.use(logMiddleware);
app.use("/api/logs", authMiddleware, logRoutes);
app.use('/api/auth', authRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/employees', employeeRoutes);


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

