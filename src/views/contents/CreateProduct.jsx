import { useState, useEffect } from 'react';
import useGenerator from "../../global/Idgenerator";
import { _categoryListPure } from "../../services/Category";
import { Formik, Form, Field } from 'formik';
import { createProductSchema } from '../../global/validator_Schemas';
import SelectFolder from './../components/modals/SelectFolder';
import { toast } from 'react-toastify';
import { _CreateProduct } from './../../services/Product';
import { values } from 'lodash';

const CreateProduct = ({ edit = false, data = null, onSubmit = null }) => {

    const [images, setImages] = useState(null);
    const [categoryPure, setCategoryPure] = useState(null);
    const [category_id, setCategory_id] = useState((edit) ? data.category_id : -1);
    const [status, setStatus] = useState(0);

    const [generateID] = useGenerator();

    const getCtegorysPure = async () => {
        try {
            const respons = await _categoryListPure();
            if (respons.data.statusText === "ok") {
                setCategoryPure(respons.data.list);
                setCategory_id(respons.data.list[0].category_id);
            }
        } catch (error) { }
    }

    const handelSubmit = async (values, reset) => {
        const obj = {
            category_id: values.category_id,
            name: values.productName,
            price: values.productPrice,
            sale_price: values.productSalePrice,
            status: status,
            stock: values.stock,
            description: values.description,
            image_folder: images.foler_path
        }
        try {
            const respons = await _CreateProduct(obj);
            console.log(respons);
            if (respons.data.statusText === "ok") {
                reset();
                setImages(null);
                setStatus(0);
            }
            toast(respons.data.message);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCtegorysPure();
        if (edit) {
            setCategory_id((edit) ? data.category_id : null);
            setCategoryPure(null);
        }
    }, [data]);



    return (
        <div className='container-fluid'>
            <SelectFolder data={(data) => {
                setImages(data);
            }} />
            <Formik
                initialValues={{
                    productName: '',
                    productPrice: '',
                    productSalePrice: '',
                    stock: '',
                    description: '',
                    file: false,
                    category_id: false,
                }}
                validationSchema={createProductSchema}
                onSubmit={(values, { resetForm }) => {
                    handelSubmit(values, resetForm);
                }}
            >
                {({ errors, touched, values, setFieldValue }) => (
                    <Form>
                        {console.log(errors)}
                        <div className="row">
                            <div className='col'>
                                <div className="card shadow">
                                    <div className="card-header">
                                        <h6 className="font-weight-bold text-primary">???????????? ????????</h6>
                                    </div>
                                    <div className="card-body" >
                                        <div className='row' style={{ display: "flex", flexDirection: "row-reverse" }}>
                                            {images != null && images.files.map((value, index) => {
                                                return (
                                                    <div className='col-xxl-1 col-xl-2 col-lg-4 col-md-5 col-sm-6 col-xs-6' >
                                                        <label htmlFor={`file-upload-${index}`} className="custom-file-upload" style={{
                                                            alignItems: "center", justifyContent: "center"
                                                        }}>
                                                            <img className="img-fluid" src={value.link} alt="preview" onLoad={() => {
                                                                setFieldValue("file", true);
                                                            }} />
                                                        </label>
                                                    </div>
                                                )
                                            })
                                            }
                                            <div className='col-xxl-1 col-xl-2 col-lg-4 col-md-5 col-sm-6 col-xs-6'>
                                                <label htmlFor="file-upload-new" style={{
                                                    display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center"
                                                }} onClick={(e) => {
                                                    document.getElementById('Modal_FileManager_Folder_open').click();
                                                    // document.getElementById('Modal_FileManager_File_open').click();
                                                }}>
                                                    <i className="fa fa-plus" aria-hidden="true" style={{ textAlign: "center", fontSize: "100px" }}></i>
                                                </label>
                                            </div>

                                        </div>
                                        {errors.file && touched.file ? (
                                            <div style={{ color: "red" }}>{errors.file}</div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className='col'>
                                <div className="card shadow">
                                    <div className="card-header">
                                        <h6 className="font-weight-bold text-primary">?????????????? ????????</h6>
                                    </div>
                                    <div className="card-body" >
                                        <div className='row'>
                                            <div className='col-6'>
                                                <div className="card shadow">
                                                    <div className="card-header">
                                                        <h6 className="font-weight-bold text-primary">???????? ????????</h6>
                                                    </div>
                                                    <div className="card-body" >
                                                        {(categoryPure != null && categoryPure.length > 0) ?
                                                            <>
                                                                {(values.category_id === false) && setFieldValue("category_id", true)}
                                                                <select value={category_id} className="form-control justify-content-center" style={{ direction: "rtl" }}
                                                                    onChange={(e) => {
                                                                        console.log('d');
                                                                        setCategory_id(e.target.value);
                                                                        setFieldValue("category_id", true);
                                                                    }}>
                                                                    {categoryPure.map(element => <option key={generateID()} value={element.category_id}>{element.name}</option>)}
                                                                </select>
                                                            </>
                                                            :
                                                            <div>
                                                                <span>
                                                                    ?????????? ???? ?????? ???????? ???????? ???????? ???????? ?????????? ????????
                                                                </span>
                                                            </div>
                                                        }
                                                        {errors.category_id && touched.category_id ? (
                                                            <div style={{ color: "red" }}>{errors.category_id}</div>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-6'>
                                                <div className="card shadow">
                                                    <div className="card-header">
                                                        <h6 className="font-weight-bold text-primary">?????? ????????</h6>
                                                    </div>
                                                    <div className="card-body" >
                                                        <div className="form-group">
                                                            <Field className="form-control form-control-user" name="productName" placeholder="?????? ????????" style={{ textAlign: "right", direction: "rtl" }} />
                                                            {errors.productName && touched.productName ? (
                                                                <div style={{ color: "red" }}>{errors.productName}</div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row mt-2'>
                                            <div className='col-6'>
                                                <div className="card shadow">
                                                    <div className="card-header">
                                                        <h6 className="font-weight-bold text-primary">???????? ???????? / ??????????</h6>
                                                    </div>
                                                    <div className="card-body" >
                                                        <div className="form-group">
                                                            <Field className="form-control form-control-user" name="productPrice" placeholder="???????? ????????" style={{ textAlign: "left" }} />
                                                            {errors.productPrice && touched.productPrice ? (
                                                                <div style={{ color: "red" }}>{errors.productPrice}</div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className='col-6'>
                                                <div className="card shadow">
                                                    <div className="card-header">
                                                        <h6 className="font-weight-bold text-primary">???????? ???????? ???????? / ??????????</h6>
                                                    </div>
                                                    <div className="card-body" >
                                                        <div className="form-group">
                                                            <Field className="form-control form-control-user" name="productSalePrice" placeholder="???????? ???????? ????????" style={{ textAlign: "left" }} />
                                                            {errors.productSalePrice && touched.productSalePrice ? (
                                                                <div style={{ color: "red" }}>{errors.productSalePrice}</div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className='row mt-2'>
                                            <div className='col-6'>
                                                <div className="card shadow">
                                                    <div className="card-header">
                                                        <h6 className="font-weight-bold text-primary">?????????? ????????</h6>
                                                    </div>
                                                    <div className="card-body" >
                                                        <select value={status} style={{ textAlign: "right" }} className="form-control justify-content-center"
                                                            onChange={(e) => setStatus(e.target.value)}>
                                                            <option key={generateID()} value={0}>????????</option>
                                                            <option key={generateID()} value={1}>???? ??????????</option>
                                                            <option key={generateID()} value={2}>?????? ????????</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-6'>
                                                <div className="card shadow">
                                                    <div className="card-header">
                                                        <h6 className="font-weight-bold text-primary">???????????? ??????????</h6>
                                                    </div>
                                                    <div className="card-body" >
                                                        <div className="form-group">
                                                            <Field className="form-control form-control-user" name="stock" placeholder="???????????? ??????????" style={{ textAlign: "left" }} />
                                                            {errors.stock && touched.stock ? (
                                                                <div style={{ color: "red" }}>{errors.stock}</div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row mt-2'>
                                            <div className='col-12'>
                                                <div className="card shadow">
                                                    <div className="card-header">
                                                        <h6 className="font-weight-bold text-primary">?????????????? ????????</h6>
                                                    </div>
                                                    <div className="card-body" >
                                                        <div className="form-group">
                                                            <Field className="form-control form-control-user" name="description" placeholder="?????????????? ????????" style={{ textAlign: "right", direction: "rtl" }} />
                                                            {errors.description && touched.description ? (
                                                                <div style={{ color: "red" }}>{errors.description}</div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row mt-2'>
                                            <div className='col-12'>
                                                <button type="submit" className="btn btn-primary btn-user btn-block">
                                                    ?????? ????????
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div >
    );
}

export default CreateProduct;
