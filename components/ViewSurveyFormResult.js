import { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";

const ViewSurveyFormResult = ({ form }) => {
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [columns, setColumns] = useState([]);


  createTheme("dark", {
      background: {
        default: "transparent",
        color: "#000",
      },
    });

  const fetchResult = async (page) => {
    setLoading(true);

    const response = await axios.get(
      `/api/get-web-form-result?formId=${form.id}&page=${page}&per_page=${perPage}`
    );

    setData(response.data.data);
    setTotalRows(response.data.count);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    fetchResult(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    const response = await axios.get(
      `/api/get-web-form-result?formId=${form.id}&page=${page}&per_page=${perPage}`
    );

    setData(response.data.data);
    setPerPage(newPerPage);
    setLoading(false);
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/export-form-resp?formId=${form.id}`);
      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "results.xlsx"); // File name
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  useEffect(() => {
    fetchResult(1); // fetch page 1 of result
  }, []);

  useEffect(() => {
    if (form?.data) {
      const formData = JSON.parse(form.data);
      
      const dynamicColumns = formData.questions.map((question) => ({
        name: question.question,
        selector: (row) => {
          const value = row.data[question.question];
          return Array.isArray(value) ? value.join(", ") : value || "N/A";
        },
        sortable: true,
      }));
  
      setColumns(dynamicColumns);
    }
  }, [form]); 


  return (
            <div style={{ width: "100%", margin: "0 auto" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "10px",
                }}
              >
                <button
                  onClick={handleExport}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Download Result
                </button>
              </div>
              <DataTable
                title={``}
                columns={columns}
                data={data}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                theme="light"
              />
            </div>
          
  );
};

export default ViewSurveyFormResult;