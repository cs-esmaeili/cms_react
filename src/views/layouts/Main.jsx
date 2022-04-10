import React, { useState, useEffect } from "react";
import { getCookie } from "../../global/cookie";
import Login from "./Login/Login";
import { useSelector, useDispatch } from "react-redux";
import { setToken } from "../../actions/profile";
import Logout from "../components/modals/Logout";
import ContentAndSidebar from "./partials/ContentAndSidebar";
import RelogIn from './../components/modals/RelogIn';
import { CheckToken } from "../../services/Authorization";

const Main = () => {

    const [check, setCheck] = useState(false);

    const token = useSelector((state) => state.token);
    const dispatch = useDispatch();
    if (token === null && getCookie('token') !== null) {
        dispatch(setToken(getCookie('token')));
    }
    const checkToken = async () => {
        try {
            const respons = await CheckToken();
            console.log(respons);
            if (respons.data.statusText === "ok") {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
    const checkConditions = async () => {
        const checktoken = await checkToken();
        if (getCookie('token') === null) {
            setCheck(false);
            return false;
        } else if (getCookie('token') !== null && checktoken === true) {
            setCheck(true);
            return true;
        }
        setCheck(false);
        return false;
    }
    useEffect(() => {
        checkConditions();
    }, [token]);


    return (
        <>
            {check ?
                <div id="wrapper">
                    <RelogIn />
                    <ContentAndSidebar />
                    <Logout />
                </div>
                :
                <Login />
            }
        </>
    );
}

export default Main;
