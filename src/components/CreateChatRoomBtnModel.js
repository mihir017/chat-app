import React, { useCallback, useRef, useState } from 'react'
import {Button, Form, Icon, Modal, FormGroup, FormControl, ControlLabel, Schema, Alert} from 'rsuite';
import { useModelState } from '../misc/custom-hooks';
import { auth, database } from './../misc/firebase';
import firebase from 'firebase/app';

// chat room validation
const { StringType } = Schema.Types;
const model = Schema.Model({
    name: StringType().isRequired('Chat name is required'),
    description: StringType().isRequired('Description is required')
});
// chat room validation
const INITIAL_FORM = {
    name: "",
    description:""
}
const CreateChatRoomBtnModel = () => {

    const { isOpen, open, close } = useModelState();
    const [formValue, setFormValue] = useState(INITIAL_FORM);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef();

    const onFormChange = useCallback((value) => {
        setFormValue(value);
    },[]);

    const onSubmit = async () => {
        if(!formRef.current.check()) {
            return
        }

        setIsLoading(true);

        const newRoomData = {
            ...formValue,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            admins: {
                [auth.currentUser.uid]: true
            }
        }

        try {

            await database.ref("rooms").push(newRoomData);

            Alert.info(`${formValue.name} has been created`,4000);

            setIsLoading(false);
            setFormValue(INITIAL_FORM);
            close();

        } catch(err) {
            setIsLoading(false);
            Alert.error(err.message,4000);
        }
    }

    return (
        <div className="mt-1">

            <Button block color="green" onClick={open}>
                <Icon icon="creative" />Create new chat Room
            </Button>

            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>New Chat Room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid onChange={onFormChange} model={model} formValue={formValue} ref={formRef}>
                        <FormGroup>
                            <ControlLabel>Room name</ControlLabel>
                            <FormControl name="name" placeholder="Enter Chat room name..." />
                        </FormGroup>
                        
                        <FormGroup>
                            <ControlLabel>Description</ControlLabel>
                            <FormControl componentClass="textarea" rows={5} name="description" placeholder="Enter room description ..." />
                        </FormGroup>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button block appearance="primary" onClick={onSubmit} disabled={isLoading}>
                        Create new Chat Room
                    </Button>
                </Modal.Footer>
            </Modal>



        </div>
    )
}

export default CreateChatRoomBtnModel
