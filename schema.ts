import { objectType, makeSchema, intArg, stringArg, nullable } from "nexus";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const Property = objectType({
  name: "Property",
  definition(t) {
    t.int("id");
    t.string("name");
    t.string("description");
    t.string("area");
    t.string("facilities");
    t.string("propertyType");
    t.string("mainImage");
    t.string("images");
    t.int("price");
    t.int("ownerId");
    t.field("owner", {
      type: "Owner",
      resolve: (parent, _, context) => {
        return prisma.property.findUnique({ where: { id: parent.id } }).owner();
      },
    });
  },
});

const Owner = objectType({
  name: "Owner",
  definition(t) {
    t.int("id");
    t.string("contactNumber");
    t.string("profileImage");
    t.string("name");
    t.string("city");
  },
});

const Query = objectType({
  name: "Query",
  definition(t) {
    t.list.field("getProperties", {
      type: "Property",
      args: {
        name: nullable(stringArg()),
        description: nullable(stringArg()),
        propertyType: nullable(stringArg()),
        priceLessThan: nullable(intArg()),
        priceGreaterThan: nullable(intArg()),
      },
      resolve: (_, args, context) => {
        return prisma.property.findMany({
          where: {
            name: { contains: args.name },
            description: { contains: args.description },
            propertyType: { equals: args.propertyType },
            price: {
              ...(args.priceLessThan ? { lte: args.priceLessThan } : {}),
              ...(args.priceGreaterThan ? { gte: args.priceGreaterThan } : {}),
            },
          },
        });
      },
    });

    t.field("getPropertyById", {
      type: "Property",
      args: {
        id: intArg(),
      },
      resolve: (_, { id }, context) => {
        return prisma.property.findUnique({
          where: { id: id },
        });
      },
    });

    t.list.field("getOwners", {
      type: "Owner",
      resolve: (_, __, context) => {
        return prisma.owner.findMany();
      },
    });

    t.field("getOwnerById", {
      type: "Owner",
      args: {
        id: intArg(),
      },
      resolve: (_, { id }, context) => {
        return prisma.owner.findUnique({
          where: { id: id },
        });
      },
    });
  },
});

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("createProperty", {
      type: "Property",
      args: {
        name: stringArg(),
        description: stringArg(),
        area: stringArg(),
        facilities: stringArg(),
        propertyType: stringArg(),
        mainImage: stringArg(),
        images: stringArg(),
        price: intArg(),
        ownerId: intArg(),
      },
      resolve: (_, args, context) => {
        return prisma.property.create({ data: args });
      },
    });

    t.field("updateProperty", {
      type: "Property",
      args: {
        id: intArg(),
        name: stringArg(),
        description: stringArg(),
        area: stringArg(),
        facilities: stringArg(),
        propertyType: stringArg(),
        mainImage: stringArg(),
        images: stringArg(),
        price: intArg(),
        ownerId: intArg(),
      },
      resolve: (_, args, context) => {
        const { id, ...data } = args;
        return prisma.property.update({
          where: { id: id },
          data: data,
        });
      },
    });

    t.field("deleteProperty", {
      type: "Property",
      args: {
        id: intArg(),
      },
      resolve: (_, { id }, context) => {
        return prisma.property.delete({
          where: { id: id },
        });
      },
    });

    t.field("createOwner", {
      type: "Owner",
      args: {
        contactNumber: stringArg(),
        profileImage: stringArg(),
        name: stringArg(),
        city: stringArg(),
      },
      resolve: (_, args, context) => {
        return prisma.owner.create({ data: args });
      },
    });

    t.field("updateOwner", {
      type: "Owner",
      args: {
        id: intArg(),
        contactNumber: stringArg(),
        profileImage: stringArg(),
        name: stringArg(),
        city: stringArg(),
      },
      resolve: (_, args, context) => {
        const { id, ...data } = args;
        return prisma.owner.update({
          where: { id: id },
          data: data,
        });
      },
    });

    t.field("deleteOwner", {
      type: "Owner",
      args: {
        id: intArg(),
      },
      resolve: (_, { id }, context) => {
        return prisma.owner.delete({
          where: { id: id },
        });
      },
    });
  },
});

export const schema = makeSchema({
  types: [Property, Owner, Query, Mutation],
  outputs: {
    schema: __dirname + "/generated/schema.graphql",
    typegen: __dirname + "/generated/typings.ts",
  },
});
