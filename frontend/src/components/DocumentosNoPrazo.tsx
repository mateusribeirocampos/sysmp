type Document = {
  idDocument: string;
  receivedAt: Date;
  DeliveryDeadline: Date;
  countDaysDelivery: number;
  message?: string;
};

type DocumentosNoPrazoProps = {
  documents: Document[];
  tipo: 'físicos' | 'extrajudiciais';
};

export function DocumentosNoPrazo({ documents, tipo }: DocumentosNoPrazoProps) {
  // Filtra documentos no prazo (não vencidos e não entregues)
  const documentosNoPrazo = documents.filter(doc => {
    const hoje = new Date();
    return doc.DeliveryDeadline > hoje && doc.countDaysDelivery > 0;
  });

  return (
    <div className="overflow-hidden">
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    ID
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Data Recebimento
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Prazo
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Dias Restantes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {documentosNoPrazo.length > 0 ? (
                  documentosNoPrazo.map((doc) => (
                    <tr key={doc.idDocument}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {doc.idDocument}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {doc.receivedAt.toLocaleDateString('pt-BR')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {doc.DeliveryDeadline.toLocaleDateString('pt-BR')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {doc.countDaysDelivery}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      Não há documentos {tipo} no prazo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 