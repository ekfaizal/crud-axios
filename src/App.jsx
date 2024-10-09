import "./App.css";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

function App() {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedId, setSelectedId] = useState("");
  const [input, setInput] = useState({});
  const [students, setStudents] = useState([]);


  const handleClose = () => {
    setInput({});
    setShow(false);
  };
  const handleShow = () => {
    setMode("add");
    setShow(true);
  };

  
  const getData = () => {
    axios
      .get("https://rest-backend-prosevo.onrender.com/students")
      .then((res) => {
        setStudents(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("data loading");
  };
  const handleChange = (event) => {
    const id = event.target.name;
    const value = event.target.value;
    setInput({ ...input, [id]: value });
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const newStudent = {
      name: input.name,
      age: input.age,
      class: input.class,
      subject: input.subject,
    };

    if (mode === "add") {
      axios
        .post("https://rest-backend-prosevo.onrender.com/students", newStudent)
        .then((response) => {
          setUpdate(!update);
          console.log(response.status, response.data);
          handleClose();
        });
    } else if (mode === "edit") {
      axios
        .put(
          `https://rest-backend-prosevo.onrender.com/students/${selectedId}`,
          newStudent
        )
        .then((response) => {
          setUpdate(!update);
          console.log(response.status, response.data);
          handleClose();
        });
    }
    setInput({});
  };

  const handleShowEdit = (index) => {
    setMode("edit");
    setShow(true);

    const studentsDetails = students[index];
    console.log(studentsDetails);
    setInput({ ...studentsDetails });

    setSelectedId(studentsDetails._id);
  };
  const handleDelete = (index) => {

    axios
      .delete(`https://rest-backend-prosevo.onrender.com/students/${index}`)
      .then((response) => {
        
        setStudents(students.filter((item) => item._id !== index));
        console.log("Item deleted successfully:", response);
      })
      .catch((error) => {
        console.error("There was an error deleting the item!", error);
      });
  };
  
  const [update, setUpdate] = useState(false);
  useEffect(getData, [update]);
  return (
    <div className="App font-monospace">
      <Container>
        <h1>Student List</h1>
        <Button variant="success" onClick={handleShow}>
          Add Student
        </Button>

        <ListGroup className="mt-3">
          {students.map((item, index) => (
            <ListGroup.Item
              key={item._id}
              className="d-flex justify-content-between"
            >
              Name :{item.name}, Age :{item.age}, Class :{item.class}, Subject :
              {item.subject}
              <div>
                <Button
                  className="m-2"
                  variant="primary"
                  onClick={() => handleShowEdit(index)}
                >
                  Update
                </Button>
                <Button variant="danger" onClick={() => handleDelete(item._id)}>
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlesubmit}>
            <Form.Label>Name </Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Name"
              name="name"
              value={input.name}
              onChange={handleChange}
            />
            <Form.Label>age </Form.Label>
            <Form.Control
              type="number"
              placeholder="Age"
              required
              name="age"
              value={input.age}
              onChange={handleChange}
            />
            <Form.Label>Class </Form.Label>
            <Form.Control
              type="text"
              placeholder="Class"
              required
              name="class"
              value={input.class}
              onChange={handleChange}
            />
            <Form.Label>subject </Form.Label>
            <Form.Control
              type="text"
              placeholder="Subject"
              required
              name="subject"
              value={input.subject}
              onChange={handleChange}
            />
            <Button className="m-2" type="submit" variant="success">
              {mode === "add" ? "Add Student" : "Edit student"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
