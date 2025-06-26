// FollowingModalWrapper.tsx
'use client';

import FollowingModal from './FollowingModal';

export default function FollowingModalWrapper({ following }: { following: any[] }) {
  return <FollowingModal following={following} title="Following" />;
}
