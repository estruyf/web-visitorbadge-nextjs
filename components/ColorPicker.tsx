import * as React from 'react';
import { BlockPicker } from 'react-color';

export interface IColorPickerProps {
  title: string;
  color: string;

  updateColor: (color: string) => void;
}

const swatches = ['#555555', '#263759', '#132136', '#F0B354', '#CC8312', '#1A7F52', '#0E7490', '#7C3AED', '#C2304B', '#EA4AAA'];

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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShow(false);
    }
  };

  React.useEffect(() => {
    if (show) {
      document.addEventListener("mousedown", handleLabelClick);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("mousedown", handleLabelClick);
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleLabelClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [show]);

  return (
    <div className="relative" ref={nodeRef as any}>
      <span className="block text-sm font-semibold text-ink-900">
        {title}
      </span>
      <button
        type="button"
        className="mt-2 flex items-center gap-x-3 w-full px-2 py-2 bg-white border border-line rounded-lg text-sm hover:border-ink-300 transition-colors"
        aria-expanded={show}
        aria-label={`${title}: ${color}. Click to change`}
        onClick={() => setShow(prev => !prev)}
      >
        <span className="h-6 w-6 rounded-md flex-shrink-0 ring-1 ring-black ring-opacity-10" style={{ backgroundColor: color }} />
        <span className="font-mono text-ink-700 uppercase">{color}</span>
      </button>
      {
        show && (
          <div className="absolute left-0 mt-2 z-30">
            <BlockPicker color={color} colors={swatches} triangle="hide" onChangeComplete={(color) => updateColor(color.hex)} className={`blockPicker ring-1 ring-black ring-opacity-5 shadow-lg`} />
          </div>
        )
      }
    </div>
  );
};
