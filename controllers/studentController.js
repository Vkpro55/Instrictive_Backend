import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';
const prisma = new PrismaClient();


export const getAllStudents = async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            include: {
                courses: true, // Include associated courses
            },
        });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching students.' });
    } finally {
        await prisma.$disconnect();
    }
};


export const updateStudent = async (req, res) => {
    const { id } = req.params;
    const { name, cohort, dateJoined, lastLogin, status, courses } = req.body;

    try {
        const updatedStudent = await prisma.student.update({
            where: { id: parseInt(id) },
            data: {
                name,
                cohort,
                dateJoined: new Date(dateJoined),
                lastLogin: new Date(lastLogin),
                status,
                courses: {
                    set: courses.map(courseId => ({ id: courseId })),
                },
            },
        });
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the student.' });
    } finally {
        await prisma.$disconnect();
    }
};

export const deleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.student.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: 'Student deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the student.' });
    } finally {
        await prisma.$disconnect();
    }
};

export const createStudent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, cohort, dateJoined, lastLogin, status, courses } = req.body;

    try {
        const newStudent = await prisma.student.create({
            data: {
                name,
                cohort,
                dateJoined: new Date(dateJoined),
                lastLogin: new Date(lastLogin),
                status,
                courses: {
                    connect: courses.map((course) => ({ name: course.name })),
                },
            },
            include: {
                courses: true,
            },
        });
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the student.' });
    } finally {
        await prisma.$disconnect();
    }
};