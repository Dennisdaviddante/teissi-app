const { Router } = require('express');
const { getAllAssessments  } = require('../controllers/statistics.controller');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdmin } = require('../middlewares/validate-roles');

const router = Router();

// Obtener estadísticas (solo admin)
router.get('/all-assessments', [
    validateJWT,
    getAllAssessments
], );

module.exports = router;
