import React, {memo} from 'react'
import { useCurrentRoom } from '../../../context/currentroom.context'
import { Button, Modal } from 'rsuite';
import { useModelState } from '../../../misc/custom-hooks';

const RoomInfoBtnModel = () => {
    
    const { isOpen, close, open } = useModelState();
    const description = useCurrentRoom(v => v.description);
    const name = useCurrentRoom(v => v.name);
    
    return (
        <div>

            <Button appearance='link' className="px-0" onClick={open}>
                Room information
            </Button>
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>
                        About {name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h6 className="mb-1">Description</h6>
                    <p>{description}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button block onClick={close}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default memo(RoomInfoBtnModel);
