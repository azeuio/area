import React from 'react';

interface DescriptionInputProps {
  placeholder: string;
  descriptionInputStyle?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  descriptionValue?: string;
}

class DescriptionInput extends React.Component<DescriptionInputProps> {
  render() {
    return (
      <div>
        <textarea
          onChange={this.props.onChange}
          value={this.props.descriptionValue}
          className={`rounded-[10px] border-[3px] font-SpaceGrotesk text-4xl px-3 py-3 focus:outline-none ${this.props.descriptionInputStyle}`}
          placeholder={this.props.placeholder}
          rows={3}
          style={{ resize: 'both' }}
        />
      </div>
    );
  }
}

export default DescriptionInput;
