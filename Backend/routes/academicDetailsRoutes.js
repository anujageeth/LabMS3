const express = require('express');
const router = express.Router();
const {
  getAllAcademicDetails,
  addModule,
  deleteModule,
  addLab,
  deleteLab
} = require('../controllers/academicDetailsController');

// Get all academic details
router.get('/', getAllAcademicDetails);

// Module routes
router.post('/semesters/:semesterId/modules', addModule);
router.delete('/modules/:id', deleteModule);

// Lab routes
router.post('/modules/:moduleId/labs', addLab);
router.delete('/labs/:id', deleteLab);

module.exports = router;