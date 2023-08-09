import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const jogador1 = await prisma.jogadores.upsert({
    where: { email: "jogador1@smart-ranking.com" },
    update: {},
    create: {
      email: "jogador1@smart-ranking.com",
      nome: "Jogador 1",
      telefoneCelular: "11111111111",
    },
  });
  const jogador2 = await prisma.jogadores.upsert({
    where: { email: "jogador2@smart-ranking.com" },
    update: {},
    create: {
      email: "jogador2@smart-ranking.com",
      nome: "Jogador 2",
      telefoneCelular: "22222222222",
    },
  });
  console.log({ jogador1, jogador2 });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
