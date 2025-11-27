const bcrypt = require('bcrypt')
const Organisation = require('./models/organisation')
const User = require('./models/user')
const Employee = require('./models/employee')
const Team = require('./models/team')
const EmployeeTeam = require('./models/employeeTeam')

 const dataSeed = async() => {
    try {
        const orgCount = await Organisation.count()
        if (orgCount > 0) return console.log('Data already seeded')

        const org1 = await Organisation.create({ name: 'Basant Techonolgies'})
        const org2 = await Organisation.create({ name: 'Infosys Software Solutions'})

        const passwordHash = await bcrypt.hash('Password123', 10);
        const admin1 = await User.create({
            organisationId: org1.id,
            email: 'admin1@basanttech.com',
            passwordHash,
            name: 'Tony Admin'
        });
        const admin2 = await User.create({
            organisationId: org2.id,
            email: 'admin2@infosolutions.com',
            passwordHash,
            name: 'Ravi Admin'
        });

        const emp1 = await Employee.create({
            organisationId: org1.id,
            firstName: 'John',
            lastName: 'cena',
            email: 'john.cena@basanttech.com',
            phone: '9876543210'
        });
        const emp2 = await Employee.create({
            organisationId: org1.id,
            firstName: 'steve',
            lastName: 'Smith',
            email: 'steve.smith@infosolutions.com',
            phone: '9876543210'
        });
        const emp3 = await Employee.create({
            organisationId: org2.id,
            firstName: 'Mike',
            lastName: 'kumar',
            email: 'mike.kumar@infosolutions.com',
            phone: '5555555555'
        });

        const team1 = await Team.create({
            organisationId: org1.id,
            name: 'Development',
            description: 'Basant Development Team'
        });
        const team2 = await Team.create({
            organisationId: org1.id,
            name: 'Marketing',
            description: 'InfoSolutions Marketing Team'
        });
        const team3 = await Team.create({
            organisationId: org2.id,
            name: 'Sales',
            description: 'Basant Sales Team'
        });

        await EmployeeTeam.create({ employeeId: emp1.id, teamId: team1.id });
        await EmployeeTeam.create({ employeeId: emp2.id, teamId: team1.id });
        await EmployeeTeam.create({ employeeId: emp2.id, teamId: team2.id });
        await EmployeeTeam.create({ employeeId: emp3.id, teamId: team3.id });

        console.log('data seeded successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

module.exports = dataSeed;


