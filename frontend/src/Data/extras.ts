export interface Extras {
  receivedAt: Date; // dd/mm/yyyy
  idDocument: string; // 25 caracteres
  countDaysDelivery: number; // number of days to deliver the document (INTEGER) DeliveryDeadline - receivedAt
  DeliveryDeadline: Date; // dd/mm/yyyy
  internalDelivery: string; // dropdown button with the name of the person who will deliver the document
  message: string; // message of the document // text area / text field / 140 caracteres
}

const calculateDaysBetween = (endDate: Date): number => {
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const extras: Extras[] = [
  {
    receivedAt: new Date(2025, 2, 18), // 18/06/2025
    idDocument: '5000428-03.2021.8.13.0460',
    DeliveryDeadline: new Date(2025, 2, 20), // 16/06/2025
    internalDelivery: "Ana Silva",
    message: "Contrato anual de manutenção de equipamentos",
    countDaysDelivery: calculateDaysBetween(new Date(2025, 2, 20))
  },
  {
    receivedAt: new Date(2025, 3, 16), // 16/06/2025
    idDocument: '5000428-03.2021.8.13.0461',
    DeliveryDeadline: new Date(2025, 3, 25), // 16/06/2025
    internalDelivery: "Carlos Oliveira",
    message: "Relatório financeiro do Q3 com análise de custos",
    countDaysDelivery: calculateDaysBetween(new Date(2025, 3, 25))
  },
  {
    receivedAt: new Date(2025, 5, 1), // 01/06/2025
    idDocument: '5000428-03.2021.8.13.0462',
    DeliveryDeadline: new Date(2025, 3, 11), // 11/06/2025
    internalDelivery: "Mariana Costa",
    message: "Proposta comercial para parceria estratégica",
    countDaysDelivery: calculateDaysBetween(new Date(2025, 3, 11))
  },
  {
    receivedAt: new Date(2025, 5, 1), // 01/06/2025
    idDocument: '5000428-03.2021.8.13.0463',
    DeliveryDeadline: new Date(2025, 3, 3), // 03/06/2025
    internalDelivery: "Pedro Henrique",
    message: "Relatório de auditoria de conformidade",
    countDaysDelivery: calculateDaysBetween(new Date(2025, 3, 3))
  },
  {
    receivedAt: new Date(2025, 5, 1), // 01/06/2025
    idDocument: '5000428-03.2021.8.13.0464',
    DeliveryDeadline: new Date(2025, 3, 1), // 01/07/2025
    internalDelivery: "Juliana Almeida",
    message: "Atualização do manual de segurança da informação",
    countDaysDelivery: calculateDaysBetween(new Date(2025, 3, 1))
  }
];


