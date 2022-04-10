import React from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../../../actions/profile";
import { withRouter } from "react-router-dom";
import config from "../../../config.json";
import Modal from "../HOC/Modal";
import { setCookie } from '../../../global/cookie';

const Logout = ({ history }) => {

    const dispatch = useDispatch();
    const logOutHandler = async () => {
        setCookie(-1, 'token', null);
        await dispatch(setToken(null));
        history.replace(config.web_url);
    };

    const footer = () => {
        return (
            <div>
                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={logOutHandler} style={{margin:"5px"}}>خروج</button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal">لغو</button>
            </div>
        );
    }
    return (
        <Modal obj_id="Modal_Logout" close={false} footer={footer()} title="آماده هستید ؟">
            <div>
                اگر به طور کامل اطمینان دارید که میخواهید از جلسه فعلی
                خراج شوید دکمه خروج را بزنید
            </div>
        </Modal>

    );
};

export default withRouter(Logout);
