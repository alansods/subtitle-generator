import { useBlocker } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { hasUnsavedWork } from '@/lib/session/selectors';
import { useSession } from '@/lib/session/store';

const unsaved = () => hasUnsavedWork(useSession.getState());

// Ir para o início descarta a sessão (a rota "/" chama reset). Com legenda não
// baixada, pede confirmação antes; fechar a aba nesse estado dispara o aviso nativo.
export function DiscardGuard() {
  const { t } = useTranslation();
  const { status, proceed, reset } = useBlocker({
    shouldBlockFn: ({ next }) => next.pathname === '/' && unsaved(),
    enableBeforeUnload: false,
    withResolver: true,
  });

  // Aviso nativo ao fechar/recarregar a aba com legenda não baixada.
  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!unsaved()) return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);

  return (
    <AlertDialog
      open={status === 'blocked'}
      onOpenChange={(open) => {
        if (!open) reset?.();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('discard.title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('discard.body')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="min-h-11 rounded-full px-5" onClick={() => reset?.()}>
            {t('discard.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            className="min-h-11 rounded-full px-5"
            onClick={() => proceed?.()}
          >
            {t('discard.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
