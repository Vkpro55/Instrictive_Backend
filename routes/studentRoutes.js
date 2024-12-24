import express from 'express';
import { body } from 'express-validator';
import { getAllStudents, updateStudent, deleteStudent, createStudent } from '../controllers/studentController.js';

const router = express.Router();

router.get('/', getAllStudents);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.post(
    '/',
    [
        body('name')
            .isString()
            .withMessage('Name must be a string')
            .notEmpty()
            .withMessage('Name is required'),
        body('cohort')
            .isIn(['AY24', 'AY25'])
            .withMessage('Cohort must be either AY24 or AY25'),
        body('courses')
            .isArray()
            .withMessage('Courses must be an array')
            .notEmpty()
            .withMessage('Courses are required')
            .custom((value) => {
                const validCourses = ['CBSE 9 Science', 'CBSE 9 Math'];
                return value.every((course) => validCourses.includes(course.name));
            })
            .withMessage('Each course must be either CBSE 9 Science or CBSE 9 Math'),
    ],
    createStudent
);


export default router;
