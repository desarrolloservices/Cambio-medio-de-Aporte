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
  FormControlLabel,
  Checkbox,
  createTheme,
  Typography,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormContext } from "../Context/FormContext"; // Import the FormContext
import Navegador from "./Navegador";
import { NumericFormat } from "react-number-format";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import MaskExpiry from "./MaskExpiry";


interface Props {
  // Propiedades del componente
}

// Create a new theme using Nunito Sans
const theme = createTheme({
  typography: {
    fontFamily: "Nunito Sans, Roboto, sans-serif",
  },
  palette: {
    primary: {
      main: "#d8282f",
    },
    secondary: {
      main: "#76777B",
    },
  },
  shape: {
    borderRadius: 13,
  },
});

const Form1: React.FC<Props> = (props) => {
  // Lógica del componente
  const { formData, handleInputChange, handleSelectChange,handleToggle } =
    useContext(FormContext); // Use the FormContext
    
    

  return (
    <form>
      <Grid container spacing={2} rowSpacing={4}>
      <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="cuenta-label">
                      Selecciona tu cuenta
                    </InputLabel>
                    <Select
                      labelId="cuenta-label"
                      id="cuenta"
                      required
                      label="Selecciona tu cuenta"
                    >
                      <MenuItem value={124454}>124454</MenuItem>
                      <MenuItem value={34454}>34454</MenuItem>
                      <MenuItem value={54545}>54545</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
        <Grid item xs={12} sm={12}>
          <Typography align="justify" variant="h6" color={theme.palette.secondary.main}>
            Incrementa tu aporte:
          </Typography>
          <br />
          <NumericFormat
                    required
                    customInput={TextField}
                    label="Monto del Aporte"
                    isAllowed={(values) => {
                      const { floatValue } = values;
                      return floatValue !== undefined && floatValue <= 100000;
                    }}
                    max={100000}
                    min={0}
                    thousandSeparator={true}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                      inputProps: { min: 0, max: 1000000 },
                    }}
                    fullWidth
                  />
        </Grid>
        <Grid item xs={12}  >
          <Typography  variant="h6" align="justify" color={theme.palette.secondary.main}>
            Aumenta tu prima de seguro:
          </Typography>
<br />
      
          <TextField
            name="prima"
            label="Prima de Seguro"
            type="number"
            value={formData.prima}
            onChange={handleInputChange}
            fullWidth
          />
          <Checkbox
          name="tieneSeguro"
          //onChange={handleToggle(value)}
          onChange={handleToggle}
          checked={formData.tieneSeguro}
           />
        </Grid>
       <Grid item xs={12}>
                    
                    {
                      formData.tieneSeguro && (
                        <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {[0, 1, 2, 3].map((value) => {
                          const labelId = `checkbox-list-secondary-label-${value}`;
                         

                          return (
                            <ListItem
                              key={value}
                              secondaryAction={
                                <Checkbox
                                  edge="end"
                                  //onChange={handleToggle(value)}
                                  //checked={formData.tieneSeguro}
                                  inputProps={{ 'aria-labelledby': labelId }}
                                />
                              }
                              disablePadding
                            >
                              <ListItemButton>
                                <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </List>
                      ) 
                    }
      

       </Grid>
       
       
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" align="justify" color={theme.palette.secondary.main}>
            Actualiza tu forma de pago: {formData.formaPago}
          </Typography>

      <br />
          <FormControl fullWidth>
            <InputLabel>Forma de Pago</InputLabel>
            <Select
            multiple={false}
            label="Forma de Pago"
              name="formaPago"
              value={formData.formaPago}
              onChange={handleSelectChange}
            >
              <MenuItem value="Carné" >Carné</MenuItem>
              <MenuItem value="Débito a Tarjeta">Débito a Tarjeta</MenuItem>
             
            </Select>
          </FormControl>
        </Grid>
        {
            formData.formaPago === "Débito a Tarjeta" && (
<>
              <Grid item xs={12} sm={6}>
                  <TextField
                    id="cardnumber"
                    label="Número de la Tarjeta"
                    variant="outlined"
                    type="number"
                    value={formData?.cardnumber}
                    //onChange={handleSelectChange}
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
                  <FormControl>
                  <MaskExpiry 
                    id="expiryDate"
                    name="expiryDate"
                   label="Vence"
                    placeholder="MM / YY"
                    variant="outlined"
                   value={formData.expiryDate}
                    onChange={handleInputChange}
                    fullWidth
                  />
                   
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
         
          <FormControl fullWidth>
            <InputLabel>Día del débito</InputLabel>
            <Select
            multiple={false}
            label="Día del débito"
              name="diaDebito"
              value={formData.diaDebito}
              onChange={handleSelectChange}
            >
              <MenuItem value="02" >02</MenuItem>
              <MenuItem value="03" >03</MenuItem>
              <MenuItem value="04" >04</MenuItem>
              <MenuItem value="05" >05</MenuItem>
              <MenuItem value="06" >06</MenuItem>
              <MenuItem value="07" >07</MenuItem>
              <MenuItem value="08" >08</MenuItem>
              <MenuItem value="09" >09</MenuItem>
              <MenuItem value="10" >10</MenuItem>
              <MenuItem value="11" >11</MenuItem>
              <MenuItem value="12" >12</MenuItem>
              <MenuItem value="13" >13</MenuItem>
              <MenuItem value="14" >14</MenuItem>
              <MenuItem value="15" >15</MenuItem>
              <MenuItem value="16" >16</MenuItem>
              <MenuItem value="17" >17</MenuItem>
              <MenuItem value="18" >18</MenuItem>
              <MenuItem value="19" >19</MenuItem>
              <MenuItem value="20" >20</MenuItem>
              <MenuItem value="21" >21</MenuItem>
              <MenuItem value="22" >22</MenuItem>
              <MenuItem value="23" >23</MenuItem>
              <MenuItem value="24" >24</MenuItem>
              <MenuItem value="25" >25</MenuItem>
              <MenuItem value="26" >26</MenuItem>
              <MenuItem value="27" >27</MenuItem>
              <MenuItem value="28" >28</MenuItem>
             
            </Select>
          </FormControl>
        </Grid>
                </>
            )
        }
        
        <Navegador />
      </Grid>
    </form>
  );
};

export default Form1;
