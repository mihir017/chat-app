import React, { useState ,useRef } from 'react';
import { Modal, Button, Alert } from 'rsuite';
import { useModelState } from '../../misc/custom-hooks';
import AvatarEditor from 'react-avatar-editor';
import { database, storage } from '../../misc/firebase';
import { useProfile } from '../../context/Profile.context';
import ProfileAvatar from '../ProfileAvatar';
import { getuserUpdate } from '../../misc/helpers';

const filesInputTypes = ".png, .jpeg, .jpg";
const fileTypes = ["image/png", "image/jpeg", "image/jpg"];
const isValidFile = file => fileTypes.includes(file.type);

const getBlob = (canvas) => {
    return new Promise((resolve, reject) => {
        
        canvas.toBlob( (blob) => {
            if(blob){
                resolve(blob);
            } else {
                reject(new Error("File process Error"))
            }
        })

    })
}

const AvatarUpload = () => {

    const {isOpen, open, close} = useModelState();
    const [img, setImg] = useState(null);
    const avatarEditorRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const {profile} = useProfile();

    const onFileInputChange = (e) => {
        const currentFiles = e.target.files;

        if (currentFiles.length === 1) {
            const file = currentFiles[0];

            if( isValidFile(file) ) {
                setImg(file);

                open();
            } else {
                Alert.warning(`Wrong file type ${file.type}`);
            }
            
        }
    }

    const onUploadCick = async () => {
        const canvas = avatarEditorRef.current.getImageScaledToCanvas();

        setIsLoading(true);
        try{
            const blob = await getBlob(canvas);

            const avatarFileRef = storage.ref(`/profile/${profile.uid}`).child("avatar");
            const uploadAvatarResut = await avatarFileRef.put( blob, {
                cacheControl : `public, max-age=${3600 * 24 * 3}`
            } )
            const downloadUrl = await uploadAvatarResut.ref.getDownloadURL();

            const updates = await getuserUpdate(profile.uid, 'avatar', downloadUrl, database);
            await database.ref().update(updates);

            // const userAvatarRef = database.ref(`/profiles/${profile.uid}`).child("avatar");
            // userAvatarRef.set(downloadUrl);
            
            setIsLoading(false)
            Alert.info("avatar has been uploaded", 4000);
        } catch (err) {
            setIsLoading(false);
            Alert.error(err.message,4000);
        }

    }

    return (
        <div className="mt-3 text-center">

            <ProfileAvatar src={profile.avatar} name={profile.name} className="width-200 height-200 font-huge img-fullsize" />
            <div>
                <label htmlFor="avatar-upload" className="d-block cursor-pointer padded">
                    Select new avatar
                    <input type="file" className="d-none" accept={filesInputTypes} onChange={onFileInputChange} id="avatar-upload" />
                </label>
            </div>

            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>
                        Adjust nad upload new avatar
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="justify-content-center align-item-center d-flex">
                        {img && 
                            <AvatarEditor
                            ref={avatarEditorRef}
                            image={img}
                            width={200}
                            height={200}
                            border={10}
                            borderRadius={100}
                            rotate={0}
                          />
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button block appearance="default" onClick={onUploadCick} disabled={isLoading}>Upload new Avatar</Button>
                </Modal.Footer>
            </Modal>
            
        </div>
    )
}

export default AvatarUpload
