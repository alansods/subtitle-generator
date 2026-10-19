import { Check, Download, MousePointer2, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';

import { VideoDropzone } from './VideoDropzone';

const PERKS = ['free', 'noAccount', 'private', 'nothingSaved'] as const;

function Chip({ children }: { children: string }) {
  return <li className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{children}</li>;
}

function StepNumber({ n }: { n: number }) {
  return (
    <span className="grid size-[30px] shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-ink-foreground">
      {n}
    </span>
  );
}

export function HomePage() {
  const { t } = useTranslation();
  // Nome de exemplo no idioma da interface.
  const sample = t('how.sample');
  const scrollToUpload = () => {
    document.querySelector('[data-testid="dropzone"]')?.scrollIntoView({ behavior: 'smooth' });
    document.querySelector<HTMLButtonElement>('[data-testid="dropzone"] button')?.focus();
  };

  const steps = [
    {
      id: 'choose',
      visual: (
        <div className="flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2.5 shadow-sm">
          <Video aria-hidden="true" className="size-5 text-muted-foreground" />
          <span className="font-mono text-xs font-medium">{sample}.mp4</span>
        </div>
      ),
      chips: ['MP4', 'WebM', 'MOV', t('how.choose.limit')],
    },
    {
      id: 'generate',
      visual: (
        <div className="flex w-full flex-col gap-2.5 px-4">
          <div className="flex justify-between text-xs">
            <span className="font-semibold">{t('how.generate.progress')}</span>
            <span className="font-mono">64%</span>
          </div>
          <div className="h-2 overflow-hidden rounded bg-card">
            <div className="h-full w-[64%] bg-primary" />
          </div>
        </div>
      ),
      chips: [t('how.generate.pt'), t('how.generate.en'), t('how.generate.auto')],
    },
    {
      id: 'review',
      visual: (
        <div className="relative flex h-full w-full items-end justify-center overflow-hidden rounded-[inherit] bg-[#14171b] pb-4">
          <span className="bg-black px-2 py-0.5 text-[13px] font-medium text-white outline-2 outline-offset-[3px] outline-[#a897ff] outline-dashed">
            {t('how.review.caption')}
          </span>
          <MousePointer2
            aria-hidden="true"
            className="absolute right-[34%] bottom-1.5 size-4 fill-white text-black"
          />
        </div>
      ),
      chips: [t('how.review.click'), t('how.review.timeline'), t('how.review.split')],
    },
    {
      id: 'download',
      visual: (
        <ul className="flex w-full flex-col gap-2 px-3.5">
          {[`${sample}.srt`, `${sample}.vtt`, `${sample}-${t('export.video.suffix')}.mp4`].map(
            (name) => (
              <li
                key={name}
                className="flex items-center gap-2 rounded-md border bg-card px-2.5 py-1.5"
              >
                <Download aria-hidden="true" className="size-3.5 text-success" />
                <span className="font-mono text-[11px]">{name}</span>
              </li>
            ),
          )}
        </ul>
      ),
      chips: ['SRT', t('how.download.vtt'), t('how.download.burn')],
    },
  ] as const;

  return (
    <div className="flex flex-col gap-16">
      <section
        aria-labelledby="hero-title"
        className="flex flex-wrap items-center gap-x-12 gap-y-8 rounded-[32px] bg-card p-6 sm:p-12"
      >
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5">
          <h1
            id="hero-title"
            className="text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl"
          >
            {t('home.title')}
          </h1>
          <p className="max-w-[540px] text-lg leading-relaxed text-muted-foreground">
            {t('home.subtitle')}
          </p>
          <ul className="grid max-w-[540px] grid-cols-1 gap-x-5 gap-y-2.5 sm:grid-cols-2">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-2.5 text-[15px] font-medium">
                <span
                  aria-hidden="true"
                  className="grid size-6 place-items-center rounded-full bg-success-soft text-success"
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {t(`home.perks.${perk}`)}
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 flex-[1_1_460px]">
          <VideoDropzone />
        </div>
      </section>

      <section aria-labelledby="how-title" className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h2 id="how-title" className="text-[32px] font-extrabold">
            {t('how.title')}
          </h2>
          <p className="text-muted-foreground">{t('how.subtitle')}</p>
        </div>
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
          {steps.map((step, index) => (
            <li key={step.id} className="flex flex-col gap-3.5 rounded-3xl bg-card p-5">
              <div
                aria-hidden="true"
                className="grid h-[132px] place-items-center overflow-hidden rounded-[18px] bg-secondary"
              >
                {step.visual}
              </div>
              <div className="flex items-center gap-2.5">
                <StepNumber n={index + 1} />
                <h3 className="text-lg font-semibold">{t(`how.${step.id}.title`)}</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`how.${step.id}.description`)}
              </p>
              <ul className="mt-auto flex flex-wrap gap-1.5">
                {step.chips.map((chip) => (
                  <Chip key={chip}>{chip}</Chip>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="cta-title"
        className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-ink px-7 py-6 text-ink-foreground"
      >
        <div className="flex flex-col gap-1">
          <h2 id="cta-title" className="text-[22px] font-bold">
            {t('home.cta')}
          </h2>
          <p className="text-[15px] opacity-80">{t('footer.privacy')}</p>
        </div>
        <Button onClick={scrollToUpload}>{t('upload.select')}</Button>
      </section>
    </div>
  );
}
