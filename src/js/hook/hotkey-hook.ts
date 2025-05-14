import React, { useEffect } from 'react';

// All registered keys, to show help
const hotkeyList: Hotkey[] = [];

// It should allow registering a handler once, and then
// dynamically add/remove bindings
window.addEventListener('keydown', (event) => {
  for (const hk of hotkeyList) {
    if (hk.event === 'keydown' && matchKey(hk.key, event)) {
      hk.callback(event);
    }
  }
});
window.addEventListener('keyup', (event) => {
  for (const hk of hotkeyList) {
    if (hk.event === 'keyup' && matchKey(hk.key, event)) {
      hk.callback(event);
    }
  }
});

type ControlKey = 'Alt' | 'CapsLock' | 'Control' | 'Fn' |
    'Meta' | 'NumLock' | 'ScrollLock' | 'Shift';
type NormalKey = 'Enter' | 'Tab' | ' ' | 'ArrowDown' | 'ArrowLeft' |
    'ArrowRight' | 'ArrowUp' | 'End' | 'Home' | 'PageDown' | 'PageUp' |
    'Backspace' | 'Copy' | 'Delete' | 'Insert' | 'Paste' | 'Redo' | 'Undo' |
    'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8' | 'F9' | 'F10' |
    'F11' | 'F12' | 'F13' | 'F14' | 'F15' | 'F16' | 'F17' | 'F18' | 'F19' |
    'F20' | 'Q' | 'W' | 'E' | 'R' | 'T' | 'Y' | 'U' | 'I' | 'O' | 'P' | '[' |
    ']' | 'A' | 'S' | 'D' | 'F' | 'G' | 'H' | 'J' | 'K' | 'L' | ';' | '\'' |
    '`' | '\\' | 'Z' | 'X' | 'C' | 'V' | 'B' | 'N' | 'M' | ',' | '.' | '/' |
    'Escape' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0' | '-' |
    '=' | 'Unidentified';
type Key = ControlKey | NormalKey |
    `${ControlKey}+${NormalKey}` | `${ControlKey}+${ControlKey}+${NormalKey}`;

type Callback = (ev: KeyboardEvent) => any;

export interface Hotkey {
  key: Key;
  event?: 'keydown' | 'keyup';
  callback: Callback;
  title?: string;
}

