import React, { FC } from "react";
import { Form, FormItemProps } from "antd";
import { IConfigurableFormItemChildFunc } from "./model";
import { DataBinder } from "@/hocs/dataBinder";
import { useDataContextManager } from "@/providers/dataContextManager";
import { InputComponentApi } from "@/componentsApi/componentApi";
import { useComponentApi } from "@/providers/componentApi/provider";

import apiCode from "../../../componentsApi/componentApi.ts?raw";

interface IConfigurableFormItem_ContextProps {
  componentId: string;
  formItemProps: FormItemProps;
  valuePropName?: string;
  componentName: string;
  propertyName: string;
  contextName: string;
  readonly children?: IConfigurableFormItemChildFunc;
}

export const ConfigurableFormItemContext: FC<IConfigurableFormItem_ContextProps> = (props) => {
  const {
    formItemProps,
    valuePropName,
    componentName,
    propertyName,
    contextName,
    children,
  } = props;
  const componentApi = useComponentApi();
  const { getDataContext } = useDataContextManager();
  const { getFieldValue, setFieldValue } = getDataContext(contextName) ?? {};

  const value = getFieldValue?.(propertyName);

  const onChange = (val: any): void => {
    const value = val?.target ? val?.target[valuePropName || 'value'] : val;
    setFieldValue?.(propertyName as "", value as never); // TODO: review and change types
  };

  // ToDo: AS - wrap useEffect ??? check and optimize
  componentApi.updateApi<InputComponentApi>(
    {
      componentName: componentName,
      typeDefinition: { typeName: 'InputComponentApi', files: [{ content: apiCode, fileName: 'apis/componentApi.ts' }] },
    },
    [{ name: 'value', getter: () => getFieldValue?.(propertyName), setter: (val) => onChange(val) }],
  );

  return (
    <Form.Item {...formItemProps}>
      <DataBinder
        onChange={onChange}
        value={value}
      >
        {children}
      </DataBinder>
    </Form.Item>
  );
};
