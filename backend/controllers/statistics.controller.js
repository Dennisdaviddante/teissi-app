const { response, request } = require('express');
const User = require('../models/user');
const Student = require('../models/student');
const SuicideAssessment = require('../models/suicideAssessment');
const { buildMatchStage } = require('../helpers/staticshelper');




// Controlador principal para la ruta de estadísticas
const getAllAssessments = async (req, res = response) => {
    try {
        // Obtenemos los filtros de la consulta (query)
        const filters = req.query;

        // Construimos la etapa de coincidencia (match stage) para MongoDB
        // Esto filtra las evaluaciones por fecha, carrera, género, etc.
        const matchStage = buildMatchStage(filters);

        let pipeline = [];

        // Si hay filtros, los agregamos al pipeline
        if (matchStage) {
            pipeline.push(matchStage);
        }

        // Unimos los datos de estudiantes y usuarios (psicólogos)
        // Esto permite acceder a la información de la carrera, género, nombre del psicólogo, etc.
        pipeline.push(
            { $lookup: { from: 'students', localField: 'student', foreignField: '_id', as: 'studentInfo' } },
            { $unwind: { path: '$studentInfo', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'users', localField: 'psychologist', foreignField: '_id', as: 'psychologistInfo' } },
            { $unwind: { path: '$psychologistInfo', preserveNullAndEmptyArrays: true } }
        );

        // Opcional: Proyectamos solo los campos que necesitamos para reducir el tamaño de la respuesta
        pipeline.push(
            {
                $project: {
                    _id: 1,
                    date: 1,
                    ideationRiskLevel: 1,
                    behaviorRiskLevel:1,
                    deathWish: 1,
                    nonSpecificActiveSuicidalThoughts: 1,
                    activeSuicidalIdeationWithMethods: 1,
                    activeSuicidalIdeationWithIntent: 1,
                    activeSuicidalIdeationWithPlan: 1,
                    actualAttempt: 1,
                    interruptedAttempt: 1,
                    abortedAttempt: 1,
                    preparatoryActs: 1,
                    'studentInfo.career': 1,
                    'studentInfo.gender': 1,
                    'studentInfo.birthDate': 1,
                    'psychologistInfo.firstName': 1,
                    'psychologistInfo.lastName': 1,
                }
            }
        );

        // Ejecutamos la agregación con el pipeline
        const assessments = await SuicideAssessment.aggregate(pipeline);

        // Enviamos la respuesta con todas las evaluaciones
        res.json(assessments);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error del servidor al obtener las evaluaciones.' });
    }
};


// ...
// En tu archivo de rutas, define la ruta de la siguiente manera:
// const router = express.Router();
// router.get('/stats', getStats);
// module.exports = router;
// ...


module.exports = {
    getAllAssessments,
    
};
