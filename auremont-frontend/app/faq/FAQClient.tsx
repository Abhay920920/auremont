"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import Link from "next/link";
import { FAQS_DATA } from "@/lib/faqData";

export default function FAQClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [openState, setOpenState] = useState<Record<string, boolean>>({
    [FAQS_DATA[0].question]: true
  });

  const categories = ["All", ...Array.from(new Set(FAQS_DATA.map(f => f.category)))];

  const filteredFaqs = FAQS_DATA.filter(faq => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch = searchQuery.trim() === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleQuestion = (question: string) => {
    setOpenState(prev => ({
      ...prev,
      [question]: !prev[question]
    }));
  };

  return (
    <div className="w-full bg-background pt-32 pb-24 min-h-screen text-primaryText">
      <div className="site-container-reading">
        
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-luxuryGold/30 bg-luxuryGold/5 text-luxuryGold text-[10px] uppercase tracking-ultra">
            <HelpCircle size={13} />
            <span>Concierge Knowledge Directory</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif text-primaryText tracking-tight">
            Frequently Asked <span className="text-luxuryGold italic">Questions</span>
          </h1>
          <p className="text-secondaryText max-w-xl mx-auto font-light text-sm sm:text-base leading-relaxed">
            Everything you need to know regarding our single-origin California reserve harvests, small-batch wood roasting, heirloom packaging, and global dispatch.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-10 max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mutedText w-4 h-4" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. roasting, shipping, shelf life, corporate)..."
            className="w-full bg-surface border border-divider rounded-full pl-11 pr-5 py-3.5 text-sm text-primaryText focus:border-luxuryGold outline-none transition-colors placeholder:text-mutedText/70"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-luxuryGold text-background font-medium shadow-md"
                  : "bg-surface text-secondaryText border border-divider hover:border-luxuryGold/40 hover:text-primaryText"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = Boolean(openState[faq.question]);
              return (
                <div 
                  key={faq.question} 
                  className="border border-divider rounded-card overflow-hidden bg-secondaryBg/60 hover:border-luxuryGold/40 transition-colors shadow-sm"
                >
                  <button
                    onClick={() => toggleQuestion(faq.question)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none"
                  >
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-luxuryGold font-mono block mb-1">
                        {faq.category}
                      </span>
                      <span className="font-serif text-base sm:text-lg text-primaryText">
                        {faq.question}
                      </span>
                    </div>
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
            })
          ) : (
            <div className="text-center py-16 text-mutedText bg-surface/40 rounded-card border border-divider">
              <p className="text-sm">No questions matched your search query "{searchQuery}".</p>
              <button 
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                className="mt-3 text-xs text-luxuryGold hover:underline uppercase tracking-wider"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-16 text-center p-8 bg-secondaryBg border border-divider rounded-card space-y-4">
          <h3 className="font-serif text-xl sm:text-2xl text-primaryText">Have a specific inquiry?</h3>
          <p className="text-secondaryText text-sm font-light max-w-md mx-auto">
            Our private client concierge is available Monday through Saturday to provide tailored recommendations.
          </p>
          <div className="pt-2">
            <Link href="/contact" className="luxury-button text-xs px-8 py-3.5 uppercase tracking-widest inline-block font-medium">
              Contact Private Concierge
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
