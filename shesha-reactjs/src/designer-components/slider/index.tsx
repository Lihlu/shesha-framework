import { Slider } from 'antd';
import React from 'react';
import ConfigurableFormItem from '@/components/formDesigner/components/formItem';
import { useFormData } from '@/providers';
import { getStyle, validateConfigurableComponentSettings } from '@/providers/form/utils';
import { SlidersFilled } from '@ant-design/icons';
import { SliderComponentDefinition } from './interfaces';
import { getSettings } from './settingsForm';
import { useStyles } from './styles';

const SliderComponent: SliderComponentDefinition = {
  type: 'slider',
  name: 'Slider',
  icon: <SlidersFilled />,
  isInput: true,
  isOutput: true,
  canBeJsSetting: true,
  Factory: ({ model }) => {
    const { data: formData } = useFormData();
    const { styles } = useStyles();
    const min = model?.min ? parseInt(model.min, 10) : undefined;
    const max = model?.max ? parseInt(model.max, 10) : undefined;

    const baseStyle = (!model.enableStyleOnReadonly && model.readOnly)
      ? {}
      : getStyle(model?.style, formData);
    const readOnlyStyle = model.readOnly ? { pointerEvents: 'none' } : {};
    const sliderStyle = { ...baseStyle, ...readOnlyStyle };

    return (
      <div className={styles.sliderWrapper}>
        <ConfigurableFormItem model={model}>
          {(value, onChange) => (
            <Slider
              className="sha-slider"
              min={min}
              max={max}
              onChange={onChange}
              value={value}
              style={sliderStyle}
            />
          )}
        </ConfigurableFormItem>
      </div>
    );
  },
  initModel: (model) => {
    return {
      ...model,
      label: 'Slider',
    };
  },
  settingsFormMarkup: getSettings,
  validateSettings: (model) => validateConfigurableComponentSettings(getSettings, model),
};

export default SliderComponent;
