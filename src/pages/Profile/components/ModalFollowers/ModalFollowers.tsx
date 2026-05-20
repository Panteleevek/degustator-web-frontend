import Avatar from "@/components/Avatar";
import Modal from "@/components/Modal";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import Follower from "./components/Follower";
import {
  useLazySearchFollowingQuery,
  useLazySearchFollowersQuery,
} from "@/services/searchApi";
import debounce from "lodash.debounce";

const ModalFollowers = ({
  isOpen,
  onClose,
  type,
  followers,
  following,
  onReloadListUser,
  userId
}: {
  isOpen: boolean;
  onClose: () => void;
  type?: string | null;
  followers: any;
  following: any;
  onReloadListUser: () => void;
  userId: string
}) => {
  const [searchFollowers, searchFollowersResult] =
    useLazySearchFollowersQuery();
  const [searchFollowing, searchFollowingResult] =
    useLazySearchFollowingQuery();
  const [value, setValue] = useState<string>("");
  const isFollowing = useMemo(() => type === "following", [type]);
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (isFollowing) {
        searchFollowing({ q: query, userId });
      } else {
        searchFollowers({ q: query, userId });
      }
    }, 500), // Задержка 500 мс [citation:1]
    [searchFollowersResult, searchFollowingResult, isFollowing], // Функция пересоздастся только при изменении `refetch`
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setValue(value);
    debouncedSearch(value);
  };

  const listUsers = useMemo(() => {
    if(isFollowing){
      if(Array.isArray(searchFollowingResult?.data?.users) && searchFollowingResult?.isSuccess){
         return searchFollowingResult?.data.users;
      }
      return following
    } else {
     if(Array.isArray(searchFollowersResult?.data?.users) && searchFollowersResult?.isSuccess){
         return searchFollowersResult?.data.users;
      }
    return followers;

    }
  }, [isFollowing, following, followers, searchFollowingResult, searchFollowingResult]);

  console.log("listUsers", listUsers, searchFollowersResult, searchFollowingResult);

  const title = useMemo(
    () => (isFollowing ? "Подписки" : "Подписчики"),
    [isFollowing],
  );
  const renderList = () => {
    if (Array.isArray(listUsers) && listUsers.length > 0) {
      return listUsers.map((user) => {
        return (
          <div
            key={user.id}
            className="flex justify-between items-center py-4 border-b text-[20px]"
          >
            <Link href={`/profile/${user.id}`} className="flex items-center">
              <Avatar user={user} />
              <p className="ml-6">{user.fullName}</p>
            </Link>
            <div className="border">
              <Follower user={user} onReload={onReloadListUser} />
            </div>
          </div>
        );
      });
    }
    return (
      <div className="flex h-full justify-center items-center">
        <p>В данный момент список пуст</p>
      </div>
    );
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col p-4 h-full text-[24px] ">
        <div className="mb-6">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Поиск..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-s"
            required
          />
        </div>
        {renderList()}
      </div>
    </Modal>
  );
};

export default ModalFollowers;
