import React, { useCallback } from 'react'
import { Button, Icon, Drawer, Alert } from 'rsuite';
import { useModelState, useMediaQuery } from '../../misc/custom-hooks';
import { isOfflineForDatabase } from '../../context/Profile.context';
import Dashboard from '.';
import { auth, database } from '../../misc/firebase';
const DashboardToggle = () => {

    const { isOpen, open, close } = useModelState();
    const isMobile = useMediaQuery('(max-width:992px)')
    
    const isSignOut = useCallback(() => {

        database.ref(`/status/${auth.currentUser.uid}`).set(isOfflineForDatabase).then(()=>{
            auth.signOut();
            Alert.info("Signed Out",4000);
            close();
        }).catch(err => {
            Alert.error(err.message,4000);
        });
    },[close])

    return (
        <>
        <Button block color="blue" className="mt-3" onClick={open}>
            <Icon icon="dashboard" /> Dashboard
        </Button>

        <Drawer full={isMobile} show={isOpen} onHide={close} placement="left">
            <Dashboard isSignOut={isSignOut} />
        </Drawer>
        </>
    )
}

export default DashboardToggle
