import { FormProps, FormPropsClass, FormItemProps } from './Form';
import { RowField, RowProps } from './RowField';

export class FormCreate {
  formProps: FormProps = new FormPropsClass();
  rowProps: RowProps = new RowField();
  formItemProps: Array<FormItemProps> = [];
  url = '';

  setFormProps(formProps: FormProps) {
    this.formProps = { ...new FormPropsClass(), ...formProps };
    return this;
  }

  setRowProps(rowProps: RowProps) {
    this.rowProps = { ...new RowField(), ...rowProps };
    return this;
  }

  setFormItemProps(formItemProps: Array<FormItemProps>) {
    this.formItemProps = formItemProps;
    return this;
  }

  setUrl(url: string) {
    this.url = url;
    return this;
  }
}
