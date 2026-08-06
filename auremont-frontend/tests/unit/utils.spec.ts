/**
 * Unit Tests for Auremont E-Commerce Utilities
 * Coverage: Currency, GST, Price Formatting, Coupon Engine, Shipping Calculator, Validation, Date Formatting, Slug Generator
 */


export function calculateGST(subtotal: number, rate = 0.05): number {
  return Number((Math.round(subtotal * rate * 100) / 100).toFixed(2));
}

export function calculateShipping(subtotal: number, threshold = 1999): number {
  return subtotal >= threshold ? 0 : 150;
}

export function applyCouponDiscount(
  subtotal: number,
  coupon: { type: 'flat' | 'percentage'; value: number; maxDiscount?: number; minimumOrder?: number }
): number {
  if (coupon.minimumOrder && subtotal < coupon.minimumOrder) {
    return 0;
  }
  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.value;
  }
  return Number(Math.min(discount, subtotal).toFixed(2));
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^\+?[1-9]\d{9,14}$/.test(phone.replace(/[\s-]/g, ''));
}

export function formatPriceINR(amountInINR: number, currency: 'INR' | 'USD' | 'EUR' | 'GBP' = 'INR'): string {
  const exchangeRates: Record<string, number> = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
  };
  const converted = amountInINR * (exchangeRates[currency] || 1);
  const symbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  return `${symbols[currency]}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

describe('Auremont E-Commerce Utilities Suite', () => {
  describe('GST Calculator', () => {
    it('should calculate 5% GST correctly for subtotal of 1000', () => {
      // Arrange
      const subtotal = 1000;
      // Act
      const tax = calculateGST(subtotal);
      // Assert
      expect(tax).toBe(50);
    });

    it('should handle decimal subtotal with correct 2-decimal rounding', () => {
      // Arrange
      const subtotal = 1398.5;
      // Act
      const tax = calculateGST(subtotal);
      // Assert
      expect(tax).toBe(69.93);
    });
  });

  describe('Shipping Calculator', () => {
    it('should return 0 shipping for subtotal >= 1999', () => {
      expect(calculateShipping(2000)).toBe(0);
      expect(calculateShipping(1999)).toBe(0);
    });

    it('should return flat shipping fee of 150 for subtotal < 1999', () => {
      expect(calculateShipping(1500)).toBe(150);
      expect(calculateShipping(0)).toBe(150);
    });
  });

  describe('Coupon Engine Logic', () => {
    it('should reject coupon if subtotal is below minimum order limit', () => {
      const coupon = { type: 'percentage' as const, value: 20, minimumOrder: 2000 };
      const discount = applyCouponDiscount(1500, coupon);
      expect(discount).toBe(0);
    });

    it('should apply percentage discount correctly', () => {
      const coupon = { type: 'percentage' as const, value: 10, minimumOrder: 500 };
      const discount = applyCouponDiscount(1000, coupon);
      expect(discount).toBe(100);
    });

    it('should cap percentage discount to maxDiscount when limit exceeded', () => {
      const coupon = { type: 'percentage' as const, value: 50, maxDiscount: 300, minimumOrder: 500 };
      const discount = applyCouponDiscount(2000, coupon);
      expect(discount).toBe(300);
    });

    it('should apply flat amount coupon correctly', () => {
      const coupon = { type: 'flat' as const, value: 250, minimumOrder: 500 };
      const discount = applyCouponDiscount(1200, coupon);
      expect(discount).toBe(250);
    });

    it('should not allow discount to exceed subtotal', () => {
      const coupon = { type: 'flat' as const, value: 1000 };
      const discount = applyCouponDiscount(500, coupon);
      expect(discount).toBe(500);
    });
  });

  describe('Slug Generator', () => {
    it('should convert luxury title to URL friendly slug', () => {
      const title = 'California Reserve Single-Origin Almonds 250g!!';
      const slug = generateSlug(title);
      expect(slug).toBe('california-reserve-single-origin-almonds-250g');
    });

    it('should handle extra spaces and special characters', () => {
      const text = '   Royal   Gold  Box -- 2026   ';
      expect(generateSlug(text)).toBe('royal-gold-box-2026');
    });
  });

  describe('Validation Helpers', () => {
    it('should validate valid email addresses', () => {
      expect(validateEmail('user@auremont.com')).toBe(true);
      expect(validateEmail('alexander.vance@sub.domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@domain')).toBe(false);
    });

    it('should validate phone numbers correctly', () => {
      expect(validatePhone('+919876543210')).toBe(true);
      expect(validatePhone('9876543210')).toBe(true);
      expect(validatePhone('123')).toBe(false);
    });
  });

  describe('Price Formatter Suite', () => {
    it('should format INR currency correctly', () => {
      expect(formatPriceINR(1499, 'INR')).toBe('₹1,499.00');
    });

    it('should format USD currency with exchange conversion', () => {
      expect(formatPriceINR(1000, 'USD')).toBe('$12.00');
    });

    it('should format EUR and GBP currencies', () => {
      expect(formatPriceINR(1000, 'EUR')).toBe('€11.00');
      expect(formatPriceINR(1000, 'GBP')).toBe('£9.50');
    });
  });
});
