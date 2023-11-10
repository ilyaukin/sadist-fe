import React, { useEffect, useRef, useState } from 'react';
import { diff_match_patch } from 'diff-match-patch';
import Icon from '../../icon/Icon';
import { WiredInput } from '/wired-elements/lib/wired-input';
import ScriptEditor, { ScriptEditorLib } from '../common/ScriptEditor';
import Dropdown from '../common/Dropdown';
import { WebCrawlerScriptTemplate } from '../../model/webcrawler';
import { LocalPageRunner } from '../../model/page-impl';
import { ValueType } from '../../model/ds';
import ValidationError from './ValidationError';
import { Page } from '../../model/page';

interface WebCrawlerReviewScreenProps {
  template?: WebCrawlerScriptTemplate;
  libs?: ScriptEditorLib[];

  setRef(ref: WebCrawlerResultRef): void;

  saveTemplate(template: WebCrawlerScriptTemplate): Promise<void>;
}

/**
 * Improvised reference
 */
export interface WebCrawlerResultRef {
  getResult(): Promise<ValueType[][]>;

  getTitle(): string | undefined;

  isSaveTemplate(): boolean;
}

interface ActionPaneState {
  executor: 'local' | 'proxy';
  isSaveTemplate: boolean;
}

interface ActionPaneRef extends ActionPaneState {
}

interface ActionPaneProps {
  executeScript: () => ( Promise<ValueType[][]> | undefined );
  templateName?: string;
  onChangeTemplateName: (name: string) => any;

  setRef(ref: ActionPaneRef): void;
}

interface SettingsProps {
  isSaveTemplate: boolean;
  templateName?: string;
  onChangeSaveTemplate: (isSaveTemplate: boolean) => any;
  onChangeTemplateName: (name: string) => any;
}

function Settings(
    {
      isSaveTemplate,
      templateName,
      onChangeSaveTemplate,
      onChangeTemplateName
    }: SettingsProps
) {
  const templateNameInputRef = useRef<WiredInput | null>(null);

  useEffect(() => {
    if (templateNameInputRef.current && templateName) {
      templateNameInputRef.current!.value = templateName!;
      templateNameInputRef.current!.focus();
    }
  }, [templateName]);

  return <>
    <wired-checkbox
        checked={isSaveTemplate}
        onchange={(event) => {
          onChangeSaveTemplate(event.detail.checked);
        }}
    ><span className="comment">Also save template as</span></wired-checkbox>
    <wired-input
        ref={templateNameInputRef}
        style={{ width: '100%' }}
        value={templateName}
        onchange={() => {
          onChangeTemplateName(templateNameInputRef.current!.value);
        }}
    ></wired-input>
  </>;
}

function ActionPane(
    {
      executeScript,
      templateName,
      onChangeTemplateName,
      setRef
    }: ActionPaneProps
) {
  const [state, setState] = useState<ActionPaneState>({
    executor: 'local',
    isSaveTemplate: true,
  })
  const { executor, isSaveTemplate } = state;

  setRef(state);

  return <>
    <div className="script-action-pane">
      <div className="script-action-pane-item">
        <wired-combo selected={executor}
                     onselected={(e) => {
                       setState({ ...state, executor: e.detail.selected });
                     }}>
          <wired-item value="local">in Browser</wired-item>
          <wired-item value="proxy">on Proxy Server</wired-item>
        </wired-combo>
      </div>
      <div className="script-action-pane-item">
        <wired-button onClick={executeScript}>
          <img src={Icon.run} alt=">"/>
        </wired-button>
      </div>
    </div>
    <Dropdown
        className="script-setting-dropdown"
        toggle={
          <wired-button>
            <img src={Icon.gear} alt="Settings"/>
          </wired-button>
        }
        content={
          <Settings
              isSaveTemplate={isSaveTemplate}
              templateName={templateName}
              onChangeSaveTemplate={(isSaveTemplate) => {
                setState({ ...state, isSaveTemplate })
              }}
              onChangeTemplateName={onChangeTemplateName}
          />
        }
    />
  </>;
}

