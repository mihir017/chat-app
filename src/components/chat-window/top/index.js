import React, { memo } from 'react'
import { useCurrentRoom } from '../../../context/currentroom.context';
import { Link } from 'react-router-dom';
import { Icon, ButtonToolbar } from 'rsuite';
import { useMediaQuery } from '../../../misc/custom-hooks'
import RoomInfoBtnModel from './RoomInfoBtnModel';
import EditRoomBtnDrawer from './EditRoomBtnDrawer';

const ChatTop = () => {

    const name = useCurrentRoom(v => v.name);
    const isAdmin = useCurrentRoom(v => v.isAdmin);
    const isMobile = useMediaQuery('(max-width: 992px)');

    return (
        <div>
            <div className="d-flex justify-content-between align-item-center">
                <h4 className="d-flex align-item-center text-disappear">
                    <Icon componentClass={Link} to="/" icon="arrow-circle-left" size="2x" className={isMobile ? 'd-inline-block p-0 mr-2 text-blue link-unstyled' : 'd-none'} />
                    <span>{name}</span>
                </h4>

                <ButtonToolbar className="ws-nowrap lign-height">{isAdmin && <EditRoomBtnDrawer /> }  </ButtonToolbar>
            </div>
            <div className='d-flex justify-content-between align-item-center'>
                <span>todo</span>
                <RoomInfoBtnModel />
            </div>

        </div>
    )
}

export default memo(ChatTop);
