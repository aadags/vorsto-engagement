import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';

const ViewSurveyForm = ({ data }) => {
  const router = useRouter();
  
  const [formId, setFormId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormId(data.id || "");
    }
  }, [data]); // Runs when `data` changes


  if (!data) return null; // Prevent rendering until `data` is available

  return (
    <div className="form_container">
      <h5 className="title">Copy and Paste the Web Form Code Snippet</h5>
      <pre>
        {'<script src="https://engage.vorsto.io/js/form.js"></script>'}<br/>
        {'<script>'}<br/>
        {'  const options = {'}<br/>
        {'    designColor: "#b49132", // Custom primary color'}<br/>
        {'    textColor: "#222222", // Custom text color'}<br/>
        {'    background: "transparent", // Background color (default is transparent)'}<br/>
        {'    fontFamily: "Arial, sans-serif", // Font family'}<br/>
        {'    borderEnabled: false, // Enable/disable border'}<br/>
        {'    shadowEnabled: false, // Enable/disable shadow'}<br/>
        {'    inputStyles: "width: 100%; padding: 10px; border-radius: 5px; font-size: 16px;",'}<br/>
        {'    textareaStyles: "width: 100%; padding: 10px; border-radius: 5px; font-size: 16px; height: 100px;",'}<br/>
        {'    buttonStyles: "width: 100%; padding: 12px; border-radius: 5px; font-size: 16px; cursor: pointer; color: #FFF; border: none;",'}<br/>
        {'    labelStyles: "display: block; font-weight: bold; margin-bottom: 5px;",'}<br/>
        {'  };'}<br/><br/>

        {'  new DynamicForm("lead-form", "'+ formId +'", options);'}<br/>
        {'</script>'}
      </pre>
      <br/>
      <h5 className="title">Or use the form link</h5>
      <pre>
        http://localhost:3000/form/{formId}
      </pre>
    </div>
  );
};

export default ViewSurveyForm;