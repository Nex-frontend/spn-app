import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppForm, useHandleSubmitForm } from "~/features/form";
import { kardexQueries } from "../query";
import { KardexSearchByRFC } from "~/shared";


interface RfcFormProps {
    formValues: { rfc: string; qna_fin?: string }
    setFormValues: React.Dispatch<React.SetStateAction<{ rfc: string; qna_fin?: string }>>
}

export const RfcForm = ({ formValues, setFormValues }: RfcFormProps) => {

    const { isLoading } = useQuery(
        kardexQueries.rfcSearch(formValues)
    );

    const form = useAppForm({
        defaultValues: {
            rfc: '',
            qna_fin: ''
        },
        validators: {
            onDynamic: KardexSearchByRFC
        },
        onSubmit: ({ value }) => {
            setFormValues(value);
        }
    });


    const { handleSubmit } = useHandleSubmitForm(form);


    return (
        <form onSubmit={handleSubmit} method="POST">
            <form.AppField name="rfc">
                {
                    (field) => (
                        <field.TextField label="RFC" placeholder="Escribe tu RFC" required />
                    )
                }
            </form.AppField>
            <form.AppField name="qna_fin">
                {
                    (field) => (
                        <field.TextField label="Qna Fin" placeholder="Opcional: Qna Fin" />
                    )
                }
            </form.AppField>
            <form.AppForm>
                <form.SubmitButton
                    fullWidth
                    mt="xl"
                    label="Buscar"
                    isSubmitting={isLoading}
                />
            </form.AppForm>
        </form>
    );

}
