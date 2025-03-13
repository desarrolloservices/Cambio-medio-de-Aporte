
import { useState, useEffect } from "react";
import { InfoProductos } from "../Data/GetDatosClientes";
import { cuenta } from '../Interfaces/Tipos';

const useProductos = () => {
    const [listCuentas, setListCuentas] = useState<cuenta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getProductos = async () => {
            setLoading(true);
            setError(null);
            let productosLoad: cuenta[] = [];
            try {
                const respuestaProductos = await InfoProductos.obtieneInfo();
                respuestaProductos.data.forEach((producto: any) => {
                    const apseguro = producto.aplica_seguro === "S" ? true : false;
                    const tipo = producto.tipo;
                    const estado = producto.estado;
                    if (
                        (tipo.substring(0, 3) === "CON" ||
                            tipo.substring(0, 3) === "Pen") && estado !== 'L'

                    ) {
                        let monedaP = "L";
                        if (producto.moneda === "LPS") {
                            monedaP = "L";
                        } else {
                            monedaP = "$";
                        }

                        productosLoad.push({
                            cuenta: producto.descripcion,
                            tiene_seguro: apseguro,
                            prima: producto.prima_seguro,
                            forma_pago: producto.forma_pago,
                            moneda: monedaP,
                            aporte: producto.aporte,
                        });
                    }
                });
                setListCuentas(productosLoad);
            } catch (err) {
                setError("Error al cargar las cuentas. Por favor, intenta de nuevo más tarde.");
                console.error("Error getting client data:", err);
            } finally {
                setLoading(false);
            }
        };

        getProductos();
    }, []); // Empty dependency array to run only once on mount

    return {
        listCuentas,
        loading,
        error,
    };
};

export default useProductos;
