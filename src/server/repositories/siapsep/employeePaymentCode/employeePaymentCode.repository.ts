import { db } from "~/server/db"
import { EmployeePaymentCodeI } from "./employeePaymentCode.interface"


export const getManyByRFCANDQNA_FIN = async (rfc: string, qna_fin: string) => {
    return await db.siapsep.execute<EmployeePaymentCodeI>({
        query: 'SELECT * FROM emp_plaza WHERE rfc LIKE ? AND qna_fin LIKE ?',
        args: [`${rfc}%`, `${qna_fin}%`]
    })
}