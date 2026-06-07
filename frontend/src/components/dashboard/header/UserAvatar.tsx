import Image from 'next/image';
import { UserIcon } from 'lucide-react';
import { User } from '@/types/api/user';

interface UserAvatarProps {
  user: User | null | undefined;
  size?: number;
  /** circle(기본): 헤더 등 작은 아바타 / square: 프로필 카드처럼 영역을 가득 채울 때 */
  shape?: 'circle' | 'square';
}

const UserAvatar = ({ user, size = 24, shape = 'circle' }: UserAvatarProps) => {
  const iconSize = size * 0.6;
  const rounded = shape === 'circle' ? 'rounded-full' : '';

  return (
    <>
      {user?.profileImage ? (
        <Image
          src={user.profileImage}
          alt={user.username || 'User Avatar'}
          fill
          sizes={`${size}px`}
          className={`${rounded} object-cover`}
        />
      ) : (
        <div className={`flex h-full w-full items-center justify-center bg-gray-200 ${rounded}`}>
          <UserIcon size={iconSize} className="text-gray-600" />
        </div>
      )}
    </>
  );
};

export default UserAvatar;
