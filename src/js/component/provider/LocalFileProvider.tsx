import React from 'react';
import * as XLSX from 'xlsx';
import AbstractProvider, { ProvidedDs } from './AbstractProvider';
import Icon from '../../icon/Icon';
import LocalFileProviderScreen from './LocalFileProviderScreen';
import ValidationError from './ValidationError';

class LocalFileProvider extends AbstractProvider {
  type = "File";

  text = "Local File";

  icon = Icon.file;

  private file?: File;
  private fileError?: string;

  renderDescription(): JSX.Element | string | null {
    return <p>Upload a .CSV or .XLS file from your local computer.</p>;
  }

  renderScreens(): JSX.Element[] {
    return [
      <LocalFileProviderScreen
          fileError={this.fileError}
          setFile={this.setFile.bind(this)}
      ></LocalFileProviderScreen>
    ];
  }

  validate(i: number): Promise<any> {
    switch (i) {
      case 0:
        const oldError = this.fileError;
        if (!this.file) {
          this.fileError = 'Please choose a file';
        } else {
          this.fileError = undefined;
        }
        if (oldError !== this.fileError) {
          this.props.onUpdateScreens?.();
        }
        if (this.fileError) {
          return Promise.reject(new ValidationError(this.fileError));
        }
    }
    return Promise.resolve();
  }

  loadCSV(): Promise<ProvidedDs> {
    return this.validate(0).then(() => {
      const file = this.file!;
      const i = file.name.lastIndexOf('.');
      const ext = i !== -1 ? file.name.substring(i + 1) : '';
      switch (ext) {
        case 'csv':
          // return CSV file as is
          return {
            csv: file,
            type: 'File',
            filename: file.name,
            extra: { access: { type: 'public' } }
          };
        case 'xls':
        case 'xlsx':
          // use XLSX reader
          // todo what with multiple sheets? we should have preview to select a sheet, area, headers etc.
          return new Promise<ProvidedDs>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (ev) {
              try {
                if (!ev.target) {
                  reject(new ValidationError('FileReader is null'));
                  return;
                }
                const data = ev.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const csv = XLSX.utils.sheet_to_csv(sheet);
                resolve({
                  csv: new Blob([csv]),
                  type: 'File',
                  filename: file.name,
                  extra: { access: { type: 'public' } }
                });
              } catch (e: any) {
                reject(new ValidationError(e.toString()));
              }
            };
            reader.readAsBinaryString(file);
          });
        default:
          this.fileError = 'File must be one of *.csv, *.xls, *.xlsx';
          this.props.onUpdateScreens?.();
          throw new ValidationError(this.fileError);
      }
    });
  }

  setFile(file: File) {
    this.file = file;
  }
}

export default LocalFileProvider;
