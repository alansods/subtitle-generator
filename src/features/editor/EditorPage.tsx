import { StylePanel } from '@/features/style/StylePanel';
import { useSession } from '@/lib/session/store';

import { CueList } from './CueList';
import { VideoPlayer } from './VideoPlayer';

export function EditorPage() {
  const video = useSession((s) => s.video);
  if (!video) return null;

  return (
    <div className="flex flex-wrap items-start gap-5">
      <div className="flex min-w-0 flex-[999_1_620px] flex-col gap-3">
        <VideoPlayer video={video} />
        <StylePanel />
      </div>
      <CueList />
    </div>
  );
}
