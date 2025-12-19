import { RefundErrors, RefundTypes, StatusAviable } from './types';

//  ====================================
//  ========== ESTATUS =================
//  ====================================

//  0 - Sin Reintegro
//  1 - Capturado
//  2 - Existe en Empleado Plaza Concepto
//  3 - Existe en Responsabilidades
//  4 - Cierre de vigencia
//  5 - Eliminación de responsabilidades
//  6 - Borrado en otro consecutivo

export const statusAviable: StatusAviable[] = ['1', '4', '5', '6'];

export const status: Record<string, StatusAviable> = {
  create: '1',
  close: '4',
  responsabilities: '5',
  other: '6',
} as const;

export const statusMapped: Record<StatusAviable, RefundTypes> = {
  '1': 'creacion',
  '4': 'cierre_vigencia',
  '5': 'eliminacion_responsabilidades',
  '6': 'borrado_otro_consecutivo',
};

export const errorMapped: Record<string, RefundErrors> = {
  notFound: 'RFC no encontrado',
  notFoundEPC: 'RFC no encontrado en EPC',
  notFoundPaycodeEPC: 'RFC, plaza no encontrada en EPC',
};
