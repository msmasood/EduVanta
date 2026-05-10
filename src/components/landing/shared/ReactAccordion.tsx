"use client";

import { useState } from "react";

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface ReactAccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
}

/**
 * Pure React accordion with Bootstrap-compatible class structure.
 * Replaces Bootstrap JS accordion — no Bootstrap JS required.
 * The _faq.scss styles apply to these Bootstrap class names.
 */
export default function ReactAccordion({ items, defaultOpenId }: ReactAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? items[0]?.id ?? null);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="faq-accordion">
      <div className="accordion" id="faqAccordion">
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div className="accordion-item" key={item.id}>
              <div className="accordion-header">
                <button
                  className={`accordion-button${isOpen ? "" : " collapsed"}`}
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={item.id}
                >
                  {item.question}
                </button>
              </div>
              <div
                id={item.id}
                className={`accordion-collapse collapse${isOpen ? " show" : ""}`}
              >
                <div className="accordion-body">{item.answer}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
