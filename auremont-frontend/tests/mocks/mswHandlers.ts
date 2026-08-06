import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const mockProducts = [
  {
    id: 'prod-001-uuid',
    name: 'California Reserve Raw Almonds 250g',
    slug: 'california-reserve-raw-almonds-250g',
    sku: 'ALM-RAW-250',
    price: '799.00',
    salePrice: '699.00',
    stockQty: 50,
    thumbnailUrl: '/images/california-almonds-250g.png',
    description: 'Ultra-premium single-origin California reserve almonds.',
    category: { name: 'Raw Reserve', slug: 'raw-reserve' },
  },
  {
    id: 'prod-002-uuid',
    name: 'Slow-Roasted Sea Salt Almonds 250g',
    slug: 'slow-roasted-sea-salt-almonds-250g',
    sku: 'ALM-RST-250',
    price: '899.00',
    salePrice: null,
    stockQty: 25,
    thumbnailUrl: '/images/roasted-almonds-jar.png',
    description: 'Hand-roasted artisanal sea salt almonds.',
    category: { name: 'Gourmet Roasted', slug: 'gourmet-roasted' },
  },
];

export const mockUser = {
  id: 'user-001-uuid',
  firstName: 'Alexander',
  lastName: 'Vance',
  email: 'alexander.vance@auremont.com',
  phone: '+919876543210',
  role: 'customer',
};

export const mockCart = {
  id: 'cart-001-uuid',
  userId: mockUser.id,
  status: 'active',
  items: [
    {
      id: 'cart-item-1',
      cartId: 'cart-001-uuid',
      productId: mockProducts[0].id,
      quantity: 2,
      unitPrice: '699.00',
      subtotal: '1398.00',
      product: mockProducts[0],
    },
  ],
};

export const mockCoupon = {
  id: 'coupon-001-uuid',
  code: 'LUXURY20',
  type: 'percentage',
  value: '20.00',
  minimumOrder: '1000.00',
  maxDiscount: '500.00',
  status: true,
};

export const handlers = [
  // Auth Handlers
  http.post('*/auth/login', async () => {
    return HttpResponse.json({
      accessToken: 'mock_jwt_access_token_12345',
      user: mockUser,
    });
  }),

  http.post('*/auth/register', async () => {
    return HttpResponse.json({
      accessToken: 'mock_jwt_access_token_67890',
      user: mockUser,
    });
  }),

  http.get('*/auth/me', () => {
    return HttpResponse.json(mockUser);
  }),

  // Product Handlers
  http.get('*/products', () => {
    return HttpResponse.json({ data: mockProducts, total: mockProducts.length });
  }),

  http.get('*/products/:slug', ({ params }) => {
    const prod = mockProducts.find((p) => p.slug === params.slug || p.id === params.slug);
    if (prod) {
      return HttpResponse.json(prod);
    }
    return new HttpResponse(JSON.stringify({ message: 'Product not found' }), { status: 404 });
  }),

  // Cart Handlers
  http.get('*/cart', () => {
    return HttpResponse.json(mockCart);
  }),

  http.post('*/cart/items', async () => {
    return HttpResponse.json(mockCart);
  }),

  http.put('*/cart/items/:id', async () => {
    return HttpResponse.json(mockCart);
  }),

  http.delete('*/cart/items/:id', async () => {
    return HttpResponse.json(mockCart);
  }),

  http.post('*/cart/merge', async () => {
    return HttpResponse.json(mockCart);
  }),

  // Coupon Validation Handler
  http.post('*/coupons/validate', async ({ request }) => {
    const body: any = await request.json();
    if (body.code === 'LUXURY20') {
      return HttpResponse.json({ coupon: mockCoupon });
    }
    return new HttpResponse(JSON.stringify({ message: 'Invalid or expired coupon code' }), { status: 400 });
  }),

  // Order Handlers
  http.post('*/orders', async () => {
    return HttpResponse.json({
      id: 'order-001-uuid',
      orderNumber: 'ORD-1700000000-123',
      subtotal: '1398.00',
      total: '1467.90',
      orderStatus: 'placed',
      paymentStatus: 'pending',
      paymentSession: {
        razorpayOrderId: 'order_mock_rzp_123',
        amount: 146790,
        currency: 'INR',
      },
    });
  }),

  http.get('*/orders/my-orders', () => {
    return HttpResponse.json([
      {
        id: 'order-001-uuid',
        orderNumber: 'ORD-1700000000-123',
        total: '1467.90',
        orderStatus: 'placed',
        createdAt: '2026-08-01T10:00:00.000Z',
        items: mockCart.items,
      },
    ]);
  }),

  // Payment Verification Handler
  http.post('*/payments/verify', async () => {
    return HttpResponse.json({ status: 'success', message: 'Payment verified' });
  }),
];

export const server = setupServer(...handlers);
