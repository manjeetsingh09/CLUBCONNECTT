const { User, Club } = require('./models');
const { sequelize } = require('./config/db');

async function findIds() {
  try {
    await sequelize.authenticate();
    const user = await User.findOne();
    const club = await Club.findOne();
    console.log('User ID:', user?.id);
    console.log('Club ID:', club?.id);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

findIds();
