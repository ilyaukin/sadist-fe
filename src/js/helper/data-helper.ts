import { DsMeta } from '../model/ds';

export function getMeta(dsId: string): Promise<DsMeta> {
  return fetch(`/ls?id=${dsId}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          throw new Error(data.error || 'Unknown error');
        } else {
          const meta = data.list.find((record: DsMeta) => record.id === dsId);
          if (!meta) {
            throw new Error(`Server did not return record for id=${dsId}`);
          }
          return meta;
        }
      }).catch((e) => {
        throw new Error('Error fetching data: ' + e.toString());
      });
}