export type UpdateProfileType = {
  occupation?: 'Alumni' | 'Student' | 'Faculty';
  image?: File;
  bio?: string;
}

export type UserProfileType = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  occupation?: 'Alumni' | 'Student' | 'Faculty' | null;
  bio?: string | null;
}