export default function WebCrawlerReviewScreen(
    { template, libs, setRef, saveTemplate }: WebCrawlerReviewScreenProps
) {
  const editorRef = useRef<ScriptEditor | null>(null);
  const resultElementRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<ValueType[][] | undefined>();
  const promiseRef = useRef<Promise<ValueType[][]> | undefined>();
  const titleRef = useRef<string | undefined>();
  const actionPaneRef = useRef<ActionPaneRef>();

  useEffect(() => {
    if (template) {
      editorRef.current?.on('blur', pushbackChanges)
      return () => editorRef.current?.off('blur', pushbackChanges);
    }
    return undefined;
  }, [template]);

  function appendResult(message: string, type: 'message' | 'error' | 'warning' = 'message') {
    // append result in console-log style, will do it
    // in pure JS to skip react's re-rendering
    const messageElement = document.createElement('span');
    if (type === 'error') {
      messageElement.style.color = 'maroon';
    } else if (type === 'warning') {
      messageElement.style.color = 'orange';
    }
    messageElement.append(document.createTextNode(message));
    messageElement.append(document.createElement('br'));
    resultElementRef.current?.appendChild(messageElement);
  }

  function clearResult() {
    while (resultElementRef.current?.hasChildNodes()) {
      resultElementRef.current!.removeChild(resultElementRef.current!.lastChild!);
    }
  }

  function wrap<T>(action: () => T,
                   {
                     onFin, onFail
                   }: {
                     onFin?: () => any; onFail?: () => any;
                   } = {}): T | undefined {
    // wrap any script actions to catch errors
    try {
      return action();
    } catch (e: any) {
      appendResult(e.toString(), 'error');
      console.log(e);
      onFail?.();
      return undefined;
    } finally {
      onFin?.();
    }
  }

  function getScriptText(): string | undefined {
    return wrap(() => template?.getScriptText());
  }

  function executeScript(): Promise<ValueType[][]> | undefined {
    // save template asynchronously
    saveTemplate(template!)
        .then(() => appendResult(`Script template saved as ${template!.name}`))
        .catch((e) => appendResult(`Error saving script template: ${e.toString()}`, 'error'));

    return wrap(() => {
      clearResult();
      pushbackChanges();

      let executor = actionPaneRef.current!.executor;
      appendResult(`Executing script at ${executor}...`);
      let page: Page;
      return promiseRef.current = initPage()
          .then(page1 => {
            page = page1;
            return template!.getScript().execute(page);
          })
          .then(result => {
            resultRef.current = result;
            titleRef.current = page.document?.title;

            clearResult();
            appendResult(JSON.stringify(result));
            return result;
          })
          .catch((e) => {
            clearResult();
            appendResult(e.toString(), 'error');
            console.log(e);
            throw new ValidationError(e.toString());
          })
          .finally(() => {
            promiseRef.current = undefined;
            finPage(page);
          });
    });
  }

  function pushbackChanges() {
    // we want to make script template operational after
    // we made changes to the resulting script, so trying to push back
    // changes from the script to the template
    const d = new diff_match_patch();
    const scriptText = editorRef.current!.getText();
    const patch = d.patch_make(template!.getScriptText(), scriptText);
    const [t2, result] = d.patch_apply(patch, template!.text);

    if (result.reduce((b1, b2) => b1 && b2, true)) {
      template!.text = t2;
    } else {
      // if we can't push back changes, we have following options:
      // - drop template and use script as is;
      // - ask a user to edit template itself;
      // - rollback to the previous editable template;
      // for now let stick with the most easy option - replace template text
      // with script text
      appendResult('Failed to merge changes back to the template, ' +
          'replacing template...', 'warning');
      template!.text = scriptText;
    }
  }

  function initPage(): Promise<Page> {
    let page: LocalPageRunner;
    let executor = actionPaneRef.current!.executor;
    switch (executor) {
      case 'local':
        page = new LocalPageRunner();
        return page.init().then(() => page);
      default:
        return Promise.reject(`Executor ${executor} not implemented`);
    }
  }

  function finPage(page: Page): Promise<void> {
    if (page instanceof LocalPageRunner) {
      return page.fin();
    }
    return Promise.resolve();
  }

  setRef({
    getResult(): Promise<ValueType[][]> {
      if (resultRef.current) {
        return Promise.resolve(resultRef.current);
      }

      if (promiseRef.current) {
        return promiseRef.current;
      }

      return executeScript() ||
          Promise.reject(new ValidationError('Failed to execute script'));
    },

    getTitle(): string | undefined {
      return titleRef.current;
    },

    isSaveTemplate(): boolean {
      return true;
    },
  });

  return <>
    <div key="review" className="script-review-block">
      <ScriptEditor
          ref={editorRef}
          id="script-review"
          className="script-review"
          text={getScriptText() || ''}
          libs={libs}
      />
      <ActionPane
          executeScript={executeScript}
          templateName={template?.name}
          onChangeTemplateName={(name) => {
            template!.name = name;
          }}
          setRef={(ref) => {
            actionPaneRef.current = ref;
          }}
      />
    </div>
    <div key="result" ref={resultElementRef} className="script-result-block">
    </div>
  </>
}