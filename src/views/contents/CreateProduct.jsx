import { useState, useEffect } from 'react';
import useGenerator from "../../global/Idgenerator";
import { _categoryListPure } from "../../services/Category";
import { Formik, Form, Field } from 'formik';
import { createProductSchema } from '../../global/validator_Schemas';

const CreateProduct = ({ edit = false, data = null, onSubmit = null }) => {

    const [update, setUpdate] = useState(false);
    const [images, setImages] = useState([]);
    const [categoryPure, setCategoryPure] = useState(null);
    const [category_id, setCategory_id] = useState((edit) ? data.category_id : -1);
    const [status, setStatus] = useState(false);

    const [generateID] = useGenerator();
    const onImageChange = (event, index = -1) => {
        console.log('onImageChange');
        if (event.target.files) {
            let imagesTemp = images;
            if (index !== -1) {
                imagesTemp[index] = event.target.files[0];
            } else {
                Object.keys(event.target.files).map((value, index) => imagesTemp.push(event.target.files[value]));
            }
            setImages(imagesTemp);
            setUpdate(!update);
        }
    }
    const deleteImage = (index) => {
        console.log('deleteImage');
        let imagesTemp = images;
        imagesTemp.splice(index, 1);
        setImages(imagesTemp);
        setUpdate(!update);
    }

    const getCtegorysPure = async () => {
        console.log('getCtegorysPure');
        try {
            const respons = await _categoryListPure();
            if (respons.data.statusText === "ok") {
                setCategoryPure(respons.data.list);
                setCategory_id(respons.data.list[0].category_id);
            }
        } catch (error) { }
    }

    const handelSubmit = (values) => {
        console.log(values);
    }

    useEffect(() => {
        getCtegorysPure();
        console.log('useEffect');
        if (edit) {
            setCategory_id((edit) ? data.category_id : null);
            setCategoryPure(null);
        }
    }, [data]);


    return (
        <div className='container-fluid'>
            <Formik
                initialValues={{
                    productName: '',
                    productPrice: '',
                    productSalePrice: '',
                    stock: '',
                    description: '',
                    file: false,
                }}
                validationSchema={createProductSchema}
                onSubmit={values => {
                    handelSubmit(values);
                }}
            >
                {({ errors, touched, setFieldValue }) => (
                    <Form  >
                        <div className="row">
                            <div className='col'>
                                <div className="card shadow">
                                    <div className="card-header">
                                        <h6 className="font-weight-bold text-primary">تصاویر کالا</h6>
                                    </div>
                                    <div className="card-body" >
                                        <div className='row' style={{ display: "flex", flexDirection: "row-reverse" }}>

                                            {
                                                images.map((value, index) => {
                                                    return (
                                                        <div className='col-xxl-1 col-xl-2 col-lg-4 col-md-5 col-sm-6 col-xs-6'>
                                                            <label htmlFor={`file-upload-${index}`} className="custom-file-upload" style={{
                                                                alignItems: "center", justifyContent: "center"
                                                            }}>
                                                                <img className="img-fluid" src={URL.createObjectURL(images[index])} alt="preview" />
                                                                <input
                                                                    id={`file-upload-${index}`}
                                                                    type="file"
                                                                    accept="image/*"
                                                                    index={index}
                                                                    onChange={(e) => onImageChange(e, index)}
                                                                    style={{ display: "none" }}
                                                                />
                                                                <button
                                                                    className="btn btn-danger btn-icon-split"
                                                                    type="button"
                                                                    data-toggle="modal" data-target="#Modal_DeleteRole"
                                                                    style={{ width: "100%", marginTop: "5px" }}
                                                                    onClick={() => { deleteImage(index); (images.length - 1 <= 0) && setFieldValue("file", false) }}
                                                                >
                                                                    <span
                                                                        className="text"
                                                                        style={{ width: "100%" }}
                                                                    >
                                                                        حذف
                                                                    </span>
                                                                    <span className="icon text-white-50">
                                                                        <i className="fas fa-exclamation-triangle"></i>
                                                                    </span>

                                                                </button>
                                                            </label>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <div className='col-xxl-1 col-xl-2 col-lg-4 col-md-5 col-sm-6 col-xs-6'>
                                                <label htmlFor="file-upload-new" style={{
                                                    display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center"
                                                }}>
                                                    <i className="fa fa-plus" aria-hidden="true" style={{ textAlign: "center", fontSize: "100px" }}></i>
                                                    <input
                                                        id="file-upload-new"
                                                        type="file"
                                                        accept="image/*"
                                                        multiple={true}
                                                        onChange={(e) => { onImageChange(e); (e.target.files.length > 0 ? setFieldValue("file", true) : setFieldValue("file", false)) }}
                                                        style={{ display: "none" }}
                                                    />
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
                                        <h6 className="font-weight-bold text-primary">اطلاعات کالا</h6>
                                    </div>
                                    <div className="card-body" >
                                        <div className='row'>
                                            <div className='col-6'>
                                                <div className="card shadow">
                                                    <div className="card-header">
                                                        <h6 className="font-weight-bold text-primary">دسته بندی</h6>
                                                    </div>
                                                    <div className="card-body" >
                                                        {categoryPure != null && categoryPure.length > 0 ?
                                                            <select value={category_id} className="form-control justify-content-center" style={{ direction: "rtl" }} onChange={(e) => setCategory_id(e.target.value)}>
                                                                {categoryPure.map(element => <option key={generateID()} value={element.category_id}>{element.name}</option>)}
                                                            </select>
                                                            :
                                                            <span>
                                                                ابتدا در بخش دسته بندی دسته بندی ایجاد کنید
                                                            </span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-6'>
                                                <div className="card shadow">
                                                    <div className="card-header">
                                                        <h6 className="font-weight-bold text-primary">نام کالا</h6>
                                                    </div>
                                                    <div className="card-body" >
                                                        <div className="form-group">
                                                            <Field className="form-control form-control-user" name="productName" placeholder="نام کالا" style={{ textAlign: "right" }} />
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
                                                        <h6 className="font-weight-bold text-primary">قیمت کالا</h6>
                                                    </div>
                                                    <div className="card-body" >
                                                        <div className="form-group">
                                                            <Field className="form-control form-control-user" name="productPrice" placeholder="قیمت کالا" style={{ textAlign: "left" }} />
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
                                                        <h6 className="font-weight-bold text-primary">قیمت فروش کالا</h6>
                                                    </div>
                                                    <div className="card-body" >
                                                        <div className="form-group">
                                                            <Field className="form-control form-control-user" name="productSalePrice" placeholder="قیمت فروش کالا" style={{ textAlign: "left" }} />
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
                                                        <h6 className="font-weight-bold text-primary">وضعیت کالا</h6>
                                                    </div>
                                                    <div className="card-body" >
                                                        <select value={status} style={{ textAlign: "right" }} className="form-control justify-content-center" onChange={(e) => setStatus(e.target.value)}>
                                                            <option key={generateID()} value={0}>فروش</option>
                                                            <option key={generateID()} value={1}>نا موجود</option>
                                                            <option key={generateID()} value={2}>غیر فعال</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-6'>
                                                <div className="card shadow">
                                                    <div className="card-header">
                                                        <h6 className="font-weight-bold text-primary">موجودی انبار</h6>
                                                    </div>
                                                    <div className="card-body" >
                                                        <div className="form-group">
                                                            <Field className="form-control form-control-user" name="stock" placeholder="موجودی انبار" style={{ textAlign: "left" }} />
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
                                                        <h6 className="font-weight-bold text-primary">توضیحات کالا</h6>
                                                    </div>
                                                    <div className="card-body" >
                                                        <div className="form-group">
                                                            <Field className="form-control form-control-user" name="description" placeholder="توضیحات کالا" style={{ textAlign: "right" }} />
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
                                                    ثبت کالا
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
        </div>
    );
}

export default CreateProduct;
