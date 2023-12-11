const { Op } = require("sequelize");
const { ContractTypes } = require('../utils/data.types');

const depositsMoney = async (req, res) => {
  const { Contract, Profile, Job } = req.app.get('models');
  const sequelize = req.app.get('sequelize');
  const { userId } = req.params;
  const { amount } = req.body;
  const { profile } = req;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const t = await sequelize.transaction();

  try {
    const senderClient = await Profile.findOne({
      where: { id: profile.id, type: 'client' },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!senderClient) {
      await t.rollback();
      return res.status(404).json({ error: 'Sender client not found' });
    }

    const unpaidJobs = await Job.sum('price', {
      where: {
        paid: null,
        '$Contract.ClientId$': profile.id,
      },
      include: {
        model: Contract,
        where: {
          status: { [Op.ne]: ContractTypes.TERMINATED },
        },
      },
      transaction: t,
    });

    const maxDeposit = unpaidJobs * 0.25;

    if (amount > maxDeposit) {
      await t.rollback();
      return res.status(400).json({ error: 'Deposit exceeds the allowed limit' });
    }

    const targetClient = await Profile.findOne({
      where: { id: userId, type: 'client' },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!targetClient) {
      await t.rollback();
      return res.status(404).json({ error: 'Target client not found' });
    }

    senderClient.balance -= amount;
    targetClient.balance += amount;

    await Promise.all([
      senderClient.save({ transaction: t }),
      targetClient.save({ transaction: t }),
    ]);

    await t.commit();

    return res.json({ message: 'Money deposited successfully' });
  } catch (error) {
    console.error('Error depositing money:', error);
    await t.rollback();
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  depositsMoney
};