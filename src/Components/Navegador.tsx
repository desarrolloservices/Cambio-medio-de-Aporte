import { Button, Grid } from '@mui/material';
import React, { useContext } from 'react';
import { FormContext } from '../Context/FormContext';


interface Props {
    // Propiedades del componente
}

const Navegador: React.FC<Props> = () => {

    const {handleBack,handleNext,activeStep} = useContext(FormContext);

    return (
        <Grid container mt={5} mb={5}>
            {
                activeStep === 0 ? <Grid item xs={12}>
                <Button variant='outlined'>Solicitar</Button>
                </Grid> : null
            }
            {
                activeStep >= 1 && activeStep < 2 ? <><Grid item xs={6}>
                <Button onClick={handleBack} variant='outlined'>Regresar</Button>
                </Grid>
                <Grid item xs={6}>
                <Button onClick={handleNext} variant='outlined'>Siguiente</Button>
                </Grid>
                </> : null
            }
            {
                activeStep === 2 ? <Grid item xs={12}>
                <Button onClick={handleBack} variant='outlined'>Regresar</Button>
                </Grid> : null
            }
        
            
       </Grid>
    );
};

export default Navegador;
