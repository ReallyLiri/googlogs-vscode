type Message = import('./common/message').Message;

type VSCode = {
  postMessage<T extends Message = Message>(message: T): void;
};

declare const vscode: VSCode;

declare module 'react-tagsinput' {
  export interface TagsInputProps {
    value: string[];
    onChange: (newTags: string[], changedTags: string[], changeIndices: number[]) => void;
    onChangeInput?: (value: string) => void;
    addKeys?: number[];
    currentValue?: string;
    inputValue?: string;
    onlyUnique?: boolean;
    validationRegex?: RegExp;
    onValidationReject?: (tags: string[]) => void;
    disabled?: boolean;
    maxTags?: number;
    addOnBlur?: boolean;
    addOnPaste?: boolean;
    removeKeys?: number[];
    className?: string;
    focusedClassName?: string;
    inputProps?: any;
    tagProps?: any;
  }

  export default class TagsInput extends React.Component<TagsInputProps> {
  }
}
