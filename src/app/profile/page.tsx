import Sidebar from '@/components/organisms/Sidebar';
import ProfileContainer from '@/features/profile/containers/ProfileContainer';
import UserArticles from '@/features/profile/components/organisms/UserArticles';
import { getSession } from '@/lib/util/auth/session';
import { redirect } from 'next/navigation';
import { UserProfileType } from '@/features/profile/types/profile.types';

export default async function ProfilePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_3fr] justify-center grow py-10 md:py-20 bg-[linear-gradient(rgba(255,255,255,0.7),rgba(255,255,255,0.8)),url(/archerbytes-bg.png)] bg-size-[110%] bg-position-[66%_120px]">
      <div className="hidden lg:flex justify-end mt-15">
        <Sidebar />
      </div>
      <ProfileContainer user={session.user as UserProfileType} />
      <UserArticles />
    </div>
  );
}
