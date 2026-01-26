'use client';

import { useState } from 'react';
import { FAQ } from '@/lib/landing/constants';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}) {
  const buttonId = `faq-button-${index}`;
  const panelId = `faq-panel-${index}`;

  return (
    <div className="border border-zinc-800 transition-colors hover:border-green-500/30">
      <h3>
        <button
          id={buttonId}
          onClick={onClick}
          className="flex w-full items-center justify-between p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <span className="font-mono text-sm text-green-400">
            <span className="mr-2 text-green-500" aria-hidden="true">{'>'}</span>
            {question}
          </span>
          <ChevronDown
            className={cn(
              'h-5 w-5 text-green-400 transition-transform duration-300',
              isOpen && 'rotate-180'
            )}
            aria-hidden="true"
          />
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className="border-t border-zinc-800 p-4">
          <p className="text-sm leading-relaxed text-zinc-300">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-title" className="relative px-4 py-24 md:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Section Header */}
        <header className="mb-16 text-center">
          <h2
            id="faq-title"
            className="mb-4 font-mono text-2xl font-bold text-green-400 md:text-3xl"
          >
            <span className="text-green-500" aria-hidden="true">{'>'}</span> FAQ
          </h2>
          <p className="mx-auto max-w-2xl text-zinc-300">
            Frequently asked questions about our security protocols
          </p>
        </header>

        {/* FAQ Items */}
        <div className="space-y-2" role="list">
          {FAQ.map((item, index) => (
            <div key={index} role="listitem">
              <FAQItem
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
