import Avatar from "@/components/Avatar";
import Modal from "@/components/Modal";
import Link from "next/link";
import { useMemo } from "react";
import Follower from "./components/Follower";

const ModalFollowers = ({
  isOpen,
  onClose,
  type,
  followers,
  following,
  onReloadListUser
}: {
  isOpen: boolean;
  onClose: () => void;
  type?: string | null;
  followers: any;
  following: any;
  onReloadListUser: () => void
}) => {
  const listUsers = useMemo(() => {
    if (!!type) return type === "following" ? following : followers;

    return [];
  }, [type, following, followers]);

  console.log("listUsers", listUsers);

  const title = useMemo(
    () => (type === "following" ? "Подписки" : "Подписчики"),
    [type],
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
              <Follower user={user} onReload={onReloadListUser}/>
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
        {renderList()}
      </div>
    </Modal>
  );
};

export default ModalFollowers;
