import { Extras, Fisicos } from '@/types';

type DocumentosNoPrazoProps = {
  documents: Extras[] | Fisicos[];
  tipo: 'físicos' | 'extrajudiciais';
};

export function DocumentosNoPrazo({ documents, tipo }: DocumentosNoPrazoProps) {
  console.log(`Documentos recebidos (${tipo}):`, documents);
  
  // Mostra a estrutura completa do primeiro documento para debug
  if (documents.length > 0) {
    console.log('Estrutura do primeiro documento:', JSON.stringify(documents[0], null, 2));
  }
  
  // Filtra documentos no prazo (não vencidos)
  const hoje = new Date();
  console.log("Data atual:", hoje.toISOString());
  
  const documentosNoPrazo = documents.filter(doc => {
    try {
      // Converte a string de data para objeto Date se necessário
      const prazo = doc.deliveryDeadLine instanceof Date ? 
        doc.deliveryDeadLine : 
        new Date(doc.deliveryDeadLine);
      
      // Calcula os dias restantes, independente se o valor vem da API
      const diasRestantes = calcularDiasRestantes(prazo);
      
      console.log(`Documento ID: ${doc.idDocument}, Prazo: ${prazo.toISOString()}, Dias API: ${doc.countDaysDeLivery}, Dias calculados: ${diasRestantes}`);
      
      // Verifica apenas se o prazo é maior que hoje (futuro) 
      return prazo > hoje;
    } catch (error) {
      console.error(`Erro ao processar documento ${doc.idDocument}:`, error);
      return false;
    }
  });
  
  console.log(`Documentos filtrados (${tipo}):`, documentosNoPrazo);

  // Se não houver documentos após a filtragem, tenta mostrar todos
  if (documentosNoPrazo.length === 0 && documents.length > 0) {
    console.log(`Nenhum documento passou no filtro. Exibindo todos os ${documents.length} documentos.`);
    return (
      <div className="overflow-hidden">
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="mb-2 text-sm text-orange-600">
                Atenção: Todos os documentos estão sendo exibidos (ignorando prazos).
              </div>
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
                  {documents.map((doc) => (
                    <tr key={doc.idDocument}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {doc.idDocument}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatDate(doc.receivedAt)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatDate(doc.deliveryDeadLine)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {calcularDiasRestantes(doc.deliveryDeadLine)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                        {formatDate(doc.receivedAt)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatDate(doc.deliveryDeadLine)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {calcularDiasRestantes(doc.deliveryDeadLine)}
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

// Função para calcular dias restantes até uma data
function calcularDiasRestantes(dataPrazo: Date | string | undefined): number {
  try {
    if (!dataPrazo) return 0;
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Resetar horas para comparação justa de dias
    
    // Garantir que estamos trabalhando com um objeto Date
    let prazo: Date;
    if (dataPrazo instanceof Date) {
      prazo = dataPrazo;
    } else {
      // Se for string, converter para Date e aplicar ajuste de timezone
      const tempDate = new Date(dataPrazo);
      // Aplicar o mesmo ajuste que é usado nas páginas Extras e Fisicos
      prazo = tempDate; // A data já foi ajustada no Dashboard antes de chegar aqui
    }
    
    prazo.setHours(0, 0, 0, 0); // Resetar horas para comparação justa de dias
    
    // Diferença em milissegundos
    const diff = prazo.getTime() - hoje.getTime();
    
    // Converter para dias (1 dia = 24 * 60 * 60 * 1000 ms)
    return Math.ceil(diff / 86400000); // Usar o mesmo formato que as outras páginas
  } catch (error) {
    console.error('Erro ao calcular dias restantes:', error);
    return 0;
  }
}

// Função auxiliar para formatar datas de forma segura
function formatDate(date: Date | string | undefined): string {
  try {
    if (!date) return 'Data não disponível';
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('pt-BR');
  } catch (error) {
    console.error('Erro ao formatar data:', date, error);
    return 'Formato de data inválido';
  }
}