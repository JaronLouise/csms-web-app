const mongoose = require('mongoose');
const Service = require('./models/Service');
require('dotenv').config();

const defaultServices = [
  {
    name: 'Sustainable Energy Solutions',
    description: 'Comprehensive renewable energy solutions including solar panel installation, wind energy systems, and energy storage solutions. We help businesses and homeowners transition to clean, sustainable energy sources.',
    features: [
      'Solar Panel Installation & Maintenance',
      'Wind Energy Systems',
      'Energy Storage Solutions',
      'Energy Efficiency Audits',
      'Grid Integration Services',
      '24/7 Monitoring & Support'
    ],
    icon: 'solar',
    isActive: true
  },
  {
    name: 'Fabrication and Installation',
    description: 'Professional fabrication and installation services for industrial equipment, custom machinery, and specialized components. Our expert team ensures precision engineering and reliable installation.',
    features: [
      'Custom Machinery Fabrication',
      'Industrial Equipment Installation',
      'Precision Engineering',
      'Quality Control & Testing',
      'On-site Installation Services',
      'Maintenance & Repair'
    ],
    icon: 'fabrication',
    isActive: true
  },
  {
    name: 'Research',
    description: 'Cutting-edge research and development services in renewable energy technologies, sustainable materials, and innovative engineering solutions. We collaborate with academic institutions and industry partners.',
    features: [
      'Renewable Energy Research',
      'Sustainable Materials Development',
      'Technology Innovation',
      'Academic Collaboration',
      'Industry Partnerships',
      'Patent Development'
    ],
    icon: 'research',
    isActive: true
  }
];

const seedServices = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/csms');
    console.log('Connected to MongoDB');

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Insert default services
    const services = await Service.insertMany(defaultServices);
    console.log(`Successfully seeded ${services.length} services:`);
    
    services.forEach(service => {
      console.log(`- ${service.name}`);
    });

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedServices(); 