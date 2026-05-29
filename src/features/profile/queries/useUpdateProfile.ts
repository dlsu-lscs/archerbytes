import { useMutation } from "@tanstack/react-query";
import { UpdateProfileType } from "../types/profile.types";
import { useRouter } from "next/navigation";

export default function useUpdateProfile() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: UpdateProfileType) => updateProfile(data),
    onSuccess: async () => {
      window.dispatchEvent(new Event('profile-updated'));
      router.refresh();
    }
  })
}

const updateProfile = async (data: UpdateProfileType) => {
  const formData = new FormData();

  if(data.occupation){
    formData.append('occupation', data.occupation);
  }

  if(data.image){
    formData.append('image', data.image);
  }

  if(data.bio){
    formData.append('bio', data.bio);
  }

  const res = await fetch(`/api/user`, {
    method: 'PATCH',
    body: formData
  });

  if(!res.ok){
    throw new Error("Failed to update profile");
  }

  const result = await res.json();
  return result.data;
}