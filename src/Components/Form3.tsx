import React, { useContext } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  ButtonGroup,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FormContext } from "../Context/FormContext"; // Import the FormContext
import Navegador from "./Navegador";

interface Props {
  // Propiedades del componente
}

const Form3: React.FC<Props> = (props) => {
  // Lógica del componente
  const { formData, handleInputChange, handleNext, handleBack, activeStep } =
    useContext(FormContext); // Use the FormContext

  const columns: GridColDef[] = [
    { field: "id", headerName: "No", width: 100 },
    { field: "firstName1", headerName: "1er. Nombre 1", width: 150 },
    { field: "firstName2", headerName: "2do. Nombre", width: 150 },
    { field: "lastName1", headerName: "1er. Apellido", width: 150 },
    { field: "lastName2", headerName: "2do. Apellido", width: 150 },
    { field: "relationship", headerName: "Parentesco", width: 150 },
    { field: "identificationNo", headerName: "No de Identificación", width: 200 },
    { field: "birthdate", headerName: "Fecha de Nacimiento", width: 200 },
    { field: "percentage", headerName: "%", width: 100 },
  ];

  const rows = [
    { id: 1, firstName1: "John", firstName2: "Doe", lastName1: "Smith", lastName2: "Johnson", relationship: "Spouse", identificationNo: "123456789", birthdate: "1990-01-01", percentage: "50%" },
    { id: 2, firstName1: "Jane", firstName2: "Doe", lastName1: "Smith", lastName2: "Johnson", relationship: "Child", identificationNo: "987654321", birthdate: "1995-05-05", percentage: "25%" },
  ];

  return (
    <div>
      <DataGrid rows={rows} columns={columns} autoHeight autoPageSize  />
      <Navegador />
    </div>
  );
};

export default Form3;
