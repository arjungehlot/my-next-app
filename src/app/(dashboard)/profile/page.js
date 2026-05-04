import ProfileView from '@/components/ProfileView';
import { getProfileData, getSessionUser } from '@/app/actions';

export default async function ProfilePage() {
  const [profileData, sessionUser] = await Promise.all([
    getProfileData(),
    getSessionUser()
  ]);

  return <ProfileView initialData={profileData} sessionUser={sessionUser} />;
}
