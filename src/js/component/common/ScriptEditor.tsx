import React, { Component, HTMLProps } from 'react';
import monaco, { editor, languages, Uri } from 'monaco-editor';
import EditorOption = editor.EditorOption;

export type ScriptEditorLib = { uri: string; source: string; };

interface ScriptEditorProps extends HTMLProps<any> {
  /**
   * UNIQUE id of the editor
   */
  id: string;

  /**
   * Initial text of the script, can be changed
   * both by user or programmatically
   */
  text: string;

  /**
   * Initial readonly state of the script,
   * can be changed programmatically later than
   */
  readonly: boolean;

  /**
   * Additional typescript libs that are used for type hints.
   */
  libs?: ScriptEditorLib[];
}

interface ScriptEditorState {
}

/**
 * Row, column
 */
export type Position = [number, number];

/**
 * Start, end
 */
export type Range = [Position, Position];

export interface ChangeEvent {
  action: 'insert' | 'remove';
  range: Range;
  lines: string[];
}

/**
 * Script editor with aid of monaco-editor.
 *
 * Generally it's just a wrapper, but keep it in case of changing underlying
 * component in the future.
 */
class ScriptEditor extends Component<ScriptEditorProps, ScriptEditorState> {
  static defaultProps = {
    readonly: false,
  }

  private static models: { [uri: string]: editor.ITextModel } = {};

  private container!: HTMLDivElement | null;
  private editor!: editor.IStandaloneCodeEditor;
  private functions: { [name: string]: { native: monaco.IDisposable, our: Function }[]; } = {};

  componentDidMount() {
    const { text, readonly, libs } = this.props;

    libs?.forEach(lib => {
      this.__addlib(lib.uri, lib.source);
    });

    this.editor = editor.create(this.container!, {
      automaticLayout: true,
      minimap: { enabled: false },
      tabSize: 2,
      language: 'javascript',
      value: text,
      readOnly: readonly,
    });
  }

  componentDidUpdate(_prevProps: Readonly<ScriptEditorProps>, _prevState: Readonly<ScriptEditorState>, _snapshot?: any) {
    const { text, readonly } = this.props;

    this.editor.setValue(text);
    this.editor.updateOptions({ readOnly: readonly });
  }

  getText(): string {
    return this.editor.getValue();
  }

  setText(text: string): void {
    // prevent destruction
    let onChangeBk: ( (event: ChangeEvent) => void )[] = [];
    this.functions['change']?.forEach(e => {
      let callback = e.our as ( (event: ChangeEvent) => void );
      onChangeBk.push(callback);
      this.off('change', callback);
    });
    let cursorBk = this.getCursor();
    let selectionBk = this.getSelection();

    this.editor.setValue(text);

    for (let callback of onChangeBk) {
      this.on('change', callback);
    }
    this.setCursor(cursorBk);
    this.setSelection(selectionBk);
  }

  isReadOnly(): boolean {
    return this.editor.getOption(EditorOption.readOnly);
  }

  setReadOnly(readonly: boolean) {
    this.editor.updateOptions({ readOnly: readonly });
  }

  getCursor(): Position {
    let position = this.editor.getPosition();
    return position ? this.__pos(position) : [0, 0];
  }

  setCursor(pos: Position) {
    this.editor.focus();
    this.editor.setPosition(this.__mpos(pos));
  }

  getSelection(): Range {
    const range = this.editor.getSelection();
    return range ? this.__range(range) : [[0, 0], [0, 0]];
  }

  setSelection(selection: Range) {
    this.editor.setSelection(this.__mrange(selection));
  }

  find(text: string): Position | undefined {
    const matches = this.editor.getModel()?.findMatches(text,
        false, false, true, null, false);
    return matches && matches.length ?
        this.__range(matches[0].range)[0] :
        undefined;
  }

  getTextAt(range: Range): string {
    return this.editor.getModel()?.getValueInRange(this.__mrange(range)) || '';
  }

  on(name: 'blur', callback: (event: Event) => any): void;
  on(name: 'change', callback: (event: ChangeEvent) => any): void;
  on(name: string, callback: Function) {
    let disposable;

    switch (name) {
      case 'blur':
        disposable = this.editor.onDidBlurEditorWidget(() => callback());
        break;
      case 'change':
        disposable = this.editor.onDidChangeModelContent((event) => {
          event.changes.forEach((change) => {
            if (change.rangeLength) {
              callback({
                action: 'remove',
                range: this.__range(change.range),
                lines: [],
              });
            }
            if (change.text) {
              let lines = change.text.split('\n');
              let start = this.__range(change.range)[0];
              let end = lines.length == 1 ?
                  [start[0], start[1] + lines[0].length] :
                  [start[0] + lines.length - 1, lines[lines.length - 1].length];
              let range = [start, end];
              callback({
                action: 'insert',
                range,
                lines,
              });
            }
          })
        });
        break;
    }

    if (disposable) {
      ( this.functions[name] ||= [] ).push({
        native: disposable,
        our: callback
      });
    }
  }

  off(name: 'blur', callback: (event: Event) => any): void;
  off(name: 'change', callback: (event: ChangeEvent) => any): void;
  off(name: string, callback: Function) {
    if (name in this.functions) {
      let e = this.functions[name].find(e => e.our == callback);
      if (e) {
        e.native.dispose();
        this.functions[name] = this.functions[name].filter(e1 => e1 != e);
      }
    }
  }

  __pos(point: monaco.IPosition): Position {
    return [point.lineNumber - 1, point.column - 1];
  }

  __mpos(pos: Position): monaco.IPosition {
    return { lineNumber: pos[0] + 1, column: pos[1] + 1 };
  }

  __range(range: monaco.IRange): Range {
    return [[range.startLineNumber - 1, range.startColumn - 1],
      [range.endLineNumber - 1, range.endColumn - 1]];
  }

  __mrange(range: Range): monaco.IRange {
    return {
      startLineNumber: range[0][0] + 1,
      startColumn: range[0][1] + 1,
      endLineNumber: range[1][0] + 1,
      endColumn: range[1][1] + 1,
    };
  }

  __addlib(uri: string, source: string) {
    if (ScriptEditor.models[uri]) {
      return;
    }

    languages.typescript.javascriptDefaults.addExtraLib(source, uri);
    ScriptEditor.models[uri] = editor.createModel(source, 'typescript', Uri.parse(uri));
  }

  render() {
    const { id, text, readonly, libs, ...props } = this.props;
    return <div
        ref={(element) => this.container = element}
        id={id}
        {...props}
    />;
  }
}

export default ScriptEditor;
