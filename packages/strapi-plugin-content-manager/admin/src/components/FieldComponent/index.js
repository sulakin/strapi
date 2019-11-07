import React from 'react';
import PropTypes from 'prop-types';
import { get, size } from 'lodash';
import { FormattedMessage } from 'react-intl';
import pluginId from '../../pluginId';
import useDataManager from '../../hooks/useDataManager';
import useEditView from '../../hooks/useEditView';
import ComponentInitializer from '../ComponentInitializer';
import NonRepeatableComponent from '../NonRepeatableComponent';
import RepeatableComponent from '../RepeatableComponent';
import Label from './Label';
import Reset from './ResetComponent';
import Wrapper from './Wrapper';

const FieldComponent = ({
  componentUid,
  isFromDynamicZone,
  isRepeatable,
  label,
  name,
}) => {
  const { modifiedData, removeComponentFromField } = useDataManager();
  const { allLayoutData } = useEditView();
  const componentValue = get(modifiedData, name, null);
  const componentValueLength = size(componentValue);
  const isInitialized = componentValue !== null || isFromDynamicZone;
  const showResetComponent =
    !isRepeatable && isInitialized && !isFromDynamicZone;
  const currentComponentSchema = get(
    allLayoutData,
    ['components', componentUid],
    {}
  );
  const displayedFields = get(currentComponentSchema, ['layouts', 'edit'], []);

  return (
    <Wrapper className="col-12" isFromDynamicZone={isFromDynamicZone}>
      <Label>
        {label}&nbsp;
        {isRepeatable && `(${componentValueLength})`}
      </Label>
      {showResetComponent && (
        <Reset
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            removeComponentFromField(name, componentUid);
          }}
        >
          <FormattedMessage id={`${pluginId}.components.reset-entry`} />
          <div />
        </Reset>
      )}
      {!isRepeatable && !isInitialized && <ComponentInitializer name={name} />}

      {!isRepeatable && isInitialized && (
        <NonRepeatableComponent
          fields={displayedFields}
          isFromDynamicZone={isFromDynamicZone}
          name={name}
          schema={currentComponentSchema}
        />
      )}
      {isRepeatable && (
        <RepeatableComponent
          componentValue={componentValue}
          componentValueLength={componentValueLength}
          componentUid={componentUid}
          fields={displayedFields}
          isFromDynamicZone={isFromDynamicZone}
          name={name}
          schema={currentComponentSchema}
        />
      )}
    </Wrapper>
  );
};

FieldComponent.defaultProps = {
  isFromDynamicZone: false,
  isRepeatable: false,
};

FieldComponent.propTypes = {
  componentUid: PropTypes.string.isRequired,
  isFromDynamicZone: PropTypes.bool,
  isRepeatable: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default FieldComponent;
