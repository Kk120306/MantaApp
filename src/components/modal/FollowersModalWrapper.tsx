// components/FollowersModalWrapper.tsx
'use client';

import FollowersModal from './FollowersModal';

export default function FollowersModalWrapper({ followers }: { followers: any[] }) {
  return <FollowersModal followers={followers} title="Followers" />;
}
