import { User } from "@/services";
import AvatarIcon from "@/statics/svg/AvatarIcon";

const Avatar = ({ user, size = 48 }: { user: User, size?: number }) => {
  if (!user.avatar) {
    return (
      <div className="relative">
        <AvatarIcon size={size}/>
      </div>
    );
  }
  console.log('avatar', user?.avatar)
  return (
    <div className="relative">
      <img
        src={user.avatar}
        alt={user.username}
        className={`rounded-full object-cover`}
        style={{ width: `${size}px`, height: `${size}px`}}
      />
    </div>
  );
};

export default Avatar;
