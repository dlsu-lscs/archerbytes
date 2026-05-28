'use client'

import ProfileForm from '../components/organisms/ProfileForm';
import { useSession } from '@/lib/auth/client';

export default function ProfileContainer() {
  const {data: session, isPending} = useSession();

  if(isPending){
    return <div className="p-10 text-center font-bold text-xl">Loading profile...</div>;
  }

  if(!session?.user){
    return null;
  }

  return (
    <div>
      <ProfileForm user={session.user} />
    </div>
  );
};