const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "CriminialLaw" },
        { name: "Civil" },
        { name: "Domestic" },
        { name: "Juvenile" },
        { name: "Traffic" },
        { name: "Matrimonial" },
        { name: "Familys" },
      ]
    });

    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();