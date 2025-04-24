import { useState, useEffect } from "react";
import { InfoProductos1 } from "../Data/GetDatosClientes";
import { cuenta } from '../Interfaces/Tipos';
import Cookies from "js-cookie";

const useProductos = () => {
    const [listCuentas, setListCuentas] = useState<cuenta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getProductos = async () => {
            // Esperar que la cookie esté disponible
            let retries = 0;
            let token = Cookies.get("tokenid");

            while (!token && retries < 10) {
                await new Promise((res) => setTimeout(res, 100));
                token = Cookies.get("tokenid");
                retries++;
            }

            if (!token) {
                setError("Token no disponible.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            let productosLoad: cuenta[] = [];

            try {
                const respuestaProductos = await InfoProductos1.obtieneInfo();
                respuestaProductos.data.forEach((producto: any) => {
                    const apseguro = producto.aplica_seguro === "S";
                    const tipo = producto.tipo;
                    const estado = producto.estado;
                    const modalidad = tipo.split('|').pop()?.trim();
                    if (
                        (tipo.substring(0, 3) === "CON" ||
                            tipo.substring(0, 3) === "Pen") &&
                        estado !== 'L'
                    ) {
                        const monedaP = producto.moneda === "LPS" ? "LEMPIRAS" : "DOLARES";

                        productosLoad.push({
                            cuenta: producto.descripcion,
                            tiene_seguro: apseguro,
                            prima: producto.prima_seguro,
                            forma_pago: producto.forma_pago,
                            moneda: monedaP,
                            aporte: producto.aporte,
                            contrato:producto.contrato,
                            modalidad:modalidad
                        });
                    }
                });
                setListCuentas(productosLoad);
            } catch (err) {
                setError("Error al cargar las cuentas. Por favor, intenta de nuevo más tarde.");
               
            } finally {
                setLoading(false);
            }
        };

        getProductos();
    }, []);

    return {
        listCuentas,
        loading,
        error,
    };
};

export default useProductos;
