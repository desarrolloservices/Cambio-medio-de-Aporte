// Form1.tsx
import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Typography,
  Button,
  Box,
  Stack,
  TextField,
  OutlinedInput,
} from "@mui/material";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { FormContext } from "../Context/FormContext";
import { planes, Bancos } from "../CustomData/Planes";
import { ClienteData, ClienteDataUpdate, cuenta, Plan } from "../Interfaces/Tipos";
import useTwilio from "../Hooks/UseTwlo";
import useExtractRawData from "../Hooks/useExtractRawData";
import useValidateToken from "../Hooks/UseValidateTk";
import VeriffComponentNew from "./VeriffDialogoNew";
import VeriffStatusChecker from "./ValidateSession";
import { useClienteContext } from "../Context/ClienteContext";
import { IMaskInput } from "react-imask";
import { InfoInsert1 } from "../Data/GetDatosClientes";
import UseDeleteCard from "../Hooks/UseDeleteCard";
import { useEditDialog } from "../Context/EditDialogContext";
import EditDialog from "./EditDialog";


interface Props {
  listCuentas: cuenta[];
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const TextMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="00/0000"
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  }
);

const Form1: React.FC<Props> = ({ listCuentas }) => {
  const { isValid, isOVP } = useValidateToken();
  const { cliente } = useClienteContext();
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const { deleteCard, loading, error } = UseDeleteCard();
  const { formData, handleInputChange, handleSelectChange, setFormData } =
    useContext(FormContext);

  const [veriffSessionId, setVeriffSessionId] = useState<string | null>(null);
  const [veriffStarted, setVeriffStarted] = useState(false);
  const [veriffApproved, setVeriffApproved] = useState(false);
  const [veriffError, setVeriffError] = useState(false);
  const [veriffShouldCheck, setVeriffShouldCheck] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const { openDialog } = useEditDialog();

  const [planSeleccionado, setPlanSeleccionado] = useState<Plan>(planes[0]);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<cuenta>(
    listCuentas.length > 0 ? listCuentas[0] : ({} as cuenta)
  );

  const { rawData, loadingData } = useExtractRawData({
    cuenta: cuentaSeleccionada.cuenta,
    trigger: reloadTrigger,
  });

  const handleSubmit = async () => {
    const cardData: ClienteData = {
      Tarjeta: formData.cardnumber,
      Aporte: formData.aporte,
      Monto: formData.monto,
      Contrato: cuentaSeleccionada.contrato,
      MonedaCCI: cuentaSeleccionada.moneda,
      DiaDebito: formData.diaDebito,
      Identidad: "0601199002463",
      CCI: cuentaSeleccionada.cuenta,
      Email: cliente?.Correo ?? "",
      NombreCliente: cliente?.Nombre ?? "",
      Banco: formData.banco,
      Vencimiento: formData.expiryDate.replace("/", ""),
      TipoDebito: "TC",
      Modalidad: cuentaSeleccionada.modalidad,
    };
  
    console.log("Card data a enviar:", cardData);
    InfoInsert1.InsertInfo(cardData);
    setShowCardForm(false); // opcional, ocultar el form de tarjeta
setReloadTrigger((prev) => !prev); // fuerza recarga del useEffect del hook
    // Aquí puedes hacer el POST con 
  };

  const handleEdit = (row: any) => {
    
    openDialog({
      ...row,
      Contrato: cuentaSeleccionada.contrato,
      Modalidad: cuentaSeleccionada.modalidad,
      MonedaCCI: cuentaSeleccionada.moneda,
      CCI: cuentaSeleccionada.cuenta,
      Email: cliente?.Correo ?? "",
      NombreCliente: cliente?.Nombre ?? "",
      Identidad: "0601199002463",
    });
  };


  useEffect(() => {
    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        prima: planSeleccionado.prima,
        sumaAsegurada: planSeleccionado.sumaAsegurada,
        cuenta: cuentaSeleccionada.cuenta,
        moneda: cuentaSeleccionada.moneda,
        aporte: cuentaSeleccionada.aporte.toString(),
        contrato:cuentaSeleccionada.contrato,
        modalidad:cuentaSeleccionada.modalidad
      }));
    }
  }, [cuentaSeleccionada]);

  useEffect(() => {
    if (cliente && setFormData) {
      setFormData((prev) => ({
        ...prev,
        nombre: cliente.Nombre,
        email: cliente.Correo,
      }));
    }
  }, [cliente]);

  useEffect(() => {
    if (veriffStarted && veriffSessionId && !veriffApproved && !veriffShouldCheck) {
   
      setVeriffShouldCheck(true);
    }
  }, [veriffStarted, veriffSessionId]);

  const handleAddCard = () => setShowCardForm(true);

 
  const maskCardNumber = (cardNumber: string) => `•••• •••• •••• ${cardNumber.slice(-4)}`;

  //const handleEdit = (row: any) => alert(`Editando: ${JSON.stringify(row, null, 2)}`);
  const handleDelete = async (row: any) => {
  
    const confirm = window.confirm("¿Estás seguro de eliminar esta tarjeta?");
    if (!confirm) return;
  
    const cardToDelete: ClienteDataUpdate = {
      ID: String(row.ID ?? ""),
      Tarjeta: row.Tarjeta,
      Aporte: "MENSUAL",
      Monto:  String(row.Monto),
      Contrato: cuentaSeleccionada.contrato,
      MonedaCCI: cuentaSeleccionada.moneda,
      DiaDebito: row.DiaDebito,
      Identidad: "0601199002463", 
      CCI: cuentaSeleccionada.cuenta,
      Email: cliente?.Correo ?? "",
      NombreCliente: cliente?.Nombre ?? "",
      Banco: row.Banco || formData.banco, 
      Vencimiento: row.FechaVencimiento?.replace("/", "") ?? "", 
      TipoDebito: "TC",
      Modalidad: cuentaSeleccionada.modalidad || "",
      Estado: "I",
    };
  
    
    await deleteCard(cardToDelete);
    setReloadTrigger((prev) => !prev); 
    
  };

  const columns: GridColDef[] = [
    {
      field: "Tarjeta",
      headerName: "Tarjeta",
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => maskCardNumber(params.row.Tarjeta),
    },
    {
      field: "DiaDebito",
      headerName: "Día Débito",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "TipoDebito",
      headerName: "Tipo Débito",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Stack direction="row" spacing={1} justifyContent="flex-end" width="100%">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row)}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleAddCard()}
          >
            Agregar
          </Button>
          <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleDelete(params.row)}
        >
          Eliminar
        </Button>
        </Stack>
      ),
    },
  ];

  const CustomNoRowsOverlay = ({ onAddCard }: { onAddCard: () => void }) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: 2,
      }}
    >
      <Typography variant="body2" sx={{ mb: 2 }}>
        No hay métodos de pago registrados.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<CreditCardIcon />}
        onClick={onAddCard}
      >
        Agregar método de pago
      </Button>
    </Box>
  );

  return (
    <>
    <form>
      {isOVP && (
        <Grid container mt={5} mb={5}>
          <Grid item xs={12}>
            {(!veriffApproved || veriffError) && (
              <VeriffComponentNew
                onSessionCreated={setVeriffSessionId}
                onVeriffStarted={() => {
                  setVeriffStarted(true);
                  setVeriffError(false);
                }}
              />
            )}
          </Grid>

          {veriffShouldCheck && veriffSessionId && (
            <VeriffStatusChecker
              sessionId={veriffSessionId}
              onApproved={() => {
                setVeriffApproved(true);
                setVeriffShouldCheck(false);
              }}
              onRejected={() => {
                setVeriffError(true);
                setVeriffShouldCheck(false);
              }}
            />
          )}
        </Grid>
      )}

      {(veriffApproved || isOVP) && (
        <Grid container spacing={2} rowSpacing={4} top={4} mb={5}>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="cuenta-label">Selecciona tu cuenta</InputLabel>
              <Select
                labelId="cuenta-label"
                id="cuenta"
                required
                name="cuenta"
                label="Selecciona tu cuenta"
                onChange={(e) => {
                  const cuenta = e.target.value;
                  const encontrada = listCuentas.find((c) => c.cuenta === cuenta);
                  if (encontrada) setCuentaSeleccionada(encontrada);
                }}
                value={formData?.cuenta || ""}
                startAdornment={
                  <InputAdornment position="start">
                    <SavingsRoundedIcon />
                  </InputAdornment>
                }
              >
                {listCuentas.map((cuenta) => (
                  <MenuItem value={cuenta.cuenta} key={cuenta.cuenta}>
                    {cuenta.cuenta}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
              Tus métodos de pago:
            </Typography>
            <DataGrid
              rows={rawData}
              columns={columns}
              getRowId={(row) => row.ID}
              autoHeight
              disableColumnMenu
              disableRowSelectionOnClick
              hideFooterPagination={rawData.length <= 5}
              pageSizeOptions={[5, 10]}
              components={{
                NoRowsOverlay: () => (
                  <CustomNoRowsOverlay onAddCard={handleAddCard} />
                ),
              }}
            />
          </Grid>

          {showCardForm && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="cardnumber"
                  name="cardnumber"
                  label="Número de la Tarjeta"
                  variant="outlined"
                  type="number"
                  value={formData?.cardnumber || ""}
                  onChange={handleInputChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCardIcon />
                      </InputAdornment>
                    ),
                  }}
                  required
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Fecha de Expiración</InputLabel>
                  <OutlinedInput
                    value={formData.expiryDate}
                    label="Fecha de Expiración"
                    onChange={handleInputChange}
                    placeholder="MM/YYYY"
                    name="expiryDate"
                    id="expiryDate"
                    inputComponent={TextMaskCustom as any}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3}>
  <TextField
    id="monto"
    name="monto"
    label="Monto del Aporte"
    variant="outlined"
    type="number"
    value={formData.monto}
    onChange={handleInputChange}
    fullWidth
    required
  />
</Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Día del débito</InputLabel>
                  <Select
                    label="Día del débito"
                    name="diaDebito"
                    value={formData.diaDebito}
                    onChange={handleSelectChange}
                  >
                    {[...Array(27)].map((_, i) => {
                      const val = (i + 2).toString();
                      return (
                        <MenuItem value={val} key={val}>
                          {val}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
    <FormControl fullWidth>
      <InputLabel>Tipo de Aporte</InputLabel>
      <Select
        label="Tipo de Aporte"
        name="aporte"
        value={formData.aporte}
        onChange={handleSelectChange}
      >
        <MenuItem value="">Seleccionar...</MenuItem>
        <MenuItem value="MENSUAL">MENSUAL</MenuItem>
        <MenuItem value="UNICO">ÚNICO</MenuItem>
      </Select>
    </FormControl>
  </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Banco Emisor</InputLabel>
                  <Select
                    label="Banco Emisor"
                    name="banco"
                    value={formData.banco}
                    onChange={handleSelectChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <AccountBalanceIcon />
                      </InputAdornment>
                    }
                  >
                    {Bancos.map((banco) => (
                      <MenuItem value={banco} key={banco}>
                        {banco}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSubmit}
                >
                  Ingresar
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      )}
    </form>
    <EditDialog onUpdateSuccess={() => setReloadTrigger((prev) => !prev)} />
    </>
  );
};

export default Form1;

