import IProvider from "./IProvider";
import Icon from "../../icon/Icon";
import GoogleSheetProviderDetails from "./GoogleSheetProviderDetails";
import React from "react";
import { getSheetAsCsv } from '../../helper/gapi-helper';

class GoogleSheetProvider extends IProvider {
  type = 'GoogleSheet';

  text = 'Google Sheets';

  icon = Icon.google;

  renderDescription() {
    return <p>Pick one of your Google Sheets to import; or use the direct link to a public sheet</p>;
  }

  renderDetails() {
    return <GoogleSheetProviderDetails
      ref={(details) => this.details = details}/>;
  }

  loadCSV() {
    return new Promise((resolve, reject) => {
      this.details.isList() ?
        this.details.getSheet().then((sheet) => {
          let csvPromise = getSheetAsCsv({ id: sheet.id });
          let urlPromise = this.details.getUrl();
          Promise.all([csvPromise, urlPromise])
            .then(([csv, url]) => {
              resolve({
                csv: new Blob([csv], { type: "text/csv" }),
                filename: sheet.name,
                type: this.type,
                extra: { source: url }
              });
            })
            .catch(e => reject(e));
        }) :
        this.details.getUrl().then((url) => {

          let result = { type: this.type, extra: { source: url } };

          url = url.replace('htmlview', 'export');
          url += (url.indexOf('?') === -1 ? '?' : '&') + 'format=csv';

          fetch(url).then((response) => {
            let header = response.headers.get('Content-disposition');
            if (header) {
              header.split(';').map(s => s.trim()).forEach(
                (s) => {
                  if (s.startsWith('filename=')) {
                    s = s.substr(9);
                    if (s.startsWith('"') && s.endsWith('"') && s.length > 1) {
                      s = s.substr(1, s.length - 2);
                    }
                    result = { filename: decodeURIComponent(s), ...result };
                  }
                }
              )
            }

            response.blob().then((blob) => {
              resolve({ csv: blob, ...result });
            }).catch((e) => reject(e))
          }).catch((e) => reject(e))
        }).catch((e) => reject(e))

    });
  }
}

export default GoogleSheetProvider;
