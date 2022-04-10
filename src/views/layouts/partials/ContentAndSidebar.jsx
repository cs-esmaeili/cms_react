import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setProfileData } from "../../../actions/profile";
import { _personProfile } from './../../../services/Person';
import ContentWrapper from '../partials/ContentWrapper';
import Sidebar from '../partials/Sidebar';

const ContentAndSidebar = () => {

    const [show, setShow] = useState(false);
    const dispatch = useDispatch();

    const PersonProfile = async () => {
        if (show === false) {
            try {
                const respons = await _personProfile();
                if (respons.data.statusText === "ok") {
                    dispatch(setProfileData(respons.data));
                    setShow(true);
                }
            } catch (error) { }
        }
    }
    useEffect(() => {
        PersonProfile();
    }, []);
    if (show) {
        return (
            <>
                <ContentWrapper />
                <Sidebar />
            </>
        );
    } else { return (<></>) }

}

export default ContentAndSidebar;
