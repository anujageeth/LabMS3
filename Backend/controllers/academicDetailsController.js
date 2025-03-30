const { Module, Lab } = require('../models/AcademicDetail');

// Get all academic details in a structured format
exports.getAllAcademicDetails = async (req, res) => {
  try {
    const [modules, labs] = await Promise.all([
      Module.find(),
      Lab.find().populate('moduleId')
    ]);

    // Format data for frontend
    const formattedData = {
      modulesBySemester: {},
      labsByModule: {}
    };

    // Organize modules by semester
    modules.forEach(module => {
      const semesterId = module.semesterId;
      if (!formattedData.modulesBySemester[semesterId]) {
        formattedData.modulesBySemester[semesterId] = [];
      }
      formattedData.modulesBySemester[semesterId].push({
        id: module._id,
        name: module.name,
        code: module.code
      });
    });

    // Organize labs by module
    labs.forEach(lab => {
      const moduleId = lab.moduleId._id.toString();
      if (!formattedData.labsByModule[moduleId]) {
        formattedData.labsByModule[moduleId] = [];
      }
      formattedData.labsByModule[moduleId].push({
        id: lab._id,
        name: lab.name
      });
    });

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new module to a semester
exports.addModule = async (req, res) => {
  try {
    const { semesterId } = req.params;
    const { name, code } = req.body;
    
    // Validate semesterId is one of the 8 semesters
    const validSemesterIds = ['sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6', 'sem7', 'sem8'];
    if (!validSemesterIds.includes(semesterId)) {
      return res.status(400).json({ error: 'Invalid semester ID' });
    }

    const module = new Module({ 
      semesterId, 
      name, 
      code 
    });
    await module.save();
    res.status(201).json(module);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add a new lab to a module
exports.addLab = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { name } = req.body;
    
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    const lab = new Lab({ 
      moduleId, 
      name
    });
    await lab.save();
    res.status(201).json(lab);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a module (and its labs)
exports.deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete all labs in this module
    await Lab.deleteMany({ moduleId: id });
    
    // Delete the module
    await Module.findByIdAndDelete(id);
    
    res.json({ message: 'Module and all associated labs deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a lab
exports.deleteLab = async (req, res) => {
  try {
    const { id } = req.params;
    await Lab.findByIdAndDelete(id);
    res.json({ message: 'Lab deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};