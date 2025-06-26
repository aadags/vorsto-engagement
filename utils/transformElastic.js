function transformProductToESDoc(product) {
    const inventory = product.inventories?.[0];
  
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      image: product.image,
      category: product.category
        ? { id: product.category.id, name: product.category.name }
        : null,
      organization_id: product.organization_id,
      outofstock: product.outofstock,
      measurement_type: product.measurement_type,
      price: inventory?.price ?? null,
      inventory_name: inventory?.name ?? null,
      barcode: inventory?.barcode ?? null,
      active: product.active,
      created_at: product.created_at,
    };
  }
  