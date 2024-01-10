import React from 'react';

interface DescriptionInputProps {
  placeholder: string;
  containerStyle?: string;
  descriptionInputStyle?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  descriptionValue?: string;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  rows?: number;
  resizeX?: boolean; // default false
  resizeY?: boolean; // default true
}

class DescriptionInput extends React.Component<DescriptionInputProps> {
  render() {
    const resize = this.props.resizeX
      ? this.props.resizeY ?? true
        ? 'both'
        : 'horizontal'
      : this.props.resizeY ?? true
      ? 'vertical'
      : 'none';
    return (
      <div
        className={`flex flex-col space-y-0 relative ${this.props.containerStyle}`}
      >
        {(this.props.minLength ||
          this.props.maxLength ||
          this.props.required) && (
          <span className="text-2xl text-right flex flex-row justify-end space-x-2">
            {(this.props.minLength || this.props.maxLength) && (
              <p
                className={`text-right italic text-xl ${
                  (this.props.descriptionValue?.length ?? 0) <
                    (this.props.minLength ?? 0) ||
                  (this.props.descriptionValue?.length ?? 0) >
                    (this.props.maxLength ?? Infinity)
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {this.props.descriptionValue?.length ?? 0}/
                {this.props.maxLength}
              </p>
            )}
            {this.props.required && (
              <p className="text-2xl text-red-500 text-right">*</p>
            )}
          </span>
        )}
        <textarea
          onChange={this.props.onChange}
          value={this.props.descriptionValue}
          className={`min-h-[2em] rounded-[10px] border-[3px] font-SpaceGrotesk text-4xl px-3 py-3 focus:outline-none ${this.props.descriptionInputStyle} resize-${resize}`}
          placeholder={this.props.placeholder}
          rows={this.props.rows ?? 1}
          maxLength={this.props.maxLength}
          required={this.props.required}
        />
      </div>
    );
  }
}

export default DescriptionInput;
