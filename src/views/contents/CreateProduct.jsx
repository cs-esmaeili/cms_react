import { useState, useEffect, useRef } from 'react';
import config from "../../config.json";
import useGenerator from "../../global/Idgenerator";
import { _categoryListPure } from "../../services/Category";
import { getValidator, rules } from '../../global/validator_rules';

const CreateProduct = ({ edit = false, data = null, onSubmit = null }) => {

    const [images, setImages] = useState([]);
    const [update, Setupdate] = useState(false);
    const [categoryPure, setCategoryPure] = useState(null);
    const [category_id, setCategory_id] = useState((edit) ? data.category_id : null);
    const [productName, setProductName] = useState(null);
    const [productPrice, setProductPrice] = useState(null);
    const [status, setStatus] = useState(null);
    const [stock, setStock] = useState(null);
    const [description, setDescription] = useState(null);
    const validator = useRef(getValidator);

    const [generateID] = useGenerator();
    const onImageChange = (event, index = -1) => {
        if (event.target.files) {
            let imagesTemp = images;
            if (index !== -1) {
                imagesTemp[index] = event.target.files[0];
            } else {
                Object.keys(event.target.files).map((value, index) => imagesTemp.push(event.target.files[value]));
            }
            setImages(imagesTemp);
            Setupdate(!update);
        }
    }
    const deleteImage = (index) => {
        let imagesTemp = images;
        imagesTemp.splice(index, 1);
        setImages(imagesTemp);
        Setupdate(!update);
    }

    const getCtegorysPure = async () => {
        try {
            const respons = await _categoryListPure();
            if (respons.data.statusText === "ok") {
                setCategoryPure(respons.data.list);
                setCategory_id(respons.data.list[0].category_id);
            }
        } catch (error) { }
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
                                                <label key={generateID()} htmlFor={`file-upload-${index}`} className="custom-file-upload" style={{
                                                    alignItems: "center", justifyContent: "center"
                                                }}>
                                                    <input
                                                        id={`file-upload-${index}`}
                                                        type="file"
                                                        accept="image/*"
                                                        index={index}
                                                        onChange={(e) => onImageChange(e, index)}
                                                        style={{ display: "none" }}
                                                    />
                                                    <img class="img-fluid" src={URL.createObjectURL(images[index])} alt="preview" />
                                                    <button
                                                        className="btn btn-danger btn-icon-split"
                                                        type="button"
                                                        data-toggle="modal" data-target="#Modal_DeleteRole"
                                                        style={{ width: "100%", marginTop: "5px" }}
                                                        onClick={() => deleteImage(index)}
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
                                        <i class="fa fa-plus" aria-hidden="true" style={{ textAlign: "center", fontSize: "100px" }}></i>
                                        <input
                                            id="file-upload-new"
                                            type="file"
                                            accept="image/*"
                                            multiple={true}
                                            onChange={onImageChange}
                                            style={{ display: "none" }}
                                        />
                                    </label>
                                </div>

                            </div>
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
                                                <input name="productName" id="productName" value={productName} className="form-control form-control-user" placeholder="نام کالا" style={{ textAlign: "right" }} />
                                                {validator.current.message(
                                                    "productName",
                                                    productName,
                                                    "required"
                                                )}
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
                                                <input name="productPrice" id="productPrice" value={productPrice} className="form-control form-control-user" placeholder="قیمت کالا" style={{ textAlign: "left" }} />
                                                {validator.current.message(
                                                    "productPrice",
                                                    productPrice,
                                                    "required"
                                                )}
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
                                                <input name="productPrice" id="productPrice" value={productPrice} className="form-control form-control-user" placeholder="قیمت فروش کالا" style={{ textAlign: "left" }} />
                                                {validator.current.message(
                                                    "productPrice",
                                                    productPrice,
                                                    "required"
                                                )}
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
                                                <input name="stock" id="stock" value={stock} className="form-control form-control-user" placeholder="موجودی انبار" style={{ textAlign: "left" }} />
                                                {validator.current.message(
                                                    "stock",
                                                    stock,
                                                    "required"
                                                )}
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
                                                <input name="description" id="description" value={description} className="form-control form-control-user" placeholder="توضیحات کالا" style={{ textAlign: "right" }} />
                                                {validator.current.message(
                                                    "description",
                                                    description,
                                                    "required"
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateProduct;
