import 'dotenv/config';

import { BcryptService } from '../src/auth/hash/bcrypt.service';
import {
  PrismaClient,
  PermissionResource,
  PermissionAction,
} from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({
  adapter: pool,
  log: ['query', 'info', 'warn', 'error'],
});

const bcryptService = new BcryptService();

async function main() {
  console.log('🧹 Deletando todos os dados...');

  // Deleta na ordem correta (relacionamentos)
  await prisma.contracts.deleteMany({});
  console.log('✅ Contratos deletados');

  await prisma.clients.deleteMany({});
  console.log('✅ Clientes deletados');

  await prisma.motorCycle.deleteMany({});
  console.log('✅ Motos deletadas');

  await prisma.userPermission.deleteMany({});
  console.log('✅ Permissões deletadas');

  await prisma.users.deleteMany({});
  console.log('✅ Usuários deletados');

  console.log('\n🌱 Criando usuário admin...');

  // Hash da senha
  const hashedPassword = await bcryptService.hash('Admin123#');

  // Cria o usuário admin
  const admin = await prisma.users.create({
    data: {
      name: 'Admin',
      email: 'admin@admin.com',
      password: hashedPassword,
    },
  });

  console.log('✅ Usuário admin criado:', {
    id: admin.id,
    name: admin.name,
    email: admin.email,
  });

  console.log('\n🔑 Criando permissões para o admin...');

  // Define todas as permissões possíveis
  const resources = [
    PermissionResource.USERS,
    PermissionResource.CLIENTS,
    PermissionResource.MOTORCYCLES,
    PermissionResource.CONTRACTS,
  ];
  const actions = [
    PermissionAction.READ,
    PermissionAction.CREATE,
    PermissionAction.UPDATE,
    PermissionAction.DELETE,
  ];

  const permissions: {
    userId: string;
    resource: PermissionResource;
    action: PermissionAction;
  }[] = [];

  for (const resource of resources) {
    for (const action of actions) {
      permissions.push({
        userId: admin.id,
        resource: resource,
        action: action,
      });
    }
  }

  // Cria todas as permissões para o admin
  await prisma.userPermission.createMany({
    data: permissions,
  });

  console.log(`✅ ${permissions.length} permissões criadas para o admin`);

  console.log('\n✨ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
