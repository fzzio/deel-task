const { Op } = require("sequelize");
const { ProfileTypes } = require('../utils/data.types');

const bestProfession = async (req, res) => {
  const { Contract, Profile, Job } = req.app.get('models');
  const sequelize = req.app.get('sequelize');
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: 'Both start and end parameters are required' });
  }

  try {
    const moneyEarnedByProfession = await Job.findAll({
      attributes: [
        'Contract.Contractor.profession',
        [sequelize.fn('sum', sequelize.col('price')), 'totalMoneyEarned'],
      ],
      where: {
        paid: true,
        paymentDate: { [Op.between]: [start, end] },
      },
      include: {
        model: Contract,
        include: {
          model: Profile,
          as: 'Contractor',
          where: { type: ProfileTypes.CONTRACTOR },
        },
      },
      group: ['Contract.Contractor.profession'],
      order: [[sequelize.col('totalMoneyEarned'), 'DESC']],
    });

    if (moneyEarnedByProfession.length > 0) {
      const bestProfession = moneyEarnedByProfession[0].Contract.Contractor.profession;
      return res.status(200).json({ bestProfession });
    } else {
      return res.status(404).json({ error: 'No professions found' });
    }
  } catch (error) {
    console.error('Error finding best profession:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  bestProfession
};