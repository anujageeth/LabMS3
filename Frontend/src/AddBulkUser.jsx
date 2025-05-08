import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./AddItem.css";

function BulkImport() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("csv", file);
    
    try {
      const response = await axios.post("http://10.50.227.93:3001/api/users/bulk-import", formData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setResults(response.data);
    } catch (error) {
      alert("Bulk import failed: " + error.message);
    }
    setLoading(false);
  };

  const handleBulkCancelClick = () => {
    navigate("/usermanage2");
  };

  const handleSingleUploadClick = () => {
    navigate("/adduser");
  };

  return (
    <div className="loginPage">
        <div className="fullBox">
            <div className="overlay"></div>
            <div className="loginBox" id="addUserBox">

                <div className="bulk-import">
                    <h2 className="loginTitle">Add a bulk</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="addItemImageBox">
                            <input
                            className="addImageBtn"
                                type="file"
                                accept=".csv"
                                onChange={(e) => setFile(e.target.files[0])}
                                required
                            />
                            </div>
                        <button type="submit" disabled={loading} className="loginBtn" id="saveUserBtn">
                            {loading ? "Processing..." : "Upload CSV"}
                        </button>
                        <br /><br />
                        <button type="button" className="loginBtn" onClick={handleSingleUploadClick}>
                            <b>Add one by one</b>
                        </button>
                        <button type="button" className="loginBtn" onClick={handleBulkCancelClick}>
                            <b>Cancel</b>
                        </button>
                    </form>

                    {results && (
                        <div className="results">
                        <h3>Import Results</h3>
                        <p>Successfully imported: {results.successCount}</p>
                        <p>Failed imports: {results.errorCount}</p>
                        
                        {results.errors.length > 0 && (
                            <div className="errors">
                                <h4>Errors:</h4>
                                {results.errors?.map((errObj, index) => (
                                    <div key={index}><b>Error:</b> {errObj.error}</div>
                                ))}

                            </div>
                        )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    </div>




    
  );
}

export default BulkImport;