const matchKey = (key: Key, event: KeyboardEvent):boolean => {
  let code: ControlKey | NormalKey;
  switch (event.code) {
    case 'AltLeft':
    case 'AltRight':
      code = 'Alt';
      break;
    case 'CapsLock':
      code = 'CapsLock';
      break;
    case 'ControlLeft':
    case 'ControlRight':
      code = 'Control';
      break;
    case 'Fn':
      code = 'Fn';
      break;
    case 'MetaLeft':
    case 'MetaRight':
      code = 'Meta';
      break;
    case 'NumLock':
      code = 'NumLock';
      break;
    case 'ScrollLock':
      code = 'ScrollLock';
      break;
    case 'ShiftLeft':
    case 'ShiftRight':
      code = 'Shift';
      break;
    case 'Backspace':
      code = 'Backspace';
      break;
    case 'Enter':
      code = 'Enter';
      break;
    case 'Tab':
      code = 'Tab';
      break;
    case 'Space':
      code = ' ';
      break;
    case 'ArrowDown':
      code = 'ArrowDown';
      break;
    case 'ArrowLeft':
      code = 'ArrowLeft';
      break;
    case 'ArrowRight':
      code = 'ArrowRight';
      break;
    case 'ArrowUp':
      code = 'ArrowUp';
      break;
    case 'End':
      code = 'End';
      break;
    case 'Home':
      code = 'Home';
      break;
    case 'PageDown':
      code = 'PageDown';
      break;
    case 'PageUp':
      code = 'PageUp';
      break;
    case 'Copy':
      code = 'Copy';
      break;
    case 'Delete':
      code = 'Delete';
      break;
    case 'Insert':
      code = 'Insert';
      break;
    case 'Paste':
      code = 'Paste';
      break;
    case 'Again':
      code = 'Redo';
      break;
    case 'Undo':
      code = 'Undo';
      break;
    case 'F1':
      code = 'F1';
      break;
    case 'F2':
      code = 'F2';
      break;
    case 'F3':
      code = 'F3';
      break;
    case 'F4':
      code = 'F4';
      break;
    case 'F5':
      code = 'F5';
      break;
    case 'F6':
      code = 'F6';
      break;
    case 'F7':
      code = 'F7';
      break;
    case 'F8':
      code = 'F8';
      break;
    case 'F9':
      code = 'F9';
      break;
    case 'F10':
      code = 'F10';
      break;
    case 'F11':
      code = 'F11';
      break;
    case 'F12':
      code = 'F12';
      break;
    case 'F13':
      code = 'F13';
      break;
    case 'F14':
      code = 'F14';
      break;
    case 'F15':
      code = 'F15';
      break;
    case 'F16':
      code = 'F16';
      break;
    case 'F17':
      code = 'F17';
      break;
    case 'F18':
      code = 'F18';
      break;
    case 'F19':
      code = 'F19';
      break;
    case 'F20':
      code = 'F20';
      break;
    case 'KeyQ':
      code = 'Q';
      break;
    case 'KeyW':
      code = 'W';
      break;
    case 'KeyE':
      code = 'E';
      break;
    case 'KeyR':
      code = 'R';
      break;
    case 'KeyT':
      code = 'T';
      break;
    case 'KeyY':
      code = 'Y';
      break;
    case 'KeyU':
      code = 'U';
      break;
    case 'KeyI':
      code = 'I';
      break;
    case 'KeyO':
      code = 'O';
      break;
    case 'KeyP':
      code = 'P';
      break;
    case 'BracketLeft':
      code = '[';
      break;
    case 'BracketRight':
      code = ']';
      break;
    case 'KeyA':
      code = 'A';
      break;
    case 'KeyS':
      code = 'S';
      break;
    case 'KeyD':
      code = 'D';
      break;
    case 'KeyF':
      code = 'F';
      break;
    case 'KeyG':
      code = 'G';
      break;
    case 'KeyH':
      code = 'H';
      break;
    case 'KeyJ':
      code = 'J';
      break;
    case 'KeyK':
      code = 'K';
      break;
    case 'KeyL':
      code = 'L';
      break;
    case 'Semicolon':
      code = ';';
      break;
    case 'Quote':
      code = '\'';
      break;
    case 'Backquote':
      code = '`';
      break;
    case 'Backslash':
      code = '\\';
      break;
    case 'KeyZ':
      code = 'Z';
      break;
    case 'KeyX':
      code = 'X';
      break;
    case 'KeyC':
      code = 'C';
      break;
    case 'KeyV':
      code = 'V';
      break;
    case 'KeyB':
      code = 'B';
      break;
    case 'KeyN':
      code = 'N';
      break;
    case 'KeyM':
      code = 'M';
      break;
    case 'Comma':
      code = ',';
      break;
    case 'Period':
      code = '.';
      break;
    case 'Slash':
      code = '/';
      break;
    case 'Escape':
      code = 'Escape';
      break;
    case 'Digit1':
    case 'Numpad1':
      code = '1';
      break;
    case 'Digit2':
    case 'Numpad2':
      code = '2';
      break;
    case 'Digit3':
    case 'Numpad3':
      code = '3';
      break;
    case 'Digit4':
    case 'Numpad4':
      code = '4';
      break;
    case 'Digit5':
    case 'Numpad5':
      code = '5';
      break;
    case 'Digit6':
    case 'Numpad6':
      code = '6';
      break;
    case 'Digit7':
    case 'Numpad7':
      code = '7';
      break;
    case 'Digit8':
    case 'Numpad8':
      code = '8';
      break;
    case 'Digit9':
    case 'Numpad9':
      code = '9';
      break;
    case 'Digit0':
    case 'Numpad0':
      code = '0';
      break;
    case 'Minus':
    case 'NumpadSubtract':
      code = '-';
      break;
    case 'Equal':
    case 'NumpadAdd':
      code = '=';
      break;
    default:
      code = 'Unidentified';
  }

  // match control keys
  if (code === 'Alt' || code === 'CapsLock' || code === 'Control' ||
      code === 'Fn' || code === 'Meta' || code === 'NumLock' ||
      code === 'ScrollLock' || code === 'Shift') {
    return key === code;
  }

  //match normal keys + ctrlKey
  const kk = key.split('+');
  return kk[kk.length - 1] === code &&
      (event.ctrlKey === kk.includes('Control')) &&
      (event.altKey === kk.includes('Alt')) &&
      (event.shiftKey === kk.includes('Shift')) &&
      (event.metaKey === kk.includes('Meta'));
}

/**
 * Add one or more hotkeys
 * @param ref Element to add hotkeys within the focused scope, or null
 * to add globally
 * @param hotkeys
 * @param dependencies
 */
export const useHotkeys = (ref: React.RefObject<HTMLElement | null> | null, hotkeys: Hotkey[], dependencies?: React.DependencyList) => {
  useEffect(() => {
    const addHandler = () => {
      for (const hk of hotkeys) {
        // no duplicates
        if (hotkeyList.indexOf(hk) === -1) {
          hk.event ||= 'keydown';
          hotkeyList.push(hk);
        }
      }
    };

    const removeHandler = () => {
      for (const hk of hotkeys) {
        hk.event ||= 'keydown';
        let start;
        if ((start = hotkeyList.indexOf(hk)) !== -1) {
          hotkeyList.splice(start, 1);
        }
      }
    }

    if (ref == null) {
      // right away register handler
      addHandler();
      return removeHandler;
    } else {
      const element = ref.current;
      if (!element) {
        return undefined;
      }

      // register on focus-in, unregister on focus-out
      if (element.contains(document.activeElement)) {
        addHandler();
      }
      element.addEventListener('focusin', addHandler);
      element.addEventListener('focusout', removeHandler);
      return () => {
        removeHandler(); // in case we're in the destroy moment
        element.removeEventListener('focusin', addHandler);
        element.removeEventListener('focusout', removeHandler);
      }
    }
  }, [ref, ...hotkeys, ...(dependencies ? dependencies : [])]);
}

/**
 * Get all currently scoped hotkeys
 * @return {Hotkey[]}
 */
export const getHotkeys = (): Hotkey[] => {
  return hotkeyList;
}
