import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
  const username = process.env.TEST_ACCOUNT_USERNAME || 'demo_admin';
  const password = process.env.TEST_ACCOUNT_PASSWORD || 'Demo@123456';
  await prisma.user.upsert({ where: { username }, update: { role: 'PRIVILEGED' }, create: { username, passwordHash: await bcrypt.hash(password, 12), role: 'PRIVILEGED' } });
  console.log(`已创建特权测试账号：${username}`);
}
main().finally(() => prisma.$disconnect());
