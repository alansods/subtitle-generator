import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import { useSession } from '@/lib/session/store';
import type { SubtitleStyle } from '@/lib/subtitles/style';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  swatch?: string;
}

const GROUPS: Record<keyof SubtitleStyle, Option[]> = {
  background: [
    { value: 'black', swatch: 'bg-black' },
    { value: 'white', swatch: 'bg-white' },
    {
      value: 'transparent',
      swatch: 'bg-[repeating-conic-gradient(#bbb_0_25%,#fff_0_50%)] bg-[length:6px_6px]',
    },
  ],
  fontSize: [{ value: 'sm' }, { value: 'md' }, { value: 'lg' }],
  position: [{ value: 'bottom' }, { value: 'top' }],
};

function Group({ name }: { name: keyof SubtitleStyle }) {
  const { t } = useTranslation();
  const style = useSession((s) => s.style);
  const setStyle = useSession((s) => s.setStyle);
  const legendId = useId();
  const options = GROUPS[name];
  return (
    <fieldset aria-labelledby={legendId} className="min-w-0">
      <legend id={legendId} className="mb-1.5 text-xs font-semibold text-muted-foreground">
        {t(`style.${name}.label`)}
      </legend>
      <div className="flex gap-0.5 rounded-full bg-secondary p-1">
        {options.map((option) => {
          const checked = style[name] === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                'inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                checked ? 'bg-ink text-ink-foreground' : 'text-foreground',
              )}
            >
              <input
                type="radio"
                name={`style-${name}`}
                value={option.value}
                checked={checked}
                onChange={() => {
                  setStyle({ [name]: option.value });
                }}
                className="sr-only"
              />
              {option.swatch && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'size-3.5 rounded-[3px] border border-muted-foreground',
                    option.swatch,
                  )}
                />
              )}
              {t(`style.${name}.${option.value}` as `style.background.black`)}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function StylePanel() {
  const { t } = useTranslation();
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-wrap items-end gap-x-6 gap-y-3.5 rounded-2xl bg-card px-4 py-3"
    >
      <h2 id={titleId} className="basis-full text-sm font-semibold">
        {t('style.title')}
      </h2>
      <Group name="background" />
      <Group name="fontSize" />
      <Group name="position" />
    </section>
  );
}
