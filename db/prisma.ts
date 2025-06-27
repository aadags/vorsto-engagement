import {Prisma, PrismaClient, Product} from '@prisma/client';
import { esClient } from '@/elastic/elasticClient';

declare let global: {
  prisma: PrismaClient;
};

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }

  prisma = global.prisma
}

// prisma.$use(async (params, next) => {
//   const result = await next(params);

//   if (params.model === 'Product' && ['create', 'update', 'delete'].includes(params.action)) {
//     const productId = params.action === 'delete' ? params.args.where.id : result.id;

//     if (params.action === 'delete') {
//       await esClient.delete({
//         index: 'products',
//         id: productId,
//       });
//     } else {
//       const product: any = await prisma.product.findUnique({
//         where: { id: productId },
//         include: {
//           category: true,
//           inventories: {
//             where: { active: true },
//             select: {
//               id: true,
//               name: true,
//               barcode: true,
//               quantity: true,
//               weight_available: true,
//               price: true,
//               price_unit: true,
//               min_weight: true,
//               weight_step: true,
//             },
//           },
//         },
//       });

//       if (product) {
//         const esDoc: any = {
//           id: product.id,
//           name: product.name,
//           description: product.description,
//           sku: product.sku,
//           image: product.image,
//           category: product.category
//             ? { id: product.category.id, name: product.category.name }
//             : null,
//           category_id: product.category_id ?? null,
//           organization_id: product.organization_id,
//           outofstock: product.outofstock,
//           measurement_type: product.measurement_type,
//           inventories: product.inventories.map((inv) => ({
//             id: inv.id,
//             name: inv.name,
//             barcode: inv.barcode,
//             quantity: inv.quantity,
//             weight_available: inv.weight_available,
//             price: inv.price,
//             price_unit: inv.price_unit,
//             min_weight: inv.min_weight,
//             weight_step: inv.weight_step,
//           })),
//           active: product.active,
//           created_at: product.created_at,
//         };

//         await esClient.index({
//           index: 'products',
//           id: product.id,
//           body: esDoc,
//         });
//       }
//     }
//   }

//   return result;
// });


export default prisma;