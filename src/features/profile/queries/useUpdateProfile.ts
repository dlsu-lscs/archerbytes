import { useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import { UpdateProfileType } from "../types/profile.types";

const queryKey: QueryKey = ['session'];

export default function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileType) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
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