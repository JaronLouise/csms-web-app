const Service = require('../models/Service');

// @desc Get all services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json(services);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
};

// @desc Get single service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (err) {
    console.error('Error fetching service:', err);
    res.status(500).json({ message: 'Failed to fetch service' });
  }
};

// @desc Create new service (Admin only)
exports.createService = async (req, res) => {
  try {
    const { name, description, features, icon } = req.body;
    
    const service = await Service.create({
      name,
      description,
      features: features || [],
      icon: icon || 'default-icon'
    });

    res.status(201).json(service);
  } catch (err) {
    console.error('Error creating service:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Service with this name already exists' });
    }
    res.status(500).json({ message: 'Failed to create service' });
  }
};

// @desc Update service (Admin only)
exports.updateService = async (req, res) => {
  try {
    const { name, description, features, icon, isActive } = req.body;
    
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.features = features || service.features;
    service.icon = icon || service.icon;
    service.isActive = isActive !== undefined ? isActive : service.isActive;

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (err) {
    console.error('Error updating service:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Service with this name already exists' });
    }
    res.status(500).json({ message: 'Failed to update service' });
  }
};

// @desc Delete service (Admin only)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service removed' });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ message: 'Failed to delete service' });
  }
}; 