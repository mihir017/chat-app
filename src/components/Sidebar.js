import React, { useEffect, useRef, useState } from 'react'
import { Divider } from 'rsuite';
import ChatRoomList from './rooms/ChatRoomList';
import DashboardToggle from './dashboard/DashboardToggle';
import CreateChatRoomBtnModel from './CreateChatRoomBtnModel';

const Sidebar = () => {
    const topSidebarRef = useRef();
    const [height,setHeight] = useState(0);
    
    useEffect(() => {
        if(topSidebarRef.current){
            setHeight(topSidebarRef.current.scrollHeight);
            // console.log(topSidebarRef.current.scrollHeight);
        }
    },[topSidebarRef]);
    return (
        <div className="h-100 pt-2">
            <div>
                <DashboardToggle />
                <CreateChatRoomBtnModel />
                <Divider>Join Conversation</Divider>
            </div>

            <ChatRoomList aboveElHeight={height} />
        </div>
    )
}

export default Sidebar
