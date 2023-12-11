const { Op } = require("sequelize");
const { ContractTypes, ProfileTypes } = require('../utils/data.types');

const getContract = async (req, res, next) => {
  const { Contract } = req.app.get('models');
  const { id } = req.params;
  const { profile } = req;

  try {
    const contract = await Contract.findOne({ where: { id } });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    const isClient = profile.type === ProfileTypes.CLIENT && contract.ClientId === profile.id;
    const isContractor = profile.type === ProfileTypes.CONTRACTOR && contract.ContractorId === profile.id;


    if (isClient || isContractor) {
      return res.json(contract);
    } else {
      return res.status(403).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    next(error);
  }
};

const getContracts = async (req, res, next) => {
  const { Contract } = req.app.get('models');
  const { profile } = req;

  try {
    const contracts = await Contract.findAll({
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
    });

    return res.json(contracts);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getContract,
  getContracts
};