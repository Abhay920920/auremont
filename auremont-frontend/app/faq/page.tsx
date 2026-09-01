"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: "Product & Sourcing",
    question: "Where do your almonds come from?",
    answer: "All RARE NUTS almonds are exclusively grown in our family-owned orchards in California's Central Valley, ensuring absolute traceability and quality control."
  },
  {
    category: "Product & Sourcing",
    question: "Are your products organic?",
    answer: "Our orchards utilize regenerative and sustainable farming practices. While our entire crop is pesticide-free, we are currently in the final stages of official USDA Organic certification."
  },
  {
    category: "Product & Sourcing",
    question: "How long do the almonds stay fresh?",
    answer: "When kept in their airtight luxury packaging in a cool, dry place, our roasted almonds maintain peak freshness for up to 6 months."
  },
  {
    category: "Orders & Shipping",
    question: "Do you ship internationally?",
    answer: "Yes, RARE NUTS ships globally. International shipping rates are calculated dynamically at checkout based on destination and weight via our DHL Express integration."
  },
  {
    category: "Orders & Shipping",
    question: "Can I include a gift message?",
    answer: "Absolutely. During checkout, you may add a complimentary bespoke gift message, which will be printed on heavy-stock card and sealed with wax in your order."
  },
  {
    category: "Orders & Shipping",
    question: "What is your return and satisfaction policy?",
    answer: "We guarantee culinary excellence. If your unboxing experience is anything less than exceptional, contact our concierge within 7 days for a replacement or full refund."
  }
];

export default function FAQPage() {
  const [openState, setOpenState] = useState<Record<string, boolean>>({
    [FAQS[0].question]: true
  });

  const toggleQuestion = (question: string) => {
    setOpenState(prev => ({
      ...prev,
      [question]: !prev[question]
    }));
  };

  const categories = Array.from(new Set(FAQS.map(f => f.category)));

  return (
    <div className="w-full bg-background pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-luxuryGold/30 bg-luxuryGold/5 text-luxuryGold text-xs uppercase tracking-widest">
            <HelpCircle size={14} />
            <span>Concierge Assistance</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-primaryText">Frequently Asked Questions</h1>
          <p className="text-secondaryText max-w-xl mx-auto font-light">
            Everything you need to know about our California reserve harvest, bespoke packaging, and global dispatch.
          </p>
        </div>
        
        <div className="space-y-12">
          {categories.map((category) => (
            <section key={category} className="space-y-4">
              <h2 className="text-xl font-serif text-luxuryGold border-b border-divider pb-3 tracking-wide">{category}</h2>
              <div className="space-y-3">
                {FAQS.map((faq) => {
                  if (faq.category !== category) return null;
                  const isOpen = Boolean(openState[faq.question]);
                  return (
                    <div 
                      key={faq.question} 
                      className="border border-divider rounded-xl overflow-hidden bg-secondaryBg/40 hover:border-luxuryGold/30 transition-colors"
                    >
                      <button
                        data-testid="faq-accordion-item"
                        onClick={() => toggleQuestion(faq.question)}
                        aria-expanded={isOpen}
                        className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none focus:ring-1 focus:ring-luxuryGold"
                      >
                        <span className="font-serif text-base text-primaryText">{faq.question}</span>
                        <ChevronDown 
                          size={18} 
                          className={`text-luxuryGold flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 text-sm text-secondaryText font-light leading-relaxed border-t border-divider/40 pt-4 animate-fade-in">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

      </div>
    </div>
  );
}
