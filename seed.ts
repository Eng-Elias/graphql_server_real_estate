import { PrismaClient } from "@prisma/client";
import * as fs from "fs/promises";

const prisma = new PrismaClient();

async function seed() {
  try {
    // Read seed data from data.json file
    const seedData = await fs.readFile("data.json", "utf-8");
    const parsedSeedData = JSON.parse(seedData);

    for (const propertyData of parsedSeedData) {
      const { owner, ...property } = propertyData;

      const createdOwner = await prisma.owner.create({
        data: {
          contactNumber: owner.contactNumber,
          profileImage: owner.profileImage,
          name: owner.name,
          city: owner.city,
        },
      });

      await prisma.property.create({
        data: {
          ...property,
          ownerId: createdOwner.id,
        },
      });
    }

    console.log("Seed data inserted successfully.");
  } catch (error) {
    console.error("Error reading or inserting seed data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
