import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ContainerMaster database...');

  // Clear existing master records to prevent duplicates
  await prisma.containerMaster.deleteMany({});
  console.log('Cleared existing container master logs.');

  const dummyMaster = [
    { cont_no: 'MSKU8261845', source: 'Import' },
    { cont_no: 'MSKU2398416', source: 'Import' },
    { cont_no: 'MSKU4819273', source: 'Export' },
    { cont_no: 'MSKU5829104', source: 'Export' },
    { cont_no: 'MAEU9283741', source: 'Import' },
    { cont_no: 'MAEU1029384', source: 'Export' },
    { cont_no: 'MAEU5910283', source: 'Empty' },
    { cont_no: 'DFSU4829103', source: 'Empty' },
    { cont_no: 'DFSU8293740', source: 'Import' },
    { cont_no: 'PONU2910284', source: 'Export' }
  ];

  for (const master of dummyMaster) {
    await prisma.containerMaster.create({
      data: {
        cont_no: master.cont_no,
        source: master.source
      }
    });
    console.log(`Seeded master container: ${master.cont_no} (${master.source})`);
  }

  console.log('ContainerMaster seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
