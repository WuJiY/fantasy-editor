import React, { FunctionComponent } from 'react';
import { ReactComponent as IconImage } from '../../assets/svg/image.svg';
import ToolbarButton from '../toolbar-button';
import { ReactEditor, useSlate } from 'slate-react';
import { Range, Transforms } from 'slate';
import { insertImage, mockUpload } from '@/utils/tools/file-tool';
import isPromise from 'is-promise';

interface OwnProps {}

type Props = OwnProps;

const ButtonImage: FunctionComponent<Props> = props => {
  let editor = useSlate();

  const handleMouseDown = () => {
    let { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);
    if (!isCollapsed) {
      Transforms.collapse(editor, { edge: 'end' });
    }
    let eleInput = document.createElement('input');
    eleInput.type = 'file';
    eleInput.style.display = 'none';
    eleInput.accept = 'image/*';
    eleInput.onchange = (e: any) => {
      let file = e.target.files[0];
      if (file) {
        let result = mockUpload(file, () => {});
        ReactEditor.focus(editor);
        if (selection) {
          Transforms.select(editor, selection);
        }
        if (isPromise(result)) {
          result.then(
            props => {
              insertImage(editor, props);
            },
            () => {},
          );
        } else {
          insertImage(editor, result);
        }
      }
    };
    eleInput.click();
  };

  return (
    <ToolbarButton onMouseDown={handleMouseDown}>
      <IconImage />
    </ToolbarButton>
  );
};

export default ButtonImage;