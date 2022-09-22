import {Endpoint} from "../forms/ConfigConnectionForm";
import {useCallback, useEffect, useState} from "react";
import {debounce} from "../utilities/debounce";
import axios from "axios";

const useApiValidation = (data: Endpoint, path: string) => {
    const [isValid, setValidApi] = useState<boolean>(false);

    const testApi = useCallback(debounce(1000,async () => {
        const { port, protocol, address } = data;
        try {
            const { status } = await axios.get(`${protocol}://${address}:${port}/${path}`)
            if(status === 200) {
                setValidApi(true);
            }
        } catch (e: any) {
            setValidApi(false);
        }
    }), [data, path]);

    useEffect(() => {
        const isComplete = Object.values(data).every(
            value => !!value
        );

        if(!isComplete) {
            setValidApi(false);
            return;
        }

        void testApi();

    }, [data.address, data.port, data.protocol]);

    return isValid;
}

export default useApiValidation;