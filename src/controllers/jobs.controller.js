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

const payForAJob = async (req, res) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const sequelize = req.app.get('sequelize');

  const { profile } = req;
  const { job_id } = req.params;

  const t = await sequelize.transaction();

  try {
    const job = await Job.findOne({
      include: {
        model: Contract,
        where: {
          [Op.and]: [
            {
              ClientId: profile.id
            },
            {
              status: { [Op.ne]: ContractTypes.TERMINATED }
            }
          ]
        }
      },
      where: {
        id: job_id
      }
    });

    if (!job) {
      await t.rollback();
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.paid) {
      await t.rollback();
      return res.status(400).json({ error: 'Job already paid' });
    }

    const clientProfile = await Profile.findOne({
      where: { id: job.Contract.ClientId },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!clientProfile || clientProfile.balance < job.price) {
      await t.rollback();
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const contractorProfile = await Profile.findOne({
      where: { id: job.Contract.ContractorId },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!contractorProfile) {
      await t.rollback();
      return res.status(500).json({ error: 'Contractor not found' });
    }

    clientProfile.balance -= job.price;
    contractorProfile.balance += job.price;
    const paymentDate = new Date();

    job.paid = true;
    job.paymentDate = paymentDate;
    job.updatedAt = paymentDate;

    await Promise.all([
      clientProfile.save({ transaction: t }),
      contractorProfile.save({ transaction: t }),
      job.save({ transaction: t }),
    ]);

    await t.commit();

    return res.json({ message: 'Job paid successfully' });
  } catch (error) {
    console.error('Error paying for a job:', error);
    await t.rollback();
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getUnpaid,
  payForAJob
};