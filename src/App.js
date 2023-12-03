import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import EditIcon from "@material-ui/icons/EditLocation";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios'; // Import Axios

function App() {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);


  const columns = [
    { title: "ID", field: "id", editable: false },
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Role", field: 'role' },
  ];

  const endpoint = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

  const getData = async () => {
    try {
      const storedData = JSON.parse(localStorage.getItem('tableData')) || [];
      if (storedData.length > 0) {
        setData(storedData);
      } else {
        const response = await axios.get(endpoint);
        const fetchedData = response.data;
        setData(fetchedData);
        localStorage.setItem('tableData', JSON.stringify(fetchedData));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const setDataToLocalStorage = (updatedData) => {
    localStorage.setItem('tableData', JSON.stringify(updatedData));
  }

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="App">
      <MaterialTable
        title=""
        data={data}
        columns={columns}
        icons={{
          Add: () => <AddIcon style={{ color: "blue" }} />,
          Edit: () => <EditIcon style={{ color: "orange" }} />,
          Delete: () => <DeleteIcon style={{ color: "red" }} />
        }}
        editable={{
          onRowAdd: (newRow) =>
            new Promise((resolve, reject) => {
              const updatedRows = [
                ...data,
                { id: Math.floor(Math.random() * 100), ...newRow }
              ];
              setDataToLocalStorage(updatedRows);
              setTimeout(() => {
                setData(updatedRows);
                resolve();
              }, 2000);
            }),
          onRowDelete: (selectedRow) =>
            new Promise((resolve, reject) => {
              const index = selectedRow.tableData.id;
              const updatedRows = [...data];
              updatedRows.splice(index, 1);
              setDataToLocalStorage(updatedRows);
              setTimeout(() => {
                setData(updatedRows);
                resolve();
              }, 2000);
            }),
          onRowUpdate: (updatedRow, oldRow) =>
            new Promise((resolve, reject) => {
              const index = oldRow.tableData.id;
              const updatedRows = [...data];
              updatedRows[index] = updatedRow;
              setDataToLocalStorage(updatedRows);
              setTimeout(() => {
                setData(updatedRows);
                resolve();
              }, 2000);
            })
        }}
        options={{
          actionsColumnIndex: -1,
          addRowPosition: 'first',
          selection: true,
          searchFieldAlignment: "left",
          pageSize: 10,
          pageSizeOptions: [],
          rowStyle: rowData => ({
            backgroundColor: selectedRows.find(row => row.tableData.id === rowData.tableData.id) ? '#E0E0E0' : '',
          }),
          selectionProps: rowData => ({
            color: "primary",
          }),
          headerSelectionProps: {
            color: 'primary' , 
          },
          exportButton: true,
          exportFileName: "Tabledata",     
          responsive: 'standard', 
        }}
        
        actions={[
          {
            tooltip: 'Delete Selected',
            icon: () => <DeleteIcon style={{ color: 'red' }} />,
            onClick: (event, rowData) => {
              const updatedData = [...data];
              selectedRows.forEach((selectedRow) => {
                const index = selectedRow.tableData.id;
                updatedData.splice(index, 1);
              });
              setData(updatedData);
              setSelectedRows([]);
            },
          },
        ]}
        
      />
    </div>
  );
}

export default App;
