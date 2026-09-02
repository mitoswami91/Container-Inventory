import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function inspect() {
  const totalCount = await prisma.containerMaster.count();
  console.log(`Total rows in container_master: ${totalCount}`);

  const sampleRows = await prisma.containerMaster.findMany({
    take: 10,
    orderBy: { id: 'desc' }
  });
  console.log('Sample 10 recent rows:', sampleRows);

  const distinctCount: any = await prisma.$queryRawUnsafe(
    'SELECT COUNT(DISTINCT cont_no) as unique_cont FROM container_master;'
  );
  console.log('Unique container count:', distinctCount);

  const withSizeCount = await prisma.containerMaster.count({
    where: {
      size: { not: null }
    }
  });
  console.log(`Rows with valid size: ${withSizeCount}`);

  await prisma.$disconnect();
}

inspect().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
});
