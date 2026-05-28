'use client'

import useUpdateProfile from '../../queries/useUpdateProfile';
import { UpdateProfileType, UserProfileType } from '../../types/profile.types';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import DesignedButton from '@/components/atoms/DesignedButton';
import { toast } from 'sonner';

export default function ProfileForm({user}: {user: UserProfileType}) {
  const [isEditing, setIsEditing] = useState(false);

  const[occupation, setOccupation] = useState(user.occupation || "");
  const [bio, setBio] = useState(user.bio || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.image || null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useUpdateProfile();

  useEffect(() => {
    return () => {
      if (selectedFile && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [selectedFile, previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be smaller than 2MB');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  const handleEditProfile = () => {
    mutate({
      occupation: occupation as UpdateProfileType['occupation'],
      bio,
      ...(selectedFile && {image: selectedFile}),
    }, {
      onSuccess: () => {
        setIsEditing(false);
        setSelectedFile(null);
        toast.success('Successfully updated profile');
      },
      onError: () => {
        toast.error('Failed to update profile');
      }
    });
  }

  const handleCancel = () => {
    setIsEditing(false);
    setOccupation(user.occupation || '');
    setBio(user.bio || '');
    setSelectedFile(null);
    setPreviewUrl(user.image || null);
  }

  return (
    <div className='flex flex-col gap-5 items-center md:items-start p-6'>
      <div className="relative group">
        <div className="relative bg-neutral-300 size-60 md:size-80 rounded-full border-4 border-black ring-offset-[7px] ring-offset-primary ring-1 ring-black overflow-hidden flex items-center justify-center">
          {previewUrl ? (
            <Image src={previewUrl} alt={user.name} fill className="object-cover" />
          ) : (
            <Image src={'/lscs-logo.png'} alt={user.name} fill className="object-cover" />
          )}
        </div>
        
        {isEditing && (
          <div 
            className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="text-white font-bold bg-black/50 px-4 py-2 rounded-md">Change Image</span>
          </div>
        )}
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
        />
      </div>

      <div className='flex flex-col gap-2 w-full'>
        <p className='text-[#25609F] font-bold text-5xl'>{user.name}</p>
        
        {isEditing ? (
          <div className="mt-2 space-y-4 w-full md:w-4/5">
            <div>
              <label className="block text-sm font-bold mb-1">Occupation</label>
              <Select value={occupation} onValueChange={setOccupation}>
                <SelectTrigger className="w-full border-2 border-black rounded-md bg-white">
                  <SelectValue placeholder="Select Occupation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Alumni">Alumni</SelectItem>
                  <SelectItem value="Faculty">Faculty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-1">Bio</label>
              <Textarea 
                className="w-full border-2 border-black rounded-md p-3 bg-white resize-none focus-visible:ring-0 focus-visible:ring-offset-0 overflow-y-auto"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                style={{ 
                  height: '128px', 
                  minHeight: '128px', 
                  maxHeight: '128px' 
                }}
              />
            </div>
          </div>
        ) : (
          <div>
            <p className='text-gray-500 font-normal text-4xl'>
              {user.occupation || 'No occupation set'}
            </p>
            <p className='mt-3 md:w-4/5'>
              {user.bio || 'This user has not set a bio yet.'}
            </p>
          </div>
        )}
      </div>

      <div className="relative z-10 w-full md:w-4/5 mt-4">
        {isEditing ? (
          <div className="flex flex-col gap-4">
            <DesignedButton
              onClick={handleEditProfile}
              disabled={isPending}
              label={isPending ? 'Saving...' : 'Save Changes'}
            />
            <DesignedButton
              onClick={handleCancel}
              disabled={isPending}
              label="Cancel"
              variant="danger"
            />
          </div>
        ) : (
          <DesignedButton 
            onClick={() => setIsEditing(true)} 
            label="Edit Profile"
          />
        )}
      </div>
    </div>
  );
};