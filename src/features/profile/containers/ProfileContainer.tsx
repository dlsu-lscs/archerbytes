import ProfileForm from '../components/organisms/ProfileForm';
import { UserProfileType } from '../types/profile.types';

export default function ProfileContainer({user}: {user: UserProfileType}) {
  return (
    <div>
      <ProfileForm user={user} />
    </div>
  );
};