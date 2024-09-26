import React, { lazy, Suspense } from 'react';
import serialize from 'serialize-javascript';
import Icon from '../../icon/Icon';
import AbstractProvider, {
  ProvidedDs,
  ProviderProps
} from './AbstractProvider';
import WebCrawlerSetupScreen from './WebCrawlerSetupScreen';
import { WebCrawlerResultRef } from './WebCrawlerScreen';
import { TypescriptLib } from '../common/Editor';
import { WebCrawlerScriptTemplate } from '../../webcrawler-model/webcrawler';
import ValidationError from './ValidationError';
import pageDef from '!raw-loader!../../webcrawler-model/page';

class WebCrawlerProvider extends AbstractProvider {
  type = 'Web';

  text = 'Web Crawler';

  icon = Icon.bug;

  private url: URL | undefined;
  private template: WebCrawlerScriptTemplate | undefined;
  private templateList: WebCrawlerScriptTemplate[] = [];
  private urlError: string | undefined;
  private templateError: string | undefined;
  private resultRef?: WebCrawlerResultRef;
  private libs: TypescriptLib[];

  constructor(props: ProviderProps) {
    super(props);
    this.libs = [{
      uri: 'ts:filename/page.d.ts',
      source: `${pageDef.replace(/export /g, '')}\nvar page: Page;`
    }];
    this.loadTemplates()
        .then(templateList => {
          this.templateList = templateList;
          this.props.onUpdateScreens?.();
        })
        .catch(e => {
          this.templateError = e.toString();
          this.props.onUpdateScreens?.();
        });
  }

  renderDescription(): JSX.Element | string | null {
    return <>
      <p>Generate a script to scrap data from the target website.</p>
      <ul>
        <li>Use one of our script templates</li>
        <li>Choose HTML elements to grab with help of our visual constructor
        </li>
        <li>Edit script to add custom logic if necessary</li>
        <li>Execute script directly in your browser
          or at our proxy server
        </li>
      </ul>
    </>
  }

  renderScreens(): JSX.Element[] {
    const WebCrawlerConstructorScreen = lazy(() => import("./WebCrawlerScreen"));

    return [
      <WebCrawlerSetupScreen
          url={this.url?.toString()}
          template={this.template}
          templateList={this.templateList}
          onChangeURL={(url) => {
            this.validateUrl(url);
          }}
          onSelectTemplate={(template) => {
            if (template) {
              this.template = {
                ...template,
                name: this.newTemplateName(template.name),
              }
            }
          }}
          urlError={this.urlError}
          templateError={this.templateError}
      />,
      <Suspense fallback="loading...">
        <WebCrawlerConstructorScreen
            url={this.url}
            template={this.template}
            libs={this.libs}
            setRef={(ref) => {
              this.resultRef = ref;
            }}
            saveTemplate={this.saveTemplate}
        />
      </Suspense>,
    ];
  }

  validate(i: number): Promise<any> {
    switch (i) {
      case 0:
        if (!this.url) {
          // validate to set proper error
          this.validateUrl();
        }
        if (this.urlError) {
          return Promise.reject(new ValidationError(this.urlError));
        }
        if (!this.template) {
          this.templateError = 'Select script template';
          this.props.onUpdateScreens?.();
          return Promise.reject(new ValidationError(this.templateError));
        }
    }
    return Promise.resolve();
  }

  loadCSV(): Promise<ProvidedDs> {
    return this.resultRef?.getResult()
        .then(result => {
          let csvString = '';
          for (let row of result) {
            csvString += row.map((value) => {
              let s = value === null || value === undefined ? '' : `${value}`;
              if (s.includes('\n') || s.includes(',') || s.includes('"')) {
                s = `"${s.replace(/"/g, '""')}"`
              }
              return s;
            }) + "\n";
          }
          return {
            csv: new Blob([csvString]),
            filename: this.resultRef?.getTitle() || this.url!.hostname,
            type: this.type,
            extra: {
              source: this.url!.toString(),
              access: { type: 'public' },
            }
          }
        }) || Promise.reject('No data available');
  }

  validateUrl(url?: string | undefined): void {
    const oldError = this.urlError;
    if (!url) {
      this.url = undefined;
      this.urlError = 'Enter URL';
    } else {
      try {
        this.url = new URL(url);
        this.urlError = undefined;
      } catch (e) {
        this.url = undefined;
        this.urlError = 'Enter valid URL';
      }
    }
    if (oldError !== this.urlError) {
      this.props.onUpdateScreens?.();
    }
  }

  loadTemplates(): Promise<WebCrawlerScriptTemplate[]> {
    return fetch('/wc/template')
        .then(response => response.text())
        .then(text => eval(text));
  }

  saveTemplate(template: WebCrawlerScriptTemplate): Promise<void> {
    return fetch('/wc/template', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-script-template',
        'X-Template-Name': `${template?.name}`
      },
      body: serialize(template),
    })
        .then(response => response.json())
        .then(data => {
          if (!data.success) {
            throw new Error('Error saving template: ' + ( data.error || 'Unknown error' ));
          }
        })
  }

  newTemplateName(oldTemplateName: string): string {
    let site = `${this.url?.hostname}`;
    if (oldTemplateName.includes(site)) {
      return oldTemplateName;
    }
    return `${site} - ${oldTemplateName}`;
  }
}

export default WebCrawlerProvider;
