import React from 'react'
import { useParams } from 'react-router';
import { Loader } from 'rsuite';
import { useRooms } from '../../context/rooms.context'
import ChatTop from '../../components/chat-window/top';
import ChatBottom from '../../components/chat-window/bottom';
import Messages from '../../components/chat-window/messages';
import { CurrentRoomProvider } from '../../context/currentroom.context';
import { transformToArr } from '../../misc/helpers';
import { auth } from '../../misc/firebase';

const Chat = () => {

    const { chatId } = useParams();
    const rooms = useRooms();

    if(!rooms) {
        return <Loader center size="md" speed="slow" vertical content="Loading..." />
    }

    const currentRoom = rooms.find(room => room.id === chatId);

    if(!currentRoom) {
        return <h6 className="text-center mt-page">Chat {chatId} not Found.</h6>
    }

    const { name, description } = currentRoom;

    const admins = transformToArr(currentRoom.admins);
    const isAdmin = admins.includes(auth.currentUser.uid);

    const currentRoomData = {
        name, description, admins, isAdmin
    }

    return (
        <CurrentRoomProvider data={currentRoomData}>
            <div className="chat-top">
                <ChatTop />
            </div>
            <div className="chat-middle">
                <Messages />
            </div>
            <div className="chat-bottom">
                <ChatBottom />
            </div>
        </CurrentRoomProvider>
    )
}

export default Chat