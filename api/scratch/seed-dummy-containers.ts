import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding dummy containers...');

  // Find the first user in the database
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('No users found in database! Please register or seed a user first.');
    return;
  }

  console.log(`Using user: ${user.full_name} (ID: ${user.id})`);

  // Clear existing active containers to ensure clean test state
  await prisma.container.deleteMany({});
  console.log('Cleared existing containers.');

  const dummyContainers = [
    { cont_no: 'MSKU8261845', size: 20, location: 'SMS1', location_remarks: 'Stack A, Line 2' },
    { cont_no: 'MAEU2398416', size: 40, location: 'SMS2', location_remarks: 'Stack B, Line 5' },
    { cont_no: 'SUDU4819273', size: 40, location: 'SMS3', location_remarks: 'Yard East' },
    { cont_no: 'PONU5829104', size: 20, location: 'SMS1', location_remarks: 'Near Gate 1' },
    { cont_no: 'HLXU9283741', size: 40, location: 'SMS4', location_remarks: 'Reefer Zone' },
    { cont_no: 'DFSU1029384', size: 20, location: 'SMS5', location_remarks: 'Maintenance Bay' },
    { cont_no: 'TGBU5910283', size: 40, location: 'SMS2', location_remarks: 'Stack C, Line 1' },
    { cont_no: 'OCGU4829103', size: 20, location: 'SMS3', location_remarks: 'Yard West' },
    { cont_no: 'NYKU8293740', size: 40, location: 'SMS1', location_remarks: 'Stack D, Line 3' },
    { cont_no: 'OOLU2910284', size: 20, location: 'SMS4', location_remarks: 'Customs Hold' }
  ];

  for (const container of dummyContainers) {
    await prisma.container.create({
      data: {
        cont_no: container.cont_no,
        size: container.size,
        location: container.location,
        location_remarks: container.location_remarks,
        user_id: user.id
      }
    });
    console.log(`Created container: ${container.cont_no}`);
  }

  console.log('Dummy containers seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
