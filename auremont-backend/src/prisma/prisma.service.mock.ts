/* eslint-disable no-plusplus */
export const createMockPrismaService = () => {
  const mockDb: Record<string, any[]> = {
    users: [],
    adminUsers: [],
    products: [],
    carts: [],
    cartItems: [],
    orders: [],
    orderItems: [],
    payments: [],
    coupons: [],
    addresses: [],
    inventoryLogs: [],
    auditLogs: [],
    adminAuditLogs: [],
    outboxEvents: [],
    webhookLogs: [],
    reviews: [],
    blogs: [],
    contactMessages: [],
    notifications: [],
    wishlists: [],
    wishlistItems: [],
    categories: [],
  };

  const matchWhere = (item: any, where: any): boolean => {
    if (!where) return true;
    if (where.OR && Array.isArray(where.OR)) {
      return where.OR.some((subWhere: any) => matchWhere(item, subWhere));
    }
    if (where.AND && Array.isArray(where.AND)) {
      return where.AND.every((subWhere: any) => matchWhere(item, subWhere));
    }
    return Object.entries(where).every(([key, val]: [string, any]) => {
      if (key === 'OR' || key === 'AND') return true;
      const itemVal = item[key];
      if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
        if ('path' in val && 'equals' in val && Array.isArray(val.path)) {
          let target = itemVal;
          for (const p of val.path) {
            if (target && typeof target === 'object') {
              target = target[p];
            } else {
              target = undefined;
              break;
            }
          }
          return target === val.equals;
        }
        if ('lte' in val) {
          return (itemVal instanceof Date ? itemVal.getTime() : itemVal) <= (val.lte instanceof Date ? val.lte.getTime() : val.lte);
        }
        if ('gte' in val) {
          return (itemVal instanceof Date ? itemVal.getTime() : itemVal) >= (val.gte instanceof Date ? val.gte.getTime() : val.gte);
        }
        if ('lt' in val) {
          return (itemVal instanceof Date ? itemVal.getTime() : itemVal) < (val.lt instanceof Date ? val.lt.getTime() : val.lt);
        }
        if ('gt' in val) {
          return (itemVal instanceof Date ? itemVal.getTime() : itemVal) > (val.gt instanceof Date ? val.gt.getTime() : val.gt);
        }
        if ('in' in val && Array.isArray(val.in)) {
          return val.in.includes(itemVal);
        }
        if ('not' in val) {
          return itemVal !== val.not;
        }
        if ('some' in val) {
          return Array.isArray(itemVal) && itemVal.length > 0;
        }
      }
      if (itemVal instanceof Date && val instanceof Date) {
        return itemVal.getTime() === val.getTime();
      }
      return itemVal === val;
    });
  };

  const createModelDelegate = (tableName: string) => ({
    findUnique: jest.fn(async ({ where }: { where: any }) => {
      const list = mockDb[tableName] || [];
      return list.find((item) => matchWhere(item, where)) || null;
    }),

    findFirst: jest.fn(async ({ where }: { where: any } = { where: undefined }) => {
      const list = mockDb[tableName] || [];
      if (!where) return list[0] || null;
      return list.find((item) => matchWhere(item, where)) || null;
    }),

    findMany: jest.fn(async ({ where, skip, take, orderBy }: any = {}) => {
      let list = [...(mockDb[tableName] || [])];
      if (where) {
        list = list.filter((item) => matchWhere(item, where));
      }
      if (skip) list = list.slice(skip);
      if (take) list = list.slice(0, take);
      return list;
    }),

    create: jest.fn(async ({ data }: { data: any }) => {
      const newItem = {
        id: data.id || `${tableName.replace(/s$/, '')}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };
      if (!mockDb[tableName]) mockDb[tableName] = [];
      mockDb[tableName].push(newItem);
      return newItem;
    }),

    update: jest.fn(async ({ where, data }: { where: any; data: any }) => {
      const list = mockDb[tableName] || [];
      const item = list.find((i) => Object.entries(where).every(([k, v]) => i[k] === v));
      if (!item) throw new Error(`Record not found in ${tableName}: ${JSON.stringify(where)}`);

      Object.entries(data).forEach(([key, val]: [string, any]) => {
        if (val && typeof val === 'object' && 'decrement' in val) {
          item[key] = (item[key] || 0) - val.decrement;
        } else if (val && typeof val === 'object' && 'increment' in val) {
          item[key] = (item[key] || 0) + val.increment;
        } else {
          item[key] = val;
        }
      });
      item.updatedAt = new Date();
      return item;
    }),

    upsert: jest.fn(async ({ where, create: createData, update: updateData }: { where: any; create: any; update: any }) => {
      const list = mockDb[tableName] || [];
      const existing = list.find((i) => Object.entries(where).every(([k, v]) => i[k] === v));
      if (existing) {
        Object.entries(updateData).forEach(([key, val]) => {
          (existing as any)[key] = val;
        });
        existing.updatedAt = new Date();
        return existing;
      }
      const newItem = {
        id: createData.id || `${tableName.replace(/s$/, '')}-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...createData,
      };
      if (!mockDb[tableName]) mockDb[tableName] = [];
      mockDb[tableName].push(newItem);
      return newItem;
    }),

    delete: jest.fn(async ({ where }: { where: any }) => {
      const list = mockDb[tableName] || [];
      const idx = list.findIndex((i) => Object.entries(where).every(([k, v]) => i[k] === v));
      if (idx !== -1) {
        const [removed] = list.splice(idx, 1);
        return removed;
      }
      return null;
    }),

    deleteMany: jest.fn(async ({ where }: { where: any } = { where: {} }) => {
      const list = mockDb[tableName] || [];
      const before = list.length;
      mockDb[tableName] = list.filter(
        (i) => !Object.entries(where).every(([k, v]) => i[k] === v)
      );
      return { count: before - mockDb[tableName].length };
    }),

    count: jest.fn(async ({ where }: any = {}) => {
      let list = mockDb[tableName] || [];
      if (where) {
        list = list.filter((item) => Object.entries(where).every(([k, v]) => item[k] === v));
      }
      return list.length;
    }),

    createMany: jest.fn(async ({ data }: { data: any[] }) => {
      if (!mockDb[tableName]) mockDb[tableName] = [];
      data.forEach((d) =>
        mockDb[tableName].push({
          id: d.id || `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          ...d,
        })
      );
      return { count: data.length };
    }),

    updateMany: jest.fn(async ({ where, data }: { where: any; data: any }) => {
      const list = mockDb[tableName] || [];
      let count = 0;
      list.forEach((item) => {
        const matches = Object.entries(where).every(([k, v]) => item[k] === v);
        if (matches) {
          Object.assign(item, data);
          count += 1;
        }
      });
      return { count };
    }),
  });

  const prismaMock: any = {
    user: createModelDelegate('users'),
    adminUser: createModelDelegate('adminUsers'),
    product: createModelDelegate('products'),
    cart: createModelDelegate('carts'),
    cartItem: createModelDelegate('cartItems'),
    order: createModelDelegate('orders'),
    orderItem: createModelDelegate('orderItems'),
    payment: createModelDelegate('payments'),
    coupon: createModelDelegate('coupons'),
    address: createModelDelegate('addresses'),
    inventoryLog: createModelDelegate('inventoryLogs'),
    auditLog: createModelDelegate('auditLogs'),
    adminAuditLog: createModelDelegate('adminAuditLogs'),
    outboxEvent: createModelDelegate('outboxEvents'),
    webhookLog: createModelDelegate('webhookLogs'),
    review: createModelDelegate('reviews'),
    blog: createModelDelegate('blogs'),
    contactMessage: createModelDelegate('contactMessages'),
    notification: createModelDelegate('notifications'),
    wishlist: createModelDelegate('wishlists'),
    wishlistItem: createModelDelegate('wishlistItems'),
    category: createModelDelegate('categories'),

    $queryRaw: jest.fn(async () => {
      return mockDb.products.map((p) => ({
        ...p,
        stock_qty: p.stockQty,
        sale_price: p.salePrice,
        thumbnail_url: p.thumbnailUrl,
      }));
    }),

    $transaction: jest.fn(async (cb: any) => {
      if (typeof cb === 'function') {
        // Pass full prismaMock as the transaction object (tx)
        return await cb(prismaMock);
      }
      // Array of promises
      return Promise.all(cb);
    }),

    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),

    _seed: (key: string, data: any[]) => {
      mockDb[key] = [...data];
    },
    _getDb: () => mockDb,
  };

  return prismaMock;
};
