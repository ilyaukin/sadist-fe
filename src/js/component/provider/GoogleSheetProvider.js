import IProvider from "./IProvider";
import Icon from "../Icon";
import GoogleSheetProviderDetails from "./GoogleSheetProviderDetails";
import React from "react";

class GoogleSheetProvider extends IProvider {
  type = 'GoogleSheet';

  text = 'Google Sheets';

  icon = Icon.google;

  renderDescription() {
    return <p>Pick one of your Google Sheets to import; or use a direct link to the public sheet</p>;
  }

  renderDetails() {
    return <GoogleSheetProviderDetails
      ref={(details) => this.details = details}/>;
  }

  loadCSV() {
    let url = this.details.url.value;

    let result = { type: this.type, extra: { source: url } };

    url = url.replace('htmlview', 'export');
    url += (url.indexOf('?') === -1 ? '?' : '&') + 'format=csv';

    return new Promise((resolve, reject) => {
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
    })
  }
}

export default GoogleSheetProvider;
