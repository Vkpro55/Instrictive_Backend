import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';
const prisma = new PrismaClient();

export const getAllStudents = async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            include: {
                courses: true,  // Include the related courses
            },
        });
        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching students.' });
    } finally {
        await prisma.$disconnect();
    }
};

export const updateStudent = async (req, res) => {
    const { id } = req.params;
    const { name, cohort, dateJoined, lastLogin, status, courses } = req.body;

    try {
        // Ensure that the courses array contains valid course ids
        if (courses && Array.isArray(courses)) {
            // Check that every course has a valid id
            for (let course of courses) {
                if (!course.id) {
                    return res.status(400).json({ error: 'Each course must have a valid id.' });
                }
            }
        }

        // Proceed with the update
        const updatedStudent = await prisma.student.update({
            where: { id: parseInt(id) },
            data: {
                name,
                cohort,
                dateJoined: new Date(dateJoined),
                lastLogin: new Date(lastLogin),
                status,
                courses: {
                    set: courses ? courses.map(course => ({ id: course.id })) : [], // Ensure each course has a valid id
                },
            },
        });

        res.status(200).json(updatedStudent);
    } catch (error) {
        console.error(error);
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
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the student.' });
    } finally {
        await prisma.$disconnect();
    }
};

export const createStudent = async (req, res) => {
    const { name, cohort, dateJoined, lastLogin, status, courses } = req.body;

    try {
        // Extract course names from the request
        const courseNames = courses.map(course => course.name);

        // Fetch existing courses from the database
        const existingCourses = await prisma.course.findMany({
            where: {
                name: { in: courseNames },
            },
        });

        // Validate that all provided courses exist in the database
        if (existingCourses.length !== courseNames.length) {
            return res.status(400).json({ error: 'One or more courses do not exist in the database.' });
        }

        // Create the student and link to existing courses
        const newStudent = await prisma.student.create({
            data: {
                name,
                cohort,
                dateJoined: new Date(dateJoined),
                lastLogin: new Date(lastLogin),
                status,
                courses: {
                    connect: existingCourses.map(course => ({ id: course.id })),
                },
            },
            include: {
                courses: true, // Include related courses
            },
        });

        // Respond with the created student
        res.status(201).json(newStudent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the student.' });
    } finally {
        await prisma.$disconnect();
    }
};

