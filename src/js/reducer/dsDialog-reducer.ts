import equal from 'deep-equal';

/**
 * Tab keys. In future may include history, meta etc...
 */
export type Tab = 'filtering'
    | 'visualization';

export interface DsDialogState {
  open: boolean;

  /**
   * Currently open tab
   */
  tab?: Tab;

  /**
   * Tab content currently changed
   */
  changed: { [key in Tab]?: boolean; };
}

export enum DsDialogActionType {
  /**
   * Open dialog with a certain tab
   */
  OPEN,

  /**
   * Switch to another tab
   */
  SWITCH,

  /**
   * Tab content has changed
   */
  CHANGED,

  /**
   * Tab content has saved (not changed anymore)
   */
  SAVED,

  /**
   * Dialog close
   */
  CLOSE,
}

export type DsDialogAction = {
  type: DsDialogActionType.OPEN | DsDialogActionType.SWITCH | DsDialogActionType.CHANGED | DsDialogActionType.SAVED;
  tab: Tab;
} | {
  type: DsDialogActionType.CLOSE;
}

export const defaultDsDialogState: DsDialogState = {
  open: false,
  changed: {},
}

export function reduceDsDialogState(state: DsDialogState, action: DsDialogAction): DsDialogState {
  let newState;
  switch (action.type) {
    case DsDialogActionType.OPEN:
      newState = { ...state, open: true, tab: action.tab };
      break;

    case DsDialogActionType.SWITCH:
      newState = { ...state, tab: action.tab };
      break;

    case DsDialogActionType.CHANGED:
      newState = { ...state, changed: { ...state.changed, [action.tab]: true } };
      break;

    case DsDialogActionType.SAVED:
      newState = { ...state, changed: { ...state.changed, [action.tab]: false } };
      break;

    case DsDialogActionType.CLOSE:
      newState = { ...state, open: false, tab: undefined };
      break;

  }

  if (newState && !equal(state, newState)) {
    return newState;
  }

  return state;
}
