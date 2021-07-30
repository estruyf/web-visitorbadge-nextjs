import * as React from 'react';
import { BlockPicker } from 'react-color';

export interface IColorPickerProps {
  title: string;
  color: string;

  updateColor: (color: string) => void;
}

export const ColorPicker: React.FunctionComponent<IColorPickerProps> = ({color, title, updateColor}: React.PropsWithChildren<IColorPickerProps>) => {
  const nodeRef = React.useRef<HTMLDivElement>();
  const [ show, setShow ] = React.useState(false);

  const handleLabelClick = (e: MouseEvent) => {
    if (nodeRef?.current?.contains(e.target as any)) {
      // inside click
      return;
    }
    // outside click
    setShow(false);
  };

  React.useEffect(() => {
    if (show) {
      document.addEventListener("mousedown", handleLabelClick);
    } else {
      document.removeEventListener("mousedown", handleLabelClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleLabelClick);
    };
  }, [show]);

  return (
    <div className="col-span-12 sm:col-span-2" ref={nodeRef as any}>
      <label htmlFor="label" className="block text-sm font-medium text-gray-700">
        {title}
      </label>
      <button type="button" className="mt-1 w-full px-3 py-2 border border-gray-300 text-sm rounded-md focus:outline-none text-white" style={{ backgroundColor: color }} onClick={() => setShow(prev => !prev)}>Click to change</button>
      {
        show && (
          <div className={`absolute mt-2`}>
            <BlockPicker color={color} onChangeComplete={(color) => updateColor(color.hex)} />
          </div>
        )
      }
    </div>
  );
};