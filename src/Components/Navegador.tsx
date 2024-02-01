import { Button, Grid } from '@mui/material';
import React, { useContext } from 'react';
import { FormContext } from '../Context/FormContext';
import { act } from 'react-dom/test-utils';

interface Props {
    // Propiedades del componente
}

const Navegador: React.FC<Props> = () => {

    const {handleBack,handleNext,activeStep} = useContext(FormContext);

    return (
        <Grid container mt={5}>
            {
                activeStep === 0 ? null : <Grid item xs={6}>
                <Button onClick={handleBack}>Regresar</Button>
              </Grid >
            }
            {
                activeStep === 3 ? null : <Grid item xs={6}>
            <Button onClick={handleNext}>Siguiente</Button>
            </Grid>
            }
        
            
       </Grid>
    );
};

export default Navegador;
