import { repository } from "~/server/repositories"

export const getPaymentCodeByRFC = async (params: { rfc: string; qna_fin?: string }) => {
    return await repository.siapsep.employeePaymentCode.getManyByRFC(params)
}