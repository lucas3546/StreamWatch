import { useState } from 'react';
import BaseModal from './BaseModal'
import { AiFillCloseCircle } from "react-icons/ai";
import Icon from '../icon/Icon';
import { removeRoom } from '../../services/roomService';
import { useRoomStore } from '../../stores/roomStore';
import { generatePromiseToast } from '../../utils/toastGenerator';
const CloseRoomModal = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const roomId = useRoomStore((state) => state.room?.id);
    const openButtonContent = (
        <>
          <Icon icon={AiFillCloseCircle} />
          Close this room
        </>
      );

    const onCloseRoom = async() => {
        if(!roomId) return;
        
        await generatePromiseToast(removeRoom(roomId), "Room closed!")
        
    }
    const footerButtons = (
        <button
        className="bg-red-800 py-2 px-3 rounded-2xl  hover:bg-red-600 cursor-pointer"
        onClick={onCloseRoom}
        >
        Close
        </button>
  );


  return (
    <BaseModal
    blurBackground={true}
      title="Close this room"
      openButtonClassname="bg-red-700 text-sm py-1 px-3 gap-1 rounded-2xl flex items-center cursor-pointer hover:bg-neutral-600 transition-colors"
      openButtonContent={openButtonContent}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      footerButtons={footerButtons}
      >
        <>
            <p>Are you sure do you want close this room?</p>
        </>
    </BaseModal>
  )
}

export default CloseRoomModal