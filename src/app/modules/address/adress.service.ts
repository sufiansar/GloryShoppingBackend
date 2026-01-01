import { prisma } from "../../config/prisma";
import { PrismaQueryBuilder } from "../../utility/queryBuilder";
import { IAddress } from "./address.interface";

const createAddress = async (addressData: IAddress) => {
  const isUserAddressExist = await prisma.user.findUnique({
    where: { id: addressData.userId },
    include: { addresses: true },
  });

  if (!isUserAddressExist) {
    throw new Error("User not found");
  }

  const isAddressExist = await prisma.address.findFirst({
    where: {
      userId: addressData.userId,
    },
  });

  if (isAddressExist) {
    throw new Error("Address already exists for this user");
  }
  //   const isAddressExist = isUserAddressExist.addresses.some(
  //     (address) =>
  //       address.label === addressData.label &&
  //       address.street === addressData.street &&
  //       address.city === addressData.city &&
  //       address.district === addressData.district &&
  //       address.postalCode === addressData.postalCode &&
  //       address.country === addressData.country
  //   );
  //   if (isAddressExist) {
  //     throw new Error("Address already exists for this user");
  //   }

  const data = {
    name: addressData.name,
    street: addressData.street,
    city: addressData.city,
    district: addressData.district,
    postalCode: addressData.postalCode,
    country: addressData.country,
    isDefault: addressData.isDefault,
    label: addressData.label,
    userId: isUserAddressExist.id,
  };
  const newAddress = await prisma.address.create({
    data,
  });

  return newAddress;
};

const getAllAddresses = async (query: Record<string, string>) => {
  const prismaQuery = new PrismaQueryBuilder(query).filter().sort().paginate();

  const prismaQueryBuilt = prismaQuery.build();
  const [addresses, meta] = await Promise.all([
    prisma.address.findMany({
      ...prismaQueryBuilt,
    }),
    prismaQuery.getMeta(prisma.address),
  ]);

  return {
    data: addresses,
    meta,
  };
};

const getAddressById = async (id: string) => {
  const address = await prisma.address.findUnique({
    where: { id },
  });
  return address;
};

const updateAddress = async (id: string, addressData: Partial<IAddress>) => {
  const existingAddress = await prisma.address.findUnique({
    where: { id },
  });

  if (!existingAddress) {
    throw new Error("Address not found");
  }

  const updatedAddress = await prisma.address.update({
    where: { id },
    data: addressData,
  });

  return updatedAddress;
};

const deleteAddress = async (id: string) => {
  const existingAddress = await prisma.address.findUnique({
    where: { id },
  });

  if (!existingAddress) {
    throw new Error("Address not found");
  }

  await prisma.address.delete({
    where: { id },
  });
  const addresses = await prisma.address.findMany();
  return addresses;
};

export const AddressService = {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};
