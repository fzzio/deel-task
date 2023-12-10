const { Op } = require("sequelize");
const { ContractTypes } = require('../utils/data.types');

const getUnpaid = async (req, res) => {
  const { Contract, Job } = req.app.get('models');
  const { profile } = req;

  try {
    const jobs = await Job.findAll({
      include: {
        model: Contract,
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { ClientId: profile.id },
                { ContractorId: profile.id }
              ]
            },
            {
              status: { [Op.ne]: ContractTypes.TERMINATED }
            }
          ]
        }
      },
      where: {
        paid: null
      }
    });

    return res.json(jobs);
  } catch (error) {
    console.error('Error retrieving unpaid jobs:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  getUnpaid
};