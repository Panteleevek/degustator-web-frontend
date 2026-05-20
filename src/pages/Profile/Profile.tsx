"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "@/store/hooks";
import Avatar from "@/components/Avatar";
import {
  useGetFollowersQuery,
  useGetFollowingQuery,
  useGetUserPostsQuery,
  useGetUserProfileQuery,
} from "@/services";
import { MoreHorizontal } from "lucide-react";
import ModalProfile from "./components/ModalProfile";
import ModalFollowers from "./components/ModalFollowers";
import Follower from "./components/ModalFollowers/components/Follower";

const Profile = ({ id }: { id?: string }) => {
  const router = useRouter();

  const userProfileResult = useGetUserProfileQuery(id, { skip: !id });
  const userProfile = useMemo(
    () => userProfileResult?.data,
    [userProfileResult, id],
  );
  const { currentUser } = useSelector((state) => state.auth);

  const currentUserProfile = useMemo(
    () => userProfile || currentUser,
    [userProfile, currentUser],
  );
  const diffUser = useMemo(
    () => userProfile?.id !== currentUser?.id,
    [userProfile, currentUser],
  );
  const [openModalProfile, setOpenModalProfile] = useState<boolean>(false);
  const [openModalFollowers, setOpenModalFollowers] = useState<string | null>(
    null,
  );
  console.log("currentUserProfile", currentUserProfile);
  const userPosts = useGetUserPostsQuery(
    { userId: currentUserProfile?.id },
    { skip: !currentUserProfile?.id },
  );
  const followers = useGetFollowersQuery(currentUserProfile?.id, {
    skip: !currentUserProfile?.id,
  });
  const following = useGetFollowingQuery(currentUserProfile?.id, {
    skip: !currentUserProfile?.id,
  });

  const userPostsList = useMemo(() => userPosts?.data?.posts, [userPosts]);
  const userFollowersCount = useMemo(
    () => (Array.isArray(followers?.data) ? followers?.data.length : 0),
    [followers],
  );
  const userFollowingCount = useMemo(
    () => (Array.isArray(following?.data) ? following?.data.length : 0),
    [following],
  );

  if (!currentUserProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  const renderFollowing = () => {
    if (diffUser && userProfile) {
      return <Follower user={userProfile} />;
    }

    return null;
  };

  const onReloadListUser = () => {
    if(openModalFollowers === 'follower') return followers.refetch()
    if(openModalFollowers === 'following') return following.refetch()
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Информация о пользователе */}
        <div className="p-4 flex items-center justify-between gap-4 border-b">
          <div className="flex">
            <Avatar user={currentUserProfile} size={86} />
            <div className="ml-6">
              <p className="font-semibold text-[24px]">
                {currentUserProfile.username}
              </p>
              <p className="text-sm text-gray-500">
                {userPostsList?.length} публикаций
              </p>
            </div>
          </div>

          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setOpenModalProfile(true)}
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Информация о пользователе */}
        <div className="p-4 flex justify-around border-b">
          <div
            className="flex flex-col items-center"
            onClick={() => setOpenModalFollowers("followers")}
          >
            <p className="font-semibold text-lg">Подписчики</p>
            <p className="font-semibold text-lg">{userFollowersCount}</p>
          </div>
          <div
            className="flex flex-col items-center"
            onClick={() => setOpenModalFollowers("following")}
          >
            <p className="font-semibold text-lg">Подписки</p>
            <p className="font-semibold text-lg">{userFollowingCount}</p>
          </div>
        </div>
        {/* Информация о пользователе */}
        <div className="border-b p-2">
          {renderFollowing()}
        </div>
        {/* Сетка постов */}
        <div className="p-1">
          {userPostsList?.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-4">У вас пока нет постов</p>
              <button
                onClick={() => router.push("/create")}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg"
              >
                Создать пост
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {userPostsList?.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square bg-gray-100 cursor-pointer"
                  onClick={() => router.push(`/post/${post.id}`)}
                >
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ModalProfile
        isOpen={openModalProfile}
        onClose={() => setOpenModalProfile(false)}
      />
      <ModalFollowers
        isOpen={!!openModalFollowers}
        followers={followers?.data}
        following={following?.data}
        type={openModalFollowers}
        onClose={() => setOpenModalFollowers(null)}
        onReloadListUser={() => onReloadListUser()}
        userId={currentUserProfile?.id}
      />
    </div>
  );
};

export default Profile;
