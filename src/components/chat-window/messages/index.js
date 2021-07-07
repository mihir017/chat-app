import React, {useCallback, useEffect, useRef, useState} from 'react'
import { useParams } from 'react-router';
import { Alert, Button } from 'rsuite';
import { auth, database, storage } from '../../../misc/firebase';
import { groupBy, transformToArrWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const PAGE_SIZE = 15;
const messageRef = database.ref('/messages');

function shouldScrollToBottom(node, threshold=30) {
    const percentage = (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;

    return percentage > threshold;
}

const Messages = () => {
    
    const { chatId } = useParams();
    const [messages, setMessages] = useState(null);
    const [limit, setLimit] = useState(PAGE_SIZE);
    const selfRef = useRef();

    const isChatEmpty = messages && messages.length === 0; 
    const canShowMessages = messages && messages.length > 0; 

    const loadMessages = useCallback((limitToLast)=>{
        messageRef.off();
        messageRef.orderByChild('roomId').equalTo(chatId).limitToLast(limitToLast || PAGE_SIZE).on('value', (snap) => {
            const data = transformToArrWithId(snap.val());

            setMessages(data);

            const afterNode = selfRef.current;
            if(shouldScrollToBottom(afterNode)){
                afterNode.scrollTop = afterNode.scrollHeight;
            }
        });
        setLimit(p => p + PAGE_SIZE);
    },[chatId])

    const onLoadMore = useCallback(() => {
        const load = selfRef.current;
        const oldHeight = load.scrollHeight;

        loadMessages(limit);

        setTimeout(() => {
            const newHeight = load.scrollHeight;
            load.scrollTop = newHeight - oldHeight;
        },200)
    },[loadMessages, limit])

    useEffect(() => {
        const node = selfRef.current;

        loadMessages();

        setTimeout(() => {
            node.scrollTop = node.scrollHeight;
        },200)

        return () => {
            messageRef.off('value');
        };

    }, [loadMessages])

    const handleAdmin = useCallback(async (uid) => {
        const adminRef = database.ref(`/rooms/${chatId}/admins`);
        let alertMsg;

        await adminRef.transaction(admins => {
            if (admins) {
                if (admins[uid]){
                    admins[uid] = null;
                    alertMsg = "Admin permission removed";
                } else {
                    admins[uid] = true;
                    alertMsg = "Admin permission granted";
                }
            }
            return admins;
        });

        Alert.info(alertMsg,4000)

    }, [chatId]);

    const handleLike = useCallback( async (msgId)=> {
        
        const {uid} = auth.currentUser;
        const messageRef = database.ref(`/messages/${msgId}`);
        let alertMsg;

        await messageRef.transaction(msg => {
            if (msg) {
                if ( msg.likes && msg.likes[uid]){
                    msg.likeCount -= 1;
                    msg.likes[uid] = null;
                    alertMsg = "Like removed";
                } else {
                    msg.likeCount += 1;

                    if(!msg.likes){
                        msg.likes = {};
                    }
                    msg.likes[uid] = true;
                    alertMsg = "Like added";
                }
            }
            return msg;
        });

        Alert.info(alertMsg,4000)
    }, []);

    const handleDelete = useCallback( async (msgId, file) => {

        if (window.confirm("Delete this message?")){
            return;
        }

        const isLast = messages[messages.length - 1].id === msgId;

        const updates = {};

        updates[`/messages/${msgId}`] = null;

        if(isLast && messages.length > 1) {
            updates[`/rooms/${chatId}/lastMessage`] = {
                ...messages[messages.length - 2],
                msgId: messages[messages.length - 2].id
            }
        }
        if(isLast && messages.length === 1) {
            updates[`/rooms/${chatId}/lastMessage`] = null;
        }

        try{
            await database.ref().update(updates);
            Alert.info('Message has been deleted',4000);
        } catch(err) {
            return Alert.error(err.message,4000);
        }

        if(file){
            try {
                const fileRef = storage.refFromURL(file.url);
                await fileRef.delete();
            } catch(err) {
                Alert.error(err.message);
            }
        }

    },[chatId, messages]);

    const renderMessages = () => {
        const groups = groupBy(messages, (item) => new Date(item.createdAt).toDateString());

        const items = [];

        Object.keys(groups).forEach((date) => {
         
            items.push( <li key={date} className="text-center mb-1 padded">{date}</li> );
         
            const msgs = groups[date].map(msg => (<MessageItem key={msg.id} message={msg} handleLike={handleLike} handleAdmin={handleAdmin} handleDelete={handleDelete} />));
        
            items.push(...msgs);
            // items.concat(msgs);

        });

        return items;

    }

    return (
        <ul ref={selfRef} className="msg-list custom-scroll">
        {messages && messages.length >= PAGE_SIZE && (
            <li className="mt-1 mb-2 text-center">
                <Button onClick={onLoadMore} color="green">Load More</Button>
            </li>
        )}
        {isChatEmpty && <li>No Messages yet</li>}
        {canShowMessages && renderMessages()}
        </ul>

    )
}

export default Messages
