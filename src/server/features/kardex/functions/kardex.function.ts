import { createServerFn } from "@tanstack/react-start";
import { KardexSearchByRFC } from "~/shared";
import { kardex } from "..";


export const getPaymentCodeByRFC = createServerFn()
    .inputValidator(KardexSearchByRFC)
    .handler(async ({ data }) => {
        console.log(data);
        return await kardex.cases.getPaymentCodeByRFC(data);
    })