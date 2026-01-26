'use client';

import { COMPARISON } from '@/lib/landing/constants';
import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

function CellValue({ value, feature, app }: { value: boolean | string; feature: string; app: string }) {
  if (value === true) {
    return (
      <>
        <Check className="mx-auto h-5 w-5 text-green-400" aria-hidden="true" />
        <span className="sr-only">{app} supports {feature}</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <X className="mx-auto h-5 w-5 text-red-400" aria-hidden="true" />
        <span className="sr-only">{app} does not support {feature}</span>
      </>
    );
  }
  // partial
  return (
    <>
      <Minus className="mx-auto h-5 w-5 text-yellow-400" aria-hidden="true" />
      <span className="sr-only">{app} partially supports {feature}</span>
    </>
  );
}

export function ComparisonTable() {
  const appNames = ['Phantom Chat', 'WhatsApp', 'Telegram', 'Signal'];

  return (
    <section aria-labelledby="comparison-title" className="relative px-4 py-24 md:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <header className="mb-16 text-center">
          <h2
            id="comparison-title"
            className="mb-4 font-mono text-2xl font-bold text-green-400 md:text-3xl"
          >
            <span className="text-green-500" aria-hidden="true">{'>'}</span> COMPARISON_MATRIX
          </h2>
          <p className="mx-auto max-w-2xl text-zinc-300">
            See how we stack up against the competition
          </p>
        </header>

        {/* Table */}
        <div className="overflow-x-auto" role="region" aria-label="Feature comparison table" tabIndex={0}>
          <table className="w-full border-collapse">
            <caption className="sr-only">
              Comparison of privacy features between Phantom Chat, WhatsApp, Telegram, and Signal
            </caption>
            <thead>
              <tr>
                {COMPARISON.headers.map((header, index) => (
                  <th
                    key={header}
                    scope="col"
                    className={cn(
                      'border border-zinc-800 p-4 text-left font-mono text-sm',
                      index === 1
                        ? 'border-green-500/50 bg-green-500/10 text-green-400'
                        : 'bg-zinc-900 text-zinc-300'
                    )}
                  >
                    {index === 1 && (
                      <span className="mr-2 text-green-500" aria-hidden="true">{'>'}</span>
                    )}
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="transition-colors hover:bg-zinc-900/50"
                >
                  <th scope="row" className="border border-zinc-800 p-4 text-left font-mono text-sm font-normal text-zinc-200">
                    {row.feature}
                  </th>
                  <td className="border border-green-500/30 bg-green-500/5 p-4 text-center">
                    <CellValue value={row.phantom} feature={row.feature} app={appNames[0]} />
                  </td>
                  <td className="border border-zinc-800 p-4 text-center">
                    <CellValue value={row.whatsapp} feature={row.feature} app={appNames[1]} />
                  </td>
                  <td className="border border-zinc-800 p-4 text-center">
                    <CellValue value={row.telegram} feature={row.feature} app={appNames[2]} />
                  </td>
                  <td className="border border-zinc-800 p-4 text-center">
                    <CellValue value={row.signal} feature={row.feature} app={appNames[3]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-400" aria-hidden="true" />
            <span>Full support</span>
          </div>
          <div className="flex items-center gap-2">
            <Minus className="h-4 w-4 text-yellow-400" aria-hidden="true" />
            <span>Partial support</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="h-4 w-4 text-red-400" aria-hidden="true" />
            <span>Not supported</span>
          </div>
        </div>
      </div>
    </section>
  );
}
