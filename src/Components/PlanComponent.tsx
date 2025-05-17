import React, { FC } from 'react';
import { Plan } from '../Interfaces/Tipos';
import { Card, CardActionArea, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';

interface Props {
  
    Plan:Plan;
}

const PlanComponent: FC<Props> = ({ Plan }) => {
    

    return (
        
        <Card sx={{ maxWidth:150 }}>
        <CardActionArea>
          <CardHeader 
            title={Plan.nombre}
            subheader="Selecciona este Plan"

          />

          
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
             Suma Asegurada: {Plan.sumaAsegurada}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Prima a pagar: {Plan.prima}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
};

export default PlanComponent;