import React from 'react'
import { Alert, Drawer, Button, Divider } from 'rsuite';
import EditableInput from '../EditableInput';
import { useProfile } from '../../context/Profile.context';
import { database } from '../../misc/firebase';
import ProviderBlock from './ProviderBlock';
import AvatarUpload from './AvatarUpload';
import { getuserUpdate } from '../../misc/helpers';
const Dashboard = ({isSignOut}) => {
    const { profile } = useProfile()

    const onSave = async (newData) => {
        // const newNickNameRef = database.ref(`/profiles/${profile.uid}`).child("name");

        try {
            // await newNickNameRef.set(newData);

            const updates = await getuserUpdate(profile.uid, 'name', newData, database);

            await database.ref().update(updates);

            Alert.success("NickName Changed.",4000);
        } catch (err) {
            Alert.error(err.massage,4000)
        }

    }

    return (
        <>

        <Drawer.Header>
            <Drawer.Title>DashBoard</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
            <h3>Hey, {profile.name}</h3>
            <ProviderBlock />
            <Divider />
            <EditableInput 
                initialValue={profile.name}
                onSave={onSave}
                label={<h6 className="mb-2">Nickname</h6>}
                name="nickname"
            />
            <AvatarUpload />
        </Drawer.Body>
        <Drawer.Footer>
            <Button block color="red" onClick={isSignOut}>Sign Out</Button>
        </Drawer.Footer>

        </>
    )
}

export default Dashboard
