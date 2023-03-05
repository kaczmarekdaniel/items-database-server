import { register } from "ts-node";
import prisma from "../../db";

// level 1 permissions - user
// get all
export const getUserItems = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      items: true,
    },
  });
  res.json({ data: user.items });
};

// get one
export const getOneItem = async (req, res) => {
  const product = await prisma.item.findFirst({
    where: {
      id: req.body.id,
    },
  });

  res.json({ data: product });
};

// level 2 permissions - supervisor

// create product
export const createItem = async (req, res) => {
  const product = await prisma.item.create({
    data: {
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      model: req.body.model,
      serial_number: req.body.serial_number,
      userId: req.body.userId,
    },
  });

  res.json({ data: product });
};

// write a function to update the product if the user is the owner  of the product

// update

async function updateItem(req, res) {
  const item = await prisma.item.findUnique({
    where: { id: req.body.item_id },
  });

  if (!item) {
    throw new Error("Item not found");
  }

  if (item.userId !== req.user && req.user.role !== "admin") {
    throw new Error("You are not authorized to update this item");
  }

  const updatedData = Object.assign({}, item, req.body.data);

  return prisma.item.update({
    where: { id: req.body.item_id },
    data: updatedData,
  });
}

// delete
export const deleteProduct = async (req, res) => {
  const deleted = await prisma.item.delete({
    where: {
      id: req.body.id,
    },
  });
  res.json({ data: deleted });
};

// // unassign
// export const unassignUser = async (req, res) => {
//   const updated = await prisma.item.update({
//     where: {
//       id: req.body.id,
//     },
//     data: {
//       userId: []
//     }
//   });
//   res.json({ data: deleted });
// };
