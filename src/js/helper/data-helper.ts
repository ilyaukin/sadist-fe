import { ProvidedDs } from '../component/provider/AbstractProvider';
import { DsMeta, FilterQuery, VizData, VizPipeline } from '../model/ds';

/**
 * List metas for all available DSes
 */
export function listMeta(): Promise<DsMeta[]> {
  return fetch('/ls')
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.list) {
          return data.list;
        }
        throw new Error('Error: ' + ( data.error || 'Unknown error' ))
      }).catch((err) => {
        throw new Error('Error fetching data: ' + err.toString())
      });
}

/**
 * Get meta for a single DS, including filtering and visualization proposals
 * @param dsId DS ID
 */
export function getMeta(dsId: string): Promise<DsMeta> {
  return fetch(`/ls?id=${dsId}&-f=true&-v=true`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const meta = data.list.find((record: DsMeta) => record.id === dsId);
          if (!meta) {
            throw new Error(`Server did not return record for id=${dsId}`);
          }
          return meta;
        }
        throw new Error(data.error || 'Unknown error');
      }).catch((e) => {
        throw new Error('Error fetching data: ' + e.toString());
      });
}

/**
 * Create DS
 * @param ds DS in the format returned by a provider
 */
export function createDs(ds: ProvidedDs): Promise<DsMeta> {
  let data;
  data = new FormData();
  data.set('csv', ds.csv, ds.filename || 'Unnamed.csv');
  data.set('type', ds.type);
  data.set('extra', JSON.stringify(ds.extra));
  return fetch('/ds', {
    method: 'PUT',
    body: data
  })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.item) {
          return data.item;
        }
        throw new Error('Error saving data: ' + ( data.error || 'Unknown error' ));
      }).catch((e) => {
        throw new Error('Error putting data source: ' + e.toString());
      });
}

/**
 * Get DS as a list of data objects
 * @param dsId DS ID
 * @param query Optional filtering query
 */
export function getDs(dsId: string, query?: FilterQuery): Promise<any[]> {
  return fetch(!query ?
      `/ds/${dsId}` :
      `/ds/${dsId}/filter?query=${encodeURIComponent(JSON.stringify(query))}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          return data.list;
        }
        throw new Error('Error: ' + ( data.error || 'Unknown error' ));
      }).catch((err) => {
        throw new Error(`Error fetching ${dsId}: ` + err.toString());
      });
}

/**
 * Get data for visualization
 * @param dsId DS ID
 * @param pipeline Visualization pipeline
 */
export function getVizData(dsId: string, pipeline: VizPipeline): Promise<VizData> {
  return fetch(`/ds/${dsId}/visualize?` +
      `pipeline=${encodeURIComponent(JSON.stringify(pipeline))}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          return data.list;
        }
        throw new Error('Error: ' + ( data.error || 'Unknown error' ));
      }).catch((e) => {
    throw new Error('Error fetching data: ' + e.toString());
  });
}
