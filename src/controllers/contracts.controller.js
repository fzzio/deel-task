const getContract = async (req, res) => {
  const { Contract } = req.app.get('models');
  const { id } = req.params;
  const { profile } = req;

  try {
    const contract = await Contract.findOne({ where: { id } });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    const isClient = profile.type === 'client' && contract.ClientId === profile.id;
    const isContractor = profile.type === 'contractor' && contract.ContractorId === profile.id;


    if (isClient || isContractor) {
      return res.json(contract);
    } else {
      return res.status(403).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error retrieving contract:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getContract
};