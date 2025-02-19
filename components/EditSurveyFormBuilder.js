import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';

const EditSurveyFormBuilder = ({ data }) => {
  const router = useRouter();
  
  const [formId, setFormId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormId(data.id || "");
      setFormTitle(data.name || "");
      setFormDesc(data.description || "");
      const q = JSON.parse(data.data || "{}");
      setQuestions(q.questions || []);
    }
  }, [data]); // Runs when `data` changes

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", answerType: "text", id: Date.now(), options: [] },
    ]);
  };

  const handleQuestionChange = (index, key, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][key] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options.push("");
    setQuestions(updatedQuestions);
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((question) => question.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/update-web-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formId, formTitle, formDesc, questions }),
      });

      if (response.ok) {
        alert("Web Form Updated");
        router.refresh();
      } else {
        alert("Error occurred while updating form");
      }
    } catch (error) {
      console.error("Error updating agent:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!data) return null; // Prevent rendering until `data` is available

  return (
    <div className="form_container" style={{ width: "70%" }}>
      <div className="form_group">
        <input
          type="text"
          className="full_width"
          placeholder="Web Form Title"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
        />
      </div>
      <br />
      <div className="form_group">
        <textarea
          type="text"
          className="full_width"
          placeholder="Web Form Description"
          value={formDesc}
          onChange={(e) => setFormDesc(e.target.value)}
        />
      </div>
      <br />
      {questions.map((question, index) => (
        <div className="form_group" key={question.id}>
          <input
            type="text"
            className="full_width"
            placeholder="Enter question"
            value={question.question}
            onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
          />
          <br /><br />
          <select
            className="full_width"
            value={question.answerType}
            onChange={(e) => handleQuestionChange(index, "answerType", e.target.value)}
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="number">Number</option>
            <option value="textarea">Text Area</option>
            <option value="radio">Radio Button</option>
            <option value="checkbox">Checkbox</option>
          </select>
          {question.answerType === "radio" || question.answerType === "checkbox" ? (
            <>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <br />
                  <input
                    type="text"
                    className="full_width"
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                  />
                  <br />
                </div>
              ))}
              <br />
              <button onClick={() => addOption(index)} className="techwave_fn_button">
                Add Option
              </button>
            </>
          ) : null}
          <button onClick={() => deleteQuestion(question.id)} className="delete_button">
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <br /><br />
        </div>
      ))}
      <br />
      <button onClick={addQuestion} className="techwave_fn_button">Add Question</button>

      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <div className="form_group">
          <button type="submit" className="techwave_fn_button" aria-readonly={loading}>
            <span>
              Update Form {loading && <FontAwesomeIcon icon={faSpinner} spin={true} />}
            </span>
          </button>
        </div>
      </form>
      <br />
    </div>
  );
};

export default EditSurveyFormBuilder;