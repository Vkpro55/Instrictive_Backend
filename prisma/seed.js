const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Create courses
    const courses = await prisma.course.createMany({
        data: [
            { name: 'CBSE 9th' },
            { name: 'HPBOSE 10th' },
            // Add more courses as needed
        ],
    });

    // Create students
    for (let i = 0; i < 100; i++) {
        const student = await prisma.student.create({
            data: {
                name: `Student ${i + 1}`,
                cohort: `AY${24 + (i % 2)}`,
                dateJoined: new Date(),
                lastLogin: new Date(),
                status: i % 2 === 0,
                courses: {
                    connect: [
                        { id: 1 }, // Connect to 'CBSE 9th'
                        { id: 2 }, // Connect to 'HPBOSE 10th'
                    ],
                },
            },
        });
        console.log(`Created student: ${student.name}`);
    }
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
