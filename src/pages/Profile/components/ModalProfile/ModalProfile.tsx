import Modal from "@/components/Modal";
import { useLogoutMutation } from "@/services";
import Link from "next/link";

const ModalProfile = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void}) => {
  const [logout] = useLogoutMutation()
  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Настройки'>
      <div className="flex flex-col p-4 h-full justify-end text-[24px] ">
        <Link className=" border-b mb-4" href='/profile/edit'>Редактирование</Link>
        <div className=" border-b text-[red] mb-4">Удалить аккаунт</div>
        <div className=" border-b text-[red] mb-4" onClick={() => logout()}>Выйти</div>
      </div>
    </Modal>
  );
};

export default ModalProfile;
