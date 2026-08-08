"use client";

/**
 * RARE NUTS Privacy-First eCommerce Analytics & GA4 Event Tracker
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const trackEvent = (eventName: string, eventParams: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams);
  } else {
    // Development console logger
    if (process.env.NODE_ENV === "development") {
      console.log(`[ANALYTICS EVENT] ${eventName}:`, eventParams);
    }
  }
};

export const trackProductView = (product: { id: string; name: string; price: number; category?: string }) => {
  trackEvent("view_item", {
    currency: "INR",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category || "Almonds",
        price: product.price,
        quantity: 1,
      },
    ],
  });
};

export const trackAddToCart = (product: { id: string; name: string; price: number; quantity: number }) => {
  trackEvent("add_to_cart", {
    currency: "INR",
    value: product.price * product.quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      },
    ],
  });
};

export const trackBeginCheckout = (cartValue: number, itemsCount: number) => {
  trackEvent("begin_checkout", {
    currency: "INR",
    value: cartValue,
    items_count: itemsCount,
  });
};

export const trackPurchase = (orderId: string, totalValue: number) => {
  trackEvent("purchase", {
    transaction_id: orderId,
    value: totalValue,
    currency: "INR",
  });
};

export const trackGiftBuilderStart = () => {
  trackEvent("gift_builder_start", {
    category: "Gift Builder",
  });
};

export const trackGiftBuilderComplete = (engravingText: string) => {
  trackEvent("gift_builder_complete", {
    has_custom_engraving: Boolean(engravingText),
  });
};

export const trackCorporateInquiry = (companyName?: string) => {
  trackEvent("corporate_gifting_inquiry", {
    has_company_name: Boolean(companyName),
  });
};

export const trackNewsletterSignup = () => {
  trackEvent("newsletter_signup", {
    location: "footer",
  });
};

export const trackSearch = (searchTerm: string) => {
  trackEvent("search", {
    search_term: searchTerm,
  });
};

export const trackWishlistAdd = (productId: string, productName: string) => {
  trackEvent("add_to_wishlist", {
    item_id: productId,
    item_name: productName,
  });
};
