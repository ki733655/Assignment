import axios from "axios";
import "./KhassiDetail.css";
import  { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { MdDelete, } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import KhassiEditForm from "./KhassiEditForm";
// search field imports
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const KhassiDetail = () => {
  const [khassiData, setKhassiData] = useState([]);
  const [editItem, setEditItem] = useState(null); // State to hold the item being edited
  // const [editConfirm, setEditConfirm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");

  // Fetching the data from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/khassi-details");
        setKhassiData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [editItem]);

  // Logic for the delete button
  const handleDelete = async (id) => {
    console.log("Deleting document with ID:", id);
    try {
      // Sending the deletion request
      const response = await axios.delete(
        `http://localhost:3000/khassi-delete/${id}`
      );
      console.log("Deletion response:", response.data);

      // Fetching the updated data after deletion
      const responseAfterDelete = await axios.get(
        "http://localhost:3000/khassi-details"
      );
      console.log("Updated data after deletion:", responseAfterDelete.data);

      // Extracting the data from the response and setting it to the boarData state
      setKhassiData(
        Array.isArray(responseAfterDelete.data) ? responseAfterDelete.data : []
      );
    } catch (error) {
      console.log("Error deleting data:", error);
    }
  };

  // Logic for handleEdit
  const handleEdit = (item) => {
    try {
      setEditItem(item);
    } catch (error) {
      console.log(error);
    }
  };
  //logic for handling the search field
  // Logic for handling the search field
const handleSearch = async (e) => {
  e.preventDefault();
  try {
    if (searchQuery.trim() === "") {
      // If search query is empty, fetch all details
      const response = await axios.get("http://localhost:3000/khassi-details");
      setKhassiData(response.data);
    } else {
      // If search query is not empty, perform search
      const response = await axios.get(
        `http://localhost:3000/khassi-search?search=${searchQuery}`
      );
      setKhassiData(response.data);
    }
  } catch (error) {
    console.log("Error searching data", error);
  }
};


const handleChange = async (e) => {
  const data = e.target.value;
  setSearchQuery(data);
  try {
    if (data.trim() === "") {
      // If search query is empty, fetch all details
      const response = await axios.get("http://localhost:3000/khassi-details");
      setKhassiData(response.data);
    } else {
      // If search query is not empty, perform search
      const response = await axios.get(
        `http://localhost:3000/khassi-search?search=${data}`
      );
      setKhassiData(response.data);
    }
  } catch (error) {
    console.log("Error searching data", error);
  }
};


   

  // }
  return (
    <div className="khassi-detail-main">
      <div className="khassi-detail-2nd">
        <Form inline className="khassi-detail-search">
          <h4 style={{ fontWeight: "600" }}>All khassi details</h4>
          <Row>
            <Col xs="auto" className="khassi-detail-column">
              <Form.Control
                type="text"
                placeholder="Search"
                className=" mr-sm-2"
                value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                onChange={handleChange }
              />
            </Col>
            <Col xs="auto">
              <Button onClick={handleSearch} type="submit">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
        <Table className="khassi-detail-table" responsive bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Room Number</th>
              <th>CSF</th>
              <th>FMD</th>
              <th>Deworm</th>
              <th>Weight</th>
              <th>Actions</th>
            </tr>
          </thead>

          {khassiData.map((value, index) => {
            const CSF = value.CSF
              ? new Date(value.CSF).toLocaleDateString("en-GB")
              : "Null";
            const FMD = value.FMD
              ? new Date(value.FMD).toLocaleDateString("en-GB")
              : "Null";
            const Deworm = value.Deworm
              ? new Date(value.Deworm).toLocaleDateString("en-GB")
              : "Null";

            return (
              <tbody key={index}>
                <tr>
                  <td>{value.id ? value.id : "Null"}</td>
                  <td>{value.roomNumber ? value.roomNumber : "Null"}</td>
                  <td>{CSF}</td>
                  <td>{FMD}</td>
                  <td>{Deworm}</td>
                  <td>{value.Weight ? value.Weight : "Null"}</td>
                  <td className="khassi-detail-logo">
                    <div className="delete-logo">
                      <MdDelete
                        id="delete"
                        onClick={() => handleDelete(value.id)}
                      />
                    </div>
                    <div className="edit logo">
                      <FaEdit
                        id="edit"
                        style={{ marginLeft: "1.5vw" }}
                        onClick={() => handleEdit(value)}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </Table>
        {/* Render the edit form if editItem is not null */}
        {editItem && (
          <KhassiEditForm editItem={editItem} setEditItem={setEditItem} />
        )}
      </div>
    </div>
  );
};

export default KhassiDetail;
