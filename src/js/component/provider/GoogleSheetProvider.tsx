import React from "react";
import AbstractProvider, { ProvidedDs } from "./AbstractProvider";
import Icon from "../../icon/Icon";
import GoogleSheetProviderScreen from "./GoogleSheetProviderScreen";
import AccessScreen from './AccessScreen';
import { getSheetAsCsv } from '../../helper/gapi-helper';

class GoogleSheetProvider extends AbstractProvider {
  type = 'GoogleSheet';

  text = 'Google Sheets';

  icon = Icon.google;

  private details?: GoogleSheetProviderScreen | null;
  private access?: AccessScreen | null;

  renderDescription() {
    return <p>Pick one of your Google Sheets to import; or use the direct link to a public sheet</p>;
  }

  renderScreens() {
    const screen1 = <GoogleSheetProviderScreen
      ref={(screen) => this.details = screen} onUpdateScreens={this.props.onUpdateScreens}/>;
    const screen2 = <AccessScreen
      ref={(screen) => this.access = screen}/>
    return this.details?.isList() ? [screen1, screen2] : [screen1];
  }

  validate(i: number) {
    switch (i) {
      case 0:
        return this.details!.isList() ? this.details!.getSheet() : this.details!.getDirectUrl();
      default:
        return new Promise(resolve => resolve(undefined));
    }
  }

  loadCSV() {
    return new Promise<ProvidedDs>((resolve, reject) => {
      this.details!.isList() ?
        this.details!.getSheet().then((sheet: gapi.client.drive.File) => {
          let csvPromise = getSheetAsCsv({ id: sheet.id! });
          let urlPromise = this.details!.getUrl();
          Promise.all([csvPromise, urlPromise])
            .then(([csv, url]) => {
              resolve({
                csv: new Blob([csv], { type: "text/csv" }),
                filename: sheet.name,
                type: this.type,
                extra: { source: url, access: { type: this.access!.getType() } },
              });
            })
            .catch(e => reject(e));
        }) :
        this.details!.getUrl().then((url) => {

          let result: any = {
            type: this.type,
            extra: { source: url, access: { type: 'public' } },
          };

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
