import {
  useFollowUserMutation,
  User,
  useUnfollowUserMutation,
} from "@/services";

const Follower = ({ user, onReload }: { user: User, onReload?: () => void }) => {
  const [follow] = useFollowUserMutation();
  const [unfollow] = useUnfollowUserMutation();

  const handleClick = () => {
    !user?.isFollowing ? follow(user?.id) : unfollow(user?.id);
    
    if(onReload) return onReload()
  }

  console.log('user?.isFollowing', user)
  return (
    <div className="p-1 flex justify-around">
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={handleClick}
      >
        {!user?.isFollowing ? "Подписаться" : "Отписаться"}
      </div>
    </div>
  );
};

export default Follower;
