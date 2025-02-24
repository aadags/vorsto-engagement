'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons'
import SurveyFormBuilder from './SurveyFormBuilder';
import ViewSurveyForm from './ViewSurveyForm';
import EditSurveyFormBuilder from './EditSurveyFormBuilder';


export default function WebForm() {

    const [activeIndex, setActiveIndex] = useState(1);
    const [selectedTag, setSelectedTag] = useState('');
    const [forms, setForms] = useState();
    const [editForm, setEditForm] = useState(false);
    const [editFormData, setEditFormData] = useState(false);
    const [formDetail, setFormDetail] = useState(false);


    const handleOnClick = (index) => {
        setActiveIndex(index);
        setSelectedTag('');
    };


    const fetchForms = async () => {
        const response = await axios.get(`/api/get-web-forms`);
        setForms(response.data.forms);
        if(response.data.forms.length < 1)
        {
            handleOnClick(2);
        }
    };

    const fetchForm = async (id) => {
        const response = await axios.get(`/api/get-web-form?formId=${id}`);
        setEditFormData(response.data.form);
    };

    const updateForm = (id) => {

        fetchForm(id);
        setEditForm(true);
        handleOnClick(3);
        
    };

    const seeForm = (id) => {

        fetchForm(id);
        setFormDetail(true);
        handleOnClick(4);
        
    };


    // store the filter keyword in a state
    useEffect(() => {
        fetchForms();
    }, [])

    return (
        <>
            <div className="techwave_fn_models_page">
                <div className="fn__title_holder">
                    <div className="container">
                        <h1 className="title">Web Forms</h1>
                    </div>
                </div>
                {/* Models */}
                <div className="techwave_fn_models">
                    <div className="fn__tabs">
                        <div className="container">
                            <div className="tab_in">
                                <a className={activeIndex === 1 ? "active" : ""} onClick={() => handleOnClick(1)}>Web Forms</a>
                                <a className={activeIndex === 2 ? "active" : ""} onClick={() => handleOnClick(2)}>Create Web Form</a>
                                {editForm && <a className={activeIndex === 3 ? "active" : ""} onClick={() => handleOnClick(3)}>Edit - {editFormData.name}</a>}
                                {formDetail && <a className={activeIndex === 4 ? "active" : ""} onClick={() => handleOnClick(4)}>Details - {editFormData.name}</a>}
                            </div>
                        </div>
                    </div>
                   
                    <div className="container">
                        {/* models content */}
                        <div className="models__content">
                            <div className="models__results">
                                <div className="fn__preloader">
                                    <div className="icon" />
                                    <div className="text">Loading</div>
                                </div>
                                <div className="fn__tabs_content">
                                    <div id="tab1" className={activeIndex === 1 ? "tab__item active" : "tab__item"}>
                                        {!forms || forms && forms.length < 1 && <h5>No Web Forms Created</h5>}
                                        {forms && <ul className="fn__model_items">
                                            {/*  model item goes here */}{
                                                forms.map((form, index) => (
                                                    <li key={form.id} className="fn__model_item">
                                                        <div className="item">
                                    
                                                            <div className="item__info">
                                                                <h3 className="title">{form.name}</h3>
                                                                <p className="desc">{form.description}</p>
                                                            </div>
                                                            <div className="item__author">
                                                                <Link href="#" onClick={() => updateForm(form.id)}><span><FontAwesomeIcon icon={faEdit} /> Edit</span></Link>
                                                              
                                                                <Link href="#" onClick={() => seeForm(form.id)}><span><FontAwesomeIcon icon={faEye} /> Details</span></Link>
                                                            </div>
                                                            
                                                        </div>
                                                    </li>
                                                ))}
                                        </ul>}
                                    </div>
                                    <div id="tab2" className={activeIndex === 2 ? "tab__item active" : "tab__item"}>
                                       <SurveyFormBuilder />
                                    </div>
                                    <div id="tab3" className={activeIndex === 3 ? "tab__item active" : "tab__item"}>
                                       {editFormData && <EditSurveyFormBuilder data={editFormData} />}
                                    </div>
                                    <div id="tab4" className={activeIndex === 4 ? "tab__item active" : "tab__item"}>
                                       {editFormData && <ViewSurveyForm data={editFormData} />}
                                    </div>
                                   
                                </div>
                            </div>
                        </div>
                        {/* !models content */}
                    </div>
                </div>
                {/* !Models */}
            </div>

        </>
    )
}