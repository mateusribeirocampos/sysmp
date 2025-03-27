export interface Fisicos {
  receivedAt: Date; // dd/mm/yyyy
  idDocument: string; // 25 caracterespdown button with the name of the class of the document
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

export const fisicos: Fisicos[] = [
  {
    receivedAt: new Date(2025, 2, 18), // 18/06/2025
    idDocument: "23011",
    countDaysDelivery: calculateDaysBetween(new Date(2025, 2, 20)),
    DeliveryDeadline: new Date(2025, 2, 20), // 16/06/2025
    internalDelivery: "Ana Silva",
    message: "Contrato anual de manutenção de equipamentos",
  },
  {
    receivedAt: new Date(2025, 3, 16), // 16/06/2025
    idDocument: "23012",
    countDaysDelivery: calculateDaysBetween(new Date(2025, 3, 25)),
    DeliveryDeadline: new Date(2025, 3, 25), // 16/06/2025
    internalDelivery: "Carlos Oliveira",
    message: "Relatório financeiro do Q3 com análise de custos",
  },
  {
    receivedAt: new Date(2025, 5, 1), // 01/06/2025
    idDocument: "23013",
    countDaysDelivery: calculateDaysBetween(new Date(2025, 3, 11)),
    DeliveryDeadline: new Date(2025, 3, 11), // 11/06/2025
    internalDelivery: "Mariana Costa",
    message: "Proposta comercial para parceria estratégica",
  },
  {
    receivedAt: new Date(2025, 5, 1), // 01/06/2025
    idDocument: "23014",
    countDaysDelivery: calculateDaysBetween(new Date(2025, 3, 3)),
    DeliveryDeadline: new Date(2025, 3, 3), // 03/06/2025
    internalDelivery: "Pedro Henrique",
    message: "Relatório de auditoria de conformidade",
  },
  {
    receivedAt: new Date(2025, 5, 1), // 01/06/2025
    idDocument: "23015",
    countDaysDelivery: calculateDaysBetween(new Date(2025, 3, 1)),
    DeliveryDeadline: new Date(2025, 3, 1), // 01/07/2025
    internalDelivery: "Juliana Almeida",
    message: "Atualização do manual de segurança da informação",
  },
  {
    receivedAt: new Date(2025, 5, 1), // 01/06/2025
    idDocument: "23016",
    countDaysDelivery: calculateDaysBetween(new Date(2025, 4, 1)),
    DeliveryDeadline: new Date(2025, 4, 1), // 01/07/2025
    internalDelivery: "Juliana Almeida",
    message: "Atualização do manual de segurança da informação",
  }
];